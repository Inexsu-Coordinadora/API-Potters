import { FastifyInstance } from "fastify";
import { PeriodoAcademicoControlador } from "../controladores/periodoAcademicoControlador";
import { PeriodoAcademicoRepositorio } from "../../core/infraestructura/postgres/periodoAcademicoRepository";
import { PeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/PeriodoAcademicoCasosUso";
import { IPeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso";
import { IPeriodoAcademicoRepositorio } from "../../core/dominio/repositorio/IPeriodoAcademicoRepositorio";

function gestionPeriodoEnrutador(
  app: FastifyInstance,
  periodoAcademicoController: PeriodoAcademicoControlador,
) {
  app.get("/periodoacademico", periodoAcademicoController.listarPeriodos);
  app.get("/periodoacademico/:idPeriodo", periodoAcademicoController.obtenerPeriodoPorId);
  app.post("/periodoacademico", periodoAcademicoController.crearPeriodo);
  app.put("/periodoacademico/:idPeriodo", periodoAcademicoController.actualizarPeriodo);
  app.delete("/periodoacademico/:idPeriodo", periodoAcademicoController.eliminarPeriodo);
}

export async function construirPeriodoAcademicoEnrutador(app: FastifyInstance) {
  const periodoAcademicoRepositorio: IPeriodoAcademicoRepositorio = new PeriodoAcademicoRepositorio();
  const periodoAcademicoCasosUso: IPeriodoAcademicoCasosUso = new PeriodoAcademicoCasosUso(periodoAcademicoRepositorio);
  const periodoAcademicoController = new PeriodoAcademicoControlador(periodoAcademicoCasosUso);

  gestionPeriodoEnrutador(app, periodoAcademicoController);
}
