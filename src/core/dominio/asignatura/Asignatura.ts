import { IAsignatura } from "./IAsignatura";

export class asignatura implements IAsignatura {

  idAsignatura?: number;
  nombreAsignatura: string;
  cargaHoraria: number;
  idFormato: number;
  informacion?: string | null;

  constructor(datosAsignatura: IAsignatura) {
    this.nombreAsignatura = datosAsignatura.nombreAsignatura;
    this.cargaHoraria = datosAsignatura.cargaHoraria;
    this.idFormato = datosAsignatura.idFormato;
    this.informacion = datosAsignatura.informacion ?? null;
  }
}
