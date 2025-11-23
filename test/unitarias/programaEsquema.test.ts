import { ProgramaEsquema } from "../../src/presentacion/esquemas/programaAcademicoEsquema";
import { ProgramaDTO } from "../../src/presentacion/esquemas/programaAcademicoEsquema";
import { ZodError } from "zod";

describe('ProgramaEsquema', () => {
    const datosBaseValidos: ProgramaDTO = {
        nombrePrograma: "Licenciatura en Sociales",
        idNivel: 2,
        idModalidad: 1,
        duracionMeses: 48,
    };

    it('debe validar un objeto con todos los campos correctos', () => {
        expect(() => ProgramaEsquema.parse(datosBaseValidos)).not.toThrow();
        const resultado = ProgramaEsquema.parse(datosBaseValidos);
        expect(resultado.nombrePrograma).toBe("Licenciatura en Sociales");
    });

    describe('Validación de nombrePrograma', () => {
        it('debe fallar si nombrePrograma es una cadena vacía', () => {
            const datosInvalidos = { ...datosBaseValidos, nombrePrograma: "" };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/El nombre del programa es obligatorio/);
        });

        it('debe fallar si nombrePrograma tiene menos de 3 caracteres', () => {
            const datosInvalidos = { ...datosBaseValidos, nombrePrograma: "Ab" };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/Debe tener al menos 3 caracteres/);
        });

        it('debe fallar si nombrePrograma supera los 100 caracteres', () => {
            const nombreLargo = 'a'.repeat(101);
            const datosInvalidos = { ...datosBaseValidos, nombrePrograma: nombreLargo };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/No puede superar los 100 caracteres/);
        });
    });

    describe('Validación de idNivel', () => {
        it('debe fallar si idNivel es 0 o negativo', () => {
            const datosInvalidos1 = { ...datosBaseValidos, idNivel: 0 };
            const datosInvalidos2 = { ...datosBaseValidos, idNivel: -5 };

            expect(() => ProgramaEsquema.parse(datosInvalidos1)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos1)).toThrow(/mayor a 0/);
            
            expect(() => ProgramaEsquema.parse(datosInvalidos2)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos2)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idNivel no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidos, idNivel: 1.5 as any };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });

        it('debe manejar idNivel como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidos, idNivel: "2" as any };
            expect(() => ProgramaEsquema.parse(datos)).not.toThrow();
            expect(ProgramaEsquema.parse(datos).idNivel).toBe(2);
        });
    });

    describe('Validación de idModalidad', () => {
        it('debe fallar si idModalidad es 0 o negativo', () => {
            const datosInvalidos = { ...datosBaseValidos, idModalidad: 0 };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idModalidad no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidos, idModalidad: 3.1 as any };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
        
        it('debe manejar idModalidad como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidos, idModalidad: "1" as any };
            expect(() => ProgramaEsquema.parse(datos)).not.toThrow();
            expect(ProgramaEsquema.parse(datos).idModalidad).toBe(1);
        });
    });

    describe('Validación de duracionMeses', () => {
        it('debe fallar si duracionMeses es 0 o negativo', () => {
            const datosInvalidos = { ...datosBaseValidos, duracionMeses: 0 };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/mayor a 0/);
        });

        it('debe fallar si duracionMeses supera el máximo de 100 meses', () => {
            const datosInvalidos = { ...datosBaseValidos, duracionMeses: 101 };
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => ProgramaEsquema.parse(datosInvalidos)).toThrow(/no debe durar más de 100 meses/);
        });
        
        it('debe manejar duracionMeses como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidos, duracionMeses: "60" as any };
            expect(() => ProgramaEsquema.parse(datos)).not.toThrow();
            expect(ProgramaEsquema.parse(datos).duracionMeses).toBe(60);
        });
    });
});