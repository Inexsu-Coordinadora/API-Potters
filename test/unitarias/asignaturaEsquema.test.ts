import { AsignaturaEsquema } from "../../src/presentacion/esquemas/asignaturaEsquema";
import { AsignaturaDTO } from "../../src/presentacion/esquemas/asignaturaEsquema";
import { ZodError } from "zod";

describe('AsignaturaEsquema', () => {
    const datosBaseValidos: AsignaturaDTO = {
        nombreAsignatura: "Matemáticas I",
        cargaHoraria: 64,
        idFormato: 1,
        informacion: "Asignatura fundamental para el desarrollo."
    };

    it('debe validar un objeto con todos los campos correctos (incluyendo opcional)', () => {
        expect(() => AsignaturaEsquema.parse(datosBaseValidos)).not.toThrow();
        const resultado = AsignaturaEsquema.parse(datosBaseValidos);
        expect(resultado.nombreAsignatura).toBe("Matemáticas I");
        expect(resultado.informacion).toBe("Asignatura fundamental para el desarrollo.");
    });

    it('debe validar un objeto cuando el campo "informacion" es opcional y no se provee', () => {
        const { informacion, ...datosSinInfo } = datosBaseValidos;
        
        expect(() => AsignaturaEsquema.parse(datosSinInfo)).not.toThrow();
        const resultado = AsignaturaEsquema.parse(datosSinInfo);
        expect(resultado.informacion).toBeNull();
    });

    describe('Validación de nombreAsignatura', () => {
        it('debe fallar si nombreAsignatura es una cadena vacía', () => {
            const datosInvalidos = { ...datosBaseValidos, nombreAsignatura: "" };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/El nombre de la asignatura es obligatorio/);
        });

        it('debe fallar si nombreAsignatura tiene menos de 3 caracteres', () => {
            const datosInvalidos = { ...datosBaseValidos, nombreAsignatura: "Ma" };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/Debe tener al menos 3 caracteres/);
        });

        it('debe fallar si nombreAsignatura supera los 100 caracteres', () => {
            const nombreLargo = 'a'.repeat(101);
            const datosInvalidos = { ...datosBaseValidos, nombreAsignatura: nombreLargo };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/No puede superar los 100 caracteres/);
        });
    });

    describe('Validación de cargaHoraria', () => {
        it('debe fallar si cargaHoraria es 0 o negativo', () => {
            const datosInvalidos1 = { ...datosBaseValidos, cargaHoraria: 0 };
            const datosInvalidos2 = { ...datosBaseValidos, cargaHoraria: -10 };

            expect(() => AsignaturaEsquema.parse(datosInvalidos1)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos1)).toThrow(/mayor a 0/);
            
            expect(() => AsignaturaEsquema.parse(datosInvalidos2)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos2)).toThrow(/mayor a 0/);
        });

        it('debe fallar si cargaHoraria supera el máximo de 200 horas', () => {
            const datosInvalidos = { ...datosBaseValidos, cargaHoraria: 201 };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/no debe superar las 200 horas/);
        });

        it('debe fallar si cargaHoraria no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidos, cargaHoraria: 64.5 as any };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
        
        it('debe manejar cargaHoraria como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidos, cargaHoraria: "90" as any };
            expect(() => AsignaturaEsquema.parse(datos)).not.toThrow();
            expect(AsignaturaEsquema.parse(datos).cargaHoraria).toBe(90);
        });
    });

    describe('Validación de idFormato', () => {
        it('debe fallar si idFormato es 0 o negativo', () => {
            const datosInvalidos = { ...datosBaseValidos, idFormato: 0 };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idFormato supera el máximo de 3', () => {
            const datosInvalidos = { ...datosBaseValidos, idFormato: 4 };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/debe ser 1, 2 o 3/);
        });

        it('debe fallar si idFormato no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidos, idFormato: 2.5 as any };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
        
        it('debe manejar idFormato como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidos, idFormato: "3" as any };
            expect(() => AsignaturaEsquema.parse(datos)).not.toThrow();
            expect(AsignaturaEsquema.parse(datos).idFormato).toBe(3);
        });
    });

    describe('Validación de informacion', () => {
        it('debe fallar si informacion supera los 200 caracteres', () => {
            const infoLarga = 'x'.repeat(201);
            const datosInvalidos = { ...datosBaseValidos, informacion: infoLarga };
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => AsignaturaEsquema.parse(datosInvalidos)).toThrow(/no puede exceder los 200 caracteres/);
        });

        it('debe convertir informacion de undefined a null', () => {
            const { informacion, ...datosSinInfo } = datosBaseValidos;
            const resultado = AsignaturaEsquema.parse(datosSinInfo); 
            expect(resultado.informacion).toBeNull();
        });
    });
});