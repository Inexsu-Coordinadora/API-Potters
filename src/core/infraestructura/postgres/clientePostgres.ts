import { Pool, types } from "pg";
import { configuration } from "../../../common/configuracion";
types.setTypeParser(1082, val => val);

const pool = new Pool({
  host: configuration.baseDatos.host,
  user: configuration.baseDatos.usuario,
  database: configuration.baseDatos.nombreDb,
  port: configuration.baseDatos.puerto,
  password: configuration.baseDatos.contrasena,
});

export async function ejecutarConsulta(
  consulta: string,
  parametros?: Array<number | string>
) {
  return await pool.query(consulta, parametros);
}
