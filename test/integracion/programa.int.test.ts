import request from "supertest";
import { app } from "../../src/presentacion/app";

// Mock del repositorio real
jest.mock("../../src/core/infraestructura/postgres/programaRepository", () => {
  return {
    ProgramaRepositorio: jest.fn().mockImplementation(() => ({
      listarPrograma: async () => [
        { idPrograma: 1, nombrePrograma: "Ingeniería de Sistemas" },
        { idPrograma: 2, nombrePrograma: "Administración" },
      ],

      obtenerProgramaPorId: async (id: number) => {
        if (id === 1) {
          return { idPrograma: 1, nombrePrograma: "Ingeniería de Sistemas" };
        }
        return null;
      },

      crearPrograma: async (data: any) => {
        if (!data.nombrePrograma) {
          throw new Error("Nombre requerido");
        }
        return 99;
      },

      actualizarPrograma: async (id: number, data: any) => {
        if (id !== 1) return null;
        return {
          idPrograma: 1,
          nombrePrograma: data.nombrePrograma ?? "Ingeniería de Sistemas",
        };
      },

      eliminarPrograma: async (id: number) => {
        if (id === 1) {
          return { idPrograma: 1, nombrePrograma: "Ingeniería de Sistemas" };
        }
        return null;
      },
    })),
  };
});

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("Programas — Integración", () => {
  test("GET /programas — lista todos", async () => {
    const res = await request(app.server).get("/api/Academium/programas");
    expect(res.status).toBe(200);
    expect(res.body.programas.length).toBe(2);
  });

  test("GET /programas/1 — encontrado", async () => {
    const res = await request(app.server).get("/api/Academium/programas/1");
    expect(res.status).toBe(200);
    expect(res.body.programa.nombrePrograma).toBe("Ingeniería de Sistemas");
  });

  test("GET /programas/999 — no encontrado", async () => {
    const res = await request(app.server).get("/api/Academium/programas/999");
    expect(res.status).toBe(404);
    expect(res.body.mensaje).toBe("Programa no encontrado");
  });

  test("POST /programas — crea correctamente", async () => {
    const data = {
      nombrePrograma: "Psicología",
      idNivel: 1,
      idModalidad: 1,
      duracionMeses: 12,
    };
    const res = await request(app.server)
      .post("/api/Academium/programas")
      .send(data);

    expect(res.status).toBe(201);
    expect(res.body.idNuevoPrograma).toBe(99);
  });

  test("POST — ZodError en validación", async () => {
    const res = await request(app.server)
      .post("/api/Academium/programas")
      .send({ nombrePrograma: 123 });

    expect(res.status).toBe(400); // error de Zod
  });

  test("PUT /programas/1 — actualiza correctamente", async () => {
    const res = await request(app.server)
      .put("/api/Academium/programas/1")
      .send({
        nombrePrograma: "Programa Modificado",
        idNivel: 1,
        idModalidad: 1,
        duracionMeses: 12,
      });

    expect(res.status).toBe(200);
    expect(res.body.programaActualizado.nombrePrograma).toBe(
      "Programa Modificado"
    );
  });

  test("DELETE /programas/1 — elimina correctamente", async () => {
    const res = await request(app.server).delete(
      "/api/Academium/programas/1"
    );
    expect(res.status).toBe(200);
    expect(res.body.idPrograma).toBe(1);
  });
});
