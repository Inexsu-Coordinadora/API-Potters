import { PlanEstudioEsquema } from "../../src/presentacion/esquemas/planEstudioEsquema";
import { PlanEstudioDTO } from "../../src/presentacion/esquemas/planEstudioEsquema";
import { ZodError } from "zod";

describe('PlanEstudioEsquema', () => {
    const datosBaseValidosDTO: PlanEstudioDTO = {
        idPrograma: 10,
        idAsignatura: 50,
        semestre: 5,
        creditos: 3,
    };

    it('debe validar un objeto con todos los campos correctos y coerción de tipos', () => {
        const datosConCoercion = {
            idPrograma: "10",
            idAsignatura: "50",
            semestre: "5",
            creditos: "3",
        };
        expect(() => PlanEstudioEsquema.parse(datosConCoercion)).not.toThrow();
        const resultado = PlanEstudioEsquema.parse(datosConCoercion);
        expect(resultado).toEqual(datosBaseValidosDTO);
    });

    describe('Validación de idPrograma', () => {
        it('debe fallar si idPrograma es 0 o negativo', () => {
            const datosInvalidos1 = { ...datosBaseValidosDTO, idPrograma: 0 };
            const datosInvalidos2 = { ...datosBaseValidosDTO, idPrograma: -1 };

            expect(() => PlanEstudioEsquema.parse(datosInvalidos1)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos1)).toThrow(/mayor a 0/);

            expect(() => PlanEstudioEsquema.parse(datosInvalidos2)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos2)).toThrow(/positivo/);
        });

        it('debe fallar si idPrograma no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idPrograma: 10.5 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
    });

    describe('Validación de idAsignatura', () => {
        it('debe fallar si idAsignatura es 0 o negativo', () => {
            const datosInvalidos1 = { ...datosBaseValidosDTO, idAsignatura: 0 };
            const datosInvalidos2 = { ...datosBaseValidosDTO, idAsignatura: -10 };

            expect(() => PlanEstudioEsquema.parse(datosInvalidos1)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos1)).toThrow(/mayor a 0/);

            expect(() => PlanEstudioEsquema.parse(datosInvalidos2)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos2)).toThrow(/positivo/);
        });

        it('debe fallar si idAsignatura no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idAsignatura: 50.1 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
    });

    describe('Validación de semestre', () => {
        it('debe fallar si semestre es menor al mínimo (1)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, semestre: 0 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/mínimo permitido es 1/);
        });

        it('debe fallar si semestre es mayor al máximo (12)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, semestre: 13 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/máximo permitido es 12/);
        });

        it('debe fallar si semestre no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, semestre: 5.5 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
    });

    describe('Validación de creditos', () => {
        it('debe fallar si creditos es menor al mínimo (1)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, creditos: 0 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/al menos 1 crédito/);
        });

        it('debe fallar si creditos es mayor al máximo (30)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, creditos: 31 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/más de 30 créditos/);
        });

        it('debe fallar si creditos no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, creditos: 3.2 };
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PlanEstudioEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
    });
});