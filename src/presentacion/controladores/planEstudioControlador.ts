import { FastifyRequest, FastifyReply } from "fastify";
import { IPlanEstudio } from "../../core/dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/IPlanEstudioCasosUso";
import { PlanEstudioDTO, CrearPlanEstudioEsquema } from "../esquemas/planEstudioEsquema";
import { ZodError } from "zod";
import { request } from "http";

export class PlanEstudioControlador {
    constructor(private PlanEstudioCasosUso: IPlanEstudioCasosUso) {}

    obtenerPlanEstudio = async (
        request: FastifyRequest<{Querystring: {limite?: number} }>,
        reply: FastifyReply
    ) => {
        try {
            const { limite } = request.query;
            const planEstudioEncontrados = await this.PlanEstudioCasosUso.obtenerPlanEstudio(limite);

            return reply.code(200).send({
                mensaje: "Planes de estudio encontrados correctamente",
                PlanEstudio: planEstudioEncontrados,
                planEstudioEncontrados: planEstudioEncontrados.length,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al obtener los planes de estudio",
                error: err instanceof Error ? err.message : err,
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
                mensaje: "Plan de Estudio encontrado correctamente",
                planEstudio: planEstudioEncontrado,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al obtener el plan de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    };

    crearPlanEstudio = async (
        request: FastifyRequest<{ Body: PlanEstudioDTO}>,
        reply: FastifyReply
    ) => {
        try {
            const nuevoPlanEstudio = CrearPlanEstudioEsquema.parse(request.body);
            const idNuevoPlanEstudio = await this.PlanEstudioCasosUso.crearPlanEstudio(nuevoPlanEstudio);

            return reply.code(200).send({
                mensaje: "El plan de estudio se creo correctamente",
                idNuevoPlanEstudio: idNuevoPlanEstudio,
            });
        } catch (err) {

            if(err instanceof ZodError) {
                return reply.code(400).send({
                    mensaje: "Error al crear un nuevo plan de estudio",
                    error: err.issues[0]?.message || "Error desconocido",
                });
            }
        
            return reply.code(500).send({
                mensaje: "Error al crear un nuevo plan de estudio",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };

    actualizarPlanEstudio = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number }; Body: IPlanEstudio }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const nuevoPlanEstudio = request.body;
            const planEstudioActualizado = await this.PlanEstudioCasosUso.actualizarPlanEstudio(
                idPlanEstudio,
                nuevoPlanEstudio
            );

            if (!planEstudioActualizado) {
                return reply.code(404).send ({
                    mensaje: "Plan de estudio no encontrado",
                });
            }

            return reply.code(200).send({
                mensaje: "Plan de estudio actualizado correctamente",
                planEstudioActualizado: planEstudioActualizado,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al actualizar el plan de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    };

    eliminarPlanEstudio = async (
        request: FastifyRequest<{ Params: {idPlanEstudio: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const planEstudioEncontrado = await this.PlanEstudioCasosUso.eliminiarPlanEstudio(idPlanEstudio);

            if(!planEstudioEncontrado) {
                return reply.code(404).send({
                    mensaje: "Plan de estudio no encontrado",
                });
            }

            return reply.code(200).send({
                mensaje: "Plan de estudio eliminado correctamente",
                idPlanEstudio: idPlanEstudio,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al eliminar el plan de estudio",
                error: err instanceof Error ? err.message : err,
            });
        }
    };
}