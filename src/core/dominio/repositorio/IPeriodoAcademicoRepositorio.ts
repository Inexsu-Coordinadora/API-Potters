import { IPeriodoAcademico } from "../periodoAcademico/IPeriodoAcademico";

export interface IPeriodoAcademicoRepositorio {
  
  crearPeriodo(datosPeriodoAcademico: IPeriodoAcademico): Promise<number>; 
  
  listarPeriodos(limite?: number): Promise<IPeriodoAcademico[]>;
  obtenerPeriodoPorId(idPeriodo: number): Promise<IPeriodoAcademico | null>;
  actualizarPeriodo(id: number, datosPeriodoAcademico: IPeriodoAcademico): Promise<IPeriodoAcademico>;
  eliminarPeriodo(id: number): Promise<IPeriodoAcademico | null>;
}