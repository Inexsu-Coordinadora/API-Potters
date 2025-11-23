import { IEstadoperiodoacademico } from "../estadoperiodoacademico/IEstadoperiodoacademico";

export interface IEstadoperiodoacademicoRepositorio {
  obtenerEstadoPorId(idEstado: number): Promise<IEstadoperiodoacademico | null>;
}
