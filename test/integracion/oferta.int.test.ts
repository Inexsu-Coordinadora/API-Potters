import request from "supertest";
import { app } from "../../src/presentacion/app";

jest.mock("../../src/core/infraestructura/postgres/ofertaRepository", () => {
  return {
    OfertaRepositorio: jest.fn().mockImplementation(() => ({
      listarOfertas: async (_limite?: number) => [
        {
          idOferta: 1,
          idAsignatura: 1,
          idPeriodo: 1,
          idPrograma: 1,
          grupo: 1,
          cupo: 30
        },
      ],

      obtenerOfertaPorId: async (id: number) =>
        id === 1
          ? {
              idOferta: 1,
              idAsignatura: 1,
              idPeriodo: 1,
              idPrograma: 1,
              grupo: 1,
              cupo: 30
            }
          : null,

      crearOferta: async (_datos: any) => 99,

      actualizarOferta: async (id: number, datos: any) =>
        id === 1
          ? {
              idOferta: 1,
              ...datos
            }
          : null,

      eliminarOferta: async (id: number) =>
        id === 1
          ? {
              idOferta: 1,
              idAsignatura: 1,
              idPeriodo: 1,
              idPrograma: 1,
              grupo: 1,
              cupo: 30
            }
          : null,

      existeOfertaDuplicada: async () => false,

      obtenerOfertaRelacionada: async (id: number) => ({
        idOferta: id,
        idAsignatura: 1,
        idPeriodo: 1,
        idPrograma: 1,
        grupo: 1,
        cupo: 30
      }),
    })),
  };
});

jest.mock("../../src/core/infraestructura/postgres/asignaturaRepository", () => ({
  AsignaturaRepositorio: jest.fn().mockImplementation(() => ({
    obtenerAsignaturaPorId: async (id: number) => (id === 1 ? { idAsignatura: 1 } : null)
  })),
}));

jest.mock("../../src/core/infraestructura/postgres/periodoAcademicoRepository", () => ({
  PeriodoAcademicoRepositorio: jest.fn().mockImplementation(() => ({
    obtenerPeriodoPorId: async (id: number) => (id === 1 ? { idPeriodo: 1 } : null)
  })),
}));

jest.mock("../../src/core/infraestructura/postgres/programaRepository", () => ({
  ProgramaRepositorio: jest.fn().mockImplementation(() => ({
    obtenerProgramaPorId: async (id: number) => (id === 1 ? { idPrograma: 1 } : null)
  })),
}));



beforeAll(async () => await app.ready());
afterAll(async () => await app.close());


// TESTS

describe("Oferta — Pruebas de Integración", () => {

  test("GET /ofertas — lista todas", async () => {
    const res = await request(app.server).get("/api/Academium/ofertas");

    expect(res.status).toBe(200);
    expect(res.body.ofertas.length).toBe(1);
  });

  test("GET /ofertas/1 — encontrada", async () => {
    const res = await request(app.server).get("/api/Academium/ofertas/1");

    expect(res.status).toBe(200);
    expect(res.body.oferta.idOferta).toBe(1);
  });

  test("GET /ofertas/999 — no existe", async () => {
    const res = await request(app.server).get("/api/Academium/ofertas/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ mensaje: "Oferta no encontrada" });
  });

  test("POST /ofertas — crea correctamente", async () => {
    const data = { idAsignatura: 1, idPeriodo: 1, idPrograma: 1, grupo: 1, cupo: 30 };

    const res = await request(app.server).post("/api/Academium/ofertas").send(data);

    expect(res.status).toBe(201);
    expect(res.body.ofertaCreada).toBe(99);
  });

  test("POST /ofertas — asignatura no existe", async () => {
    const data = { idAsignatura: 999, idPeriodo: 1, idPrograma: 1, grupo: 1, cupo: 30 };

    const res = await request(app.server).post("/api/Academium/ofertas").send(data);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ mensaje: "No se encontró la asignatura ingresada" });
  });

  test("PUT /ofertas/1 — actualiza correctamente", async () => {
    const data = { cupo: 40, idAsignatura: 1, idPeriodo: 1, idPrograma: 1, grupo: 1 };

    const res = await request(app.server).put("/api/Academium/ofertas/1").send(data);

    expect(res.status).toBe(200);
    expect(res.body.OfertaActualizada.cupo).toBe(40);
  });

  test("PUT /ofertas/999 — no existe", async () => {
    const res = await request(app.server).put("/api/Academium/ofertas/999").send({ cupo: 10 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ mensaje: "Oferta no encontrada" });
  });

  test("DELETE /ofertas/1 — elimina correctamente", async () => {
    const res = await request(app.server).delete("/api/Academium/ofertas/1");

    expect(res.status).toBe(200);
    expect(res.body.idOferta).toBe(1);
  });

  test("DELETE /ofertas/999 — no existe", async () => {
    const res = await request(app.server).delete("/api/Academium/ofertas/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ mensaje: "Oferta no encontrada" });
  });

});
