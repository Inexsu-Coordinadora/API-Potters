import { IOferta } from "../../dominio/oferta/IOferta";

export interface IOfertaRepositorio {
  crearOferta(datosOferta: IOferta): Promise<number>;
  listarOfertas(limite?: number): Promise<IOferta[]>;
  obtenerOfertaPorId(idOferta: number): Promise<IOferta | null>;
  actualizarOferta(idOferta: number, datosOferta: IOferta): Promise<IOferta>;
  eliminarOferta(idOferta: number): Promise<IOferta | null>;
}

