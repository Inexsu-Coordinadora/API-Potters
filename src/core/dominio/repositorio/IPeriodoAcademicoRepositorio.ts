import { IPeriodoAcademico } from "../periodoAcademico/IPeriodoAcademico";

export interface IPeriodoAcademicoRepositorio {
  
  crearPeriodo(datosPeriodoAcademico: IPeriodoAcademico): Promise<number>; 
  
  listarPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: string): Promise<IPeriodoAcademico | null>;
  actualizarPeriodo(id: string, datosPeriodoAcademico: IPeriodoAcademico): Promise<IPeriodoAcademico>;
  eliminarPeriodo(id: string): Promise<void>;
}