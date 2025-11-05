import { IPrograma } from "../programa/IPrograma";

export interface IProgramaRepositorio {
    crearPrograma(datosPrograma: IPrograma): Promise <string>;
    listarPrograma(limite?: number): Promise<IPrograma[]>;
    obtenerProgramaPorId(idPrograma: string): Promise<IPrograma | null>;
    actualizarPrograma(id: string, datosPrograma: IPrograma): Promise<IPrograma>;
    eliminarPrograma(id: string): Promise<IPrograma | null>;
}