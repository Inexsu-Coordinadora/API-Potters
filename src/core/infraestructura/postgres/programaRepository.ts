import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IPrograma } from "../../dominio/programa/IPrograma";

export class ProgramaRepositorio implements IProgramaRepositorio {
    async crearPrograma(datosPrograma: IPrograma): Promise<string> {
        const columnas = Object.keys(datosPrograma).map((key) => key.toLowerCase());
        const parametros: (string | number)[] = Object.values(datosPrograma);
        const placeholders = columnas.map((_, i ) => `$${i + 1}`).join(",");

        const query = `
            INSERT INTO programaacademico (${columnas.join(",")})
            VALUES (${placeholders})
            RETURNING idprograma AS "idPrograma"
            `;

        const respuesta = await ejecutarConsulta(query, parametros);
        return respuesta.rows[0].idPrograma;
    }

    async listarPrograma(limite?: number): Promise<IPrograma[]> {
        let query = `SELECT * FROM programaacademico`;
        const valores: number[] = [];

        if (limite !== undefined){
            query += " LIMIT $1";
            valores.push(limite);
        }

        const result = await ejecutarConsulta(query, valores);
        return result.rows;
    }

    async obtenerProgramaPorId(idPrograma: number): Promise<IPrograma | null> {
        const query = "SELECT * FROM programaacademico WHERE idprograma = $1";
        const result = await ejecutarConsulta(query, [idPrograma]);
        return result.rows[0] || null;
    }

    async actualizarPrograma(id: number, datosPrograma: IPrograma): Promise<IPrograma> {
        const columnas = Object.keys(datosPrograma).map((key) => key.toLowerCase());
        const parametros = Object.values(datosPrograma);
        const setClause = columnas.map((col, i ) => `${col}=$${i + 1}`).join (",");
        parametros.push(id);

        const query = `
        UPDATE programaacademico
        SET ${setClause}
        WHERE idPrograma=$${parametros.length}
        RETURNING *;
    `;

    const result = await ejecutarConsulta(query, parametros);
    return result.rows[0];
 }
 async eliminarPrograma(idPrograma: number): Promise<IPrograma | null> {
    const query = "DELETE FROM programaacademico WHERE idPrograma = $1 RETURNING *"
    const result = await ejecutarConsulta(query, [idPrograma]);
    return result.rows[0] || null;
  }
}
