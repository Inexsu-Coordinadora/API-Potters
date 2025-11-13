import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { PeriodoAcademicoDTO } from "../../../presentacion/esquemas/periodoAcademicoEsquema";
import { IPeriodoRelacionado} from "../../dominio/periodoAcademico/IPeriodoRelacionado";

export interface IPeriodoAcademicoCasosUso {
  obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null>;
  crearPeriodo(periodo: PeriodoAcademicoDTO): Promise<IPeriodoRelacionado>;
  actualizarPeriodo(idPeriodo: number, periodo: PeriodoAcademicoDTO): Promise<IPeriodoRelacionado | null>;
  eliminarPeriodo(idPeriodo: number): Promise<IPeriodoAcademico | null>;
}
