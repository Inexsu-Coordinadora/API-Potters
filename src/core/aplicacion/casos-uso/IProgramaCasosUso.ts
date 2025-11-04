import { IPrograma } from "../../dominio/programa/IPrograma";
import { ProgramaDTO } from "../../../presentacion/esquemas/programaAcademicoEsquema";

export interface IProgramaCasosUso {
    obtenerPrograma(limite?: number): Promise<IPrograma[]>;
    obtenerProgramasPorId(idPrograma: string): Promise <IPrograma | null>;
    crearPrograma(programa: ProgramaDTO): Promise<string>;
    actualizarPrograma(idPrograma: string, programa: IPrograma): Promise <IPrograma | null>;
    eliminarPrograma(idPrograma: string): Promise <void>;
}