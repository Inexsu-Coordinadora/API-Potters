import { IAsignatura } from "../../dominio/asignatura/IAsignatura";
import { AsignaturaDTO } from "../../../presentacion/esquemas/asignaturaEsquema";

export interface IAsignaturaCasosUso {
  obtenerAsignaturas(limite?: number): Promise<IAsignatura[]>;
  obtenerAsignaturasPorId(idAsignatura: string): Promise<IAsignatura | null>;
  crearAsignatura(asignatura: AsignaturaDTO): Promise<string>;
  actualizarAsignatura(idAsignatura: string, asignatura: IAsignatura): Promise<IAsignatura | null>;
  eliminarAsignatura(idAsignatura: string): Promise<IAsignatura | null>;
}
