import { IOferta } from "../../dominio/oferta/IOferta";
import { OfertaDTO } from "../../../presentacion/esquemas/ofertaEsquema";

export interface IOfertaCasosUso {
  obtenerOfertas(limite?: number): Promise<IOferta[]>;
  obtenerOfertaPorId(idOferta: number): Promise<IOferta | null>;
  crearOferta(datosOferta: OfertaDTO): Promise<number>;
  actualizarOferta(idOferta: number, oferta: IOferta): Promise<IOferta | null>;
  eliminarOferta(idOferta: number): Promise<IOferta | null>;
}
