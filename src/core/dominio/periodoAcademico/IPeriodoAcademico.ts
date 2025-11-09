export interface IPeriodoAcademico {
  idPeriodo?: string;
  semestre: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  estadoPeriodo: string;
}
