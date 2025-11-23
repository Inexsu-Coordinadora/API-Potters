import { ProgramaDTO } from "../../../presentacion/esquemas/programaAcademicoEsquema";
import { EntidadNoEncontradaError } from "../../dominio/errores/encontrarError";
import { IPrograma } from "../../dominio/programa/IPrograma";
import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { IProgramaCasosUso } from "./IProgramaCasosUso";

export class ProgramaCasosUso implements IProgramaCasosUso {
    constructor(private programaRepositorio: IProgramaRepositorio) { }

    async obtenerPrograma(limite?: number): Promise<IPrograma[]> {
        const lista = await this.programaRepositorio.listarPrograma(limite);
        if (!lista || lista.length == 0) throw new EntidadNoEncontradaError("No se encontró ningún programa académico");
        return lista;
    }

    async obtenerProgramasPorId(idPrograma: number): Promise<IPrograma | null> {
        const programaObtenido = await this.programaRepositorio.obtenerProgramaPorId(idPrograma);
        if (!programaObtenido) throw new EntidadNoEncontradaError("No se encontró ningún programa académico");
        return programaObtenido;
    }

    async crearPrograma(datosPrograma: ProgramaDTO): Promise<string> {
        const idNuevoPrograma = await this.programaRepositorio.crearPrograma(datosPrograma);
        return idNuevoPrograma;
    }

    async actualizarPrograma(idPrograma: number, programa: IPrograma): Promise<IPrograma | null> {
        const programaActualizado = await this.programaRepositorio.actualizarPrograma(
            idPrograma,
            programa
        );

        if (!programaActualizado) throw new EntidadNoEncontradaError(`Programa académico con id ${idPrograma} no encontrado`);
        return programaActualizado;
    }

    async eliminarPrograma(idPrograma: number): Promise<IPrograma | null> {
        const programaObtenido = await this.programaRepositorio.eliminarPrograma(idPrograma);
        if (!programaObtenido) throw new EntidadNoEncontradaError("No se encontró ningún programa académico");
        return programaObtenido;
    }
}