import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IAsignatura } from "../../dominio/asignatura/IAsignatura";

export class AsignaturaRepositorio implements IAsignaturaRepositorio {
  async crearAsignatura(datosAsignatura: IAsignatura): Promise<string> {
    const columnas = Object.keys(datosAsignatura).map((key) => key.toLowerCase());
    const parametros: Array<string | number> = Object.values(datosAsignatura);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO asignatura (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *  -- aquí Postgres genera el id automáticamente
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

  async obtenerAsignaturaPorId(idAsignatura: string): Promise<IAsignatura | null> {
    const query = "SELECT * FROM asignatura WHERE idAsignatura = $1";
    const result = await ejecutarConsulta(query, [idAsignatura]);
    return result.rows[0] || null;
  }

  async actualizarAsignatura(id: string, datosAsignatura: IAsignatura): Promise<IAsignatura> {
    const columnas = Object.keys(datosAsignatura).map((key) => key.toLowerCase());
    const parametros = Object.values(datosAsignatura);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE asignatura
      SET ${setClause}
      WHERE idAsignatura=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async eliminarAsignatura(idAsignatura: string): Promise<IAsignatura | null> {
    const query = "DELETE FROM asignatura WHERE idAsignatura = $1 RETURNING *";
    const result = await ejecutarConsulta(query, [idAsignatura]);
    return result.rows[0] || null;
  }
}
