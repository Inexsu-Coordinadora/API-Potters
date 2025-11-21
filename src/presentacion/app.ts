import Fastify from "fastify";
import { FastifyError } from "fastify";
import { construirAsignaturasEnrutador } from "./rutas/gestionAsignaturaEnrutador";
import { construirProgramasEnrutador } from "./rutas/gestionProgramaEnRutador";
import { construirPeriodoAcademicoEnrutador } from "./rutas/gestionPeriodoAcademicoEnrutador";
import { construirOfertasEnrutador } from "./rutas/gestionOfertaEnrutador";
import { construirPlanEstudioEnrutador } from "./rutas/gestionPlanEstudioEnrutador";
import { httpConfig } from "./../config/http";
import { ZodError } from "zod";

const app = Fastify({ logger: true });

app.setErrorHandler((err, request, reply) => {

  // 1. Zod → convertir al estilo de Fastify
  if (err instanceof ZodError) {
    const mensaje = err.issues[0]?.message || "Datos inválidos";
    
    return reply.code(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: mensaje
    });
  }

  // 2. Errores de dominio → custom errors
  if (err.statusCode) {
    return reply.code(err.statusCode).send({
      statusCode: err.statusCode,
      error: err.name || "Error",
      message: err.message
    });
  }

  // 3. Errores inesperados (500)
  console.error("ERROR NO CONTROLADO", err);

  return reply.code(500).send({
    statusCode: 500,
    error: "Internal Server Error",
    message: err.message || "Error interno del servidor"
  });
});



app.register(
  async (appInstance) => {
    construirAsignaturasEnrutador(appInstance);
    construirProgramasEnrutador(appInstance);
    construirPeriodoAcademicoEnrutador(appInstance);
    construirOfertasEnrutador(appInstance);
    construirPlanEstudioEnrutador(appInstance);
  },
  { prefix: "/api/Academium" }
);

export const startServer = async (): Promise<void> => {
  try {
    await app.listen({ port: httpConfig.puerto });
    app.log.info("El servidor esta corriendo...");
  } catch (err) {
    app.log.error(`Error al ejecutar el servidor\n ${err}`);

    const serverError: FastifyError = {
      code: "FST_ERR_INIT_SERVER",
      name: "ServidorError",
      statusCode: 500,
      message: `El servidor no se pudo iniciar: ${(err as Error).message}`,
    };

    throw serverError;
  }
};
