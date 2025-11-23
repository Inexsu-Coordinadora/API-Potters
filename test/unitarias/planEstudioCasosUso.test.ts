import { PlanEstudioCasosUso } from "../../src/core/aplicacion/casos-uso/PlanEstudioCasosUso";
import { IPlanEstudioRepositorio } from "../../src/core/dominio/repositorio/IPlanEstudioRepositorio";
import { IProgramaRepositorio } from "../../src/core/dominio/repositorio/IProgramaRepositorio";
import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { IPlanEstudio } from "../../src/core/dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioRelacionado } from "../../src/core/dominio/planEstudio/IPlanEstudioRelacionado";
import { IPrograma } from "../../src/core/dominio/programa/IPrograma";
import { IAsignatura } from "../../src/core/dominio/asignatura/IAsignatura";
import { EntidadNoEncontradaError } from "../../src/core/dominio/errores/encontrarError";
import { ReglaNegocioError } from "../../src/core/dominio/errores/reglaNegocioError";
import { jest } from '@jest/globals';

const mockPlanEstudioRepositorio: jest.Mocked<IPlanEstudioRepositorio> = {
    crearPlanEstudio: jest.fn(),
    listarPlanEstudio: jest.fn(),
    obtenerPlanEstudioPorId: jest.fn(),
    actualizarPlanEstudio: jest.fn(),
    eliminarPlanEstudio: jest.fn(),
    existeDuplicidad: jest.fn(),
    obtenerPlanEstudioRelacionado: jest.fn(),
};

const mockProgramaRepositorio: jest.Mocked<IProgramaRepositorio> = {
    crearPrograma: jest.fn(),
    listarPrograma: jest.fn(),
    obtenerProgramaPorId: jest.fn(),
    actualizarPrograma: jest.fn(),
    eliminarPrograma: jest.fn(),
};

const mockAsignaturaRepositorio: jest.Mocked<IAsignaturaRepositorio> = {
    crearAsignatura: jest.fn(),
    listarAsignaturas: jest.fn(),
    obtenerAsignaturaPorId: jest.fn(),
    actualizarAsignatura: jest.fn(),
    eliminarAsignatura: jest.fn(),
};

const datosPlanEstudio: IPlanEstudio = {
    idPrograma: 1,
    idAsignatura: 100,
    semestre: 2,
    creditos: 4,
};

const planEstudioExistente: IPlanEstudio = {
    ...datosPlanEstudio,
    idPlanEstudio: 50,
};

const programaMock: IPrograma = {
    idPrograma: 1,
    nombrePrograma: "Ingeniería de Sistemas",
    idNivel: 1,
    idModalidad: 1,
    duracionMeses: 60
};

const asignaturaMock: IAsignatura = {
    idAsignatura: 100,
    nombreAsignatura: "Programación Avanza",
    cargaHoraria: 64,
    idFormato: 1,
    informacion: "Curso obligatorio"
};

const planRelacionadoMock: IPlanEstudioRelacionado = {
    idPlanEstudio: 50,
    nombrePrograma: "Ingeniería de Sistemas",
    nombreAsignatura: "Programación Avanzada",
    semestre: 2,
    creditos: 4
};

let planEstudioCasosUso: PlanEstudioCasosUso;

describe('PlanEstudioCasosUso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        planEstudioCasosUso = new PlanEstudioCasosUso(
            mockPlanEstudioRepositorio,
            mockProgramaRepositorio,
            mockAsignaturaRepositorio
        );
    });

    describe('obtenerPlanEstudio', () => {
        it('debe devolver la lista de planes de estudio', async () => {
            mockPlanEstudioRepositorio.listarPlanEstudio.mockResolvedValue([planEstudioExistente]);
            const resultado = await planEstudioCasosUso.obtenerPlanEstudio();
            expect(mockPlanEstudioRepositorio.listarPlanEstudio).toHaveBeenCalled();
            expect(resultado).toEqual([planEstudioExistente]);
        });

        it('debe lanzar EntidadNoEncontradaError si la lista está vacía', async () => {
            mockPlanEstudioRepositorio.listarPlanEstudio.mockResolvedValue([]);
            await expect(planEstudioCasosUso.obtenerPlanEstudio()).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('obtenerPlanEstudioPorId', () => {
        it('debe devolver el plan por ID', async () => {
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(planEstudioExistente);
            const resultado = await planEstudioCasosUso.obtenerPlanEstudioPorId(50);
            expect(mockPlanEstudioRepositorio.obtenerPlanEstudioPorId).toHaveBeenCalledWith(50);
            expect(resultado).toEqual(planEstudioExistente);
        });

        it('debe lanzar EntidadNoEncontradaError si no existe', async () => {
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(null);
            await expect(planEstudioCasosUso.obtenerPlanEstudioPorId(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('crearPlanEstudio', () => {
        const setupSuccessMocks = () => {
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaMock);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaMock);
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(false);
            mockPlanEstudioRepositorio.crearPlanEstudio.mockResolvedValue(50);
            mockPlanEstudioRepositorio.obtenerPlanEstudioRelacionado.mockResolvedValue(planRelacionadoMock);
        };

        it('debe crear el plan de estudio exitosamente', async () => {
            setupSuccessMocks();

            const resultado = await planEstudioCasosUso.crearPlanEstudio(datosPlanEstudio);

            expect(mockProgramaRepositorio.obtenerProgramaPorId).toHaveBeenCalledWith(datosPlanEstudio.idPrograma);
            expect(mockAsignaturaRepositorio.obtenerAsignaturaPorId).toHaveBeenCalledWith(datosPlanEstudio.idAsignatura);
            expect(mockPlanEstudioRepositorio.existeDuplicidad).toHaveBeenCalledWith(
                datosPlanEstudio.idPrograma,
                datosPlanEstudio.idAsignatura,
                datosPlanEstudio.semestre
            );
            expect(mockPlanEstudioRepositorio.crearPlanEstudio).toHaveBeenCalledWith(datosPlanEstudio);
            expect(resultado).toEqual(planRelacionadoMock);
        });

        it('debe lanzar EntidadNoEncontradaError si el Programa no existe', async () => {
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(null);

            await expect(planEstudioCasosUso.crearPlanEstudio(datosPlanEstudio)).rejects.toThrow(EntidadNoEncontradaError);
            await expect(planEstudioCasosUso.crearPlanEstudio(datosPlanEstudio)).rejects.toThrow(/programa académico/);
        });

        it('debe lanzar EntidadNoEncontradaError si la Asignatura no existe', async () => {
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaMock);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(null);

            await expect(planEstudioCasosUso.crearPlanEstudio(datosPlanEstudio)).rejects.toThrow(EntidadNoEncontradaError);
            await expect(planEstudioCasosUso.crearPlanEstudio(datosPlanEstudio)).rejects.toThrow(/asignatura/);
        });

        it('debe lanzar ReglaNegocioError si el plan ya existe (Duplicidad)', async () => {
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaMock);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaMock);
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(true);

            await expect(planEstudioCasosUso.crearPlanEstudio(datosPlanEstudio)).rejects.toThrow(ReglaNegocioError);
        });
    });

    describe('actualizarPlanEstudio', () => {
        const idActualizar = 50;
        const datosActualizar: IPlanEstudio = { ...datosPlanEstudio, creditos: 5 };
        const planActualizadoRelacionado = { ...planRelacionadoMock, creditos: 5 };

        const setupUpdateSuccessMocks = () => {
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(planEstudioExistente);
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaMock);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaMock);
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(false);
            mockPlanEstudioRepositorio.actualizarPlanEstudio.mockResolvedValue(datosActualizar);
            mockPlanEstudioRepositorio.obtenerPlanEstudioRelacionado.mockResolvedValue(planActualizadoRelacionado);
        };

        it('debe actualizar el plan de estudio exitosamente', async () => {
            setupUpdateSuccessMocks();

            const resultado = await planEstudioCasosUso.actualizarPlanEstudio(idActualizar, datosActualizar);

            expect(mockPlanEstudioRepositorio.actualizarPlanEstudio).toHaveBeenCalledWith(idActualizar, datosActualizar);
            expect(resultado).toEqual(planActualizadoRelacionado);
        });

        it('debe lanzar EntidadNoEncontradaError si el plan de estudio a actualizar no existe', async () => {
            setupUpdateSuccessMocks();
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(null);

            await expect(planEstudioCasosUso.actualizarPlanEstudio(idActualizar, datosActualizar)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar EntidadNoEncontradaError si el Programa nuevo no existe', async () => {
            setupUpdateSuccessMocks();
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(null);

            await expect(planEstudioCasosUso.actualizarPlanEstudio(idActualizar, datosActualizar)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar EntidadNoEncontradaError si la Asignatura nueva no existe', async () => {
            setupUpdateSuccessMocks();
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(null);

            await expect(planEstudioCasosUso.actualizarPlanEstudio(idActualizar, datosActualizar)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar ReglaNegocioError si se genera duplicidad al actualizar', async () => {
            setupUpdateSuccessMocks();
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(true);

            await expect(planEstudioCasosUso.actualizarPlanEstudio(idActualizar, datosActualizar)).rejects.toThrow(ReglaNegocioError);
        });
    });

    describe('eliminarPlanEstudio', () => {
        it('debe eliminar y devolver el plan', async () => {
            mockPlanEstudioRepositorio.eliminarPlanEstudio.mockResolvedValue(planEstudioExistente);
            const resultado = await planEstudioCasosUso.eliminarPlanEstudio(50);
            expect(mockPlanEstudioRepositorio.eliminarPlanEstudio).toHaveBeenCalledWith(50);
            expect(resultado).toEqual(planEstudioExistente);
        });

        it('debe lanzar EntidadNoEncontradaError si falla al eliminar', async () => {
            mockPlanEstudioRepositorio.eliminarPlanEstudio.mockResolvedValue(null);
            await expect(planEstudioCasosUso.eliminarPlanEstudio(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });
});