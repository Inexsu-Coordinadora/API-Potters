import { FastifyRequest, FastifyReply } from 'fastify';
import { OfertaControlador } from '../../src/presentacion/controladores/ofertaControlador';
import { IOfertaCasosUso } from '../../src/core/aplicacion/casos-uso/IOfertaCasosUso';
import { IOferta } from '../../src/core/dominio/oferta/IOferta';
import { IOfertaRelacionada } from '../../src/core/dominio/oferta/IOfertaRelacionada';
import { OfertaEsquema } from '../../src/presentacion/esquemas/ofertaEsquema';
import { OfertaDTO } from '../../src/presentacion/esquemas/ofertaEsquema';

jest.mock('../../src/presentacion/esquemas/ofertaEsquema', () => {
    return {
        OfertaEsquema: {
            parse: jest.fn(),
        },
        OfertaDTO: {},
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

const mockOfertaCasosUso: Mocked<IOfertaCasosUso> = {
    obtenerOfertas: jest.fn(),
    obtenerOfertaPorId: jest.fn(),
    crearOferta: jest.fn(),
    actualizarOferta: jest.fn(),
    eliminarOferta: jest.fn(),
};

const mockOfertaData: OfertaDTO = {
    idPrograma: 1,
    idPeriodo: 10,
    idAsignatura: 100,
    grupo: 1,
    cupo: 30,
};

const mockOfertaCompleta: IOferta = {
    idOferta: 500,
    ...mockOfertaData,
};

const mockOfertaRelacionada: IOfertaRelacionada = {
    idOferta: 500,
    nombrePrograma: "Ingeniería",
    semestre: "2026-1",
    nombreAsignatura: "Matemáticas",
    informacion: "Grupo 1 - Mañana"
};

const mockListaOfertas: IOferta[] = [mockOfertaCompleta];

describe('OfertaControlador', () => {
    let controlador: OfertaControlador;
    let reply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();
        controlador = new OfertaControlador(mockOfertaCasosUso);
        reply = mockReply();
        (OfertaEsquema.parse as jest.Mock).mockImplementation((body) => body);
    });

    describe('obtenerOfertas', () => {
        it('debe responder con 200 y la lista de ofertas', async () => {
            const req = mockRequest({}, {}, { limite: 5 });
            mockOfertaCasosUso.obtenerOfertas.mockResolvedValue(mockListaOfertas);

            await controlador.obtenerOfertas(req, reply);

            expect(mockOfertaCasosUso.obtenerOfertas).toHaveBeenCalledWith(5);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Ofertas encontradas correctamente",
                ofertas: mockListaOfertas,
                ofertasEncontradas: mockListaOfertas.length,
            });
        });

        it('debe propagar el error si el caso de uso falla', async () => {
            const req = mockRequest();
            const error = new Error("Error DB");
            mockOfertaCasosUso.obtenerOfertas.mockRejectedValue(error);

            await expect(controlador.obtenerOfertas(req, reply)).rejects.toThrow(error);
        });
    });

    describe('obtenerOfertaPorId', () => {
        const idOferta = 500;

        it('debe responder con 200 y la oferta encontrada', async () => {
            const req = mockRequest({}, { idOferta });
            mockOfertaCasosUso.obtenerOfertaPorId.mockResolvedValue(mockOfertaCompleta);

            await controlador.obtenerOfertaPorId(req, reply);

            expect(mockOfertaCasosUso.obtenerOfertaPorId).toHaveBeenCalledWith(idOferta);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Oferta encontrada correctamente",
                oferta: mockOfertaCompleta,
            });
        });

        it('debe propagar error si la oferta no existe', async () => {
            const req = mockRequest({}, { idOferta });
            const error = new CasoUsoError("No encontrada");
            mockOfertaCasosUso.obtenerOfertaPorId.mockRejectedValue(error);

            await expect(controlador.obtenerOfertaPorId(req, reply)).rejects.toThrow(error);
        });
    });

    describe('crearOferta', () => {
        it('debe responder con 201 y la oferta creada (ID)', async () => {
            const req = mockRequest(mockOfertaData);
            mockOfertaCasosUso.crearOferta.mockResolvedValue(mockOfertaRelacionada);

            await controlador.crearOferta(req, reply);

            expect(OfertaEsquema.parse).toHaveBeenCalledWith(mockOfertaData);
            expect(mockOfertaCasosUso.crearOferta).toHaveBeenCalledWith(mockOfertaData);
            expect(reply.code).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "La oferta se creó correctamente",
                ofertaCreada: mockOfertaRelacionada,
            });
        });

        it('debe propagar el error si falla la validación Zod', async () => {
            const invalidData = { ...mockOfertaData, cupo: "muchos" };
            const req = mockRequest(invalidData);
            const zodError = new ZodError([{ path: ['cupo'], message: 'Invalid type' }]);

            (OfertaEsquema.parse as jest.Mock).mockImplementation(() => {
                throw zodError;
            });

            await expect(controlador.crearOferta(req, reply)).rejects.toThrow(ZodError);
        });
    });

    describe('actualizarOferta', () => {
        const idOferta = 500;
        const updateData = { ...mockOfertaData, cupo: 40 };

        it('debe responder con 200 y la oferta actualizada', async () => {
            const req = mockRequest(updateData, { idOferta });
            const ofertaActualizadaRelacionada = { ...mockOfertaRelacionada, idOferta: 500 };
            mockOfertaCasosUso.actualizarOferta.mockResolvedValue(ofertaActualizadaRelacionada);

            await controlador.actualizarOferta(req, reply);

            expect(OfertaEsquema.parse).toHaveBeenCalledWith(updateData);
            expect(mockOfertaCasosUso.actualizarOferta).toHaveBeenCalledWith(idOferta, updateData);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Oferta actualizada correctamente",
                OfertaActualizada: ofertaActualizadaRelacionada,
            });
        });

        it('debe propagar error si falla el caso de uso', async () => {
            const req = mockRequest(updateData, { idOferta });
            const error = new Error("Error al actualizar");
            mockOfertaCasosUso.actualizarOferta.mockRejectedValue(error);

            await expect(controlador.actualizarOferta(req, reply)).rejects.toThrow(error);
        });
    });

    describe('eliminarOferta', () => {
        const idOferta = 500;

        it('debe responder con 200 tras eliminar correctamente', async () => {
            const req = mockRequest({}, { idOferta });
            mockOfertaCasosUso.eliminarOferta.mockResolvedValue(mockOfertaCompleta);

            await controlador.eliminarOferta(req, reply);

            expect(mockOfertaCasosUso.eliminarOferta).toHaveBeenCalledWith(idOferta);
            expect(reply.code).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith({
                mensaje: "Oferta eliminada correctamente",
                idOferta: idOferta,
            });
        });

        it('debe propagar error si no se puede eliminar', async () => {
            const req = mockRequest({}, { idOferta });
            const error = new Error("No se pudo eliminar");
            mockOfertaCasosUso.eliminarOferta.mockRejectedValue(error);

            await expect(controlador.eliminarOferta(req, reply)).rejects.toThrow(error);
        });
    });
});