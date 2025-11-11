import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";

export class PeriodoAcademicoRepositorio implements IPeriodoAcademicoRepositorio {
  async crearPeriodo(datosPeriodo: IPeriodoAcademico): Promise<number> {
    const datosSinId = { ...datosPeriodo };
    delete (datosSinId as any).idPeriodo;

    const columnas = Object.keys(datosPeriodo).map((key) => key.toLowerCase());
    const parametros: (string | number)[] = Object.values(datosPeriodo);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO periodoacademico (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING idperiodo;
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].idperiodo;
  }

  async listarPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
    let query = "SELECT * FROM periodoacademico";
    const valores: number[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  async obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    const query = "SELECT * FROM periodoacademico WHERE idPeriodo = $1";
    const result = await ejecutarConsulta(query, [idPeriodo]);
    return result.rows[0] || null;
  }

  async actualizarPeriodo(id: number, datosPeriodo: IPeriodoAcademico): Promise<IPeriodoAcademico> {
    const columnas = Object.keys(datosPeriodo).map((key) => key.toLowerCase());
    const parametros = Object.values(datosPeriodo);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE periodoacademico
      SET ${setClause}
      WHERE idPeriodo=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
  }

  async eliminarPeriodo(id: number): Promise<IPeriodoAcademico | null> {
    const query = "DELETE FROM periodoacademico WHERE idPeriodo = $1 RETURNING *";
    const result = await ejecutarConsulta(query, [id]);
    return result.rows[0] || null;
  }
}