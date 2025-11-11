import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IPeriodoAcademicoCasosUso } from "./IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";

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

  async actualizarPeriodo(idPeriodo: number, periodo: IPeriodoAcademico): Promise<IPeriodoAcademico | null> {
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