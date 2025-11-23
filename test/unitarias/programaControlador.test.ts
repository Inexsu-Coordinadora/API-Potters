import { FastifyRequest, FastifyReply } from 'fastify';
import { ProgramasControlador } from '../../src/presentacion/controladores/programaControlador';
import { IProgramaCasosUso } from '../../src/core/aplicacion/casos-uso/IProgramaCasosUso';
import { IPrograma } from '../../src/core/dominio/programa/IPrograma';
import { ProgramaDTO } from '../../src/presentacion/esquemas/programaAcademicoEsquema';
import { ProgramaEsquema } from '../../src/presentacion/esquemas/programaAcademicoEsquema';

jest.mock('../../src/presentacion/esquemas/programaAcademicoEsquema', () => {
    return {
        ProgramaEsquema: {
            parse: jest.fn(),
        },
        ProgramaDTO: {},
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

const mockProgramasCasosUso: Mocked<IProgramaCasosUso> = {
    obtenerPrograma: jest.fn(),
    obtenerProgramasPorId: jest.fn(),
    crearPrograma: jest.fn(),
    actualizarPrograma: jest.fn(),
    eliminarPrograma: jest.fn(),
};

const mockProgramaDTO: ProgramaDTO = {
    nombrePrograma: "Ingeniería de Sistemas",
    idNivel: 2,
    idModalidad: 1,
    duracionMeses: 60,
};

const mockProgramaEntity: IPrograma = {
    idPrograma: 10,
    ...mockProgramaDTO,
};

const mockListaProgramas: IPrograma[] = [mockProgramaEntity];

describe('ProgramasControlador', () => {
    let controlador: ProgramasControlador;
    let reply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();
        controlador = new ProgramasControlador(mockProgramasCasosUso);
        reply = mockReply();
        (ProgramaEsquema.parse as jest.Mock).mockImplementation((body) => body);
    });

    describe('obtenerPrograma', () => {
        it('debe responder con 200 y la lista de programas', async () => {
            const req = mockRequest({}, {}, { limite: 5 });
            mockProgramasCasosUso.obtenerPrograma.mockResolvedValue(mockListaProgramas);

            await controlador.obtenerPrograma(req, reply);

            expect(mockProgramasCasosUso.obtenerPrograma).toHaveBeenCalledWith(5);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Programas encontrados correctamente",
                programas: mockListaProgramas,
                programasEncontrados: mockListaProgramas.length,
            });
        });

        it('debe propagar el error si el caso de uso falla', async () => {
            const req = mockRequest();
            const error = new Error("Error DB");
            mockProgramasCasosUso.obtenerPrograma.mockRejectedValue(error);

            await expect(controlador.obtenerPrograma(req, reply)).rejects.toThrow(error);
        });
    });

    describe('obtenerProgramaPorId', () => {
        const idPrograma = 10;

        it('debe responder con 200 y el programa encontrado', async () => {
            const req = mockRequest({}, { idPrograma });
            mockProgramasCasosUso.obtenerProgramasPorId.mockResolvedValue(mockProgramaEntity);

            await controlador.obtenerProgramaPorId(req, reply);

            expect(mockProgramasCasosUso.obtenerProgramasPorId).toHaveBeenCalledWith(idPrograma);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Programa encontrado correctamente",
                programa: mockProgramaEntity,
            });
        });

        it('debe propagar error si el programa no existe', async () => {
            const req = mockRequest({}, { idPrograma });
            const error = new CasoUsoError("No encontrado");
            mockProgramasCasosUso.obtenerProgramasPorId.mockRejectedValue(error);

            await expect(controlador.obtenerProgramaPorId(req, reply)).rejects.toThrow(error);
        });
    });

    describe('crearPrograma', () => {
        it('debe responder con 201 y el programa creado (o ID)', async () => {
            const req = mockRequest(mockProgramaDTO);
            const idNuevoPrograma = "10";
            mockProgramasCasosUso.crearPrograma.mockResolvedValue(idNuevoPrograma);

            await controlador.crearPrograma(req, reply);

            expect(ProgramaEsquema.parse).toHaveBeenCalledWith(mockProgramaDTO);
            expect(mockProgramasCasosUso.crearPrograma).toHaveBeenCalledWith(mockProgramaDTO);
            expect(reply.code).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "El programa se creó correctamente",
                idNuevoPrograma: idNuevoPrograma,
            });
        });

        it('debe propagar el error si falla la validación Zod', async () => {
            const invalidData = { ...mockProgramaDTO, duracionMeses: "muchos" };
            const req = mockRequest(invalidData);
            const zodError = new ZodError([{ path: ['duracionMeses'], message: 'Invalid type' }]);

            (ProgramaEsquema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            await expect(controlador.crearPrograma(req, reply)).rejects.toThrow(ZodError);
        });
    });

    describe('actualizarPrograma', () => {
        const idPrograma = 10;
        const updateData = { ...mockProgramaDTO, duracionMeses: 72 };

        it('debe responder con 200 y el programa actualizado', async () => {
            const req = mockRequest(updateData, { idPrograma });
            const programaActualizado = { ...mockProgramaEntity, duracionMeses: 72 };
            mockProgramasCasosUso.actualizarPrograma.mockResolvedValue(programaActualizado);

            await controlador.actualizarPrograma(req, reply);

            expect(ProgramaEsquema.parse).toHaveBeenCalledWith(updateData);
            expect(mockProgramasCasosUso.actualizarPrograma).toHaveBeenCalledWith(idPrograma, updateData);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Programa actualizado correctamente",
                programaActualizado: programaActualizado,
            });
        });

        it('debe propagar error si falla el caso de uso', async () => {
            const req = mockRequest(updateData, { idPrograma });
            const error = new Error("Error al actualizar");
            mockProgramasCasosUso.actualizarPrograma.mockRejectedValue(error);

            await expect(controlador.actualizarPrograma(req, reply)).rejects.toThrow(error);
        });
    });

    describe('eliminarPrograma', () => {
        const idPrograma = 10;

        it('debe responder con 200 tras eliminar correctamente', async () => {
            const req = mockRequest({}, { idPrograma });
            mockProgramasCasosUso.eliminarPrograma.mockResolvedValue(mockProgramaEntity);

            await controlador.eliminarPrograma(req, reply);

            expect(mockProgramasCasosUso.eliminarPrograma).toHaveBeenCalledWith(idPrograma);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Programa eliminado correctamente",
                idPrograma: idPrograma,
            });
        });

        it('debe propagar error si no se puede eliminar', async () => {
            const req = mockRequest({}, { idPrograma });
            const error = new Error("No se pudo eliminar");
            mockProgramasCasosUso.eliminarPrograma.mockRejectedValue(error);

            await expect(controlador.eliminarPrograma(req, reply)).rejects.toThrow(error);
        });
    });
});