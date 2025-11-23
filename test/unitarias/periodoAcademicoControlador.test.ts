import { FastifyRequest, FastifyReply } from 'fastify';
import { PeriodoAcademicoControlador } from '../../src/presentacion/controladores/periodoAcademicoControlador';
import { IPeriodoAcademicoCasosUso } from '../../src/core/aplicacion/casos-uso/IPeriodoAcademicoCasosUso';
import { IPeriodoAcademico } from '../../src/core/dominio/periodoAcademico/IPeriodoAcademico';
import { IPeriodoRelacionado } from '../../src/core/dominio/periodoAcademico/IPeriodoRelacionado';
import { PeriodoAcademicoDTO } from '../../src/presentacion/esquemas/periodoAcademicoEsquema';
import { PeriodoAcademicoEsquema } from '../../src/presentacion/esquemas/periodoAcademicoEsquema';

jest.mock('../../src/presentacion/esquemas/periodoAcademicoEsquema', () => {
    return {
        PeriodoAcademicoEsquema: {
            parse: jest.fn(),
        },
        PeriodoAcademicoDTO: {}, 
    };
});

class ZodError extends Error {
    issues: any[];
    constructor(issues: any[]) {
        super('Validación error');
        this.name = 'ZodError';
        this.issues = issues;
        this.message = JSON.stringify(issues, null, 2);
    }
}

class CasoUsoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CasoUsoError';
    }
}

const mockRequest = (body: any = {}, params: any = {}, query: any = {}) => ({
    body,
    params,
    query,
}) as FastifyRequest<any>;

const mockReply = () => {
    const reply: any = {};
    reply.code = jest.fn().mockReturnThis();
    reply.send = jest.fn().mockReturnThis();
    return reply as FastifyReply;
};

type Mocked<T> = {
    [P in keyof T]: jest.Mock<any>;
};

const mockPeriodoCasosUso: Mocked<IPeriodoAcademicoCasosUso> = {
    obtenerPeriodos: jest.fn(),
    obtenerPeriodoPorId: jest.fn(),
    crearPeriodo: jest.fn(),
    actualizarPeriodo: jest.fn(),
    eliminarPeriodo: jest.fn(),
};

const fechaInicio = new Date("2026-02-01");
const fechaFin = new Date("2026-06-30");

const mockPeriodoDTO: PeriodoAcademicoDTO = {
    semestre: "2026-1",
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    idEstado: 1,
};

const mockPeriodoEntity: IPeriodoAcademico = {
    idPeriodo: 10,
    ...mockPeriodoDTO,
};

const mockPeriodoRelacionado: IPeriodoRelacionado = {
    idPeriodo: 10,
    semestre: "2026-1",
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    estadoperiodo: "Preparación"
};

const mockListaPeriodos: IPeriodoAcademico[] = [mockPeriodoEntity];

describe('PeriodoAcademicoControlador', () => {
    let controlador: PeriodoAcademicoControlador;
    let reply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();
        controlador = new PeriodoAcademicoControlador(mockPeriodoCasosUso);
        reply = mockReply();
        (PeriodoAcademicoEsquema.parse as jest.Mock).mockImplementation((body) => body);
    });

    describe('listarPeriodos', () => {
        it('debe responder con 200 y la lista de periodos', async () => {
            const req = mockRequest({}, {}, { limite: 5 });
            mockPeriodoCasosUso.obtenerPeriodos.mockResolvedValue(mockListaPeriodos);

            await controlador.listarPeriodos(req, reply);

            expect(mockPeriodoCasosUso.obtenerPeriodos).toHaveBeenCalledWith(5);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Periodos académicos encontrados correctamente",
                periodos: mockListaPeriodos,
                periodosEncontrados: mockListaPeriodos.length,
            });
        });

        it('debe propagar el error si el caso de uso falla', async () => {
            const req = mockRequest();
            const error = new Error("Error DB");
            mockPeriodoCasosUso.obtenerPeriodos.mockRejectedValue(error);

            await expect(controlador.listarPeriodos(req, reply)).rejects.toThrow(error);
        });
    });

    describe('obtenerPeriodoPorId', () => {
        const idPeriodo = 10;

        it('debe responder con 200 y el periodo encontrado', async () => {
            const req = mockRequest({}, { idPeriodo });
            mockPeriodoCasosUso.obtenerPeriodoPorId.mockResolvedValue(mockPeriodoEntity);

            await controlador.obtenerPeriodoPorId(req, reply);

            expect(mockPeriodoCasosUso.obtenerPeriodoPorId).toHaveBeenCalledWith(idPeriodo);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Periodo académico encontrado correctamente",
                periodo: mockPeriodoEntity,
            });
        });

        it('debe propagar error si el periodo no existe', async () => {
            const req = mockRequest({}, { idPeriodo });
            const error = new CasoUsoError("No encontrado");
            mockPeriodoCasosUso.obtenerPeriodoPorId.mockRejectedValue(error);

            await expect(controlador.obtenerPeriodoPorId(req, reply)).rejects.toThrow(error);
        });
    });

    describe('crearPeriodo', () => {
        it('debe responder con 201 y el periodo creado', async () => {
            const req = mockRequest(mockPeriodoDTO);
            mockPeriodoCasosUso.crearPeriodo.mockResolvedValue(mockPeriodoRelacionado);

            await controlador.crearPeriodo(req, reply);

            expect(PeriodoAcademicoEsquema.parse).toHaveBeenCalledWith(mockPeriodoDTO);
            expect(mockPeriodoCasosUso.crearPeriodo).toHaveBeenCalledWith(mockPeriodoDTO);
            expect(reply.code).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "El periodo académico se creó correctamente",
                idNuevoPeriodo: mockPeriodoRelacionado,
            });
        });

        it('debe propagar el error si falla la validación Zod', async () => {
            const invalidData = { ...mockPeriodoDTO, idEstado: 99 };
            const req = mockRequest(invalidData);
            const zodError = new ZodError([{ path: ['idEstado'], message: 'Invalid state' }]);

            (PeriodoAcademicoEsquema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            await expect(controlador.crearPeriodo(req, reply)).rejects.toThrow(ZodError);
        });
    });

    describe('actualizarPeriodo', () => {
        const idPeriodo = 10;
        const updateData = { ...mockPeriodoDTO, idEstado: 2 };

        it('debe responder con 200 y el periodo actualizado', async () => {
            const req = mockRequest(updateData, { idPeriodo });
            const periodoActualizado = { ...mockPeriodoRelacionado, estadoperiodo: "Activo" };
            mockPeriodoCasosUso.actualizarPeriodo.mockResolvedValue(periodoActualizado);

            await controlador.actualizarPeriodo(req, reply);

            expect(PeriodoAcademicoEsquema.parse).toHaveBeenCalledWith(updateData);
            expect(mockPeriodoCasosUso.actualizarPeriodo).toHaveBeenCalledWith(idPeriodo, updateData);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Periodo académico actualizado correctamente",
                periodoActualizado: periodoActualizado,
            });
        });

        it('debe propagar error si falla el caso de uso (ej. traslape)', async () => {
            const req = mockRequest(updateData, { idPeriodo });
            const error = new Error("Traslape de fechas");
            mockPeriodoCasosUso.actualizarPeriodo.mockRejectedValue(error);

            await expect(controlador.actualizarPeriodo(req, reply)).rejects.toThrow(error);
        });
    });

    describe('eliminarPeriodo', () => {
        const idPeriodo = 10;

        it('debe responder con 200 tras eliminar correctamente', async () => {
            const req = mockRequest({}, { idPeriodo });
            mockPeriodoCasosUso.eliminarPeriodo.mockResolvedValue(mockPeriodoEntity);

            await controlador.eliminarPeriodo(req, reply);

            expect(mockPeriodoCasosUso.eliminarPeriodo).toHaveBeenCalledWith(idPeriodo);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Periodo académico eliminado correctamente",
                idPeriodo: idPeriodo,
            });
        });

        it('debe propagar error si no se puede eliminar', async () => {
            const req = mockRequest({}, { idPeriodo });
            const error = new Error("No se pudo eliminar");
            mockPeriodoCasosUso.eliminarPeriodo.mockRejectedValue(error);

            await expect(controlador.eliminarPeriodo(req, reply)).rejects.toThrow(error);
        });
    });
});