import { IOferta } from "../../dominio/oferta/IOferta";
import { OfertaDTO } from "../../../presentacion/esquemas/ofertaEsquema";
import { IOfertaRelacionada } from "../../dominio/oferta/IOfertaRelacionada";

export interface IOfertaCasosUso {
  obtenerOfertas(limite?: number): Promise<IOferta[]>;
  obtenerOfertaPorId(idOferta: number): Promise<IOferta | null>;
  crearOferta(datosOferta: OfertaDTO): Promise<IOfertaRelacionada | null>;
  actualizarOferta(idOferta: number, oferta: OfertaDTO): Promise<IOfertaRelacionada | null>;
  eliminarOferta(idOferta: number): Promise<IOferta | null>;
}
