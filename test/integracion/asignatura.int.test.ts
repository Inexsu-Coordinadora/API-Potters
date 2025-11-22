import request from "supertest";
import { app } from "../../src/presentacion/app";

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

      obtenerAsignaturaPorId: async (id: string) => {
        if (id === "2")
          return { idAsignatura: 2, nombreAsignatura: "Matemáticas" };
        return null;
      },

      crearAsignatura: async () => "99",

      actualizarAsignatura: async (id: string) => {
        if (id === "1")
          return { idAsignatura: 1, nombreAsignatura: "Base de datos" };
        return null;
      },

      eliminarAsignatura: async (id: string) => {
        if (id === "1")
          return { idAsignatura: 1, nombreAsignatura: "Matemáticas" };
        return null;
      },
    })),
  };
});

beforeAll(async () => await app.ready());
afterAll(async () => await app.close());

// 🔵 3. TESTS DE INTEGRACIÓN COMPLETOS
describe("Asignaturas - Integración", () => {
  test("GET /asignaturas — retorna todas", async () => {
    const res = await request(app.server).get("/api/Academium/asignaturas");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.asignaturas)).toBe(true);
    expect(res.body.asignaturas.length).toBe(3);
  });

  test("GET /asignaturas/2 — respeta el límite", async () => {
    const res = await request(app.server).get(
      "/api/Academium/asignaturas/2"
    );

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toEqual("Asignatura encontrada correctamente");
    expect(res.body.asignatura.idAsignatura).toBe(2);
  });

  test("GET /asignaturas/2 — asignatura encontrada", async () => {
    const res = await request(app.server).get(
      "/api/Academium/asignaturas/2"
    );

    expect(res.status).toBe(200);
    expect(res.body.asignatura).toHaveProperty("idAsignatura", 2);
  });

  test("GET /asignaturas/999 — asignatura NO existe", async () => {
    const res = await request(app.server).get(
      "/api/Academium/asignaturas/999"
    );

    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("No se encontró ninguna asignatura");
  });

  test("POST /asignaturas — crear asignatura", async () => {
    const payload = { nombreAsignatura: "inteligencia artificial", cargaHoraria: 20, "idFormato": 2, informacion: "Testing" };

    const res = await request(app.server)
      .post("/api/Academium/asignaturas")
      .send(payload);


    expect(res.status).toBe(201);
    expect(res.body.idNuevaAsignatura).toBe("99");
  });

  test("PUT /asignaturas/1 — actualizar asignatura", async () => {
    const payload = { nombreAsignatura: "Base de datos", cargaHoraria: 15, "idFormato": 1, informacion: "Testing" };

    const res = await request(app.server)
      .put("/api/Academium/asignaturas/1")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.asignaturaActualizada).toHaveProperty("nombreAsignatura", "Base de datos");
  });

  test("PUT /asignaturas/999 — actualizar asignatura NO existe", async () => {
    const payload = { nombreAsignatura: "Base de datos", cargaHoraria: 15, "idFormato": 1, informacion: "Testing" };

    const res = await request(app.server)
      .put("/api/Academium/asignaturas/999")
      .send(payload);

    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("Asignatura con id 999 no encontrada");
  });


  test("DELETE /asignaturas/1 — eliminar asignatura", async () => {
    const res = await request(app.server).delete(
      "/api/Academium/asignaturas/1"
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("idAsignatura", "1");
    expect(res.body.mensaje).toEqual("Asignatura eliminada correctamente");
  });


  test("DELETE /asignaturas/999 — asignatura NO existe", async () => {
    const res = await request(app.server).delete(
      "/api/Academium/asignaturas/999"
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message", "No se encontró ninguna asignatura");
  });
});
