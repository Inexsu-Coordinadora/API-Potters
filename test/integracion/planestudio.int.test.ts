import { app } from "../../src/presentacion/app"; 
const BASE_URL = "/planestudio";

describe(" Test de integración - Gestión Plan de Estudio", () => {

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    let idCreado: string;

    test(" Crear Plan de Estudio", async () => {
        const response = await app.inject({
            method: "POST",
            url: BASE_URL,
            payload: {
                nombre: "Plan Ingeniería 2025",
                descripcion: "Prueba automatizada"
            }
        });

        expect(response.statusCode).toBe(201);

        const json = response.json();
        expect(json).toHaveProperty("idPlanEstudio");

        idCreado = json.idPlanEstudio;
    });

    test(" Obtener todos los Planes de Estudio", async () => {
        const response = await app.inject({
            method: "GET",
            url: BASE_URL
        });

        expect(response.statusCode).toBe(200);

        const json = response.json();
        expect(Array.isArray(json)).toBe(true);
    });

    test(" Obtener Plan de Estudio por ID", async () => {
        const response = await app.inject({
            method: "GET",
            url: `${BASE_URL}/${idCreado}`
        });

        expect(response.statusCode).toBe(200);

        const json = response.json();
        expect(json.idPlanEstudio).toBe(idCreado);
    });

    test(" Actualizar Plan de Estudio", async () => {
        const response = await app.inject({
            method: "PUT",
            url: `${BASE_URL}/${idCreado}`,
            payload: {
                nombre: "Plan Ingeniería 2025 (Modificado)",
                descripcion: "Actualización desde pruebas automáticas"
            }
        });

        expect(response.statusCode).toBe(200);

        const json = response.json();
        expect(json).toHaveProperty("mensaje");
    });

    test(" Eliminar Plan de Estudio", async () => {
        const response = await app.inject({
            method: "DELETE",
            url: `${BASE_URL}/${idCreado}`
        });

        expect(response.statusCode).toBe(200);

        const json = response.json();
        expect(json).toHaveProperty("mensaje");
    });

});
