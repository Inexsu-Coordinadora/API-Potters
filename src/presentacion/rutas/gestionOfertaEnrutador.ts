import { FastifyInstance } from "fastify";
import { OfertaControlador } from "../controladores/ofertaControlador";
import { IOfertaRepositorio } from "../../core/dominio/repositorio/IOfertaRepositorio";
import { OfertaCasosUso } from "../../core/aplicacion/casos-uso/OfertaCasosUso";
import { OfertaRepositorio } from "../../core/infraestructura/postgres/ofertaRepository";
import { IOfertaCasosUso } from "../../core/aplicacion/casos-uso/IOfertaCasosUso";
import { IAsignaturaRepositorio } from "../../core/dominio/repositorio/IAsignaturaRepositorio";
import { AsignaturaRepositorio } from "../../core/infraestructura/postgres/asignaturaRepository";
import { IPeriodoAcademicoRepositorio } from "../../core/dominio/repositorio/IPeriodoAcademicoRepositorio";
import { PeriodoAcademicoRepositorio } from "../../core/infraestructura/postgres/periodoAcademicoRepository";
import { IProgramaRepositorio } from "../../core/dominio/repositorio/IProgramaRepositorio";
import { ProgramaRepositorio } from "../../core/infraestructura/postgres/programaRepository";

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
