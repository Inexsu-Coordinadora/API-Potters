import { IOferta } from "../../dominio/oferta/IOferta";
import { IOfertaRepositorio } from "../../dominio/repositorio/IOfertaRepositorio";
import { IOfertaCasosUso } from "./IOfertaCasosUso";

export class OfertaCasosUso implements IOfertaCasosUso {
  constructor(private ofertaRepositorio: IOfertaRepositorio) {}

  async obtenerOfertas(limite?: number): Promise<IOferta[]> {
    return await this.ofertaRepositorio.listarOfertas(limite);
  }

  async obtenerOfertaPorId(idOferta: number): Promise<IOferta | null> {
    const ofertaObtenida = await this.ofertaRepositorio.obtenerOfertaPorId(idOferta);
    return ofertaObtenida;
  }

   async crearOferta(datosOferta: IOferta): Promise<number> {
    const idNuevaOferta = await this.ofertaRepositorio.crearOferta(datosOferta);
    return idNuevaOferta;
  }


  async actualizarOferta(idOferta: number, oferta: IOferta): Promise<IOferta | null> {
    const OfertaActualizado = await this.ofertaRepositorio.actualizarOferta(
      idOferta,
      oferta
    );
    return OfertaActualizado || null;
  }

  async eliminarOferta(idOferta: number): Promise<IOferta | null> {
    const ofertaObtenida = await this.ofertaRepositorio.eliminarOferta(idOferta);
    return ofertaObtenida;
  }
}
