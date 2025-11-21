import { IOferta } from "../../dominio/oferta/IOferta";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { IOfertaRepositorio } from "../../dominio/repositorio/IOfertaRepositorio";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { IOfertaCasosUso } from "./IOfertaCasosUso";
import { IOfertaRelacionada } from "../../dominio/oferta/IOfertaRelacionada";
import { PeriodoAcademico } from "../../dominio/periodoAcademico/PeriodoAcademico";
import { EntidadNoEncontradaError } from "../../dominio/errores/encontrarError";
import { ReglaNegocioError } from "../../dominio/errores/reglaNegocioError";

export class OfertaCasosUso implements IOfertaCasosUso {
  constructor(private ofertaRepositorio: IOfertaRepositorio,
    private asignaturaRepositorio: IAsignaturaRepositorio,
    private programaRepositorio: IProgramaRepositorio,
    private periodoRepositorio: IPeriodoAcademicoRepositorio) { }

  async obtenerOfertas(limite?: number): Promise<IOferta[]> {

    const lista = await this.ofertaRepositorio.listarOfertas(limite);
    if (!lista || lista.length == 0) throw new EntidadNoEncontradaError("No se encontró ninguna oferta");
    return lista;
  }

  async obtenerOfertaPorId(idOferta: number): Promise<IOferta | null> {
    const ofertaObtenida = await this.ofertaRepositorio.obtenerOfertaPorId(idOferta);
    if (!ofertaObtenida) throw new EntidadNoEncontradaError("No se encontró ninguna oferta");
    return ofertaObtenida;
  }

  async crearOferta(datosOferta: IOferta): Promise<IOfertaRelacionada | null> {

    const registroExistente = await this.ofertaRepositorio.existeOfertaDuplicada(datosOferta);
    const asignatura = await this.asignaturaRepositorio.obtenerAsignaturaPorId(datosOferta.idAsignatura);
    const programa = await this.programaRepositorio.obtenerProgramaPorId(datosOferta.idPrograma);
    const periodo = await this.periodoRepositorio.obtenerPeriodoPorId(datosOferta.idPeriodo);

    if (registroExistente) throw new ReglaNegocioError("Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico");
    if (!asignatura) throw new EntidadNoEncontradaError("No se encontró la asignatura ingresada");

    if (registroExistente) throw new ReglaNegocioError("Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico");
    if (!asignatura) throw new EntidadNoEncontradaError("No se encontró la asignatura ingresada");
    if (!programa)  throw new EntidadNoEncontradaError("No se encontró el programa ingresado");
    if (!periodo) throw new EntidadNoEncontradaError("No se encontró el periodo ingresado");

    let objperiodo = new PeriodoAcademico(periodo);
    let mensajeValidacionEstadoPeriodo = objperiodo.validarEstado();
    if (!mensajeValidacionEstadoPeriodo.includes("periodo activo")) throw new ReglaNegocioError(mensajeValidacionEstadoPeriodo);

    const idNuevaOferta = await this.ofertaRepositorio.crearOferta(datosOferta);
    const ofertaCreada = await this.ofertaRepositorio.obtenerOfertaRelacionada(idNuevaOferta);
    return ofertaCreada;
  }

  async actualizarOferta(idOferta: number, oferta: IOferta): Promise<IOfertaRelacionada | null> {

    const registroExistente = await this.ofertaRepositorio.existeOfertaDuplicada(oferta);
    const asignatura = await this.asignaturaRepositorio.obtenerAsignaturaPorId(oferta.idAsignatura);
    const programa = await this.programaRepositorio.obtenerProgramaPorId(oferta.idPrograma);
    const periodo = await this.periodoRepositorio.obtenerPeriodoPorId(oferta.idPeriodo);

    if (registroExistente) throw new ReglaNegocioError("Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico");
    if (!asignatura) throw new EntidadNoEncontradaError("No se encontró la asignatura ingresada");
    if (!programa) throw new EntidadNoEncontradaError("No se encontró el programa ingresado");
    if (!periodo) throw new EntidadNoEncontradaError("No se encontró el periodo ingresado");

    const objperiodo = new PeriodoAcademico(periodo);
    const mensajeValidacionEstadoPeriodo = objperiodo.validarEstado();
    if (!mensajeValidacionEstadoPeriodo.includes("periodo activo")) throw new ReglaNegocioError(mensajeValidacionEstadoPeriodo);

    const updated = await this.ofertaRepositorio.actualizarOferta(idOferta, oferta);
    if (!updated) throw new EntidadNoEncontradaError(`Oferta con id ${idOferta} no encontrada`);

    const ofertaActualizada = await this.ofertaRepositorio.obtenerOfertaRelacionada(idOferta);
    if (!ofertaActualizada) throw new Error("Error inesperado al obtener la oferta actualizada");

    return ofertaActualizada;
  }

  async eliminarOferta(idOferta: number): Promise<IOferta | null> {
    const ofertaObtenida = await this.ofertaRepositorio.eliminarOferta(idOferta);
    if (!ofertaObtenida) throw new EntidadNoEncontradaError("No se encontró ninguna oferta");
    return ofertaObtenida;
  }
}
