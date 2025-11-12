import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";

export interface IPeriodoAcademicoCasosUso {
  obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null>;
  crearPeriodo(periodo: PeriodoAcademicoDTO): Promise<number>;
  actualizarPeriodo(idPeriodo: number, periodo: PeriodoAcademicoDTO): Promise<IPeriodoAcademico | null>;
  eliminarPeriodo(idPeriodo: number): Promise<IPeriodoAcademico | null>;
}
