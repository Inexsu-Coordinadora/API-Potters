import { IPrograma } from "../../dominio/programa/IPrograma";
import { ProgramaDTO } from "../../../presentacion/esquemas/programaAcademicoEsquema";

export interface IProgramaCasosUso {
    obtenerPrograma(limite?: number): Promise<IPrograma[]>;
    obtenerProgramasPorId(idPrograma: number): Promise <IPrograma | null>;
    crearPrograma(programa: ProgramaDTO): Promise<string>;
    actualizarPrograma(idPrograma: number, programa: IPrograma): Promise <IPrograma | null>;
    eliminarPrograma(idPrograma: number): Promise <IPrograma | null>;
}