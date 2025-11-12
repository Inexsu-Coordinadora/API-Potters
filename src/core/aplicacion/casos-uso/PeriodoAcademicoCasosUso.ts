import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IPeriodoAcademicoCasosUso } from "./IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";
import { number } from "zod";

export class PeriodoAcademicoCasosUso implements IPeriodoAcademicoCasosUso {
  constructor(private periodoRepositorio: IPeriodoAcademicoRepositorio) { }

  async obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
    return await this.periodoRepositorio.listarPeriodos(limite);
  }

  async obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    return await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
  }

  async crearPeriodo(datosPeriodo: PeriodoAcademicoDTO): Promise<number> {

    const periodoTraslapo = await this.periodoRepositorio.consultarTraslapeFechas(datosPeriodo);
    if (periodoTraslapo) {
      throw new Error(`Se encontró un periodo activo con una fecha traslapada:idPeriodo ${periodoTraslapo.idPeriodo} periodo desde ${this.formatearFecha(periodoTraslapo.fechaInicio)} hasta ${this.formatearFecha(periodoTraslapo.fechaFin)}`);
    }

    const idNuevoPeriodo = await this.periodoRepositorio.crearPeriodo(datosPeriodo);
    return idNuevoPeriodo
  }

  async actualizarPeriodo(idPeriodo: number, periodo: PeriodoAcademicoDTO): Promise<IPeriodoAcademico | null> {

    const periodoTraslapo = await this.periodoRepositorio.consultarTraslapeFechas(periodo);
    if (periodoTraslapo) {
      throw new Error(`Se encontró un periodo activo con una fecha traslapada:idPeriodo ${periodoTraslapo.idPeriodo} periodo desde ${this.formatearFecha(periodoTraslapo.fechaInicio)} hasta ${this.formatearFecha(periodoTraslapo.fechaFin)}`);
    }

    const periodoConsultado = await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
    if (periodoConsultado) {
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
        throw new Error(
          `Transición de estado no permitida: no se puede cambiar de ${nombresEstados[estadoActual]} a ${nombresEstados[nuevoEstado]}`
        );
      }
    }

    const periodoActualizado = await this.periodoRepositorio.actualizarPeriodo(idPeriodo, periodo);
    return periodoActualizado || null;
  }

  async eliminarPeriodo(idPeriodo: number): Promise<IPeriodoAcademico | null> {
    const periodoObtenido = await this.periodoRepositorio.eliminarPeriodo(idPeriodo);
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