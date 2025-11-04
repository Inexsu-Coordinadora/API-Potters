import { FastifyRequest, FastifyReply } from "fastify";
import { IPrograma } from "../../core/dominio/programa/IPrograma";
import { IProgramaCasosUso } from "../../core/aplicacion/casos-uso/IProgramaCasosUso";
import { ProgramaDTO, crearProgramaEsquema } from "../esquemas/programaAcademicoEsquema";
import { ZodError } from "zod";

export class ProgramasControlador {
    constructor(private ProgramasCasosUso: IProgramaCasosUso) {}

    obtenerPrograma = async (
        request: FastifyRequest<{ Querystring: {limite?: number} }>,
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
            return reply.code(500).send({
                mensaje: "Error al obtener los programas",
                error: err instanceof Error ? err.message : err,
            });
        }
    };
    
    obtenerProgramaPorId = async (
        request: FastifyRequest<{ Params: { idAsignatura: string} }>,
        reply: FastifyReply
    ) => {
        try {
            const { idAsignatura } = request.params;
            const programaEncontrado = await this.ProgramasCasosUso.obtenerProgramasPorId(idAsignatura);

            if (!programaEncontrado) {
                return reply.code(404).send ({
                    mensaje: "Programa no encontrado",
                });
            }

            return reply.code(200).send({
                mensaje: "Programa encontrado correctamente",
                Programa: programaEncontrado,
            });
        } catch (err) {
            return reply.code(500).send({
                mensaje: "Error al obtener el programa",
                error: err instanceof Error ? err.message : err,
            });
        }
    };

    crearPrograma = async (
        request: FastifyRequest<{ Body: ProgramaDTO}>,
        reply: FastifyReply
    ) => {
        try {
            const nuevoPrograma = crearProgramaEsquema.parse(request.body);
            const idNuevoPrograma = await this.ProgramasCasosUso.crearPrograma(nuevoPrograma);

            return reply.code(200).send({
                mensaje: "El programa se creó correctamente",
                idNuevoPrograma: idNuevoPrograma,
            });
        } catch (err) {
            if (err instanceof ZodError) {
                return reply.code(400).send ({
                    mensaje: "Error al crear un nuevo programa",
                    error: err.issues[0]?.message || "Error desconocido",
                });
            }
            return reply.code(500).send({
                mensaje: "Error al crear un nuevo programa",
                error: err instanceof Error ? err.message : String(err),
            });
        }
    };


    actualizarPrograma = async (
        request: FastifyRequest<{ Params: {idPrograma: string}; Body: IPrograma}>,
        reply: FastifyReply
    ) => {
        try {
        const { idPrograma } = request.params;
        const nuevoPrograma = request.body;
        const programaActualizado = await this.ProgramasCasosUso.actualizarPrograma(
            idPrograma,
            nuevoPrograma
        );
        
        if (!programaActualizado) {
            return reply.code(404).send({
                mensaje: "Programa no encotrado",
            });
        }

        return reply.code(200).send ({
            mensaje: "Programa actualizado correctamente",
            programaActualizado: programaActualizado,
        });
        } catch (err) {
            return reply.code(500).send ({
                mensaje: "Error al actualizar el programa",
                error: err instanceof Error ? err.message : err,
            });
        } 
    };

    eliminarPrograma = async (
        request: FastifyRequest<{ Params: {idPrograma: string}}>,
        reply: FastifyReply
    ) => {
        try {
            const { idPrograma } = request.params;
            await this.ProgramasCasosUso.eliminarPrograma(idPrograma);

            return reply.code(200).send({
                mensaje: "Programa eliminado correctamente",
                idPrograma: idPrograma,
            });
        } catch (err) {
            return reply.code(500).send ({
                mensaje: "Error al eliminar el programa",
                error: err instanceof Error ? err.message : err,
            });
        }
    };
}