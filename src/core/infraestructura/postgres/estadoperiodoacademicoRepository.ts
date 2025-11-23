import { IEstadoperiodoacademicoRepositorio } from "../../dominio/repositorio/IEstadoperiodoacademicoRepositorio";
import { ejecutarConsulta } from "./clientePostgres";
import { IEstadoperiodoacademico } from "../../dominio/estadoperiodoacademico/IEstadoperiodoacademico";

export class EstadoperiodoacademicoRepositorio implements IEstadoperiodoacademicoRepositorio {
  async obtenerEstadoPorId(idEstado: number): Promise<IEstadoperiodoacademico | null> {
    const query = "SELECT * FROM estadoperiodoacademico WHERE idEstado = $1";
    const result = await ejecutarConsulta(query, [idEstado]);
    return result.rows[0] || null;
  }
}
