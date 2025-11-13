export interface IAsignatura {
  idAsignatura?: number;
  nombreAsignatura: string;
  cargaHoraria: number;
  idFormato: number;
  informacion?: string | null;
}
