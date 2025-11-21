import { IOferta } from "../../dominio/oferta/IOferta";
import { IOfertaRelacionada } from "../../dominio/oferta/IOfertaRelacionada";

export interface IOfertaCasosUso {
  obtenerOfertas(limite?: number): Promise<IOferta[]>;
  obtenerOfertaPorId(idOferta: number): Promise<IOferta | null>;
  crearOferta(datosOferta: IOferta): Promise<IOfertaRelacionada | null>;
  actualizarOferta(idOferta: number, oferta: IOferta): Promise<IOfertaRelacionada | null>;
  eliminarOferta(idOferta: number): Promise<IOferta | null>;
}
