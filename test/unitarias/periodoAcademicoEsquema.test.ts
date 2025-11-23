import { PeriodoAcademicoEsquema } from "../../src/presentacion/esquemas/periodoAcademicoEsquema";
import { ZodError } from "zod";

describe('PeriodoAcademicoEsquema', () => {
    const fechaInicioValida = "2026-02-01";
    const fechaFinValida = "2026-06-30";
    
    const datosBaseValidosDTO = {
        semestre: "2026-1",
        fechaInicio: fechaInicioValida,
        fechaFin: fechaFinValida,
        idEstado: 1, 
    };

    it('debe validar un objeto con todos los campos correctos y transformar las fechas', () => {
        expect(() => PeriodoAcademicoEsquema.parse(datosBaseValidosDTO)).not.toThrow();
        const resultado = PeriodoAcademicoEsquema.parse(datosBaseValidosDTO);
        
        expect(resultado.fechaInicio).toBeInstanceOf(Date);
        expect(resultado.fechaFin).toBeInstanceOf(Date);
        expect(resultado.fechaInicio.toISOString().substring(0, 10)).toBe(fechaInicioValida);
    });

    it('debe fallar si la fecha de inicio es mayor que la fecha de fin', () => {
        const datosInvalidos = {
            ...datosBaseValidosDTO,
            fechaInicio: "2026-10-01",
            fechaFin: "2026-06-30",
        };
        expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
        expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/La fecha de inicio no puede ser mayor que la fecha de fin/);
    });

    describe('Validación de Semestre', () => {
        it('debe fallar si semestre es una cadena vacía', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, semestre: "" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/El semestre es obligatorio/);
        });

        it('debe fallar si semestre tiene menos de 6 caracteres', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, semestre: "2026" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/Debe tener al menos 6 caracteres/);
        });

        it('debe fallar si semestre supera los 10 caracteres', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, semestre: "2026-1-EXTRA" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/No puede superar los 10 caracteres/);
        });
    });

    describe('Validación de Fechas', () => {
        it('debe fallar si fechaInicio tiene un formato incorrecto (no AAAA-MM-DD)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, fechaInicio: "01/02/2026" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/El formato de la fecha de inicio es inválido/);
        });

        it('debe fallar si fechaFin tiene un formato incorrecto (no AAAA-MM-DD)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, fechaFin: "2026/06/30" }; 
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/El formato de la fecha de finalización es inválido/);
        });

        it('debe fallar si fechaInicio no es una fecha válida (ej. día 32)', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, fechaInicio: "2026-01-32" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/La fecha de inicio no es válida en el calendario/);
        });

        it('debe fallar si el año de fechaInicio es menor a 2010', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, fechaInicio: "2009-12-31" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/El año de la fecha de inicio debe estar entre 2010 y 2100/);
        });

        it('debe fallar si el año de fechaFin es mayor a 2100', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, fechaFin: "2101-03-01" };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/El año de la fecha de finalización debe estar entre 2010 y 2100/);
        });
    });

    describe('Validación de idEstado', () => {
        it('debe fallar si idEstado es 0 o negativo', () => {
            const datosInvalidos1 = { ...datosBaseValidosDTO, idEstado: 0 };
            const datosInvalidos2 = { ...datosBaseValidosDTO, idEstado: -1 };

            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos1)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos1)).toThrow(/mayor a 0/);
            
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos2)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos2)).toThrow(/mayor a 0/);
        });

        it('debe fallar si idEstado supera el máximo de 3', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idEstado: 4 };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/solo puede ser 1, 2 o 3/);
        });

        it('debe fallar si idEstado no es un número entero', () => {
            const datosInvalidos = { ...datosBaseValidosDTO, idEstado: 1.5 as any };
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(ZodError);
            expect(() => PeriodoAcademicoEsquema.parse(datosInvalidos)).toThrow(/número entero/);
        });
        
        it('debe manejar idEstado como cadena y convertirlo a número (coerce)', () => {
            const datos = { ...datosBaseValidosDTO, idEstado: "2" as any };
            expect(() => PeriodoAcademicoEsquema.parse(datos)).not.toThrow();
            expect(PeriodoAcademicoEsquema.parse(datos).idEstado).toBe(2);
        });
    });
});