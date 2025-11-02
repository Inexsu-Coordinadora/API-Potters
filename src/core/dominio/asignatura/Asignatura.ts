import { IAsignatura } from "./IAsignatura";

export class asignatura implements IAsignatura {

  idAsignatura?: string;
  nombreAsignatura: string;
  creditos: string;
  cargaHoraria: string;
  formatoClase: string;
  informacion?: string | null;

  constructor(datosAsignatura: IAsignatura) {
    this.nombreAsignatura = datosAsignatura.nombreAsignatura;
    this.creditos = datosAsignatura.creditos;
    this.cargaHoraria = datosAsignatura.cargaHoraria;
    this.formatoClase = datosAsignatura.formatoClase;
    this.informacion = datosAsignatura.informacion ?? null;
  }
}
