import { IAsignatura } from "../../dominio/asignatura/IAsignatura";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { IAsignaturaCasosUso } from "./IAsignaturaCasosUso";

export class AsignaturaCasosUso implements IAsignaturaCasosUso {
  constructor(private asignaturaRepositorio: IAsignaturaRepositorio) {}

  async obtenerAsignaturas(limite?: number): Promise<IAsignatura[]> {
    return await this.asignaturaRepositorio.listarAsignaturas(limite);
  }

  async obtenerAsignaturasPorId(idAsignatura: string): Promise<IAsignatura | null> {
    const asignaturaObtenido = await this.asignaturaRepositorio.obtenerAsignaturaPorId(idAsignatura);
    return asignaturaObtenido;
  }

  async crearAsignatura(datosAsignatura: IAsignatura): Promise<string> {
    const idNuevaAsignatura = await this.asignaturaRepositorio.crearAsignatura(datosAsignatura);
    return idNuevaAsignatura;
  }

  async actualizarAsignatura(idAsignatura: string, asignatura: IAsignatura): Promise<IAsignatura | null> {
    const asignaturaActualizado = await this.asignaturaRepositorio.actualizarAsignatura(
      idAsignatura,
      asignatura
    );
    return asignaturaActualizado || null;
  }

  async eliminarAsignatura(idAsignatura: string): Promise<IAsignatura | null> {
    const asignaturaObtenido = await this.asignaturaRepositorio.eliminarAsignatura(idAsignatura);
    return asignaturaObtenido;
  }
}
