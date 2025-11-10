import { IPlanEstudio } from "../planEstudio/IPlanEstudio";

export interface IPlanEstudioRepositorio {
    crearPlanEstudio(datosPlanEstudio: IPlanEstudio): Promise <number>;
    listarPlanEstudio(limite?: number): Promise <IPlanEstudio[]>;
    obtenerPlanEstudioPorId(idPlanEstudio: number): Promise <IPlanEstudio | null>;
    actualizarPlanEstudio(id: number, datosPlanEstudio: IPlanEstudio): Promise <IPlanEstudio>;
    eliminarPlanEstudio(id: number): Promise <IPlanEstudio | null>;
}