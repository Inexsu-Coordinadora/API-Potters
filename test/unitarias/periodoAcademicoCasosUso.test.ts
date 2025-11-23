import { PeriodoAcademicoCasosUso } from "../../src/core/aplicacion/casos-uso/PeriodoAcademicoCasosUso";
import { IPeriodoAcademicoRepositorio } from "../../src/core/dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IPeriodoAcademico } from "../../src/core/dominio/periodoAcademico/IPeriodoAcademico";
import { IPeriodoRelacionado } from "../../src/core/dominio/periodoAcademico/IPeriodoRelacionado";
import { PeriodoAcademicoDTO } from "../../src/presentacion/esquemas/periodoAcademicoEsquema";
import { EntidadNoEncontradaError } from "../../src/core/dominio/errores/encontrarError";
import { ReglaNegocioError } from "../../src/core/dominio/errores/reglaNegocioError";
import { jest } from '@jest/globals';

const mockPeriodoRepositorio: jest.Mocked<IPeriodoAcademicoRepositorio> = {
    crearPeriodo: jest.fn(),
    listarPeriodos: jest.fn(),
    obtenerPeriodoPorId: jest.fn(),
    actualizarPeriodo: jest.fn(),
    eliminarPeriodo: jest.fn(),
    consultarTraslapeFechas: jest.fn(),
    obtenerPeriodoRelacionado: jest.fn(),
};

const fechaInicio = new Date("2026-02-01");
const fechaFin = new Date("2026-06-30");

const datosPeriodoDTO: PeriodoAcademicoDTO = {
    semestre: "2026-1",
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    idEstado: 1,
};

const periodoEntidad: IPeriodoAcademico = {
    idPeriodo: 1,
    semestre: "2026-1",
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    idEstado: 1,
};

const periodoRelacionadoMock: IPeriodoRelacionado = {
    idPeriodo: 1,
    semestre: "2026-1",
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    estadoperiodo: "Preparación"
};

let periodoCasosUso: PeriodoAcademicoCasosUso;

describe('PeriodoAcademicoCasosUso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        periodoCasosUso = new PeriodoAcademicoCasosUso(mockPeriodoRepositorio);
    });

    describe('obtenerPeriodos', () => {
        it('debe devolver la lista de periodos', async () => {
            mockPeriodoRepositorio.listarPeriodos.mockResolvedValue([periodoEntidad]);
            const resultado = await periodoCasosUso.obtenerPeriodos();
            expect(mockPeriodoRepositorio.listarPeriodos).toHaveBeenCalled();
            expect(resultado).toEqual([periodoEntidad]);
        });

        it('debe lanzar EntidadNoEncontradaError si la lista está vacía', async () => {
            mockPeriodoRepositorio.listarPeriodos.mockResolvedValue([]);
            await expect(periodoCasosUso.obtenerPeriodos()).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('obtenerPeriodoPorId', () => {
        it('debe devolver el periodo encontrado', async () => {
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(periodoEntidad);
            const resultado = await periodoCasosUso.obtenerPeriodoPorId(1);
            expect(mockPeriodoRepositorio.obtenerPeriodoPorId).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(periodoEntidad);
        });

        it('debe lanzar EntidadNoEncontradaError si no existe', async () => {
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(null);
            await expect(periodoCasosUso.obtenerPeriodoPorId(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('crearPeriodo', () => {
        it('debe crear el periodo si no hay traslapes', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(null);
            mockPeriodoRepositorio.crearPeriodo.mockResolvedValue(1);
            mockPeriodoRepositorio.obtenerPeriodoRelacionado.mockResolvedValue(periodoRelacionadoMock);

            const resultado = await periodoCasosUso.crearPeriodo(datosPeriodoDTO);

            expect(mockPeriodoRepositorio.consultarTraslapeFechas).toHaveBeenCalledWith(datosPeriodoDTO, 0);
            expect(mockPeriodoRepositorio.crearPeriodo).toHaveBeenCalledWith(datosPeriodoDTO);
            expect(resultado).toEqual(periodoRelacionadoMock);
        });

        it('debe lanzar ReglaNegocioError si hay traslape de fechas', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(periodoEntidad);
            await expect(periodoCasosUso.crearPeriodo(datosPeriodoDTO)).rejects.toThrow(ReglaNegocioError);
            await expect(periodoCasosUso.crearPeriodo(datosPeriodoDTO)).rejects.toThrow(/traslapada/);
        });
    });

    describe('actualizarPeriodo', () => {
        const idActualizar = 1;
        const datosActualizarDTO: PeriodoAcademicoDTO = { ...datosPeriodoDTO, idEstado: 2 };

        it('debe actualizar si no hay traslapes y la transición de estado es válida (1 -> 2)', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(null);
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(periodoEntidad);
            mockPeriodoRepositorio.actualizarPeriodo.mockResolvedValue({ ...periodoEntidad, idEstado: 2 });

            const periodoActualizadoRelacionado = { ...periodoRelacionadoMock, estadoperiodo: "Activo" };
            mockPeriodoRepositorio.obtenerPeriodoRelacionado.mockResolvedValue(periodoActualizadoRelacionado);

            const resultado = await periodoCasosUso.actualizarPeriodo(idActualizar, datosActualizarDTO);

            expect(mockPeriodoRepositorio.consultarTraslapeFechas).toHaveBeenCalledWith(datosActualizarDTO, idActualizar);
            expect(mockPeriodoRepositorio.actualizarPeriodo).toHaveBeenCalledWith(idActualizar, datosActualizarDTO);
            expect(resultado).toEqual(periodoActualizadoRelacionado);
        });

        it('debe lanzar ReglaNegocioError si hay traslape de fechas al actualizar', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(periodoEntidad);

            await expect(periodoCasosUso.actualizarPeriodo(idActualizar, datosActualizarDTO)).rejects.toThrow(ReglaNegocioError);
        });

        it('debe lanzar EntidadNoEncontradaError si el periodo a actualizar no existe', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(null);
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(null);

            await expect(periodoCasosUso.actualizarPeriodo(99, datosActualizarDTO)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar ReglaNegocioError si intenta pasar de Activo (2) a Preparación (1)', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(null);

            const periodoActivo = { ...periodoEntidad, idEstado: 2 };
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(periodoActivo);

            const intentoInvalido = { ...datosPeriodoDTO, idEstado: 1 };

            await expect(periodoCasosUso.actualizarPeriodo(idActualizar, intentoInvalido)).rejects.toThrow(ReglaNegocioError);
            await expect(periodoCasosUso.actualizarPeriodo(idActualizar, intentoInvalido)).rejects.toThrow(/Transición de estado no permitida/);
        });

        it('debe lanzar ReglaNegocioError si intenta pasar de Cerrado (3) a Activo (2)', async () => {
            mockPeriodoRepositorio.consultarTraslapeFechas.mockResolvedValue(null);

            const periodoCerrado = { ...periodoEntidad, idEstado: 3 };
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(periodoCerrado);

            const intentoInvalido = { ...datosPeriodoDTO, idEstado: 2 };

            await expect(periodoCasosUso.actualizarPeriodo(idActualizar, intentoInvalido)).rejects.toThrow(ReglaNegocioError);
        });
    });

    describe('eliminarPeriodo', () => {
        it('debe eliminar y devolver el periodo', async () => {
            mockPeriodoRepositorio.eliminarPeriodo.mockResolvedValue(periodoEntidad);
            const resultado = await periodoCasosUso.eliminarPeriodo(1);
            expect(mockPeriodoRepositorio.eliminarPeriodo).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(periodoEntidad);
        });

        it('debe lanzar EntidadNoEncontradaError si falla al eliminar', async () => {
            mockPeriodoRepositorio.eliminarPeriodo.mockResolvedValue(null);
            await expect(periodoCasosUso.eliminarPeriodo(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });
});