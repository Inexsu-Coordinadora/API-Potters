import { IPlanEstudio } from "../planEstudio/IPlanEstudio";
import { IPlanEstudioRelacionado } from "../planEstudio/IPlanEstudioRelacionado";

export interface IPlanEstudioRepositorio {
    crearPlanEstudio(datosPlanEstudio: IPlanEstudio): Promise <number>;
    listarPlanEstudio(limite?: number): Promise <IPlanEstudio[]>;
    obtenerPlanEstudioPorId(idPlanEstudio: number): Promise <IPlanEstudio | null>;
    actualizarPlanEstudio(id: number, datosPlanEstudio: IPlanEstudio): Promise <IPlanEstudio>;
    eliminarPlanEstudio(id: number): Promise <IPlanEstudio | null>;
    existeDuplicidad(idPrograma: number,  idAsignatura: number, semestre: number, idExcluir?: number ): 
    Promise<boolean>;
    obtenerPlanEstudioRelacionado(id: number): Promise <IPlanEstudioRelacionado>;
}