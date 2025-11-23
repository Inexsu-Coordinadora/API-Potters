import { OfertaCasosUso } from "../../src/core/aplicacion/casos-uso/OfertaCasosUso";
import { IOfertaRepositorio } from "../../src/core/dominio/repositorio/IOfertaRepositorio";
import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { IProgramaRepositorio } from "../../src/core/dominio/repositorio/IProgramaRepositorio";
import { IPeriodoAcademicoRepositorio } from "../../src/core/dominio/repositorio/IPeriodoAcademicoRepositorio";
import { EntidadNoEncontradaError } from "../../src/core/dominio/errores/encontrarError";
import { ReglaNegocioError } from "../../src/core/dominio/errores/reglaNegocioError";
import { IOferta } from "../../src/core/dominio/oferta/IOferta";
import { IOfertaRelacionada } from "../../src/core/dominio/oferta/IOfertaRelacionada";
import { PeriodoAcademico } from "../../src/core/dominio/periodoAcademico/PeriodoAcademico";
import { IPeriodoAcademico } from "../../src/core/dominio/periodoAcademico/IPeriodoAcademico";
import { jest } from '@jest/globals';
import { IAsignatura } from "../../src/core/dominio/asignatura/IAsignatura";
import { IPrograma } from "../../src/core/dominio/programa/IPrograma";
import { estadoPeriodoAcademico } from "../../src/core/dominio/enum/estadoPeriodoAcademico";

jest.spyOn(PeriodoAcademico.prototype, 'validarEstado');
const mockValidarEstado = PeriodoAcademico.prototype.validarEstado as jest.Mock;

const mockOfertaRepositorio: jest.Mocked<IOfertaRepositorio> = {
    crearOferta: jest.fn(),
    listarOfertas: jest.fn(),
    obtenerOfertaPorId: jest.fn(),
    actualizarOferta: jest.fn(),
    eliminarOferta: jest.fn(),
    existeOfertaDuplicada: jest.fn(),
    obtenerOfertaRelacionada: jest.fn(),
};

const mockAsignaturaRepositorio: jest.Mocked<IAsignaturaRepositorio> = {
    crearAsignatura: jest.fn(),
    listarAsignaturas: jest.fn(),
    obtenerAsignaturaPorId: jest.fn(),
    actualizarAsignatura: jest.fn(),
    eliminarAsignatura: jest.fn(),
};

const mockProgramaRepositorio: jest.Mocked<IProgramaRepositorio> = {
    crearPrograma: jest.fn(),
    listarPrograma: jest.fn(),
    obtenerProgramaPorId: jest.fn(),
    actualizarPrograma: jest.fn(),
    eliminarPrograma: jest.fn(),
};

const mockPeriodoRepositorio: jest.Mocked<IPeriodoAcademicoRepositorio> = {
    crearPeriodo: jest.fn(),
    listarPeriodos: jest.fn(),
    obtenerPeriodoPorId: jest.fn(),
    actualizarPeriodo: jest.fn(),
    eliminarPeriodo: jest.fn(),
    consultarTraslapeFechas: jest.fn(),
    obtenerPeriodoRelacionado: jest.fn(),
};

const datosOferta: IOferta = {
    idPrograma: 1,
    idPeriodo: 10,
    idAsignatura: 100,
    grupo: 1,
    cupo: 50,
};

const ofertaExistente: IOferta = { ...datosOferta, idOferta: 1 };

const asignaturaCompletaMock: IAsignatura = {
    idAsignatura: 100,
    nombreAsignatura: "Física I",
    cargaHoraria: 64,
    idFormato: 1,
    informacion: "Asignatura básica de ciencias"
};

const programaCompletoMock: IPrograma = {
    idPrograma: 1,
    nombrePrograma: "Ingeniería de Sistemas",
    idNivel: 1,
    idModalidad: 1,
    duracionMeses: 60
};

const periodoActivoMock: IPeriodoAcademico = {
    idPeriodo: 10,
    semestre: "2026-1",
    fechaInicio: new Date("2026-01-15"),
    fechaFin: new Date("2026-05-30"),
    idEstado: estadoPeriodoAcademico.activo,
};

const ofertaRelacionadaMock: IOfertaRelacionada = {
    idOferta: 1,
    nombrePrograma: "Ingeniería",
    semestre: "2026-1",
    nombreAsignatura: "Física I",
    informacion: "Grupo 1",
};

let ofertaCasosUso: OfertaCasosUso;

describe('OfertaCasosUso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        ofertaCasosUso = new OfertaCasosUso(
            mockOfertaRepositorio,
            mockAsignaturaRepositorio,
            mockProgramaRepositorio,
            mockPeriodoRepositorio
        );
    });

    describe('obtenerOfertas', () => {
        it('debe devolver la lista de ofertas', async () => {
            mockOfertaRepositorio.listarOfertas.mockResolvedValue([ofertaExistente]);
            const resultado = await ofertaCasosUso.obtenerOfertas();
            expect(mockOfertaRepositorio.listarOfertas).toHaveBeenCalled();
            expect(resultado).toEqual([ofertaExistente]);
        });

        it('debe lanzar EntidadNoEncontradaError si no se encuentran ofertas', async () => {
            mockOfertaRepositorio.listarOfertas.mockResolvedValue([]);
            await expect(ofertaCasosUso.obtenerOfertas()).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('obtenerOfertaPorId', () => {
        it('debe devolver la oferta por ID', async () => {
            mockOfertaRepositorio.obtenerOfertaPorId.mockResolvedValue(ofertaExistente);
            const resultado = await ofertaCasosUso.obtenerOfertaPorId(1);
            expect(mockOfertaRepositorio.obtenerOfertaPorId).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(ofertaExistente);
        });

        it('debe lanzar EntidadNoEncontradaError si la oferta no existe', async () => {
            mockOfertaRepositorio.obtenerOfertaPorId.mockResolvedValue(null);
            await expect(ofertaCasosUso.obtenerOfertaPorId(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('crearOferta', () => {
        const setupSuccessMocks = () => {
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(false);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaCompletaMock);
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaCompletoMock);
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(periodoActivoMock);
            
            mockValidarEstado.mockReturnValue("periodo activo");
            mockOfertaRepositorio.crearOferta.mockResolvedValue(1);
            mockOfertaRepositorio.obtenerOfertaRelacionada.mockResolvedValue(ofertaRelacionadaMock);
        };

        it('debe crear la oferta correctamente', async () => {
            setupSuccessMocks();
            const resultado = await ofertaCasosUso.crearOferta(datosOferta);
            
            expect(mockValidarEstado).toHaveBeenCalled();
            expect(mockOfertaRepositorio.crearOferta).toHaveBeenCalledWith(datosOferta);
            expect(resultado).toEqual(ofertaRelacionadaMock);
        });

        it('debe lanzar ReglaNegocioError si existe duplicado', async () => {
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(true);
            await expect(ofertaCasosUso.crearOferta(datosOferta)).rejects.toThrow(ReglaNegocioError);
        });

        it('debe lanzar EntidadNoEncontradaError si no encuentra Asignatura', async () => {
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(false);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(null);
            
            await expect(ofertaCasosUso.crearOferta(datosOferta)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar EntidadNoEncontradaError si no encuentra Programa', async () => {
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(false);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaCompletaMock);
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(null);

            await expect(ofertaCasosUso.crearOferta(datosOferta)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar EntidadNoEncontradaError si no encuentra Periodo', async () => {
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(false);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaCompletaMock);
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaCompletoMock);
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(null);

            await expect(ofertaCasosUso.crearOferta(datosOferta)).rejects.toThrow(EntidadNoEncontradaError);
        });

        it('debe lanzar ReglaNegocioError si el Periodo NO está activo', async () => {
            setupSuccessMocks();
            mockValidarEstado.mockReturnValue("El periodo está cerrado"); 

            await expect(ofertaCasosUso.crearOferta(datosOferta)).rejects.toThrow(ReglaNegocioError);
            await expect(ofertaCasosUso.crearOferta(datosOferta)).rejects.toThrow("El periodo está cerrado");
        });
    });

    describe('actualizarOferta', () => {
        const idActualizar = 1;
        const datosActualizados: IOferta = { ...datosOferta, grupo: 2 };

        const setupUpdateSuccessMocks = () => {
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(false);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(asignaturaCompletaMock);
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaCompletoMock);
            mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(periodoActivoMock);
            
            mockValidarEstado.mockReturnValue("periodo activo");
            mockOfertaRepositorio.actualizarOferta.mockResolvedValue(datosActualizados);
            mockOfertaRepositorio.obtenerOfertaRelacionada.mockResolvedValue(ofertaRelacionadaMock);
        };

        it('debe actualizar la oferta correctamente', async () => {
            setupUpdateSuccessMocks();
            await ofertaCasosUso.actualizarOferta(idActualizar, datosActualizados);
            expect(mockOfertaRepositorio.actualizarOferta).toHaveBeenCalledWith(idActualizar, datosActualizados);
        });

        it('debe lanzar EntidadNoEncontradaError si la oferta no existe al actualizar', async () => {
            setupUpdateSuccessMocks();
            mockOfertaRepositorio.actualizarOferta.mockResolvedValue(null as any);
            await expect(ofertaCasosUso.actualizarOferta(99, datosActualizados)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('eliminarOferta', () => {
        it('debe eliminar y devolver la oferta', async () => {
            mockOfertaRepositorio.eliminarOferta.mockResolvedValue(ofertaExistente);
            const resultado = await ofertaCasosUso.eliminarOferta(1);
            expect(mockOfertaRepositorio.eliminarOferta).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(ofertaExistente);
        });

        it('debe lanzar EntidadNoEncontradaError si no encuentra oferta al eliminar', async () => {
            mockOfertaRepositorio.eliminarOferta.mockResolvedValue(null);
            await expect(ofertaCasosUso.eliminarOferta(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });
});