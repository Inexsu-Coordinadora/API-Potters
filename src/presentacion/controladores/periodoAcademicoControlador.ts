import { FastifyRequest, FastifyReply } from "fastify";
import { IPeriodoAcademico } from "../../core/dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso"; // <-- Usa la interfaz de Casos de Uso
import { PeriodoAcademicoDTO, CrearPeriodoAcademicoEsquema } from "../esquemas/periodoAcademicoEsquema";
import { ZodError } from "zod";

export class PeriodoAcademicoControlador {
  constructor(private PeriodosCasosUso: IPeriodoAcademicoCasosUso) { }


  listarPeriodos = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const periodosEncontrados = await this.PeriodosCasosUso.obtenerPeriodos(limite); // <-- Usa el Caso de Uso

      return reply.code(200).send({
        mensaje: "Periodos académicos encontrados correctamente",
        periodos: periodosEncontrados,
        periodosEncontrados: periodosEncontrados.length,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener los periodos académicos",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerPeriodoPorId = async (
    request: FastifyRequest<{ Params: { idPeriodo: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params;
      const periodoEncontrado = await this.PeriodosCasosUso.obtenerPeriodoPorId(idPeriodo);

      if (!periodoEncontrado) {
        return reply.code(404).send({
          mensaje: "Periodo académico no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Periodo académico encontrado correctamente",
        periodo: periodoEncontrado,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener el periodo académico",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearPeriodo = async (
    request: FastifyRequest<{ Body: PeriodoAcademicoDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const nuevoPeriodo = CrearPeriodoAcademicoEsquema.parse(request.body);
      const idNuevoPeriodo = await this.PeriodosCasosUso.crearPeriodo(nuevoPeriodo);

      return reply.code(201).send({
        mensaje: "El periodo académico se creó correctamente",
        idNuevoPeriodo: idNuevoPeriodo,
      });
    } catch (err: any) {

      const mensaje = err?.message ?? "";
      const mensajeError: Array<string> = mensaje.split(":");

      if (mensaje.includes("fecha traslapada")) {
        return reply.status(400).send({
          mensaje: "No se puede crear el periodo académico",
          error: `Existe un periodo activo que solapa las fechas. ${mensajeError[1]}`
        });
      }

      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error de validación al crear un nuevo periodo académico",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }
      return reply.code(500).send({
        mensaje: "Error al crear un nuevo periodo académico",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarPeriodo = async (

    request: FastifyRequest<{ Params: { idPeriodo: number }; Body: IPeriodoAcademico }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params;
      const datosPeriodo = request.body;

      const periodoActualizado = await this.PeriodosCasosUso.actualizarPeriodo(
        idPeriodo,
        datosPeriodo
      );

      if (!periodoActualizado) {
        return reply.code(404).send({
          mensaje: "Periodo académico no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Periodo académico actualizado correctamente",
        periodoActualizado: periodoActualizado,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al actualizar el periodo académico",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  eliminarPeriodo = async (
    request: FastifyRequest<{ Params: { idPeriodo: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params;
      const periodoEncontrado = await this.PeriodosCasosUso.eliminarPeriodo(idPeriodo);

      if (!periodoEncontrado) {
        return reply.code(404).send({
          mensaje: "Periodo no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Periodo académico eliminado correctamente",
        idPeriodo: idPeriodo,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar el periodo académico",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}