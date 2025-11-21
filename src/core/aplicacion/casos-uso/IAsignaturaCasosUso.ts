import { IAsignatura } from "../../dominio/asignatura/IAsignatura";

export interface IAsignaturaCasosUso {
  obtenerAsignaturas(limite?: number): Promise<IAsignatura[]>;
  obtenerAsignaturasPorId(idAsignatura: number): Promise<IAsignatura | null>;
  crearAsignatura(asignatura: IAsignatura): Promise<string>;
  actualizarAsignatura(idAsignatura: number, asignatura: IAsignatura): Promise<IAsignatura | null>;
  eliminarAsignatura(idAsignatura: number): Promise<IAsignatura | null>;
}
