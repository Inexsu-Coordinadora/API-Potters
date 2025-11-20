import { IPeriodoAcademico } from "../../dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoRelacionado} from "../../dominio/periodoAcademico/IPeriodoRelacionado";

export interface IPeriodoAcademicoCasosUso {
  obtenerPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null>;
  crearPeriodo(periodo: IPeriodoAcademico): Promise<IPeriodoRelacionado>;
  actualizarPeriodo(idPeriodo: number, periodo: IPeriodoAcademico): Promise<IPeriodoRelacionado | null>;
  eliminarPeriodo(idPeriodo: number): Promise<IPeriodoAcademico | null>;
}
