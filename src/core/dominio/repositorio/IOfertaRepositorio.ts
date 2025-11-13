import { IOferta } from "../../dominio/oferta/IOferta";
import { IOfertaRelacionada } from "../../dominio/oferta/IOfertaRelacionada";

export interface IOfertaRepositorio {
  crearOferta(datosOferta: IOferta): Promise<number>;
  listarOfertas(limite?: number): Promise<IOferta[]>;
  obtenerOfertaPorId(idOferta: number): Promise<IOferta | null>;
  actualizarOferta(idOferta: number, datosOferta: IOferta): Promise<IOferta>;
  eliminarOferta(idOferta: number): Promise<IOferta | null>;
  existeOfertaDuplicada(datosOferta: IOferta): Promise<boolean>;
  obtenerOfertaRelacionada(idOferta: number): Promise<IOfertaRelacionada>;
}

