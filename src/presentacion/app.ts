import Fastify, { FastifyError } from "fastify";
import { construirAsignaturasEnrutador } from "./rutas/gestionAsignaturaEnrutador";
import { construirProgramasEnrutador } from "./rutas/gestionProgramaEnRutador";
import { construirPeriodoAcademicoEnrutador } from "./rutas/gestionPeriodoAcademicoEnrutador";
import { construirOfertasEnrutador } from "./rutas/gestionOfertaEnrutador";
import { construirPlanEstudioEnrutador } from "./rutas/gestionPlanEstudioEnrutador";
import { httpConfig } from "../config/http";
import { ZodError } from "zod";

const app = Fastify({
  logger: process.env.NODE_ENV !== "test",
});

app.setErrorHandler((err, request, reply) => {
  if (err instanceof ZodError) {
    return reply.code(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: err.issues[0]?.message || "Datos inválidos",
    });
  }

  if (err.statusCode) {
    return reply.code(err.statusCode).send({
      statusCode: err.statusCode,
      error: err.name || "Error",
      message: err.message,
    });
  }

  console.error("ERROR NO CONTROLADO", err);

  return reply.code(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: err.message || "Error interno del servidor",
  });
});

  app.register(async (appInstance) => {
    await construirAsignaturasEnrutador(appInstance);
    await construirProgramasEnrutador(appInstance);
    await construirPeriodoAcademicoEnrutador(appInstance);
    await construirOfertasEnrutador(appInstance);
    await construirPlanEstudioEnrutador(appInstance);
  }, { prefix: "/api/Academium" });



export const startServer = async () => {
  try {
    await app.listen({ port: httpConfig.puerto });
    app.log.info(`Servidor escuchando en puerto ${httpConfig.puerto}...`);
  } catch (err) {
    const serverError: FastifyError = {
      code: "FST_ERR_INIT_SERVER",
      name: "ServerError",
      statusCode: 500,
      message: `Error al iniciar servidor: ${(err as Error).message}`,
    };
    throw serverError;
  }
};

export { app };
export default app;
