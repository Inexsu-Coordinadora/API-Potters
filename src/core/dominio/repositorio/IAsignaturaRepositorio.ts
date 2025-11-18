import { IAsignatura } from "../../dominio/asignatura/IAsignatura";

export interface IAsignaturaRepositorio {
  crearAsignatura(datosAsignatura: IAsignatura): Promise<string>;
  listarAsignaturas(limite?: number): Promise<IAsignatura[]>;
  obtenerAsignaturaPorId(idAsignatura: number): Promise<IAsignatura | null>;
  actualizarAsignatura(id: number, datosAsignatura: IAsignatura): Promise<IAsignatura>;
  eliminarAsignatura(id: number): Promise<IAsignatura | null>;
}
