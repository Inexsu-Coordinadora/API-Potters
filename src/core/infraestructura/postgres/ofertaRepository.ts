import { IOfertaRepositorio } from "../../dominio/repositorio/IOfertaRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IOferta } from "../../dominio/oferta/IOferta";

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
    return respuesta.rows[0].id_oferta;
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
    return result.rows[0];
  }

  async eliminarOferta(idOferta: number): Promise<IOferta | null> {
    const query = "DELETE FROM oferta WHERE idoferta = $1 RETURNING *";
    const result = await ejecutarConsulta(query, [idOferta]);
    return result.rows[0] || null;
  }
}