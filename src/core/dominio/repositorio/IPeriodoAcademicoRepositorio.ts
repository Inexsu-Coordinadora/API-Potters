import { IPeriodoAcademico } from "../periodoAcademico/IPeriodoAcademico";
import { IPeriodoRelacionado} from "../periodoAcademico/IPeriodoRelacionado";

export interface IPeriodoAcademicoRepositorio {
  
  crearPeriodo(datosPeriodoAcademico: IPeriodoAcademico): Promise<number>; 
  listarPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null>;
  actualizarPeriodo(id: number, datosPeriodoAcademico: IPeriodoAcademico): Promise<IPeriodoAcademico>;
  eliminarPeriodo(id: number): Promise<IPeriodoAcademico | null>;
  consultarTraslapeFechas(datosPeriodoAcademico: IPeriodoAcademico): Promise<IPeriodoAcademico | null>; 
  obtenerPeriodoRelacionado(idPeriodo: number): Promise<IPeriodoRelacionado>;
}