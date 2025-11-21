import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IAsignatura } from "../../dominio/asignatura/IAsignatura";

export class AsignaturaRepositorio implements IAsignaturaRepositorio {

  async crearAsignatura(datosAsignatura: IAsignatura): Promise<string> {
    const parametros: Array<string | number> = Object.values(datosAsignatura);
    const query = `
      INSERT INTO asignatura (nombreasignatura, cargahoraria, idformato, informacion)
      VALUES ($1, $2, $3, $4)
      RETURNING idasignatura AS "idAsignatura"
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].idAsignatura;
  }

  async listarAsignaturas(limite?: number): Promise<IAsignatura[]> {
    let query = "SELECT * FROM asignatura";
    const valores: number[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  async obtenerAsignaturaPorId(idAsignatura: number): Promise<IAsignatura | null> {
    const query = "SELECT * FROM asignatura WHERE idAsignatura = $1";
    const result = await ejecutarConsulta(query, [idAsignatura]);
    return result.rows[0] || null;
  }

  async actualizarAsignatura(id: number, datosAsignatura: IAsignatura): Promise<IAsignatura> {
    const parametros = Object.values(datosAsignatura);
    parametros.push(id);

    const query = `
      UPDATE asignatura
      SET nombreasignatura = $1, cargahoraria = $2, idformato = $3, informacion = $4
      WHERE idasignatura = $5
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async eliminarAsignatura(idAsignatura: number): Promise<IAsignatura | null> {
    const query = "DELETE FROM asignatura WHERE idAsignatura = $1 RETURNING *";
    const result = await ejecutarConsulta(query, [idAsignatura]);
    return result.rows[0] || null;
  }
}
