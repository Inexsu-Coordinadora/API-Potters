import { IOferta } from "./IOferta";

export class Oferta implements IOferta {

  idOferta?: number;
  idPrograma: number;
  idPeriodo: number;
  idAsignatura: number;
  grupo: number;
  cupo: number;

  constructor(datosOferta: IOferta) {
    this.idPrograma = datosOferta.idPrograma;
    this.idPeriodo = datosOferta.idPeriodo;
    this.idAsignatura = datosOferta.idAsignatura;
    this.grupo = datosOferta.grupo;
    this.cupo = datosOferta.cupo ?? null;
  }
}
