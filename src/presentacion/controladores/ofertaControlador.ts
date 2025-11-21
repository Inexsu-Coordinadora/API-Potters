import { FastifyRequest, FastifyReply } from "fastify";
import { IOfertaCasosUso } from "../../core/aplicacion/casos-uso/IOfertaCasosUso";
import { OfertaDTO, OfertaEsquema } from "../esquemas/ofertaEsquema";

export class OfertaControlador {

  constructor(private OfertaCasosUso: IOfertaCasosUso) { }

  obtenerOfertas = async (
    request: FastifyRequest<{ Querystring: { limite?: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { limite } = request.query;
      const OfertasEncontradas = await this.OfertaCasosUso.obtenerOfertas(limite);

      return reply.code(200).send({
        mensaje: "Ofertas encontradas correctamente",
        Ofertas: OfertasEncontradas,
        OfertasEncontradas: OfertasEncontradas.length,
      });

    } catch (err) {
     throw err;
    }
  };

  obtenerOfertaPorId = async (
    request: FastifyRequest<{ Params: { idOferta: number } }>,
    reply: FastifyReply
  ) => {
    try {

      const { idOferta } = request.params;
      const OfertaEncontrada = await this.OfertaCasosUso.obtenerOfertaPorId(idOferta);

      return reply.code(200).send({
        mensaje: "Oferta encontrada correctamente",
        Oferta: OfertaEncontrada,
      });

    } catch (err) {
     throw err;
    }
  };

  crearOferta = async (
    request: FastifyRequest<{ Body: OfertaDTO }>,
    reply: FastifyReply
  ) => {
    try {

      const nuevaOferta = OfertaEsquema.parse(request.body);
      const ofertaCreada = await this.OfertaCasosUso.crearOferta(nuevaOferta);

      return reply.code(201).send({
        mensaje: "La oferta se creó correctamente",
        ofertaCreada: ofertaCreada,
      });

    } catch (err) {
     throw err;
    }
  };

  actualizarOferta = async (
    request: FastifyRequest<{ Params: { idOferta: number }; Body: OfertaDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const { idOferta } = request.params;
      const nuevaOferta = OfertaEsquema.parse(request.body);

      const OfertaActualizada = await this.OfertaCasosUso.actualizarOferta(
        idOferta,
        nuevaOferta
      );

      return reply.code(200).send({
        mensaje: "Oferta actualizada correctamente",
        OfertaActualizada: OfertaActualizada,
      });
    } catch (err) {
      throw err;
    }
  };

  eliminarOferta = async (
    request: FastifyRequest<{ Params: { idOferta: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idOferta } = request.params;
      await this.OfertaCasosUso.eliminarOferta(idOferta);

      return reply.code(200).send({
        mensaje: "Oferta eliminada correctamente",
        idOferta: idOferta,
      });
    } catch (err) {
      throw err;
    }
  };
}