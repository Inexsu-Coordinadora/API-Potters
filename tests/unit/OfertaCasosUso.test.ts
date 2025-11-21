// Importaciones de Casos de Uso, Mocks de Repositorios e Interfaces
import { OfertaCasosUso } from "../../src/core/aplicacion/casos-uso/OfertaCasosUso";
import { IOferta } from "../../src/core/dominio/oferta/IOferta";
import { IOfertaRelacionada } from "../../src/core/dominio/oferta/IOfertaRelacionada";

// Interfaces de Repositorios (para tipado de mocks)
import { IPeriodoAcademicoRepositorio } from "../../src/core/dominio/repositorio/IPeriodoAcademicoRepositorio";
import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { IProgramaRepositorio } from "../../src/core/dominio/repositorio/IProgramaRepositorio";
import { IOfertaRepositorio } from "../../src/core/dominio/repositorio/IOfertaRepositorio";

// Interfaces de Dominio (para tipado de datos de mock)
import { IPeriodoAcademico } from "../../src/core/dominio/periodoAcademico/IPeriodoAcademico";
import { IAsignatura } from "../../src/core/dominio/asignatura/IAsignatura";
import { IPrograma } from "../../src/core/dominio/programa/IPrograma";

// --- MOCK DE CLASE DE DOMINIO: PeriodoAcademico ---
// Mockeamos la clase PeriodoAcademico para controlar su método de validación interna.
// Esto nos permite simular estados sin depender del enum 'estadoPeriodoAcademico' faltante.
const mockValidarEstado = jest.fn();

// Se asume que PeriodoAcademico está en la ruta relativa correcta.
jest.mock('../../src/core/dominio/periodoAcademico/PeriodoAcademico', () => {
    // Retornamos un constructor simulado que devuelve un objeto con la función espiada
    const mockPeriodoAcademico = jest.fn().mockImplementation((periodo: any) => {
        return {
            validarEstado: mockValidarEstado,
            // Las propiedades de IPeriodoAcademico se pueden simular si fueran necesarias,
            // pero para el CU solo se llama al constructor y luego a validarEstado.
        };
    });
    return { PeriodoAcademico: mockPeriodoAcademico };
});


// --- Datos de MOCK comunes para todas las pruebas ---

// Mock de entrada DTO (IOferta)
const MOCK_DATOS_OFERTA: IOferta = {
    idPrograma: 1,
    idPeriodo: 10,
    idAsignatura: 5,
    grupo: 1,
    cupo: 50,
};

// Mock de retorno de IPeriodoAcademico - Estado Activo (idEstado=2)
const MOCK_PERIODO_ACTIVO: IPeriodoAcademico = {
    idPeriodo: 10,
    semestre: "2024-II",
    fechaInicio: new Date("2024-07-01"),
    fechaFin: new Date("2024-12-31"),
    idEstado: 2, // Estado Activo
};

// Mocks de existencias de dependencias (tipado con las interfaces proporcionadas)
const MOCK_ASIGNATURA_EXISTENTE: IAsignatura = {
    idAsignatura: 5,
    nombreAsignatura: 'Matemáticas Avanzadas',
    cargaHoraria: 4,
    idFormato: 1,
};

const MOCK_PROGRAMA_EXISTENTE: IPrograma = {
    idPrograma: 1,
    nombrePrograma: 'Ingeniería de Sistemas',
    idNivel: 3,
    idModalidad: 1,
    duracionMeses: 60,
};

// Mock de objeto relacionado (IOfertaRelacionada)
const MOCK_OFERTA_RELACIONADA: IOfertaRelacionada = {
    idOferta: 100,
    nombrePrograma: MOCK_PROGRAMA_EXISTENTE.nombrePrograma,
    semestre: MOCK_PERIODO_ACTIVO.semestre,
    nombreAsignatura: MOCK_ASIGNATURA_EXISTENTE.nombreAsignatura,
    informacion: "Grupo 1 / Cupo 50",
};


// --- ESTRUCTURA DE PRUEBAS ---
describe("OfertaCasosUso", () => {
    let casosUso: OfertaCasosUso;

    // Los Mocks tipados se inicializan AQUI (globalmente) para que it.each pueda acceder a sus métodos.
    const mockOfertaRepositorio: jest.Mocked<IOfertaRepositorio> = {
        listarOfertas: jest.fn(),
        obtenerOfertaPorId: jest.fn(),
        crearOferta: jest.fn(), // << MOCK PERSISTENCIA 1
        actualizarOferta: jest.fn(), // << MOCK PERSISTENCIA 2
        eliminarOferta: jest.fn(),
        existeOfertaDuplicada: jest.fn(),
        obtenerOfertaRelacionada: jest.fn(),
    } as jest.Mocked<IOfertaRepositorio>;

    const mockAsignaturaRepositorio: jest.Mocked<IAsignaturaRepositorio> = {
        crearAsignatura: jest.fn(),
        listarAsignaturas: jest.fn(),
        obtenerAsignaturaPorId: jest.fn(), 
        actualizarAsignatura: jest.fn(),
        eliminarAsignatura: jest.fn(),
    } as jest.Mocked<IAsignaturaRepositorio>;

    const mockProgramaRepositorio: jest.Mocked<IProgramaRepositorio> = {
        crearPrograma: jest.fn(),
        listarPrograma: jest.fn(), 
        obtenerProgramaPorId: jest.fn(), 
        actualizarPrograma: jest.fn(),
        eliminarPrograma: jest.fn(),
    } as jest.Mocked<IProgramaRepositorio>;

    const mockPeriodoRepositorio: jest.Mocked<IPeriodoAcademicoRepositorio> = {
        crearPeriodo: jest.fn(),
        listarPeriodos: jest.fn(),
        obtenerPeriodoPorId: jest.fn(), 
        actualizarPeriodo: jest.fn(),
        eliminarPeriodo: jest.fn(),
        consultarTraslapeFechas: jest.fn(),
        obtenerPeriodoRelacionado: jest.fn(),
    } as jest.Mocked<IPeriodoAcademicoRepositorio>;

    beforeEach(() => {
        // --- FIX: Limpiar los contadores de llamadas de los Mocks de Persistencia ---
        // Esto es crucial para que las aserciones `not.toHaveBeenCalled()` funcionen
        // en las pruebas que esperan que se lance una excepción.
        mockOfertaRepositorio.crearOferta.mockClear();
        mockOfertaRepositorio.actualizarOferta.mockClear();
        
        // Limpiamos los mocks de validación y de obtención de dependencias
        mockValidarEstado.mockClear();
        mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockClear();
        mockProgramaRepositorio.obtenerProgramaPorId.mockClear();
        mockPeriodoRepositorio.obtenerPeriodoPorId.mockClear();
        mockOfertaRepositorio.existeOfertaDuplicada.mockClear();

        // Inyección de dependencias
        casosUso = new OfertaCasosUso(
            mockOfertaRepositorio,
            mockAsignaturaRepositorio,
            mockProgramaRepositorio,
            mockPeriodoRepositorio
        );

        // Configuramos el camino feliz por defecto para los métodos de creación/actualización
        mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(MOCK_ASIGNATURA_EXISTENTE);
        mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(MOCK_PROGRAMA_EXISTENTE);
        mockPeriodoRepositorio.obtenerPeriodoPorId.mockResolvedValue(MOCK_PERIODO_ACTIVO);
        
        // Simulación del resultado de la validación exitosa (lo que el CU espera)
        mockValidarEstado.mockReturnValue("periodo activo"); 
        
        mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(false);
    });

    // --- PRUEBAS DE CONSULTA BÁSICAS ---

    describe("Métodos de consulta básicos", () => {
        it("debe obtener lista de ofertas y llamar al repositorio con el límite correcto", async () => {
            // Arreglar
            const listaOfertas: IOferta[] = [{ ...MOCK_DATOS_OFERTA, idOferta: 1 }];
            mockOfertaRepositorio.listarOfertas.mockResolvedValue(listaOfertas);

            // Actuar
            const resultado = await casosUso.obtenerOfertas(10);

            // Afirmar
            expect(mockOfertaRepositorio.listarOfertas).toHaveBeenCalledWith(10);
            expect(resultado).toEqual(listaOfertas);
        });

        it("debe retornar una oferta por ID y llamar al repositorio", async () => {
            // Arreglar
            mockOfertaRepositorio.obtenerOfertaPorId.mockResolvedValue({ ...MOCK_DATOS_OFERTA, idOferta: 100 });

            // Actuar
            const resultado = await casosUso.obtenerOfertaPorId(100);

            // Afirmar
            expect(mockOfertaRepositorio.obtenerOfertaPorId).toHaveBeenCalledWith(100);
            expect(resultado).not.toBeNull();
        });
    });

    // --- PRUEBAS DE CREACIÓN DE OFERTA (Lógica de Negocio) ---

    describe("crearOferta", () => {
        const ID_NUEVA_OFERTA = 100;

        beforeEach(() => {
            mockOfertaRepositorio.crearOferta.mockResolvedValue(ID_NUEVA_OFERTA);
            mockOfertaRepositorio.obtenerOfertaRelacionada.mockResolvedValue(MOCK_OFERTA_RELACIONADA);
        });

        it("debe crear una oferta exitosamente cuando todas las validaciones pasan", async () => {
            // Actuar
            const resultado = await casosUso.crearOferta(MOCK_DATOS_OFERTA);

            // Afirmar
            expect(mockAsignaturaRepositorio.obtenerAsignaturaPorId).toHaveBeenCalled();
            // Notar que el CU llama a obtenerProgramaPorId, no a listarPrograma.
            expect(mockProgramaRepositorio.obtenerProgramaPorId).toHaveBeenCalled(); 
            expect(mockPeriodoRepositorio.obtenerPeriodoPorId).toHaveBeenCalled();
            expect(mockOfertaRepositorio.existeOfertaDuplicada).toHaveBeenCalledWith(MOCK_DATOS_OFERTA);
            expect(mockValidarEstado).toHaveBeenCalled();
            expect(mockOfertaRepositorio.crearOferta).toHaveBeenCalledWith(MOCK_DATOS_OFERTA);
            expect(resultado).toEqual(MOCK_OFERTA_RELACIONADA);
        });

        it("debe lanzar un error si ya existe una oferta duplicada", async () => {
            // Arreglar: Duplicidad existe
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(true);

            // Actuar y Afirmar
            await expect(casosUso.crearOferta(MOCK_DATOS_OFERTA)).rejects.toThrow(
                "Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico"
            );
            // Esta aserción ahora debe pasar porque el mock fue limpiado en beforeEach
            expect(mockOfertaRepositorio.crearOferta).not.toHaveBeenCalled(); 
        });

        it.each([
            ["Asignatura", "No se encontró la asignatura ingresada", mockAsignaturaRepositorio.obtenerAsignaturaPorId],
            ["Programa", "No se encontró el programa ingresado", mockProgramaRepositorio.obtenerProgramaPorId],
            ["Periodo", "No se encontró el periodo ingresado", mockPeriodoRepositorio.obtenerPeriodoPorId],
        ])("debe lanzar un error si la dependencia de %s no existe", async (dependencia, mensajeEsperado, mockRepoCall) => {
            // Arreglar: La dependencia mockeada retorna null
            mockRepoCall.mockResolvedValue(null);

            // Actuar y Afirmar
            await expect(casosUso.crearOferta(MOCK_DATOS_OFERTA)).rejects.toThrow(
                mensajeEsperado
            );
            // Esta aserción ahora debe pasar
            expect(mockOfertaRepositorio.crearOferta).not.toHaveBeenCalled();
        });


        it("debe lanzar un error si el Periodo Académico no está activo (ejemplo: Preparación)", async () => {
            // Arreglar: El Periodo Académico existe pero no está activo
            const mensajeError = "El periodo está en preparacion"; // Coincide con la lógica de PeriodoAcademico.ts
            mockValidarEstado.mockReturnValue(mensajeError);

            // Actuar y Afirmar
            await expect(casosUso.crearOferta(MOCK_DATOS_OFERTA)).rejects.toThrow(
                mensajeError
            );
            expect(mockValidarEstado).toHaveBeenCalled();
            // Esta aserción ahora debe pasar
            expect(mockOfertaRepositorio.crearOferta).not.toHaveBeenCalled();
        });
    });

    // --- PRUEBAS DE ACTUALIZACIÓN DE OFERTA ---

    describe("actualizarOferta", () => {
        const ID_A_ACTUALIZAR = 101;
        const NUEVOS_DATOS: IOferta = { ...MOCK_DATOS_OFERTA, cupo: 70 };
        const OFERTA_ACTUALIZADA: IOfertaRelacionada = { ...MOCK_OFERTA_RELACIONADA, informacion: "Grupo 1 / Cupo 70" };

        beforeEach(() => {
            mockOfertaRepositorio.actualizarOferta.mockResolvedValue(undefined as any); // Devuelve void
            mockOfertaRepositorio.obtenerOfertaRelacionada.mockResolvedValue(OFERTA_ACTUALIZADA);
        });

        it("debe actualizar una oferta exitosamente cuando todas las validaciones pasan", async () => {
            // Actuar
            const resultado = await casosUso.actualizarOferta(ID_A_ACTUALIZAR, NUEVOS_DATOS);

            // Afirmar
            expect(mockOfertaRepositorio.existeOfertaDuplicada).toHaveBeenCalledWith(NUEVOS_DATOS);
            expect(mockValidarEstado).toHaveBeenCalled();
            expect(mockOfertaRepositorio.actualizarOferta).toHaveBeenCalledWith(ID_A_ACTUALIZAR, NUEVOS_DATOS);
            expect(resultado).toEqual(OFERTA_ACTUALIZADA);
        });

        it("debe lanzar un error si los datos actualizados causan duplicidad", async () => {
            // Arreglar: Duplicidad existe
            mockOfertaRepositorio.existeOfertaDuplicada.mockResolvedValue(true);

            // Actuar y Afirmar
            await expect(casosUso.actualizarOferta(ID_A_ACTUALIZAR, NUEVOS_DATOS)).rejects.toThrow(
                "Ya existe un grupo matriculado con la misma asignatura, programa y periodo académico"
            );
            // Esta aserción ahora debe pasar
            expect(mockOfertaRepositorio.actualizarOferta).not.toHaveBeenCalled();
        });

        it("debe lanzar un error si el Periodo Académico no está activo", async () => {
            // Arreglar: El Periodo Académico existe pero no está activo
            const mensajeError = "El periodo está cerrado"; // Otro caso de PeriodoAcademico.ts
            mockValidarEstado.mockReturnValue(mensajeError);

            // Actuar y Afirmar
            await expect(casosUso.actualizarOferta(ID_A_ACTUALIZAR, NUEVOS_DATOS)).rejects.toThrow(
                mensajeError
            );
            expect(mockValidarEstado).toHaveBeenCalled();
            // Esta aserción ahora debe pasar
            expect(mockOfertaRepositorio.actualizarOferta).not.toHaveBeenCalled();
        });
    });

    // --- PRUEBAS DE ELIMINACIÓN DE OFERTA ---

    describe("eliminarOferta", () => {
        it("debe llamar al repositorio para eliminar una oferta y retornar el objeto eliminado", async () => {
            // Arreglar
            mockOfertaRepositorio.eliminarOferta.mockResolvedValue(MOCK_DATOS_OFERTA);

            // Actuar
            const resultado = await casosUso.eliminarOferta(102);

            // Afirmar
            expect(mockOfertaRepositorio.eliminarOferta).toHaveBeenCalledWith(102);
            expect(resultado).toEqual(MOCK_DATOS_OFERTA);
        });

        it("debe retornar null si la oferta a eliminar no existe", async () => {
            // Arreglar
            mockOfertaRepositorio.eliminarOferta.mockResolvedValue(null);

            // Actuar
            const resultado = await casosUso.eliminarOferta(999);

            // Afirmar
            expect(mockOfertaRepositorio.eliminarOferta).toHaveBeenCalledWith(999);
            expect(resultado).toBeNull();
        });
    });
});