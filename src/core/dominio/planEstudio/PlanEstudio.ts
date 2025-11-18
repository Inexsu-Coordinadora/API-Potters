import { IPlanEstudio } from "./IPlanEstudio";

export class planEstudio implements IPlanEstudio {
    idPlanEstudio?: number;
    idPrograma: number;
    idAsignatura: number;
    semestre: number;
    creditos: number;

    constructor(datosPlanEstudio: IPlanEstudio) {
        this.idPrograma = datosPlanEstudio.idPrograma;
        this.idAsignatura = datosPlanEstudio.idAsignatura;
        this.semestre = datosPlanEstudio.semestre;
        this.creditos = datosPlanEstudio.creditos;
    }
}