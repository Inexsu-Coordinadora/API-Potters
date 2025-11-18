import { IEstadoperiodoacademico } from "../estadoperiodoacademico/Iestadoperiodoacademico";

export interface IEstadoperiodoacademicoRepositorio {
  obtenerEstadoPorId(idEstado: number): Promise<IEstadoperiodoacademico | null>;
}
