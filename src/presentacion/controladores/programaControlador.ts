import { FastifyRequest, FastifyReply } from "fastify";
import { IPrograma } from "../../core/dominio/programa/IPrograma";
import { IProgramaCasosUso } from "../../core/aplicacion/casos-uso/IProgramaCasosUso";
import { ProgramaDTO, crearProgramaEsquema } from "../esquemas/programaAcademicoEsquema";

export class ProgramasControlador {
    constructor(private ProgramasCasosUso: IProgramaCasosUso) { }

    obtenerPrograma = async (
        request: FastifyRequest<{ Querystring: { limite?: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { limite } = request.query;
            const ProgramasEncontrados = await this.ProgramasCasosUso.obtenerPrograma(limite);

            return reply.code(200).send({
                mensaje: "Programas encontrados correctamente",
                Programas: ProgramasEncontrados,
                ProgramasEncontrados: ProgramasEncontrados.length,
            });
        } catch (err) {
            throw err;
        }
    };

    obtenerProgramaPorId = async (
        request: FastifyRequest<{ Params: { idPrograma: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPrograma } = request.params;
            const programaEncontrado = await this.ProgramasCasosUso.obtenerProgramasPorId(idPrograma);

            return reply.code(200).send({
                mensaje: "Programa encontrado correctamente",
                Programa: programaEncontrado,
            });
        } catch (err) {
            throw err;
        }
    };

    crearPrograma = async (
        request: FastifyRequest<{ Body: ProgramaDTO }>,
        reply: FastifyReply
    ) => {
        try {
            const nuevoPrograma = crearProgramaEsquema.parse(request.body);
            const idNuevoPrograma = await this.ProgramasCasosUso.crearPrograma(nuevoPrograma);

            return reply.code(201).send({
                mensaje: "El programa se creó correctamente",
                idNuevoPrograma: idNuevoPrograma,
            });
        } catch (err) {
            throw err;
        }
    };

    actualizarPrograma = async (
        request: FastifyRequest<{ Params: { idPrograma: number }; Body: IPrograma }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPrograma } = request.params;
            const nuevoPrograma = request.body;
            const programaActualizado = await this.ProgramasCasosUso.actualizarPrograma(
                idPrograma,
                nuevoPrograma
            );

            return reply.code(200).send({
                mensaje: "Programa actualizado correctamente",
                programaActualizado: programaActualizado,
            });
        } catch (err) {
            throw err;
        }
    };

    eliminarPrograma = async (
        request: FastifyRequest<{ Params: { idPrograma: number } }>,
        reply: FastifyReply
    ) => {
        try {
            const { idPrograma } = request.params;
            const ProgramaEncontrada = await this.ProgramasCasosUso.eliminarPrograma(idPrograma);

            return reply.code(200).send({
                mensaje: "Programa eliminado correctamente",
                idPrograma: idPrograma,
            });
        } catch (err) {
            throw err;
        }
    };
}