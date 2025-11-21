import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoRelacionado } from "../../dominio/periodoAcademico/IPeriodoRelacionado";

export class PeriodoAcademicoRepositorio implements IPeriodoAcademicoRepositorio {

  async crearPeriodo(datosPeriodo: IPeriodoAcademico): Promise<number> {

    const parametros = [
      datosPeriodo.semestre,
      new Date(datosPeriodo.fechaInicio).toISOString().split("T")[0] || "",
      new Date(datosPeriodo.fechaFin).toISOString().split("T")[0] || "",
      datosPeriodo.idEstado
    ];

    const query = `
          INSERT INTO periodoacademico (semestre, fechainicio, fechafin, idestado)
          VALUES ($1, $2, $3, $4)
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
    const query = `SELECT idperiodo, semestre, fechainicio, fechafin, idestado AS "idEstado" FROM periodoacademico WHERE idPeriodo = $1`;
    const result = await ejecutarConsulta(query, [idPeriodo]);
    return result.rows[0] || null;
  }

  async actualizarPeriodo(id: number, datosPeriodo: IPeriodoAcademico): Promise<IPeriodoAcademico> {

    const parametros = [
      datosPeriodo.semestre,
      new Date(datosPeriodo.fechaInicio).toISOString().split("T")[0] || "",
      new Date(datosPeriodo.fechaFin).toISOString().split("T")[0] || "",
      datosPeriodo.idEstado
    ];
    parametros.push(id);

    const query = `
      UPDATE periodoacademico
      SET semestre = $1, fechainicio = $2, fechafin = $3, idestado = $4
      WHERE idperiodo = $5
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

  async consultarTraslapeFechas(datosPeriodoAcademico: IPeriodoAcademico, idperiodo: number): Promise<IPeriodoAcademico | null> {

    let query = "";
    const { fechaInicio, fechaFin } = datosPeriodoAcademico;
    const parametros = [
      fechaInicio instanceof Date ? fechaInicio.toISOString().split("T")[0] : fechaInicio,
      fechaFin instanceof Date ? fechaFin.toISOString().split("T")[0] : fechaFin
    ] as [string, string];

    if (idperiodo > 0) {
      query = `
      SELECT idperiodo AS "idPeriodo", semestre, fechainicio AS "fechaInicio", fechafin AS "fechaFin", idestado
      FROM periodoacademico
      WHERE idestado = 2
      AND fechainicio <= $2 
      AND idperiodo != $3
      AND fechafin >= $1;    
  `;
      parametros.push(idperiodo.toString());
    }
    else {

      query = `
      SELECT idperiodo AS "idPeriodo", semestre, fechainicio AS "fechaInicio", fechafin AS "fechaFin", idestado
      FROM periodoacademico
      WHERE idestado = 2
      AND fechainicio <= $2 
      AND fechafin >= $1;   
  `;
    }

    const result = await ejecutarConsulta(query, parametros);
    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0] as IPeriodoAcademico;
  }

  async obtenerPeriodoRelacionado(idPeriodo: number): Promise<IPeriodoRelacionado> {
    const query = `
    SELECT pra.idperiodo,
    pra.semestre,
    pra.fechainicio,
    pra.fechafin,
    epa.estadoperiodo
    FROM periodoacademico pra 
    INNER JOIN estadoperiodoacademico epa ON pra.idestado = epa.idestado
    WHERE pra.idperiodo = $1
  `;

    const values = [idPeriodo];
    const result = await ejecutarConsulta(query, values);
    const row = result.rows[0];

    const periodoTransformado = {
      ...row,
      fechainicio: row.fechainicio
        ? new Date(row.fechainicio).toISOString().split("T")[0]
        : null,
      fechafin: row.fechafin
        ? new Date(row.fechafin).toISOString().split("T")[0]
        : null,
    };
    return periodoTransformado;
  }
}