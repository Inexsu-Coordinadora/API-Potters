import { FastifyRequest, FastifyReply } from "fastify";
import { IPlanEstudio } from "../../core/dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioCasosUso } from "../../core/aplicacion/casos-uso/IPlanEstudioCasosUso";
import { PlanEstudioDTO, PlanEstudioEsquema } from "../esquemas/planEstudioEsquema";

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
            throw err;
        }
    };

    obtenerPlanEstudioPorId = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const planEstudioEncontrado = await this.PlanEstudioCasosUso.obtenerPlanEstudioPorId(idPlanEstudio);

            return reply.code(200).send({
                mensaje: "Plan de estudio encontrado correctamente",
                planEstudio: planEstudioEncontrado,
            });
        } catch (err) {
            throw err;
        }
    };

    crearPlanEstudio = async (
        request: FastifyRequest<{ Body: PlanEstudioDTO }>,
        reply: FastifyReply
    ) => {
        try {
            const nuevoPlanEstudio = PlanEstudioEsquema.parse(request.body);
            const idNuevoPlanEstudio = await this.PlanEstudioCasosUso.crearPlanEstudio(nuevoPlanEstudio);

            return reply.code(201).send({
                mensaje: "El plan de estudio se creó correctamente",
                idNuevoPlanEstudio: idNuevoPlanEstudio,
            });

        } catch (err) {
            throw err;
        }
    };

    actualizarPlanEstudio = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number }; Body: IPlanEstudio }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const datosValidados = PlanEstudioEsquema.parse(request.body);
            const planEstudioActualizado = await this.PlanEstudioCasosUso.actualizarPlanEstudio(
                idPlanEstudio,
                datosValidados as IPlanEstudio
            );

            return reply.code(200).send({
                mensaje: "Plan de estudio actualizado correctamente",
                planEstudioActualizado: planEstudioActualizado,
            });
        } catch (err) {
            throw err;
        }
    };

    eliminarPlanEstudio = async (
        request: FastifyRequest<{ Params: { idPlanEstudio: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPlanEstudio } = request.params;
            const planEstudioEncontrado = await this.PlanEstudioCasosUso.eliminarPlanEstudio(idPlanEstudio);

            return reply.code(200).send({
                mensaje: "Plan de estudio eliminado correctamente",
                idPlanEstudio: idPlanEstudio,
            });

        } catch (err) {
            throw err;
        }
    }
}