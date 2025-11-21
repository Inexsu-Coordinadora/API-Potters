import { IAsignatura } from "../../dominio/asignatura/IAsignatura";
import { EntidadNoEncontradaError } from "../../dominio/errores/encontrarError";
import { IAsignaturaRepositorio } from "../../dominio/repositorio/IAsignaturaRepositorio";
import { IAsignaturaCasosUso } from "./IAsignaturaCasosUso";

export class AsignaturaCasosUso implements IAsignaturaCasosUso {
  constructor(private asignaturaRepositorio: IAsignaturaRepositorio) { }

  async obtenerAsignaturas(limite?: number): Promise<IAsignatura[]> {
    const lista = await this.asignaturaRepositorio.listarAsignaturas(limite);
    if (!lista || lista.length == 0) throw new EntidadNoEncontradaError("No se encontró ninguna asignatura");
    return lista;
  }

  async obtenerAsignaturasPorId(idAsignatura: number): Promise<IAsignatura | null> {
    const asignaturaObtenido = await this.asignaturaRepositorio.obtenerAsignaturaPorId(idAsignatura);
    if (!asignaturaObtenido) throw new EntidadNoEncontradaError("No se encontró ninguna asignatura");
    return asignaturaObtenido;
  }

  async crearAsignatura(datosAsignatura: IAsignatura): Promise<string> {
    const idNuevaAsignatura = await this.asignaturaRepositorio.crearAsignatura(datosAsignatura);
    return idNuevaAsignatura;
  }

  async actualizarAsignatura(idAsignatura: number, asignatura: IAsignatura): Promise<IAsignatura | null> {
    const asignaturaActualizado = await this.asignaturaRepositorio.actualizarAsignatura(
      idAsignatura,
      asignatura
    );

    if (!asignaturaActualizado) throw new EntidadNoEncontradaError(`Asignatura con id ${idAsignatura} no encontrada`);
    return asignaturaActualizado;
  }

  async eliminarAsignatura(idAsignatura: number): Promise<IAsignatura | null> {
    const asignaturaObtenido = await this.asignaturaRepositorio.eliminarAsignatura(idAsignatura);
    if (!asignaturaObtenido) throw new EntidadNoEncontradaError("No se encontró ninguna asignatura");
    return asignaturaObtenido;
  }
}
