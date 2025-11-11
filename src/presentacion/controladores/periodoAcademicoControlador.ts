import { FastifyRequest, FastifyReply } from "fastify";
import { IPeriodoAcademico } from "../../core/dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoDTO, CrearPeriodoAcademicoEsquema } from "../esquemas/periodoAcademicoEsquema";
import { ZodError } from "zod";

export class PeriodoAcademicoControlador {
  constructor(private periodosCasosUso: IPeriodoAcademicoCasosUso) { }


  listarPeriodos = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const periodosEncontrados = await this.periodosCasosUso.obtenerPeriodos(limite);

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
      const periodoEncontrado = await this.periodosCasosUso.obtenerPeriodoPorId(idPeriodo);

      if (!periodoEncontrado) {
        return reply.code(404).send({
          mensaje: "Periodo académico no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Periodo académico encontrado correctamente",
        periodoEncontrado,
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
      const idNuevoPeriodo = await this.periodosCasosUso.crearPeriodo(nuevoPeriodo);

      return reply.code(201).send({
        mensaje: "El periodo académico se creó correctamente",
        idNuevoPeriodo,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error de validación en los campos del periodo académico",
          errores: err.issues.map(issue => ({
            campo: issue.path.join("."),
            detalle: issue.message,
          })),
        });
      }

      if (err instanceof Error) {
        const mensajeError = err.message.toLowerCase();

        if (mensajeError.includes("fecha")) {
          return reply.code(400).send({
            mensaje: "Fecha inválida: la fecha de fin no puede ser menor que la de inicio."
          });
        }

        if (mensajeError.includes("solapa")) {
          return reply.code(409).send({
            mensaje: "Ya existe un periodo activo que se solapa con las fecha ingresadas."
          });
        }

        if (mensajeError.includes("transición")) {
          return reply.code(400).send({
            mensaje: "Transición de estado no permitida."
          });
        }

        if (mensajeError.includes("duplicate key")) {
          return reply.code(400).send({
            mensaje: "Ya existe un periodo con este identificador."
          });
        }
      }
      return reply.code(500).send({
        mensaje: "Error al crear un nuevo periodo académico.",
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

      const periodoActualizado = await this.periodosCasosUso.actualizarPeriodo(
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
        periodoActualizado,
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("fecha")) {
          return reply.code(400).send({
            mensaje: "Fecha inválida al intentar actualizar el periodo",
          });
        }
        if (err.message.includes("solapa")) {
          return reply.code(409).send({
            mensaje: "No se puede actualizar porque se solapa con otro periodo activo",
          });
        }
        if (err.message.includes("transición")) {
          return reply.code(400).send({
            mensaje: "Transición de estado no permitida",
          });
        }
      }

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
      const periodoEncontrado = await this.periodosCasosUso.eliminarPeriodo(idPeriodo);

      if (!periodoEncontrado) {
        return reply.code(404).send({
          mensaje: "Periodo académico no encontrado",
        });
      }

      return reply.code(200).send({
        mensaje: "Periodo académico eliminado correctamente",
        idPeriodo,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar el periodo académico",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}