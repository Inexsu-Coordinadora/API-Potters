import { ProgramaCasosUso } from "../../src/core/aplicacion/casos-uso/ProgramaCasosUso";
import { IProgramaRepositorio } from "../../src/core/dominio/repositorio/IProgramaRepositorio";
import { IPrograma } from "../../src/core/dominio/programa/IPrograma";
import { ProgramaDTO } from "../../src/presentacion/esquemas/programaAcademicoEsquema";
import { EntidadNoEncontradaError } from "../../src/core/dominio/errores/encontrarError";
import { jest } from '@jest/globals';

const mockProgramaRepositorio: jest.Mocked<IProgramaRepositorio> = {
    crearPrograma: jest.fn(),
    listarPrograma: jest.fn(),
    obtenerProgramaPorId: jest.fn(),
    actualizarPrograma: jest.fn(),
    eliminarPrograma: jest.fn(),
};

const programaId = 1;
const datosProgramaDTO: ProgramaDTO = {
    nombrePrograma: "Ingeniería de Software",
    idNivel: 3,
    idModalidad: 1,
    duracionMeses: 24,
};

const programaExistente: IPrograma = {
    ...datosProgramaDTO,
    idPrograma: programaId,
};

let programaCasosUso: ProgramaCasosUso;

describe('ProgramaCasosUso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        programaCasosUso = new ProgramaCasosUso(mockProgramaRepositorio);
    });

    describe('obtenerPrograma', () => {
        it('debe devolver la lista de programas académicos', async () => {
            mockProgramaRepositorio.listarPrograma.mockResolvedValue([programaExistente]);
            const resultado = await programaCasosUso.obtenerPrograma();
            expect(mockProgramaRepositorio.listarPrograma).toHaveBeenCalled();
            expect(resultado).toEqual([programaExistente]);
        });

        it('debe lanzar EntidadNoEncontradaError si la lista está vacía', async () => {
            mockProgramaRepositorio.listarPrograma.mockResolvedValue([]);
            await expect(programaCasosUso.obtenerPrograma()).rejects.toThrow(EntidadNoEncontradaError);
            await expect(programaCasosUso.obtenerPrograma()).rejects.toThrow("No se encontró ningún programa académico");
        });
    });

    describe('obtenerProgramasPorId', () => {
        it('debe devolver el programa encontrado por ID', async () => {
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(programaExistente);
            const resultado = await programaCasosUso.obtenerProgramasPorId(programaId);
            expect(mockProgramaRepositorio.obtenerProgramaPorId).toHaveBeenCalledWith(programaId);
            expect(resultado).toEqual(programaExistente);
        });

        it('debe lanzar EntidadNoEncontradaError si no existe el programa', async () => {
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(null);
            await expect(programaCasosUso.obtenerProgramasPorId(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });

    describe('crearPrograma', () => {
        it('debe crear el programa y devolver el ID (string)', async () => {
            const nuevoIdString = "1";
            mockProgramaRepositorio.crearPrograma.mockResolvedValue(nuevoIdString);

            const resultado = await programaCasosUso.crearPrograma(datosProgramaDTO);

            expect(mockProgramaRepositorio.crearPrograma).toHaveBeenCalledWith(datosProgramaDTO);
            expect(resultado).toBe(nuevoIdString);
        });
    });

    describe('actualizarPrograma', () => {
        const datosActualizados: IPrograma = { ...programaExistente, duracionMeses: 36 };

        it('debe actualizar el programa y devolver la entidad actualizada', async () => {
            mockProgramaRepositorio.actualizarPrograma.mockResolvedValue(datosActualizados);

            const resultado = await programaCasosUso.actualizarPrograma(programaId, datosActualizados);

            expect(mockProgramaRepositorio.actualizarPrograma).toHaveBeenCalledWith(programaId, datosActualizados);
            expect(resultado).toEqual(datosActualizados);
        });

        it('debe lanzar EntidadNoEncontradaError si el repositorio devuelve null', async () => {
            mockProgramaRepositorio.actualizarPrograma.mockResolvedValue(null as any);

            await expect(programaCasosUso.actualizarPrograma(99, datosActualizados)).rejects.toThrow(EntidadNoEncontradaError);
            await expect(programaCasosUso.actualizarPrograma(99, datosActualizados)).rejects.toThrow(/no encontrado/);
        });
    });

    describe('eliminarPrograma', () => {
        it('debe eliminar y devolver el programa eliminado', async () => {
            mockProgramaRepositorio.eliminarPrograma.mockResolvedValue(programaExistente);

            const resultado = await programaCasosUso.eliminarPrograma(programaId);

            expect(mockProgramaRepositorio.eliminarPrograma).toHaveBeenCalledWith(programaId);
            expect(resultado).toEqual(programaExistente);
        });

        it('debe lanzar EntidadNoEncontradaError si falla al eliminar', async () => {
            mockProgramaRepositorio.eliminarPrograma.mockResolvedValue(null);
            await expect(programaCasosUso.eliminarPrograma(99)).rejects.toThrow(EntidadNoEncontradaError);
        });
    });
});