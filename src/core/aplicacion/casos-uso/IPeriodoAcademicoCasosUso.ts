import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";

export interface IPeriodoAcademicoCasosUso {
  obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: string): Promise<IPeriodoAcademico | null>;
  crearPeriodo(periodo: PeriodoAcademicoDTO): Promise<number>;
  actualizarPeriodo(idPeriodo: string, periodo: IPeriodoAcademico): Promise<IPeriodoAcademico | null>;
  eliminarPeriodo(idPeriodo: string): Promise<void>;
}
