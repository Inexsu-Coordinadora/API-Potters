export interface IPeriodoAcademico {
  idPeriodo?: number;
  semestre: string;
  fechaInicio: string | Date;
  fechaFin: string | Date;
  idEstado: number;
}
