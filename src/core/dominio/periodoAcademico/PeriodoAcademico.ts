import { IPeriodoAcademico } from "./IPeriodoAcademico";

export class PeriodoAcademico implements PeriodoAcademico {

  idPeriodo?: string;
  semestre: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  estadoPeriodo: string;

  constructor(datosPeriodoAcademico: IPeriodoAcademico) {
    this.semestre = datosPeriodoAcademico.semestre;
    this.fechaInicio = datosPeriodoAcademico.fechaInicio;
    this.fechaFin = datosPeriodoAcademico.fechaFin;
    this.estadoPeriodo= datosPeriodoAcademico.estadoPeriodo;
  }
}
