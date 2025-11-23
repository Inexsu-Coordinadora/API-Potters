import { FastifyRequest, FastifyReply } from 'fastify';
import { AsignaturasControlador } from '../../src/presentacion/controladores/asignaturaControlador';
import { IAsignatura } from '../../src/core/dominio/asignatura/IAsignatura';
import { IAsignaturaCasosUso } from '../../src/core/aplicacion/casos-uso/IAsignaturaCasosUso';
import { AsignaturaEsquema } from '../../src/presentacion/esquemas/asignaturaEsquema';

jest.mock('../../src/presentacion/esquemas/asignaturaEsquema', () => {
    return {
        AsignaturaEsquema: {
            parse: jest.fn(),
        },
        AsignaturaDTO: {}, 
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

class CasoUsoAsignaturaNoEncontrada extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CasoUsoAsignaturaNoEncontrada';
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
const mockAsignaturaCasosUso: Mocked<IAsignaturaCasosUso> = {
    obtenerAsignaturas: jest.fn(),
    obtenerAsignaturasPorId: jest.fn(),
    crearAsignatura: jest.fn(),
    actualizarAsignatura: jest.fn(),
    eliminarAsignatura: jest.fn(),
};

const mockAsignaturaData: IAsignatura = {
    nombreAsignatura: 'Matemáticas',
    cargaHoraria: 60, 
    idFormato: 1,
};

const mockAsignaturaCompleta: IAsignatura = { idAsignatura: 42, ...mockAsignaturaData };

const mockAsignaturas: IAsignatura[] = [
    mockAsignaturaCompleta,
    { idAsignatura: 43, ...mockAsignaturaData, nombreAsignatura: 'Física' },
];

describe('AsignaturasControlador (Fastify)', () => {
    let controlador: AsignaturasControlador;
    let reply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();
        controlador = new AsignaturasControlador(mockAsignaturaCasosUso);
        reply = mockReply();
        (AsignaturaEsquema.parse as jest.Mock).mockImplementation((body) => body);
    });

    describe('obtenerAsignaturas', () => {
        it('debe responder con 200 y una lista de asignaturas sin límite', async () => {
            const req = mockRequest({}, {}, {});
            mockAsignaturaCasosUso.obtenerAsignaturas.mockResolvedValue(mockAsignaturas);

            await controlador.obtenerAsignaturas(req, reply);

            expect(mockAsignaturaCasosUso.obtenerAsignaturas).toHaveBeenCalledWith(undefined);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: 'Asignaturas encontradas correctamente',
                asignaturas: mockAsignaturas,
                asignaturasEncontradas: mockAsignaturas.length,
            });
        });

        it('debe responder con 200 y una lista de asignaturas con límite', async () => {
            const req = mockRequest({}, {}, { limite: 10 });
            mockAsignaturaCasosUso.obtenerAsignaturas.mockResolvedValue([mockAsignaturaCompleta]);

            await controlador.obtenerAsignaturas(req, reply);

            expect(mockAsignaturaCasosUso.obtenerAsignaturas).toHaveBeenCalledWith(10);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalled();
        });

        it('debe propagar (throw) el error si el caso de uso falla', async () => {
            const req = mockRequest({}, {}, {});
            const error = new Error('Error de base de datos');
            mockAsignaturaCasosUso.obtenerAsignaturas.mockRejectedValue(error);

            await expect(controlador.obtenerAsignaturas(req, reply)).rejects.toThrow(error);
            expect(reply.send).not.toHaveBeenCalled();
        });
    });

    describe('obtenerAsignaturaPorId', () => {
        const idAsignatura = 42;

        it('debe responder con 200 y la asignatura encontrada', async () => {
            const req = mockRequest({}, { idAsignatura });
            mockAsignaturaCasosUso.obtenerAsignaturasPorId.mockResolvedValue(mockAsignaturaCompleta);

            await controlador.obtenerAsignaturaPorId(req, reply);

            expect(mockAsignaturaCasosUso.obtenerAsignaturasPorId).toHaveBeenCalledWith(idAsignatura);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: 'Asignatura encontrada correctamente',
                asignatura: mockAsignaturaCompleta,
            });
        });

        it('debe propagar (throw) un error si el caso de uso falla (No Encontrado)', async () => {
            const req = mockRequest({}, { idAsignatura });
            const error = new CasoUsoAsignaturaNoEncontrada('Asignatura no encontrada');
            mockAsignaturaCasosUso.obtenerAsignaturasPorId.mockRejectedValue(error);

            await expect(controlador.obtenerAsignaturaPorId(req, reply)).rejects.toThrow(error);
        });
    });

    describe('crearAsignatura', () => {
        it('debe responder con 201 y el ID de la nueva asignatura', async () => {
            const req = mockRequest(mockAsignaturaData);
            const newId = 50;
            mockAsignaturaCasosUso.crearAsignatura.mockResolvedValue(newId);
            
            await controlador.crearAsignatura(req, reply);

            expect(AsignaturaEsquema.parse).toHaveBeenCalledWith(mockAsignaturaData);
            expect(mockAsignaturaCasosUso.crearAsignatura).toHaveBeenCalledWith(mockAsignaturaData);
            expect(reply.code).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: 'La asignatura: ' + mockAsignaturaData.nombreAsignatura + ' se creó correctamente',
                idNuevaAsignatura: newId,
            });
        });

        it('debe propagar (throw) ZodError si la validación del esquema falla', async () => {
            const invalidData = { ...mockAsignaturaData, cargaHoraria: 'sesenta' }; 
            const req = mockRequest(invalidData);
            const zodIssues = [{ 
                code: 'invalid_type', 
                path: ['cargaHoraria'], 
                message: 'La cargaHoraria debe ser un campo obligatorio', 
                expected: 'number',
                received: 'NaN'
            }];
            const zodError = new ZodError(zodIssues);

            (AsignaturaEsquema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });
            
            await expect(controlador.crearAsignatura(req, reply)).rejects.toThrow(ZodError);
            
            await expect(controlador.crearAsignatura(req, reply)).rejects.toThrow(zodError.message);
            
            expect(reply.send).not.toHaveBeenCalled();
        });
    });

    describe('actualizarAsignatura', () => {
        const idAsignatura = 42;
        const updateData: IAsignatura = {
            ...mockAsignaturaData,
            nombreAsignatura: 'Matemáticas',
        };

        it('debe responder con 200 y el objeto de asignatura actualizado', async () => {
            const req = mockRequest(updateData, { idAsignatura });
            const result = { idAsignatura, ...updateData };
            mockAsignaturaCasosUso.actualizarAsignatura.mockResolvedValue(result);

            await controlador.actualizarAsignatura(req, reply);

            expect(AsignaturaEsquema.parse).toHaveBeenCalledWith(updateData);
            expect(mockAsignaturaCasosUso.actualizarAsignatura).toHaveBeenCalledWith(
                idAsignatura,
                updateData
            );
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: 'Asignatura actualizada correctamente',
                asignaturaActualizada: result,
            });
        });

        it('debe propagar (throw) un error si el caso de uso falla (No Encontrado)', async () => {
            const req = mockRequest(updateData, { idAsignatura });
            const error = new CasoUsoAsignaturaNoEncontrada('Asignatura a actualizar no existe');
            mockAsignaturaCasosUso.actualizarAsignatura.mockRejectedValue(error);

            await expect(controlador.actualizarAsignatura(req, reply)).rejects.toThrow(error);
        });
    });

    describe('eliminarAsignatura', () => {
        const idAsignatura = 42;

        it('debe responder con 200 tras la eliminación exitosa', async () => {
            const req = mockRequest({}, { idAsignatura });
            mockAsignaturaCasosUso.eliminarAsignatura.mockResolvedValue(true);

            await controlador.eliminarAsignatura(req, reply);

            expect(mockAsignaturaCasosUso.eliminarAsignatura).toHaveBeenCalledWith(idAsignatura);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: 'Asignatura eliminada correctamente',
                idAsignatura: idAsignatura,
            });
        });

        it('debe propagar (throw) un error si el caso de uso falla (No Encontrado)', async () => {
            const req = mockRequest({}, { idAsignatura });
            const error = new CasoUsoAsignaturaNoEncontrada('Asignatura a eliminar no existe');
            mockAsignaturaCasosUso.eliminarAsignatura.mockRejectedValue(error);

            await expect(controlador.eliminarAsignatura(req, reply)).rejects.toThrow(error);
        });
    });
});