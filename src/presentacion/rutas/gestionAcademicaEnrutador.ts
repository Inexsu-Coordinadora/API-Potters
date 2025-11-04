import { FastifyInstance } from "fastify";
import { AsignaturasControlador } from "../controladores/asignaturaControlador";
import { IAsignaturaRepositorio } from "../../core/dominio/repositorio/IAsignaturaRepositorio";
import { AsignaturaCasosUso} from "../../core/aplicacion/casos-uso/AsignaturaCasosUso";
import { AsignaturaRepositorio } from "../../core/infraestructura/postgres/asignaturaRepository";
import { IAsignaturaCasosUso } from "../../core/aplicacion/casos-uso/IAsignaturaCasosUso";


function gestionAcademicaEnrutador(
  app: FastifyInstance,
  asignaturaController: AsignaturasControlador,
) {
  app.get("/asignaturas", asignaturaController.obtenerAsignaturas);
  app.get("/asignaturas/:idAsignatura", asignaturaController.obtenerAsignaturaPorId);
  app.post("/asignaturas", asignaturaController.crearAsignatura);
  app.put("/asignaturas/:idAsignatura", asignaturaController.actualizarAsignatura);
  app.delete("/asignaturas/:idAsignatura", asignaturaController.eliminarAsignatura);
}

export async function construirAsignaturasEnrutador(app: FastifyInstance) {
  const asignaturaRepositorio: IAsignaturaRepositorio = new AsignaturaRepositorio();
  const asignaturaCasosUso: IAsignaturaCasosUso = new AsignaturaCasosUso(asignaturaRepositorio);
  const asignaturaController = new AsignaturasControlador(asignaturaCasosUso);

  gestionAcademicaEnrutador(app, asignaturaController);
}


import express from "express";
import enrutadorAsignatura from "./asignaturaRuta";
import enrutadorPeriodo from "./periodoAcademicoRuta";

const enrutadorGestionAcademica = express.Router();

// Rutas de Asignaturas
enrutadorGestionAcademica.use("/asignaturas", enrutadorAsignatura);

// Rutas de Periodos Académicos
enrutadorGestionAcademica.use("/periodos", enrutadorPeriodo);

export default enrutadorGestionAcademica;
