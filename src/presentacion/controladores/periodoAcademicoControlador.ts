import { FastifyRequest, FastifyReply } from "fastify";
import { IPeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso"; // <-- Usa la interfaz de Casos de Uso
import { PeriodoAcademicoDTO, CrearPeriodoAcademicoEsquema } from "../esquemas/periodoAcademicoEsquema";

export class PeriodoAcademicoControlador {
  constructor(private PeriodosCasosUso: IPeriodoAcademicoCasosUso) { }

  listarPeriodos = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const periodosEncontrados = await this.PeriodosCasosUso.obtenerPeriodos(limite);

      return reply.code(200).send({
        mensaje: "Periodos académicos encontrados correctamente",
        periodos: periodosEncontrados,
        periodosEncontrados: periodosEncontrados.length,
      });
    } catch (err) {
      throw err;
    }
  };

  obtenerPeriodoPorId = async (
    request: FastifyRequest<{ Params: { idPeriodo: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params;
      const periodoEncontrado = await this.PeriodosCasosUso.obtenerPeriodoPorId(idPeriodo);

      return reply.code(200).send({
        mensaje: "Periodo académico encontrado correctamente",
        periodo: periodoEncontrado,
      });
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
    }
  };

  actualizarPeriodo = async (
    request: FastifyRequest<{ Params: { idPeriodo: number }; Body: PeriodoAcademicoDTO }>,
    reply: FastifyReply
  ) => {
    try {

      const { idPeriodo } = request.params;
      const datosPeriodo = CrearPeriodoAcademicoEsquema.parse(request.body);

      const periodoActualizado = await this.PeriodosCasosUso.actualizarPeriodo(
        idPeriodo,
        datosPeriodo
      );

      return reply.code(200).send({
        mensaje: "Periodo académico actualizado correctamente",
        periodoActualizado: periodoActualizado,
      });
    } catch (err) {
      throw err;
    }
  };


  eliminarPeriodo = async (
    request: FastifyRequest<{ Params: { idPeriodo: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idPeriodo } = request.params;
      await this.PeriodosCasosUso.eliminarPeriodo(idPeriodo);

      return reply.code(200).send({
        mensaje: "Periodo académico eliminado correctamente",
        idPeriodo: idPeriodo,
      });
    } catch (err) {
      throw err;
    }
  };
}