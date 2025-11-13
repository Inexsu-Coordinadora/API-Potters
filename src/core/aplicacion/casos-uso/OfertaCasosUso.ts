import { IOferta } from "../../dominio/oferta/IOferta";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { IOfertaRepositorio } from "../../dominio/repositorio/IOfertaRepositorio";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { IOfertaCasosUso } from "./IOfertaCasosUso";

export class OfertaCasosUso implements IOfertaCasosUso {
  constructor(private ofertaRepositorio: IOfertaRepositorio,
    private asignaturaRepositorio: IAsignaturaRepositorio,
    private programaRepositorio: IProgramaRepositorio,
    private periodoRepositorio: IPeriodoAcademicoRepositorio) { }

  async obtenerOfertas(limite?: number): Promise<IOferta[]> {
    return await this.ofertaRepositorio.listarOfertas(limite);
  }

  async obtenerOfertaPorId(idOferta: number): Promise<IOferta | null> {
    const ofertaObtenida = await this.ofertaRepositorio.obtenerOfertaPorId(idOferta);
    return ofertaObtenida;
  }

  async crearOferta(datosOferta: IOferta): Promise<number> {
    const idAsignatura = await this.asignaturaRepositorio.obtenerAsignaturaPorId(datosOferta.idAsignatura);
    const idPrograma = await this.programaRepositorio.obtenerProgramaPorId(datosOferta.idPrograma);
    const idPeriodo = await this.periodoRepositorio.obtenerPeriodoPorId(datosOferta.idPeriodo);

    if (idAsignatura === null) {
      throw new Error("No se encontró la asignatura buscada");
    }

    if (idPrograma === null) {
      throw new Error("No se encontró el programa buscado");
    }

    if (idPeriodo === null) {
      throw new Error("No se encontró el periodo buscado");
    }

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
