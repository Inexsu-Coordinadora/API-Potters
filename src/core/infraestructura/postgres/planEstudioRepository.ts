import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IPlanEstudio } from "../../dominio/planEstudio/IPlanEstudio";

export class PlanEstudioRepositorio implements IPlanEstudioRepositorio {
    async crearPlanEstudio(datosPlanEstudio: IPlanEstudio): Promise<number> {
        const { idPlanEstudio, ...resto } = datosPlanEstudio;
        const datosLimpios = Object.fromEntries(Object.entries(resto).filter(([_, valor]) => valor !== undefined && valor !== null)
    );
        const columnas = Object.keys(datosLimpios).map((key) => key.toLowerCase());
        const parametros: Array<string | number> = Object.values(datosPlanEstudio);
        const placeholders = columnas.map((_, i) => `$${i + 1}`).join(",");

        const query = `
        INSERT INTO planestudio (${columnas.join(",")})
        VALUES (${placeholders})
        RETURNING * -- aquí Postgres genera el id automaticamente
        `;

        const respuesta = await ejecutarConsulta(query, parametros);
        return respuesta.rows[0].idPlanEstudio;
    }

    async listarPlanEstudio(limite?: number): Promise<IPlanEstudio[]> {
        let query = "SELECT * FROM planestudio";
        const valores: number[] = [];

        if (limite !== undefined) {
            query += " LIMIT $1";
            valores.push(limite);
        }

        const result = await ejecutarConsulta(query, valores);
        return result.rows;
    }

    async obtenerPlanEstudioPorId(idPlanEstudio: number): Promise <IPlanEstudio | null> {
        const query = "SELECT * FROM planestudio WHERE idPlanEstudio = $1";
        const result = await ejecutarConsulta(query, [idPlanEstudio]);
        return result.rows[0] || null;
    }

    async actualizarPlanEstudio(id: number, datosPlanEstudio: IPlanEstudio): Promise<IPlanEstudio> {
        const columnas = Object.keys(datosPlanEstudio).map((key) => key.toLowerCase());
        const parametros = Object.values(datosPlanEstudio);
        const setClause = columnas.map((col, i) => `${col}=$${i + 1}`).join(",");
        parametros.push(id);

        const query = `
        UPDATE planestudio
        SET ${setClause}
        WHERE idPlanEstudio=$${parametros.length}
        RETURNING *;
        `;

        const result = await ejecutarConsulta(query, parametros);
        return result.rows[0];
    }

    async eliminarPlanEstudio(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const query = "DELETE FROM planestudio WHERE idPlanEstudio = $1 RETURNING *"
        const result = await ejecutarConsulta(query, [idPlanEstudio]);
        return result.rows[0] || null;
    }
}       