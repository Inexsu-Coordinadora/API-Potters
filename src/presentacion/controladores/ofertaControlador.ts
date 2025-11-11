import { FastifyRequest, FastifyReply } from "fastify";
import { IOferta } from "../../core/dominio/oferta/IOferta";
import { IOfertaCasosUso } from "../../core/aplicacion/casos-uso/IOfertaCasosUso";
import { OfertaDTO, CrearOfertaEsquema } from "../esquemas/ofertaEsquema";
import { ZodError } from "zod";

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
      return reply.code(500).send({
        mensaje: "Error al obtener las ofertas",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  obtenerOfertaPorId = async (
    request: FastifyRequest<{ Params: { idOferta: number } }>,
    reply: FastifyReply
  ) => {
    try {

      const { idOferta } = request.params;
      const OfertaEncontrada = await this.OfertaCasosUso.obtenerOfertaPorId(idOferta);

      if (!OfertaEncontrada) {
        return reply.code(404).send({
          mensaje: "Oferta no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Oferta encontrada correctamente",
        Oferta: OfertaEncontrada,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al obtener la oferta",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  crearOferta = async (
    request: FastifyRequest<{ Body: OfertaDTO }>,
    reply: FastifyReply
  ) => {
    try {

      const nuevaOferta = CrearOfertaEsquema.parse(request.body);
      const ofertaCreada = await this.OfertaCasosUso.crearOferta(nuevaOferta);

      return reply.code(200).send({
        mensaje: "La oferta se creó correctamente",
        ofertaCreada: ofertaCreada,
      });

    } catch (err: any) {

      if (err?.message === "Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico" ||
        err?.message === "No se encontró la asignatura buscada" ||
        err?.message === "No se encontró el programa buscado" ||
        err?.message === "No se encontró el periodo buscado" ||
        err?.message === "El periodo está en preparacion" ||
        err?.message === "El periodo está cerrado") {

        return reply.code(404).send({
          mensaje: "Error al crear una nueva oferta",
          error: err.message,
        });
      }

      if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error al crear una nueva oferta",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }

      return reply.code(500).send({
        mensaje: "Error al crear una nueva oferta",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  actualizarOferta = async (
    request: FastifyRequest<{ Params: { idOferta: number }; Body: OfertaDTO }>,
    reply: FastifyReply
  ) => {
    try {
      const { idOferta } = request.params;
      //const nuevaOferta = request.body;
      const nuevaOferta = CrearOfertaEsquema.parse(request.body);
      console.log("nuevaOferta", nuevaOferta);

      const OfertaActualizada = await this.OfertaCasosUso.actualizarOferta(
        idOferta,
        nuevaOferta
      );

      if (!OfertaActualizada) {
        return reply.code(404).send({
          mensaje: "Oferta no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Oferta actualizada correctamente",
        OfertaActualizada: OfertaActualizada,
      });
    } catch (err: any) {

      if (err?.message === "Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico" ||
        err?.message === "No se encontró la asignatura buscada" ||
        err?.message === "No se encontró el programa buscado" ||
        err?.message === "No se encontró el periodo buscado" ||
        err?.message === "El periodo está en preparacion" ||
        err?.message === "El periodo está cerrado") {

        return reply.code(404).send({
          mensaje: "Error al actualizar la oferta",
          error: err.message,
        });
      }

        if (err instanceof ZodError) {
        return reply.code(400).send({
          mensaje: "Error al crear una nueva oferta",
          error: err.issues[0]?.message || "Error desconocido",
        });
      }

      return reply.code(500).send({
        mensaje: "Error al actualizar la oferta",
        error: err instanceof Error ? err.message : err,
      });
    }
  };

  eliminarOferta = async (
    request: FastifyRequest<{ Params: { idOferta: number } }>,
    reply: FastifyReply
  ) => {
    try {
      const { idOferta } = request.params;
      const OfertaEncontrada = await this.OfertaCasosUso.eliminarOferta(idOferta);

      if (!OfertaEncontrada) {
        return reply.code(404).send({
          mensaje: "Oferta no encontrada",
        });
      }

      return reply.code(200).send({
        mensaje: "Oferta eliminada correctamente",
        idOferta: idOferta,
      });
    } catch (err) {
      return reply.code(500).send({
        mensaje: "Error al eliminar la oferta",
        error: err instanceof Error ? err.message : err,
      });
    }
  };
}