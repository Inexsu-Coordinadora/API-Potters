import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { AsignaturaCasosUso } from "../../src/core/aplicacion/casos-uso/AsignaturaCasosUso";
import { IAsignatura } from "../../src/core/dominio/asignatura/IAsignatura";
import { EntidadNoEncontradaError } from "../../src/core/dominio/errores/encontrarError";

const mockAsignaturaRepositorio: IAsignaturaRepositorio = {
    crearAsignatura: jest.fn(),
    listarAsignaturas: jest.fn(),
    obtenerAsignaturaPorId: jest.fn(),
    actualizarAsignatura: jest.fn(),
    eliminarAsignatura: jest.fn(),
};

const asignaturaMock: IAsignatura = {
    idAsignatura: 1,
    nombreAsignatura: "Matemáticas",
    cargaHoraria: 40,
    idFormato: 1,
    informacion: "Asignatura fundamental",
};

const listaAsignaturasMock: IAsignatura[] = [
    asignaturaMock,
    {
        idAsignatura: 2,
        nombreAsignatura: "Programación Orientada a Objetos",
        cargaHoraria: 60,
        idFormato: 2,
    },
];

let asignaturaCasosUso: AsignaturaCasosUso;

describe('AsignaturaCasosUso', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        asignaturaCasosUso = new AsignaturaCasosUso(mockAsignaturaRepositorio);
    });

    describe('obtenerAsignaturas', () => {
        it('debe devolver la lista de asignaturas si existen', async () => {
            (mockAsignaturaRepositorio.listarAsignaturas as jest.Mock).mockResolvedValue(listaAsignaturasMock);

            const resultado = await asignaturaCasosUso.obtenerAsignaturas();

            expect(mockAsignaturaRepositorio.listarAsignaturas).toHaveBeenCalledWith(undefined);
            expect(resultado).toEqual(listaAsignaturasMock);
        });

        it('debe lanzar EntidadNoEncontradaError si el repositorio devuelve una lista vacía', async () => {
            (mockAsignaturaRepositorio.listarAsignaturas as jest.Mock).mockResolvedValue([]);

            await expect(asignaturaCasosUso.obtenerAsignaturas()).rejects.toThrow(
                EntidadNoEncontradaError
            );
            await expect(asignaturaCasosUso.obtenerAsignaturas()).rejects.toThrow(
                "No se encontró ninguna asignatura"
            );
        });
        
        it('debe llamar a listarAsignaturas con el límite especificado', async () => {
            const limite = 5;
            (mockAsignaturaRepositorio.listarAsignaturas as jest.Mock).mockResolvedValue(listaAsignaturasMock);

            await asignaturaCasosUso.obtenerAsignaturas(limite);

            expect(mockAsignaturaRepositorio.listarAsignaturas).toHaveBeenCalledWith(limite);
        });
    });

    describe('obtenerAsignaturasPorId', () => {
        it('debe devolver la asignatura si se encuentra', async () => {
            (mockAsignaturaRepositorio.obtenerAsignaturaPorId as jest.Mock).mockResolvedValue(asignaturaMock);

            const resultado = await asignaturaCasosUso.obtenerAsignaturasPorId(1);

            expect(mockAsignaturaRepositorio.obtenerAsignaturaPorId).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(asignaturaMock);
        });

        it('debe lanzar EntidadNoEncontradaError si la asignatura no se encuentra', async () => {
            (mockAsignaturaRepositorio.obtenerAsignaturaPorId as jest.Mock).mockResolvedValue(null);

            await expect(asignaturaCasosUso.obtenerAsignaturasPorId(99)).rejects.toThrow(
                EntidadNoEncontradaError
            );
            await expect(asignaturaCasosUso.obtenerAsignaturasPorId(99)).rejects.toThrow(
                "No se encontró ninguna asignatura"
            );
        });
    });

    describe('crearAsignatura', () => {
        it('debe llamar al repositorio y devolver el ID de la nueva asignatura', async () => {
            const nuevoId = "3";
            const datosCreacion: IAsignatura = {
                nombreAsignatura: "Física",
                cargaHoraria: 60,
                idFormato: 1,
            };
            
            (mockAsignaturaRepositorio.crearAsignatura as jest.Mock).mockResolvedValue(nuevoId);

            const resultado = await asignaturaCasosUso.crearAsignatura(datosCreacion);

            expect(mockAsignaturaRepositorio.crearAsignatura).toHaveBeenCalledWith(datosCreacion);
            expect(resultado).toBe(nuevoId);
        });
    });

    describe('actualizarAsignatura', () => {
        const idActualizar = 1;
        const datosActualizados: IAsignatura = { ...asignaturaMock, nombreAsignatura: "Matemáticas" };

        it('debe devolver la asignatura actualizada si el repositorio tiene éxito', async () => {
            (mockAsignaturaRepositorio.actualizarAsignatura as jest.Mock).mockResolvedValue(datosActualizados);

            const resultado = await asignaturaCasosUso.actualizarAsignatura(idActualizar, datosActualizados);

            expect(mockAsignaturaRepositorio.actualizarAsignatura).toHaveBeenCalledWith(
                idActualizar,
                datosActualizados
            );
            expect(resultado).toEqual(datosActualizados);
        });

        it('debe lanzar EntidadNoEncontradaError si el repositorio devuelve null', async () => {
            (mockAsignaturaRepositorio.actualizarAsignatura as jest.Mock).mockResolvedValue(null);

            await expect(asignaturaCasosUso.actualizarAsignatura(99, datosActualizados)).rejects.toThrow(
                EntidadNoEncontradaError
            );
            await expect(asignaturaCasosUso.actualizarAsignatura(99, datosActualizados)).rejects.toThrow(
                "Asignatura con id 99 no encontrada"
            );
        });
    });

    describe('eliminarAsignatura', () => {
        const idEliminar = 1;
        it('debe devolver la asignatura eliminada si el repositorio tiene éxito', async () => {
            (mockAsignaturaRepositorio.eliminarAsignatura as jest.Mock).mockResolvedValue(asignaturaMock);

            const resultado = await asignaturaCasosUso.eliminarAsignatura(idEliminar);

            expect(mockAsignaturaRepositorio.eliminarAsignatura).toHaveBeenCalledWith(idEliminar);
            expect(resultado).toEqual(asignaturaMock);
        });

        it('debe lanzar EntidadNoEncontradaError si el repositorio devuelve null', async () => {
            (mockAsignaturaRepositorio.eliminarAsignatura as jest.Mock).mockResolvedValue(null);

            await expect(asignaturaCasosUso.eliminarAsignatura(99)).rejects.toThrow(
                EntidadNoEncontradaError
            );
            await expect(asignaturaCasosUso.eliminarAsignatura(99)).rejects.toThrow(
                "No se encontró ninguna asignatura"
            );
        });
    });
});