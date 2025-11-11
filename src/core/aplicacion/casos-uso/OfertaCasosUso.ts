import { IOferta } from "../../dominio/oferta/IOferta";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { IOfertaRepositorio } from "../../dominio/repositorio/IOfertaRepositorio";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { IOfertaCasosUso } from "./IOfertaCasosUso";
import { IOfertaRelacionada } from "../../dominio/oferta/IOfertaRelacionada";

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

  async crearOferta(datosOferta: IOferta): Promise<IOfertaRelacionada | null> {

    const registroExistente = await this.ofertaRepositorio.existeOfertaDuplicada(datosOferta);
    const idAsignatura = await this.asignaturaRepositorio.obtenerAsignaturaPorId(datosOferta.idAsignatura);
    const idPrograma = await this.programaRepositorio.obtenerProgramaPorId(datosOferta.idPrograma);
    const idPeriodo = await this.periodoRepositorio.obtenerPeriodoPorId(datosOferta.idPeriodo);

    if (registroExistente) {
      throw new Error("Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico");
    }

    if (idAsignatura === null) {
      throw new Error("No se encontró la asignatura ingresada");
    }

    if (idPrograma === null) {
      throw new Error("No se encontró el programa ingresado");
    }

    if (idPeriodo === null) {
      throw new Error("No se encontró el periodo ingresado");
    }

    if (idPeriodo.idEstado === 1) {
      throw new Error("El periodo está en preparacion");
    }

    if (idPeriodo.idEstado === 3) {
      throw new Error("El periodo está cerrado");
    }

    const idNuevaOferta = await this.ofertaRepositorio.crearOferta(datosOferta);
    const ofertaCreada = await this.ofertaRepositorio.obtenerOfertaRelacionada(idNuevaOferta);
    return ofertaCreada;
  }

  async actualizarOferta(idOferta: number, oferta: IOferta): Promise<IOfertaRelacionada | null> {

    const registroExistente = await this.ofertaRepositorio.existeOfertaDuplicada(oferta);
    const idAsignatura = await this.asignaturaRepositorio.obtenerAsignaturaPorId(oferta.idAsignatura);
    const idPrograma = await this.programaRepositorio.obtenerProgramaPorId(oferta.idPrograma);
    const idPeriodo = await this.periodoRepositorio.obtenerPeriodoPorId(oferta.idPeriodo);

    if (registroExistente) {
      throw new Error("Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico");
    }

    if (idAsignatura === null) {
      throw new Error("No se encontró la asignatura ingresada");
    }

    if (idPrograma === null) {
      throw new Error("No se encontró el programa ingresado");
    }

    if (idPeriodo === null) {
      throw new Error("No se encontró el periodo ingresado");
    }

    if (idPeriodo.idEstado === 1) {
      throw new Error("El periodo está en preparacion");
    }

    if (idPeriodo.idEstado === 3) {
      throw new Error("El periodo está cerrado");
    }

      await this.ofertaRepositorio.actualizarOferta(
      idOferta,
      oferta
    );
    const ofertaActualizada = await this.ofertaRepositorio.obtenerOfertaRelacionada(idOferta);
    return ofertaActualizada;
    
  }

  async eliminarOferta(idOferta: number): Promise<IOferta | null> {
    const ofertaObtenida = await this.ofertaRepositorio.eliminarOferta(idOferta);
    return ofertaObtenida;
  }
}
