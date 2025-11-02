import { Pool } from "pg";
import { configuration } from "../../../common/configuracion";

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
  console.log(consulta,"consulta postgres");
  console.log(parametros,"parametros postgres");
  return await pool.query(consulta, parametros);
}
