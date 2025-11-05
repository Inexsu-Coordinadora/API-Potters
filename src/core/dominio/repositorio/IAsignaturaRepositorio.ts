import { IAsignatura } from "../../dominio/asignatura/IAsignatura";

export interface IAsignaturaRepositorio {
  crearAsignatura(datosAsignatura: IAsignatura): Promise<string>;
  listarAsignaturas(limite?: number): Promise<IAsignatura[]>;
  obtenerAsignaturaPorId(idAsignatura: string): Promise<IAsignatura | null>;
  actualizarAsignatura(id: string, datosAsignatura: IAsignatura): Promise<IAsignatura>;
  eliminarAsignatura(id: string): Promise<IAsignatura | null>;
}
