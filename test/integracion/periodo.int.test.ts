import request from "supertest";
import { app } from "../../src/presentacion/app";

jest.mock("../../src/core/infraestructura/postgres/periodoAcademicoRepository", () => {
  return {
    PeriodoAcademicoRepositorio: jest.fn().mockImplementation(() => ({
      listarPeriodos: async () => [
        {
          idPeriodo: 1,
          fechaInicio: "2025-01-01",
          fechaFin: "2025-03-01",
          estado: "ACTIVO",
        },
      ],

      obtenerPeriodoPorId: async (id: number) => {
        if (id === 1)
          return {
            idPeriodo: 1,
            fechaInicio: "2025-01-01",
            fechaFin: "2025-03-01",
            estado: "ACTIVO",
            idEstado: 2,
          };
        return null;
      },

      crearPeriodo: async (data: any) => {
        if (new Date(data.fechaInicio) >= new Date(data.fechaFin))
          throw new Error("Regla negocio: fecha inválida");

        if (data.fechaInicio === "2025-01-15")
          throw new Error("Periodo traslapado");

        return 99;
      },

      actualizarPeriodo: async (id: number, data: any) => {
        if (id !== 1) return null;
        return { ...data, idPeriodo: 1 };
      },

      eliminarPeriodo: async (id: number) => {
        if (id === 1)
          return {
            idPeriodo: 1,
            fechaInicio: "2025-01-01",
            fechaFin: "2025-03-01",
          };
        return null;
      },
    })),
  };
});

// --------------------------------------------------
beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

// --------------------------------------------------
describe("Periodo Académico — Pruebas de Integración", () => {

  test("GET /periodoAcademico — lista todos", async () => {
    const res = await request(app.server).get("/api/Academium/periodoAcademico");
    expect(res.status).toBe(200);
    expect(res.body.periodos.length).toBe(1);
  });

  test("GET /periodoAcademico/1 — encontrado", async () => {
    const res = await request(app.server).get("/api/Academium/periodoAcademico/1");
    expect(res.status).toBe(200);
    expect(res.body.periodo.idPeriodo).toBe(1);
  });

  test("GET /periodoAcademico/999 — no existe", async () => {
    const res = await request(app.server).get("/api/Academium/periodoAcademico/999");
    expect(res.status).toBe(404);
  });

  test("POST /periodoAcademico — crea correctamente", async () => {
    const data = { fechaInicio: "2025-04-01", fechaFin: "2025-06-01", estado: "ACTIVO" };
    const res = await request(app.server)
      .post("/api/Academium/periodoAcademico")
      .send(data);

    expect(res.status).toBe(201);
    expect(res.body.idNuevoPeriodo).toBe(99);
  });

  test("POST — ZodError", async () => {
    const res = await request(app.server)
      .post("/api/Academium/periodoAcademico")
      .send({ fechaInicio: 123 });

    expect(res.status).toBe(400);
  });

  test("PUT /periodoAcademico/1 — actualiza", async () => {
    const data = { fechaInicio: "2025-07-01", fechaFin: "2025-09-01", estado:"ACTIVO" };
    const res = await request(app.server)
      .put("/api/Academium/periodoAcademico/1")
      .send(data);

    expect(res.status).toBe(200);
    expect(res.body.periodoActualizado.idPeriodo).toBe(1);
  });

  test("DELETE /periodoAcademico/1 — elimina OK", async () => {
    const res = await request(app.server).delete("/api/Academium/periodoAcademico/1");
    expect(res.status).toBe(200);
    expect(res.body.idPeriodo).toBe(1);
  });

});
