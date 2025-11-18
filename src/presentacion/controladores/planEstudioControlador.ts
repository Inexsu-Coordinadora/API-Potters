import { FastifyRequest, FastifyReply } from "fastify";
import { IPlanEstudio } from "../../core/dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/IPlanEstudioCasosUso";
import { PlanEstudioDTO, CrearPlanEstudioEsquema } from "../esquemas/planEstudioEsquema";
import { ZodError } from "zod";
import { request } from "http";
import { ValidacionError } from "../../core/dominio/errores/validacionError";

export class PlanEstudioControlador {
    constructor(private PlanEstudioCasosUso: IPlanEstudioCasosUso) { }

    obtenerPlanEstudio = async (
        request: FastifyRequest<{ Querystring: { limite?: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { limite } = request.query;
            const planEstudioEncontrados = await this.PlanEstudioCasosUso.obtenerPlanEstudio(limite);

            return reply.code(200).send({
                mensaje: "Plan de estudio encontrado correctamente",
                PlanEstudio: planEstudioEncontrados,
                planEstudioEncontrados: planEstudioEncontrados.length,
            });
        } catch (err) {
            console.error("Error al listar planes de estudio:", err);
            return reply.code(500).send({
                mensaje: "Error al listar los planes de estudio",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };

    obtenerPlanEstudioPorId = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const planEstudioEncontrado = await this.PlanEstudioCasosUso.obtenerPlanEstudioPorId(idPlanEstudio);

            if (!planEstudioEncontrado) {
                return reply.code(404).send({
                    mensaje: "Plan de estudio no encontrado",
                });
            }
            return reply.code(200).send({
                mensaje: "Plan de estudio encontrado correctamente",
                planEstudio: planEstudioEncontrado,
            });

        } catch (err) {
            console.error("Error al obtener plan de estudio por ID:", err);
            return reply.code(500).send({
                mensaje: "Error al obtener el plan de estudio",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };

    crearPlanEstudio = async (
        request: FastifyRequest<{ Body: PlanEstudioDTO }>,
        reply: FastifyReply
    ) => {
        const mensajeGenerico = "Error al registrar el plan de estudio";
        try {

            const nuevoPlanEstudio = CrearPlanEstudioEsquema.parse(request.body);
            const idNuevoPlanEstudio = await this.PlanEstudioCasosUso.crearPlanEstudio(nuevoPlanEstudio);

            console.log('blaaaaaaaaaaa', idNuevoPlanEstudio );

            return reply.code(201).send({
                mensaje: "El plan de estudio se creó correctamente",
                idNuevoPlanEstudio: idNuevoPlanEstudio,
            });

        } catch (err) {
            let errorDetalle: string;
            let statusCode: number = 500;

            if (err instanceof ValidacionError) {
                statusCode = 400;
                errorDetalle = err.message;
                return reply.code(statusCode).send({
                    mensaje: mensajeGenerico,
                    error: errorDetalle,
                });
            }

            if (err instanceof ZodError) {
                statusCode = 400;
                errorDetalle = err.issues[0]?.message || "Error en la estructura de los datos";
                return reply.code(statusCode).send({
                    mensaje: mensajeGenerico,
                    error: errorDetalle,
                });
            }

            console.error("Error detallado en POST /planestudio:", err);
            return reply.code(500).send({
                mensaje: "Error interno del servidor al registrar un plan de estudio",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };

    actualizarPlanEstudio = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number }; Body: IPlanEstudio }>,
        reply: FastifyReply
    ) => {
        const mensajeGenerico = "Error al actualizar el plan de estudio";
        try {
            const { idPlanEstudio } = request.params;

            const datosValidados = CrearPlanEstudioEsquema.parse(request.body);

            const planEstudioActualizado = await this.PlanEstudioCasosUso.actualizarPlanEstudio(
                idPlanEstudio,
                datosValidados as IPlanEstudio
            );


            if (!planEstudioActualizado) {
                return reply.code(404).send({
                    mensaje: "Plan de estudio no encontrado para actualizar",
                });
            }

            return reply.code(200).send({
                mensaje: "Plan de estudio actualizado correctamente",
                planEstudioActualizado: planEstudioActualizado,
            });


        } catch (err) {
            let errorDetalle: string;
            let statusCode: number = 500;

            if (err instanceof ValidacionError) {
                statusCode = 400;
                errorDetalle = err.message;
                return reply.code(statusCode).send({
                    mensaje: mensajeGenerico,
                    error: errorDetalle,
                });
            }

            if (err instanceof ZodError) {
                statusCode = 400;
                errorDetalle = err.issues[0]?.message || "Error en la estructura de los datos";
                return reply.code(statusCode).send({
                    mensaje: mensajeGenerico,
                    error: errorDetalle,
                });
            }

            console.error("Error detallado en PUT /planestudio:", err);
            return reply.code(500).send({
                mensaje: mensajeGenerico,
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };

    eliminarPlanEstudio = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const planEstudioEncontrado = await this.PlanEstudioCasosUso.eliminiarPlanEstudio(idPlanEstudio);

            if (!planEstudioEncontrado) {
                return reply.code(404).send({
                    mensaje: "Plan de estudio no encontrado",
                });
            }

            return reply.code(200).send({
                mensaje: "Plan de estudio eliminado correctamente",
                idPlanEstudio: idPlanEstudio,
            });

        } catch (err) {
            console.error("Error al eliminar plan de estudio:", err);
            return reply.code(500).send({
                mensaje: "Error al eliminar el plan de estudio",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }
}