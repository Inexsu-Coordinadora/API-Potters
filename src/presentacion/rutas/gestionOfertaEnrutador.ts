import { FastifyInstance } from "fastify";
import { OfertaControlador } from "../controladores/ofertaControlador";
import { IOfertaRepositorio } from "../../core/dominio/repositorio/IOfertaRepositorio";
import { OfertaCasosUso } from "../../core/aplicacion/casos-uso/OfertaCasosUso";
import { OfertaRepositorio } from "../../core/infraestructura/postgres/ofertaRepository";
import { IOfertaCasosUso } from "../../core/aplicacion/casos-uso/IOfertaCasosUso";
import { IAsignaturaRepositorio } from "../../core/dominio/repositorio/IAsignaturaRepositorio";
import { AsignaturaRepositorio } from "../../core/infraestructura/postgres/asignaturaRepository";
import { IAsignaturaCasosUso } from "../../core/aplicacion/casos-uso/IAsignaturaCasosUso";
import { AsignaturaCasosUso } from "../../core/aplicacion/casos-uso/AsignaturaCasosUso";
import { AsignaturasControlador } from "../controladores/asignaturaControlador";
import { IPeriodoAcademicoRepositorio } from "../../core/dominio/repositorio/IPeriodoAcademicoRepositorio";
import { PeriodoAcademicoRepositorio } from "../../core/infraestructura/postgres/periodoAcademicoRepository";
import { IPeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso";
import { PeriodoAcademicoCasosUso } from "../../core/aplicacion/casos-uso/PeriodoAcademicoCasosUso";
import { PeriodoAcademicoControlador } from "../controladores/periodoAcademicoControlador";
import { IProgramaRepositorio } from "../../core/dominio/repositorio/IProgramaRepositorio";
import { ProgramaRepositorio } from "../../core/infraestructura/postgres/programaRepository";
import { IProgramaCasosUso } from "../../core/aplicacion/casos-uso/IProgramaCasosUso";
import { ProgramaCasosUso } from "../../core/aplicacion/casos-uso/ProgramaCasosUso";
import { ProgramasControlador } from "../controladores/programaControlador";


function gestionOfertaEnrutador(
  app: FastifyInstance,
  ofertaControlador: OfertaControlador,
) {

  app.get("/ofertas", ofertaControlador.obtenerOfertas);
  app.get("/ofertas/:idOferta", ofertaControlador.obtenerOfertaPorId);
  app.post("/ofertas", ofertaControlador.crearOferta);
  app.put("/ofertas/:idOferta", ofertaControlador.actualizarOferta);
  app.delete("/ofertas/:idOferta", ofertaControlador.eliminarOferta);
}

export async function construirOfertasEnrutador(app: FastifyInstance) {

  const asignaturaRepositorio: IAsignaturaRepositorio = new AsignaturaRepositorio();
  const programaRepositorio: IProgramaRepositorio = new ProgramaRepositorio();
  const periodoAcademicoRepositorio: IPeriodoAcademicoRepositorio = new PeriodoAcademicoRepositorio();

  const ofertaRepositorio: IOfertaRepositorio = new OfertaRepositorio();
  const ofertaCasosUso: IOfertaCasosUso = new OfertaCasosUso(ofertaRepositorio, asignaturaRepositorio, programaRepositorio, periodoAcademicoRepositorio);
  const ofertaControlador = new OfertaControlador(ofertaCasosUso);

  gestionOfertaEnrutador(app, ofertaControlador);
}
