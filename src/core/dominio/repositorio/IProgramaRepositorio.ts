import { IPrograma } from "../programa/IPrograma";

export interface IProgramaRepositorio {
    crearPrograma(datosPrograma: IPrograma): Promise <string>;
    listarPrograma(limite?: number): Promise<IPrograma[]>;
    obtenerProgramaPorId(idPrograma: number): Promise<IPrograma | null>;
    actualizarPrograma(idPrograma: number, datosPrograma: IPrograma): Promise<IPrograma>;
    eliminarPrograma(idPrograma: number): Promise<IPrograma | null>;
}