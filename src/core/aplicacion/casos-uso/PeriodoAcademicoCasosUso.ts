import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IPeriodoAcademicoCasosUso } from "./IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";
import { IPeriodoRelacionado } from "../../dominio/periodoAcademico/IPeriodoRelacionado";
import { EntidadNoEncontradaError } from "../../dominio/errores/encontrarError";
import { ReglaNegocioError } from "../../dominio/errores/reglaNegocioError";

export class PeriodoAcademicoCasosUso implements IPeriodoAcademicoCasosUso {
  constructor(private periodoRepositorio: IPeriodoAcademicoRepositorio) { }

  async obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
    const lista = await this.periodoRepositorio.listarPeriodos(limite);
    if (!lista || lista.length == 0) throw new EntidadNoEncontradaError("No se encontró ningún periodo académico");
    return lista;
  }

  async obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    const periodoObtenido = await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
    if (!periodoObtenido) throw new EntidadNoEncontradaError("No se encontró ningún periodo académico");
    return periodoObtenido;
  }

  async crearPeriodo(datosPeriodo: PeriodoAcademicoDTO): Promise<IPeriodoRelacionado> {

    const periodoTraslapo = await this.periodoRepositorio.consultarTraslapeFechas(datosPeriodo, 0);
    if (periodoTraslapo) throw new ReglaNegocioError(`Se encontró un periodo activo con una fecha traslapada: idPeriodo ${periodoTraslapo.idPeriodo} periodo desde ${this.formatearFecha(periodoTraslapo.fechaInicio)} hasta ${this.formatearFecha(periodoTraslapo.fechaFin)}`);

    const idNuevoPeriodo = await this.periodoRepositorio.crearPeriodo(datosPeriodo);
    const periodoCreado = await this.periodoRepositorio.obtenerPeriodoRelacionado(idNuevoPeriodo)
    return periodoCreado
  }

  async actualizarPeriodo(idPeriodo: number, periodo: PeriodoAcademicoDTO): Promise<IPeriodoRelacionado | null> {

    const periodoTraslapo = await this.periodoRepositorio.consultarTraslapeFechas(periodo, idPeriodo);
    if (periodoTraslapo) throw new ReglaNegocioError(`Se encontró un periodo activo con una fecha traslapada: idPeriodo ${periodoTraslapo.idPeriodo} periodo desde ${this.formatearFecha(periodoTraslapo.fechaInicio)} hasta ${this.formatearFecha(periodoTraslapo.fechaFin)}`);

    const periodoConsultado = await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
    if (!periodoConsultado) throw new EntidadNoEncontradaError("No se encontró ningún periodo académico");

    const estadoActual = periodoConsultado.idEstado;
    const nuevoEstado = periodo.idEstado;

    const nombresEstados: Record<number, string> = {
      1: "Preparación",
      2: "Activo",
      3: "Cerrado",
    };

    const esTransicionValida =
      (estadoActual === 1 && (nuevoEstado === 1 || nuevoEstado === 2 || nuevoEstado === 3)) || // de preparación
      (estadoActual === 2 && (nuevoEstado === 2 || nuevoEstado === 3)) ||                      // de activo
      (estadoActual === 3 && nuevoEstado === 3);                                               // cerrado solo a cerrado (sin cambio)

    if (!esTransicionValida) {
      throw new ReglaNegocioError(
        `Transición de estado no permitida: no se puede cambiar de ${nombresEstados[estadoActual]} a ${nombresEstados[nuevoEstado]}`
      );
    }

    await this.periodoRepositorio.actualizarPeriodo(idPeriodo, periodo);
    const periodoActualizado = await this.periodoRepositorio.obtenerPeriodoRelacionado(idPeriodo)
    if (!periodoActualizado) throw new EntidadNoEncontradaError("Hubo un error al encontrar las relaciones del periodo académico");

    return periodoActualizado;
  }

  async eliminarPeriodo(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    const periodoObtenido = await this.periodoRepositorio.eliminarPeriodo(idPeriodo);
    if (!periodoObtenido) throw new EntidadNoEncontradaError("No se encontró ningún periodo académico");
    return periodoObtenido;
  }

  formatearFecha(fecha: Date | string): string {
    const f = new Date(fecha);
    const dia = String(f.getDate()).padStart(2, "0");
    const mes = String(f.getMonth() + 1).padStart(2, "0");
    const anio = f.getFullYear();
    return `${anio}-${mes}-${dia}`;
  }
}