import { IPlanEstudio } from "../../dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioRepositorio } from "../../dominio/repositorio/IPlanEstudioRepositorio";
import { IPlanEstudioCasosUso } from "./IPlanEstudioCasosUso";

export class PlanEstudioCasosUso implements IPlanEstudioCasosUso {
    constructor(private planEstudioRepositorio: IPlanEstudioRepositorio) {}

    async obtenerPlanEstudio(limite?: number): Promise<IPlanEstudio[]> {
        return await this.planEstudioRepositorio.listarPlanEstudio(limite);
    }

    async obtenerPlanEstudioPorId(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const planEstudioObtenido = await this.planEstudioRepositorio.obtenerPlanEstudioPorId(idPlanEstudio);
        return planEstudioObtenido;
    }

    async crearPlanEstudio(datosPlanEstudio: IPlanEstudio): Promise<number> {
        const idNuevoPlanEstudio = await this.planEstudioRepositorio.crearPlanEstudio(datosPlanEstudio);
        return idNuevoPlanEstudio;
    }

    async actualizarPlanEstudio(idPlanEstudio: number, planEstudio: IPlanEstudio): Promise<IPlanEstudio | null> {
        const planEstudioActualizado = await this.planEstudioRepositorio.actualizarPlanEstudio(
            idPlanEstudio,
            planEstudio
        );
        return planEstudioActualizado || null;
    }

    async eliminiarPlanEstudio(idPlanEstudio: number): Promise<IPlanEstudio | null> {
        const planEstudioObtenido = await this.planEstudioRepositorio.eliminarPlanEstudio(idPlanEstudio);
        return planEstudioObtenido
    }
}