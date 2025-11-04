import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoRepositorio } from "../../dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IPeriodoAcademicoCasosUso } from "./IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema"; 

export class PeriodoAcademicoCasosUso implements IPeriodoAcademicoCasosUso {
  constructor(private periodoRepositorio: IPeriodoAcademicoRepositorio) {}

  async obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]> {
    return await this.periodoRepositorio.listarPeriodos(limite);
  }

  async obtenerPeriodoPorId(idPeriodo: string): Promise<IPeriodoAcademico | null> {
    return await this.periodoRepositorio.obtenerPeriodoPorId(idPeriodo);
  }

  async crearPeriodo(datosPeriodo: PeriodoAcademicoDTO): Promise<number> {
    return await this.periodoRepositorio.crearPeriodo(datosPeriodo as IPeriodoAcademico);
  }

  async actualizarPeriodo(idPeriodo: string, periodo: IPeriodoAcademico): Promise<IPeriodoAcademico | null> {
    const periodoActualizado = await this.periodoRepositorio.actualizarPeriodo(idPeriodo, periodo);
    return periodoActualizado || null;
  }

  async eliminarPeriodo(idPeriodo: string): Promise<void> {
    await this.periodoRepositorio.eliminarPeriodo(idPeriodo);
  }
}