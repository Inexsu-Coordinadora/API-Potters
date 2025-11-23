import { FastifyRequest, FastifyReply } from "fastify";
import { IAsignatura } from "../../core/dominio/asignatura/IAsignatura";
import { IAsignaturaCasosUso } from "../../core/aplicacion/casos-uso/IAsignaturaCasosUso";
import { AsignaturaDTO, AsignaturaEsquema } from "../esquemas/asignaturaEsquema";

export class AsignaturasControlador {
  constructor(private AsignaturasCasosUso: IAsignaturaCasosUso) {}
 
  obtenerAsignaturas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const asignaturasEncontradas = await this.AsignaturasCasosUso.obtenerAsignaturas(limite);

      return reply.code(200).send({
        mensaje: "Asignaturas encontradas correctamente",
        asignaturas: asignaturasEncontradas,
        asignaturasEncontradas: asignaturasEncontradas.length,
      });
    } catch (err) {
      throw err;
    }
  };

  obtenerAsignaturaPorId = async (
    request: FastifyRequest<{ Params: { idAsignatura: number } }>,
    reply: FastifyReply
  ) => {
    try {
      
      const { idAsignatura } = request.params;
      const asignaturaEncontrada = await this.AsignaturasCasosUso.obtenerAsignaturasPorId(idAsignatura);

      return reply.code(200).send({
        mensaje: "Asignatura encontrada correctamente",
        asignatura: asignaturaEncontrada,
      });
    } catch (err) {
      throw err;
    }
  };

  crearAsignatura = async (
    request: FastifyRequest<{ Body: AsignaturaDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevaAsignatura = AsignaturaEsquema.parse(request.body);
      const idNuevaAsignatura = await this.AsignaturasCasosUso.crearAsignatura(nuevaAsignatura);

      return reply.code(201).send({
        mensaje: "La asignatura: " + request.body.nombreAsignatura + " se creó correctamente",
        idNuevaAsignatura: idNuevaAsignatura,
      });
    } catch (err) {
      throw err;
    }
  };

  actualizarAsignatura = async (
    request: FastifyRequest<{ Params: { idAsignatura: number }; Body: IAsignatura }>,
    reply: FastifyReply
  ) => {
    try {
      const { idAsignatura } = request.params;
      const nuevaAsignatura = AsignaturaEsquema.parse(request.body);

      const asignaturaActualizada = await this.AsignaturasCasosUso.actualizarAsignatura(
        idAsignatura,
        nuevaAsignatura
      );

      return reply.code(200).send({
        mensaje: "Asignatura actualizada correctamente",
        asignaturaActualizada: asignaturaActualizada,
      });
    } catch (err) {
      throw err;
    }
  };

  eliminarAsignatura = async (
    request: FastifyRequest<{ Params: { idAsignatura: number } }>,
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
      throw err;
    }
  };
}
