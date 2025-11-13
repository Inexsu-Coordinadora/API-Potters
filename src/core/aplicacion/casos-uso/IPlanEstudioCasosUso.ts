import { IPlanEstudio } from "../../dominio/planEstudio/IPlanEstudio";
import { PlanEstudioDTO } from "../../../presentacion/esquemas/planEstudioEsquema";

export interface IPlanEstudioCasosUso {
    obtenerPlanEstudio(limite?: number): Promise<IPlanEstudio[]>;
    obtenerPlanEstudioPorId(IPlanEstudio: number): Promise<IPlanEstudio | null>;
    crearPlanEstudio(datosPlanEstudio: PlanEstudioDTO): Promise<number>;
    actualizarPlanEstudio(idPlanEstudio: number, planEstudio: IPlanEstudio): Promise<IPlanEstudio | null>
    eliminiarPlanEstudio(idPlanEstudio: number): Promise <IPlanEstudio | null>;
}