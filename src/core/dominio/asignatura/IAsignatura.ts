export interface IAsignatura {
  idAsignatura?: string;
  nombreAsignatura: string;
  creditos: string;
  cargaHoraria: string;
  formatoClase: string;
  informacion?: string | null;
}
