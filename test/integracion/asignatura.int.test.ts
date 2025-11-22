import request from "supertest";
import { app } from "../../src/presentacion/app";
import { AsignaturaRepositorio } from "../../src/core/infraestructura/postgres/asignaturaRepository";

// 🔵 1. Mock completo del repositorio
jest.mock("../../src/core/infraestructura/postgres/asignaturaRepository", () => {
  return {
    AsignaturaRepositorio: jest.fn().mockImplementation(() => ({
      listarAsignaturas: async (limite?: number) => {
        const datos = [
          { idAsignatura: 1, nombreAsignatura: "Matemáticas" },
          { idAsignatura: 2, nombreAsignatura: "Inglés" },
          { idAsignatura: 3, nombreAsignatura: "Física" },
        ];
        return typeof limite === "number" ? datos.slice(0, limite) : datos;
      },

      obtenerAsignaturaPorId: async (id: number) => {
        if (id === 1)
          return { idAsignatura: 1, nombreAsignatura: "Matemáticas" };
        return null;
      },

      crearAsignatura: async () => "99",

      actualizarAsignatura: async (id: number) => {
        if (id === 1)
          return { idAsignatura: 1, nombreAsignatura: "Actualizada" };
        return null;
      },

      eliminarAsignatura: async (id: number) => {
        if (id === 1)
          return { idAsignatura: 1, nombreAsignatura: "Matemáticas" };
        return null;
      },
    })),
  };
});

beforeAll(async () => {
  // 🔵 2. Inyectar el mock en el router ANTES de app.ready()
  const MockRepo = AsignaturaRepositorio as jest.Mock;
  const repoInstance = new MockRepo();

  app.register(
    (instancia) =>
      require("../../src/presentacion/rutas/gestionAsignaturaEnrutador")
        .construirAsignaturasEnrutador(instancia, repoInstance),
    { prefix: "/api/Academium" }
  );

  await app.ready();
});

afterAll(async () => {
  await app.close();
});

// 🔵 3. TESTS DE INTEGRACIÓN COMPLETOS
describe("Asignaturas - Integración", () => {
  test("GET /asignaturas — retorna todas", async () => {
    const res = await request(app.server).get("/api/Academium/asignaturas");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);
  });

  test("GET /asignaturas?limite=2 — respeta el límite", async () => {
    const res = await request(app.server).get(
      "/api/Academium/asignaturas?limite=2"
    );
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("GET /asignaturas/1 — asignatura encontrada", async () => {
    const res = await request(app.server).get(
      "/api/Academium/asignaturas/1"
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("idAsignatura", 1);
  });

  test("GET /asignaturas/999 — asignatura NO existe", async () => {
    const res = await request(app.server).get(
      "/api/Academium/asignaturas/999"
    );
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("mensaje", "Asignatura no encontrada");
  });

  test("POST /asignaturas — crear asignatura", async () => {
    const nueva = { nombreAsignatura: "Química" };

    const res = await request(app.server)
      .post("/api/Academium/asignaturas")
      .send(nueva);

    expect(res.status).toBe(201);
    expect(res.body).toBe("99");
  });

  test("PUT /asignaturas/1 — actualizar asignatura", async () => {
    const actualizar = { nombreAsignatura: "Actualizada" };

    const res = await request(app.server)
      .put("/api/Academium/asignaturas/1")
      .send(actualizar);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("nombreAsignatura", "Actualizada");
  });

  test("PUT /asignaturas/999 — actualizar asignatura NO existe", async () => {
    const actualizar = { nombreAsignatura: "NoExiste" };

    const res = await request(app.server)
      .put("/api/Academium/asignaturas/999")
      .send(actualizar);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("mensaje", "Asignatura no encontrada");
  });

  test("DELETE /asignaturas/1 — eliminar asignatura", async () => {
    const res = await request(app.server).delete(
      "/api/Academium/asignaturas/1"
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("idAsignatura", 1);
  });

  test("DELETE /asignaturas/999 — asignatura NO existe", async () => {
    const res = await request(app.server).delete(
      "/api/Academium/asignaturas/999"
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("mensaje", "Asignatura no encontrada");
  });
});
