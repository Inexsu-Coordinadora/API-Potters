import { FastifyInstance } from "fastify";
import { OfertaControlador } from "../controladores/ofertaControlador";
import { IOfertaRepositorio } from "../../core/dominio/repositorio/IOfertaRepositorio";
import { OfertaCasosUso } from "../../core/aplicacion/casos-uso/OfertaCasosUso";
import { OfertaRepositorio } from "../../core/infraestructura/postgres/ofertaRepository";
import { IOfertaCasosUso } from "../../core/aplicacion/casos-uso/IOfertaCasosUso";


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
  const ofertaRepositorio: IOfertaRepositorio = new OfertaRepositorio();
  const ofertaCasosUso: IOfertaCasosUso = new OfertaCasosUso(ofertaRepositorio);
  const ofertaControlador = new OfertaControlador(ofertaCasosUso);

  gestionOfertaEnrutador(app, ofertaControlador);
}
