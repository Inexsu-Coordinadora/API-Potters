import { IOfertaRepositorio } from "../../dominio/repositorio/IOfertaRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IOferta } from "../../dominio/oferta/IOferta";
import { IOfertaRelacionada } from "../../dominio/oferta/IOfertaRelacionada";

export class OfertaRepositorio implements IOfertaRepositorio {

  async crearOferta(datosOferta: IOferta): Promise<number> {
    const columnas = Object.keys(datosOferta).map((key) => key.toLowerCase());
    const parametros: Array<string | number> = Object.values(datosOferta);
    const placeholders = columnas.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO oferta (${columnas.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const respuesta = await ejecutarConsulta(query, parametros);
    return respuesta.rows[0].idoferta;
  }

  async listarOfertas(limite?: number): Promise<IOferta[]> {
    let query = "SELECT * FROM oferta";
    const valores: number[] = [];

    if (limite !== undefined) {
      query += " LIMIT $1";
      valores.push(limite);
    }

    const result = await ejecutarConsulta(query, valores);
    return result.rows;
  }

  async obtenerOfertaPorId(idOferta: number): Promise<IOferta | null> {
    const query = "SELECT * FROM oferta WHERE idoferta = $1";
    const result = await ejecutarConsulta(query, [idOferta]);
    return result.rows[0] || null;
  }

  async actualizarOferta(id: number, datosOferta: IOferta): Promise<IOferta> {
    const columnas = Object.keys(datosOferta).map((key) => key.toLowerCase());
    const parametros = Object.values(datosOferta);
    const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(", ");
    parametros.push(id);

    const query = `
      UPDATE oferta
      SET ${setClause}
      WHERE idoferta=$${parametros.length}
      RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0] ?? null;
  }

  async eliminarOferta(idOferta: number): Promise<IOferta | null> {
    const query = "DELETE FROM oferta WHERE idoferta = $1 RETURNING *";
    const result = await ejecutarConsulta(query, [idOferta]);
    return result.rows[0] || null;
  }

  async existeOfertaDuplicada(datosOferta: IOferta): Promise<boolean> {
    const query = `
    SELECT 1
    FROM oferta
    WHERE idprograma = $1
      AND idperiodo = $2
      AND idasignatura = $3
      AND grupo = $4
    LIMIT 1;
  `;

    const { idPrograma, idPeriodo, idAsignatura, grupo } = datosOferta;
    const values = [idPrograma, idPeriodo, idAsignatura, grupo];
    const result = await ejecutarConsulta(query, values);
    return (result?.rowCount ?? 0) > 0;
  }

  async obtenerOfertaRelacionada(idOferta: number): Promise<IOfertaRelacionada> {
    const query = `
    SELECT ofer.idoferta, pga.nombreprograma, pra.semestre, asi.nombreasignatura, asi.informacion FROM oferta ofer 
    INNER JOIN programaacademico pga ON ofer.idprograma = pga.idprograma 
    INNER JOIN periodoacademico pra ON ofer.idperiodo = pra.idperiodo
    INNER JOIN asignatura asi ON ofer.idasignatura = asi.idasignatura WHERE ofer.idoferta = $1
  `;

    const values = [idOferta];
    const result = await ejecutarConsulta(query, values);
    return result.rows[0] || null;
  }
}