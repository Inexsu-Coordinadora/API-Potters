import { envEsquema } from "../presentacion/esquemas/envEsquema"

export const databaseConfig = {
  host: envEsquema.PGHOST,
  port: envEsquema.PGPORT,
  user: envEsquema.PGUSER,
  password: envEsquema.PGPASSWORD,
  database: envEsquema.PGDBNAME,
};
