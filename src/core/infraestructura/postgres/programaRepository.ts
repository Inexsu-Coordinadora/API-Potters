import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IPrograma } from "../../dominio/programa/IPrograma";

export class ProgramaRepositorio implements IProgramaRepositorio {

    async crearPrograma(datosPrograma: IPrograma): Promise<string> {
        const parametros: (string | number)[] = Object.values(datosPrograma);

        const query = `
        INSERT INTO programaacademico (nombreprograma, idnivel, idmodalidad, duracionmeses) 
        VALUES ($1, $2, $3, $4)
        RETURNING idprograma AS "idPrograma";
        `;

        const respuesta = await ejecutarConsulta(query, parametros);
        return respuesta.rows[0].idPrograma;
    }

    async listarPrograma(limite?: number): Promise<IPrograma[]> {
        let query = `SELECT * FROM programaacademico`;
        const valores: number[] = [];

        if (limite !== undefined) {
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
        const parametros = Object.values(datosPrograma);
        parametros.push(id);

        const query = `
            UPDATE programaacademico SET nombreprograma = $1, idnivel = $2, idmodalidad = $3, duracionmeses = $4
            WHERE idprograma = $5
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
