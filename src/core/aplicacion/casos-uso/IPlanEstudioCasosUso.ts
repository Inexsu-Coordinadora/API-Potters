import { IPlanEstudio } from "../../dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioRelacionado } from "../../dominio/planEstudio/IPlanEstudioRelacionado";

export interface IPlanEstudioCasosUso {
    obtenerPlanEstudio(limite?: number): Promise<IPlanEstudio[]>;
    obtenerPlanEstudioPorId(IPlanEstudio: number): Promise<IPlanEstudio | null>;
    crearPlanEstudio(datosPlanEstudio: IPlanEstudio): Promise<IPlanEstudioRelacionado>;
    actualizarPlanEstudio(idPlanEstudio: number, planEstudio: IPlanEstudio): Promise<IPlanEstudioRelacionado | null>
    eliminiarPlanEstudio(idPlanEstudio: number): Promise <IPlanEstudio | null>;
}