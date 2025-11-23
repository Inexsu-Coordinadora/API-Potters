import { FastifyRequest, FastifyReply } from 'fastify';
import { PlanEstudioControlador } from '../../src/presentacion/controladores/planEstudioControlador';
import { IPlanEstudioCasosUso } from '../../src/core/aplicacion/casos-uso/IPlanEstudioCasosUso';
import { IPlanEstudio } from '../../src/core/dominio/planEstudio/IPlanEstudio';
import { IPlanEstudioRelacionado } from '../../src/core/dominio/planEstudio/IPlanEstudioRelacionado';
import { PlanEstudioDTO } from '../../src/presentacion/esquemas/planEstudioEsquema';
import { PlanEstudioEsquema } from '../../src/presentacion/esquemas/planEstudioEsquema';

jest.mock('../../src/presentacion/esquemas/planEstudioEsquema', () => {
    return {
        PlanEstudioEsquema: {
            parse: jest.fn(),
        },
        PlanEstudioDTO: {}, 
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

const mockPlanEstudioCasosUso: Mocked<IPlanEstudioCasosUso> = {
    obtenerPlanEstudio: jest.fn(),
    obtenerPlanEstudioPorId: jest.fn(),
    crearPlanEstudio: jest.fn(),
    actualizarPlanEstudio: jest.fn(),
    eliminarPlanEstudio: jest.fn(),
};

const mockPlanDTO: PlanEstudioDTO = {
    idPrograma: 1,
    idAsignatura: 100,
    semestre: 2,
    creditos: 4,
};

const mockPlanEntity: IPlanEstudio = {
    idPlanEstudio: 50,
    ...mockPlanDTO,
};

const mockPlanRelacionado: IPlanEstudioRelacionado = {
    idPlanEstudio: 50,
    nombrePrograma: "Ingeniería",
    nombreAsignatura: "Programación",
    semestre: 2,
    creditos: 4
};

const mockListaPlanes: IPlanEstudio[] = [mockPlanEntity];

describe('PlanEstudioControlador', () => {
    let controlador: PlanEstudioControlador;
    let reply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();
        controlador = new PlanEstudioControlador(mockPlanEstudioCasosUso);
        reply = mockReply();
        (PlanEstudioEsquema.parse as jest.Mock).mockImplementation((body) => body);
    });

    describe('obtenerPlanEstudio', () => {
        it('debe responder con 200 y la lista de planes', async () => {
            const req = mockRequest({}, {}, { limite: 10 });
            mockPlanEstudioCasosUso.obtenerPlanEstudio.mockResolvedValue(mockListaPlanes);

            await controlador.obtenerPlanEstudio(req, reply);

            expect(mockPlanEstudioCasosUso.obtenerPlanEstudio).toHaveBeenCalledWith(10);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Plan de estudio encontrado correctamente",
                planesEstudio: mockListaPlanes,
                planesEstudioEncontrados: mockListaPlanes.length,
            });
        });

        it('debe propagar el error si el caso de uso falla', async () => {
            const req = mockRequest();
            const error = new Error("Error DB");
            mockPlanEstudioCasosUso.obtenerPlanEstudio.mockRejectedValue(error);

            await expect(controlador.obtenerPlanEstudio(req, reply)).rejects.toThrow(error);
        });
    });

    describe('obtenerPlanEstudioPorId', () => {
        const idPlanEstudio = 50;

        it('debe responder con 200 y el plan encontrado', async () => {
            const req = mockRequest({}, { idPlanEstudio });
            mockPlanEstudioCasosUso.obtenerPlanEstudioPorId.mockResolvedValue(mockPlanEntity);

            await controlador.obtenerPlanEstudioPorId(req, reply);

            expect(mockPlanEstudioCasosUso.obtenerPlanEstudioPorId).toHaveBeenCalledWith(idPlanEstudio);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Plan de estudio encontrado correctamente",
                planEstudio: mockPlanEntity,
            });
        });

        it('debe propagar error si el plan no existe', async () => {
            const req = mockRequest({}, { idPlanEstudio });
            const error = new CasoUsoError("No encontrado");
            mockPlanEstudioCasosUso.obtenerPlanEstudioPorId.mockRejectedValue(error);

            await expect(controlador.obtenerPlanEstudioPorId(req, reply)).rejects.toThrow(error);
        });
    });

    describe('crearPlanEstudio', () => {
        it('debe responder con 201 y el plan creado', async () => {
            const req = mockRequest(mockPlanDTO);
            mockPlanEstudioCasosUso.crearPlanEstudio.mockResolvedValue(mockPlanRelacionado);

            await controlador.crearPlanEstudio(req, reply);

            expect(PlanEstudioEsquema.parse).toHaveBeenCalledWith(mockPlanDTO);
            expect(mockPlanEstudioCasosUso.crearPlanEstudio).toHaveBeenCalledWith(mockPlanDTO);
            expect(reply.code).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "El plan de estudio se creó correctamente",
                idNuevoPlanEstudio: mockPlanRelacionado,
            });
        });

        it('debe propagar el error si falla la validación Zod', async () => {
            const invalidData = { ...mockPlanDTO, creditos: "muchos" };
            const req = mockRequest(invalidData);
            const zodError = new ZodError([{ path: ['creditos'], message: 'Invalid type' }]);

            (PlanEstudioEsquema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            await expect(controlador.crearPlanEstudio(req, reply)).rejects.toThrow(ZodError);
        });
    });

    describe('actualizarPlanEstudio', () => {
        const idPlanEstudio = 50;
        const updateData = { ...mockPlanDTO, creditos: 5 };

        it('debe responder con 200 y el plan actualizado', async () => {
            const req = mockRequest(updateData, { idPlanEstudio });
            const planActualizadoRelacionado = { ...mockPlanRelacionado, creditos: 5 };
            mockPlanEstudioCasosUso.actualizarPlanEstudio.mockResolvedValue(planActualizadoRelacionado);

            await controlador.actualizarPlanEstudio(req, reply);

            expect(PlanEstudioEsquema.parse).toHaveBeenCalledWith(updateData);
            expect(mockPlanEstudioCasosUso.actualizarPlanEstudio).toHaveBeenCalledWith(idPlanEstudio, updateData);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Plan de estudio actualizado correctamente",
                planEstudioActualizado: planActualizadoRelacionado,
            });
        });

        it('debe propagar error si falla el caso de uso', async () => {
            const req = mockRequest(updateData, { idPlanEstudio });
            const error = new Error("Error al actualizar");
            mockPlanEstudioCasosUso.actualizarPlanEstudio.mockRejectedValue(error);

            await expect(controlador.actualizarPlanEstudio(req, reply)).rejects.toThrow(error);
        });
    });

    describe('eliminarPlanEstudio', () => {
        const idPlanEstudio = 50;

        it('debe responder con 200 tras eliminar correctamente', async () => {
            const req = mockRequest({}, { idPlanEstudio });
            mockPlanEstudioCasosUso.eliminarPlanEstudio.mockResolvedValue(mockPlanEntity);

            await controlador.eliminarPlanEstudio(req, reply);

            expect(mockPlanEstudioCasosUso.eliminarPlanEstudio).toHaveBeenCalledWith(idPlanEstudio);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Plan de estudio eliminado correctamente",
                idPlanEstudio: idPlanEstudio,
            });
        });

        it('debe propagar error si no se puede eliminar', async () => {
            const req = mockRequest({}, { idPlanEstudio });
            const error = new Error("No se pudo eliminar");
            mockPlanEstudioCasosUso.eliminarPlanEstudio.mockRejectedValue(error);

            await expect(controlador.eliminarPlanEstudio(req, reply)).rejects.toThrow(error);
        });
    });
});