import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IPlanEstudio } from "../../dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioRelacionado } from "../../dominio/planEstudio/IPlanEstudioRelacionado";

export class PlanEstudioRepositorio implements IPlanEstudioRepositorio {

    async crearPlanEstudio(datosPlanEstudio: IPlanEstudio): Promise<number> {
        const { idPlanEstudio, ...resto } = datosPlanEstudio;

        const datosParaInsertar = Object.fromEntries(
            Object.entries(resto).filter(([_, valor]) => valor !== undefined && valor !== null)
        );

        const columnas = Object.keys(datosParaInsertar).map((key) => key.toLowerCase());

        const parametros: Array<string | number> = Object.values(datosParaInsertar);

        const placeholders = columnas.map((_, i) => `$${i + 1}`).join(",");

        const query = `
            INSERT INTO planestudio (${columnas.join(",")})
            VALUES (${placeholders})
            RETURNING idplanestudio
        `;

        try {
            const respuesta = await ejecutarConsulta(query, parametros);
            return respuesta.rows[0].idplanestudio;
        } catch (error) {
            console.error("Error SQL en crearPlanEstudio:", error);
            throw error;
        }
    }

    async obtenerPlanEstudioRelacionado(idPlanEstudio: number): Promise<IPlanEstudioRelacionado> {
        let query = `SELECT planes.idplanestudio, 
        pga.nombreprograma, 
        asi.nombreasignatura, planes.semestre, planes.creditos
        FROM planestudio planes 
        INNER JOIN programaacademico pga ON planes.idprograma = pga.idprograma 
        INNER JOIN asignatura asi ON planes.idasignatura = asi.idasignatura WHERE planes.idplanestudio = $1`;

        const values = [idPlanEstudio];
        const result = await ejecutarConsulta(query, values);
        return result.rows[0] || null;
    }


    async listarPlanEstudio(limite?: number): Promise<IPlanEstudio[]> {
        let query = 'SELECT * FROM planestudio';
        const valores: number[] = [];

        if (limite !== undefined) {
            query += " LIMIT $1";
            valores.push(limite);
        }

        const result = await ejecutarConsulta(query, valores);
        return result.rows;
    }

    async obtenerPlanEstudioPorId(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const query = 'SELECT * FROM planestudio WHERE idplanestudio = $1';
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
            WHERE idplanestudio=$${parametros.length}
            RETURNING *;
        `;
        const result = await ejecutarConsulta(query, parametros);
        return result.rows[0];
    }

    async eliminarPlanEstudio(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const query = 'DELETE FROM planestudio WHERE idplanestudio = $1 RETURNING *'
        const result = await ejecutarConsulta(query, [idPlanEstudio]);
        return result.rows[0] || null;
    }

    async existeDuplicidad(
        idPrograma: number,
        idAsignatura: number,
        semestre: number,
        idExcluir?: number
    ): Promise<boolean> {
        let query = `
            SELECT 1 
            FROM planestudio 
            WHERE 
                idprograma = $1 AND 
                idasignatura = $2 AND 
                semestre = $3
        `;
        const params: Array<number | string> = [idPrograma, idAsignatura, semestre];

        if (idExcluir !== undefined) {
            query += ` AND idplanestudio != $4`;
            params.push(idExcluir);
        }

        const result = await ejecutarConsulta(query, params);
        return result.rows.length > 0;
    }
}