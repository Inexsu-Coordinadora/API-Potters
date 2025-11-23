import { Pool, types } from "pg";
import { databaseConfig } from "../../../config/database";
types.setTypeParser(1082, val => val);

const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
});

export async function ejecutarConsulta(
  consulta: string,
  parametros?: Array<number | string>
) {
  return await pool.query(consulta, parametros);
}
