import { IPeriodoAcademico } from "./IPeriodoAcademico";
import { estadoPeriodoAcademico } from "../enum/estadoPeriodoAcademico";

export class PeriodoAcademico implements IPeriodoAcademico {

  idPeriodo?: number;
  semestre: string;
  fechaInicio: Date;
  fechaFin: Date;
  idEstado: number;

  constructor(datosPeriodoAcademico: IPeriodoAcademico) {
    this.semestre = datosPeriodoAcademico.semestre;
    this.fechaInicio = datosPeriodoAcademico.fechaInicio;
    this.fechaFin = datosPeriodoAcademico.fechaFin;
    this.idEstado = datosPeriodoAcademico.idEstado;
  }

  validarEstado(): string {

    let mensaje = "";

    if (this.idEstado === estadoPeriodoAcademico.preparacion) {
      mensaje = "El periodo está en preparacion";
    }

    if (this.idEstado === estadoPeriodoAcademico.cerrado) {
      mensaje = "El periodo está cerrado";
    }

    if (this.idEstado === estadoPeriodoAcademico.activo) {
      mensaje = "periodo activo";
    }

    return mensaje;
  }
}
