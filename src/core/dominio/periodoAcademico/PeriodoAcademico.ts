import { IPeriodoAcademico } from "./IPeriodoAcademico";

export class PeriodoAcademico implements PeriodoAcademico {

  idPeriodo?: number;
  semestre: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  idEstado: number;

  constructor(datosPeriodoAcademico: IPeriodoAcademico) {
    this.semestre = datosPeriodoAcademico.semestre;
    this.fechaInicio = datosPeriodoAcademico.fechaInicio;
    this.fechaFin = datosPeriodoAcademico.fechaFin;
    this.idEstado= datosPeriodoAcademico.idEstado;
  }
}
