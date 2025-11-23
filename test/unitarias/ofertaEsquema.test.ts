import { OfertaEsquema } from "../../src/presentacion/esquemas/ofertaEsquema";
import { OfertaDTO } from "../../src/presentacion/esquemas/ofertaEsquema";
import { ZodError } from "zod";

describe('OfertaEsquema', () => {
    const datosBaseValidosDTO: OfertaDTO = {
        idPrograma: 1,
        idPeriodo: 5,
        idAsignatura: 10,
        grupo: 2,
        cupo: 50,
    };

    it('debe validar un objeto con todos los campos correctos', () => {
        expect(() => OfertaEsquema.parse(datosBaseValidosDTO)).not.toThrow();
        const resultado = OfertaEsquema.parse(datosBaseValidosDTO);
        expect(resultado).toEqual(datosBaseValidosDTO);
    });

    describe('Validación de idPrograma', () => {
        it('debe fallar si idPrograma es 0 o negativo', () => {
            const datosInvalidos1 = { ...datosBaseValidosDTO, idPrograma: 0 };
            const datosInvalidos2 = { ...datosBaseValidosDTO, idPrograma: -5 };

            expect(() => OfertaEsquema.parse(datosInvalidos1)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos1)).toThrow(/mayor a 0/);
            
            expect(() => OfertaEsquema.parse(datosInvalidos2)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos2)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idPrograma no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idPrograma: 1.5 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });

        it('debe manejar idPrograma como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidosDTO, idPrograma: "10" as any };
            expect(() => OfertaEsquema.parse(datos)).not.toThrow();
            expect(OfertaEsquema.parse(datos).idPrograma).toBe(10);
        });
        
        it('debe fallar si idPrograma no está presente', () => {
            const datosIncompletos = { ...datosBaseValidosDTO, idPrograma: undefined };
            expect(() => OfertaEsquema.parse(datosIncompletos as any)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosIncompletos as any)).toThrow(/El idPrograma debe ser un campo obligatorio/);
        });
    });

    describe('Validación de idPeriodo', () => {
        it('debe fallar si idPeriodo es 0 o negativo', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idPeriodo: 0 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idPeriodo no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idPeriodo: 2.7 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });

        it('debe manejar idPeriodo como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidosDTO, idPeriodo: "3" as any };
            expect(() => OfertaEsquema.parse(datos)).not.toThrow();
            expect(OfertaEsquema.parse(datos).idPeriodo).toBe(3);
        });
    });

    describe('Validación de idAsignatura', () => {
        it('debe fallar si idAsignatura es 0 o negativo', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idAsignatura: 0 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idAsignatura no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idAsignatura: 5.5 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });

        it('debe manejar idAsignatura como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidosDTO, idAsignatura: "8" as any };
            expect(() => OfertaEsquema.parse(datos)).not.toThrow();
            expect(OfertaEsquema.parse(datos).idAsignatura).toBe(8);
        });
    });

    describe('Validación de grupo', () => {
        it('debe fallar si grupo es 0 o negativo', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, grupo: 0 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/mayor a 0/);
        });

        it('debe fallar si grupo excede el máximo de 50', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, grupo: 51 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/no debe ser mayor a 50/);
        });
        
        it('debe fallar si grupo no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, grupo: 1.1 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
        
        it('debe manejar grupo como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidosDTO, grupo: "4" as any };
            expect(() => OfertaEsquema.parse(datos)).not.toThrow();
            expect(OfertaEsquema.parse(datos).grupo).toBe(4);
        });
    });

    describe('Validación de cupo', () => {
        it('debe fallar si cupo es menor al mínimo de 10', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, cupo: 9 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/al menos 10 estudiantes/);
        });

        it('debe fallar si cupo excede el máximo de 200', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, cupo: 201 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/no puede exceder más de 200 estudiantes/);
        });
        
        it('debe fallar si cupo no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, cupo: 50.5 };
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => OfertaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
        
        it('debe manejar cupo como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidosDTO, cupo: "150" as any };
            expect(() => OfertaEsquema.parse(datos)).not.toThrow();
            expect(OfertaEsquema.parse(datos).cupo).toBe(150);
        });
    });
});