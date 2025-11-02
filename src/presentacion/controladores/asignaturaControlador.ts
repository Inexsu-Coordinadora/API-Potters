import { FastifyRequest, FastifyReply } from "fastify";
import { IAsignatura } from "../../core/dominio/asignatura/IAsignatura";
import { IAsignaturaCasosUso } from "../../core/aplicacion/casos-uso/IAsignaturaCasosUso";
import { AsignaturaDTO, CrearAsignaturaEsquema } from "../esquemas/asignaturaEsquema";
import { ZodError } from "zod";

export class AsignaturasControlador {
  constructor(private AsignaturasCasosUso: IAsignaturaCasosUso) {}
 
  obtenerAsignaturas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const AsignaturasEncontradas = await this.AsignaturasCasosUso.obtenerAsignaturas(limite);

      return reply.code(200).send({
        mensaje: "Asignaturas encontradas correctamente",
        Asignaturas: AsignaturasEncontradas,
        AsignaturasEncontrados: AsignaturasEncontradas.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener las Asignaturas",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerAsignaturaPorId = async (
    request: FastifyRequest<{ Params: { idAsignatura: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idAsignatura } = request.params;
      const AsignaturaEncontrada = await this.AsignaturasCasosUso.obtenerAsignaturasPorId(idAsignatura);

      if (!AsignaturaEncontrada) {
        return reply.code(404).send({
          mensaje: "Asignatura no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Asignatura encontrada correctamente",
        Asignatura: AsignaturaEncontrada,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la Asignatura",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearAsignatura = async (
    request: FastifyRequest<{ Body: AsignaturaDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevaAsignatura = CrearAsignaturaEsquema.parse(request.body);
      const idNuevaAsignatura = await this.AsignaturasCasosUso.crearAsignatura(nuevaAsignatura);

      return reply.code(200).send({
        mensaje: "La Asignatura se creó correctamente",
        idNuevoAsignatura: idNuevaAsignatura,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error al crear una nueva Asignatura",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(500).send({
        mensaje: "Error al crear una nueva Asignatura",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarAsignatura = async (
    request: FastifyRequest<{ Params: { idAsignatura: string }; Body: IAsignatura }>,
    reply: FastifyReply
  ) => {
    try {
      const { idAsignatura } = request.params;
      const nuevaAsignatura = request.body;
      const AsignaturaActualizada = await this.AsignaturasCasosUso.actualizarAsignatura(
        idAsignatura,
        nuevaAsignatura
      );

      if (!AsignaturaActualizada) {
        return reply.code(404).send({
          mensaje: "Asignatura no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Asignatura actualizada correctamente",
        AsignaturaActualizado: AsignaturaActualizada,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar la Asignatura",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  eliminarAsignatura = async (
    request: FastifyRequest<{ Params: { idAsignatura: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idAsignatura } = request.params;
      await this.AsignaturasCasosUso.eliminarAsignatura(idAsignatura);

      return reply.code(200).send({
        mensaje: "Asignatura eliminada correctamente",
        idAsignatura: idAsignatura,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar la Asignatura",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}
