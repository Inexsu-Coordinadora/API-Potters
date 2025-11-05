import { ProgramaDTO } from "../../../presentacion/esquemas/programaAcademicoEsquema";
import { IPrograma } from "../../dominio/programa/IPrograma";
import { IProgramaRepositorio } from "../../dominio/repositorio/IProgramaRepositorio";
import { IProgramaCasosUso } from "./IProgramaCasosUso";

export class ProgramaCasosUso implements IProgramaCasosUso {
        constructor(private programaRepositorio: IProgramaRepositorio) {}

    async obtenerPrograma(limite?: number): Promise<IPrograma[]> {
        return await this.programaRepositorio.listarPrograma(limite);
    }

    async obtenerProgramasPorId(idPrograma: string): Promise<IPrograma | null> {
        const programaObtenido = await this.programaRepositorio.obtenerProgramaPorId(idPrograma);
        return programaObtenido;   
    }
    
    async crearPrograma(datosPrograma: ProgramaDTO): Promise<string> {
        const idNuevoPrograma = await this.programaRepositorio.crearPrograma(datosPrograma);
        return idNuevoPrograma;
    }

    async actualizarPrograma(idPrograma: string, programa: IPrograma): Promise<IPrograma | null> {
        const programaActualizado = await this.programaRepositorio.actualizarPrograma(
            idPrograma,
            programa
        );
        return programaActualizado || null;
    }
    async eliminarPrograma(idPrograma: string): Promise<IPrograma | null> {
        const programaObtenido = await this.programaRepositorio.eliminarPrograma(idPrograma);
        return programaObtenido;
  }
}