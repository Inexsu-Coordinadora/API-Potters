import { FastifyRequest, FastifyReply } from "fastify"; 
import { IPeriodoAcademico } from "../../core/dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso"; // <-- Usa la interfaz de Casos de Uso
import { PeriodoAcademicoDTO, CrearPeriodoAcademicoEsquema } from "../esquemas/periodoAcademicoEsquema";
import { ZodError } from "zod";

export class PeriodoAcademicoControlador {
  constructor(private PeriodosCasosUso: IPeriodoAcademicoCasosUso) {}


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
    request: FastifyRequest<{ Params: { idPeriodo: string } }>, // <-- El ID de la URL es string
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params; // <-- Se toma como string
      // Se pasa el ID como string al Caso de Uso (se evita Number(id))
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
      // Validación con Zod
      const nuevoPeriodo = CrearPeriodoAcademicoEsquema.parse(request.body);
      // La función retorna el ID (que en las correcciones anteriores definimos como number)
      const idNuevoPeriodo = await this.PeriodosCasosUso.crearPeriodo(nuevoPeriodo); 

      return reply.code(201).send({ // Código 201 Created
        mensaje: "El periodo académico se creó correctamente",
        idNuevoPeriodo: idNuevoPeriodo,
      });
    } catch (err) {
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
    // Usa IPeriodoAcademico como tipo de cuerpo para consistencia con la capa de Dominio
    request: FastifyRequest<{ Params: { idPeriodo: string }; Body: IPeriodoAcademico }>, 
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params;
      const datosPeriodo = request.body; // No se valida parcialmente, se asume validación en DTO

      const periodoActualizado = await this.PeriodosCasosUso.actualizarPeriodo(
        idPeriodo, // Se pasa el ID como string
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
    request: FastifyRequest<{ Params: { idPeriodo: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params; // Se toma como string
      await this.PeriodosCasosUso.eliminarPeriodo(idPeriodo); // Se pasa el ID como string

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