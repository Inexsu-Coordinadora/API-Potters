import { PlanEstudioCasosUso } from "../../src/core/aplicacion/casos-uso/PlanEstudioCasosUso";
import { IPlanEstudioRepositorio } from "../../src/core/dominio/repositorio/IPlanEstudioRepositorio";
import { IProgramaRepositorio } from "../../src/core/dominio/repositorio/IProgramaRepositorio";
import { IAsignaturaRepositorio } from "../../src/core/dominio/repositorio/IAsignaturaRepositorio";
import { PlanEstudioDTO } from "../../src/presentacion/esquemas/planEstudioEsquema";
import { IPlanEstudio } from "../../src/core/dominio/planEstudio/IPlanEstudio";
import { IPlanEstudioRelacionado } from "../../src/core/dominio/planEstudio/IPlanEstudioRelacionado";
import { ValidacionError } from "../../src/core/dominio/errores/validacionError";

// --- Datos de MOCK comunes para todas las pruebas ---

// MOCK DTO (Entrada de datos)
const MOCK_PLAN_ESTUDIO_DTO: PlanEstudioDTO = {
    idPrograma: 1,
    idAsignatura: 10,
    semestre: 3,
    creditos: 5,
};

// MOCK IPlanEstudio (Objeto base sin relaciones)
const MOCK_PLAN_ESTUDIO_BASE: IPlanEstudio = {
    idPlanEstudio: 50,
    idPrograma: 1,
    idAsignatura: 10,
    semestre: 3,
    creditos: 5,
};

// MOCK IPlanEstudioRelacionado (Objeto de salida con nombres de programas/asignaturas)
const MOCK_PLAN_ESTUDIO_RELACIONADO: IPlanEstudioRelacionado = {
    idPlanEstudio: 50,
    nombrePrograma: 'Ingeniería de Sistemas',
    nombreAsignatura: 'Algoritmos I',
    semestre: 3,
    creditos: 5,
};

// MOCK para existencia de Programa
const MOCK_PROGRAMA_EXISTENTE = { idPrograma: 1, nombre: 'Ingeniería de Sistemas' };

// MOCK para existencia de Asignatura
const MOCK_ASIGNATURA_EXISTENTE = {
    idAsignatura: 10,
    nombreAsignatura: 'Algoritmos I',
    cargaHoraria: 4, 
    idFormato: 1 
};


// --- ESTRUCTURA DE PRUEBAS ---
describe("PlanEstudioCasosUso", () => {
    let casosUso: PlanEstudioCasosUso;
    
    // Mocks tipados de los repositorios
    let mockPlanEstudioRepositorio: jest.Mocked<IPlanEstudioRepositorio>;
    let mockProgramaRepositorio: jest.Mocked<IProgramaRepositorio>;
    let mockAsignaturaRepositorio: jest.Mocked<IAsignaturaRepositorio>;

    beforeEach(() => {
        // Inicialización completa de IPlanEstudioRepositorio
        mockPlanEstudioRepositorio = {
            listarPlanEstudio: jest.fn(),
            obtenerPlanEstudioPorId: jest.fn(),
            crearPlanEstudio: jest.fn(),
            actualizarPlanEstudio: jest.fn(),
            eliminarPlanEstudio: jest.fn(),
            existeDuplicidad: jest.fn(),
            obtenerPlanEstudioRelacionado: jest.fn(),
        } as jest.Mocked<IPlanEstudioRepositorio>;

        // CORRECCIÓN: Cambiado de 'listarProgramas' a 'listarPrograma' para coincidir con la interfaz.
        mockProgramaRepositorio = {
            obtenerProgramaPorId: jest.fn(),
            listarPrograma: jest.fn(), // <--- CORRECCIÓN AQUI
            crearPrograma: jest.fn(),
            actualizarPrograma: jest.fn(),
            eliminarPrograma: jest.fn(),
            obtenerProgramaRelacionado: jest.fn(),
        } as jest.Mocked<IProgramaRepositorio>;

        // Inicialización completa de IAsignaturaRepositorio
        mockAsignaturaRepositorio = {
            obtenerAsignaturaPorId: jest.fn(),
            listarAsignaturas: jest.fn(),
            crearAsignatura: jest.fn(),
            actualizarAsignatura: jest.fn(),
            eliminarAsignatura: jest.fn(),
        } as jest.Mocked<IAsignaturaRepositorio>;


        // Inyección de dependencias
        casosUso = new PlanEstudioCasosUso(
            mockPlanEstudioRepositorio,
            mockProgramaRepositorio,
            mockAsignaturaRepositorio
        );
    });

    // --- PRUEBAS DE CONSULTA BÁSICAS ---

    describe("Métodos de consulta básicos", () => {
        it("debe obtener lista de planes de estudio y llamar al repositorio con el límite correcto", async () => {
            // Arreglar
            mockPlanEstudioRepositorio.listarPlanEstudio.mockResolvedValue([MOCK_PLAN_ESTUDIO_BASE]);

            // Actuar
            const resultado = await casosUso.obtenerPlanEstudio(10);

            // Afirmar
            expect(mockPlanEstudioRepositorio.listarPlanEstudio).toHaveBeenCalledWith(10);
            expect(resultado).toEqual([MOCK_PLAN_ESTUDIO_BASE]);
        });

        it("debe retornar un plan de estudio por ID y llamar al repositorio", async () => {
            // Arreglar
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(MOCK_PLAN_ESTUDIO_BASE);

            // Actuar
            const resultado = await casosUso.obtenerPlanEstudioPorId(50);

            // Afirmar
            expect(mockPlanEstudioRepositorio.obtenerPlanEstudioPorId).toHaveBeenCalledWith(50);
            expect(resultado).toEqual(MOCK_PLAN_ESTUDIO_BASE);
        });

        it("debe retornar null si el plan de estudio no existe", async () => {
            // Arreglar
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(null);

            // Actuar
            const resultado = await casosUso.obtenerPlanEstudioPorId(999);

            // Afirmar
            expect(mockPlanEstudioRepositorio.obtenerPlanEstudioPorId).toHaveBeenCalledWith(999);
            expect(resultado).toBeNull();
        });
    });

    // --- PRUEBAS DE CREACIÓN DE PLAN DE ESTUDIO ---

    describe("crearPlanEstudio", () => {
        beforeEach(() => {
            // Configuramos los mocks para el camino feliz (Happy Path) por defecto
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(MOCK_PROGRAMA_EXISTENTE as any);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(MOCK_ASIGNATURA_EXISTENTE as any);
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(false);
            mockPlanEstudioRepositorio.crearPlanEstudio.mockResolvedValue(MOCK_PLAN_ESTUDIO_BASE.idPlanEstudio!);
            mockPlanEstudioRepositorio.obtenerPlanEstudioRelacionado.mockResolvedValue(MOCK_PLAN_ESTUDIO_RELACIONADO);
        });

        it("debe crear un plan de estudio exitosamente y retornar el objeto relacionado", async () => {
            // Actuar
            const resultado = await casosUso.crearPlanEstudio(MOCK_PLAN_ESTUDIO_DTO);

            // Afirmar
            expect(mockProgramaRepositorio.obtenerProgramaPorId).toHaveBeenCalledWith(MOCK_PLAN_ESTUDIO_DTO.idPrograma);
            expect(mockAsignaturaRepositorio.obtenerAsignaturaPorId).toHaveBeenCalledWith(MOCK_PLAN_ESTUDIO_DTO.idAsignatura);
            expect(mockPlanEstudioRepositorio.existeDuplicidad).toHaveBeenCalledWith(
                MOCK_PLAN_ESTUDIO_DTO.idPrograma,
                MOCK_PLAN_ESTUDIO_DTO.idAsignatura,
                MOCK_PLAN_ESTUDIO_DTO.semestre
            );
            expect(mockPlanEstudioRepositorio.crearPlanEstudio).toHaveBeenCalled();
            expect(resultado).toEqual(MOCK_PLAN_ESTUDIO_RELACIONADO);
        });

        it("debe lanzar un ValidacionError si el Programa Académico no existe", async () => {
            // Arreglar: El programa no existe
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(null);
            const ID_INVALIDO = 99;

            // Actuar y Afirmar
            await expect(casosUso.crearPlanEstudio({ ...MOCK_PLAN_ESTUDIO_DTO, idPrograma: ID_INVALIDO })).rejects.toThrow(ValidacionError);
            await expect(casosUso.crearPlanEstudio({ ...MOCK_PLAN_ESTUDIO_DTO, idPrograma: ID_INVALIDO })).rejects.toThrow(
                `El Programa Académico con ID ${ID_INVALIDO} no existe`
            );
            expect(mockAsignaturaRepositorio.obtenerAsignaturaPorId).not.toHaveBeenCalled(); // No debe seguir validando
            expect(mockPlanEstudioRepositorio.crearPlanEstudio).not.toHaveBeenCalled();
        });

        it("debe lanzar un ValidacionError si la Asignatura no existe", async () => {
            // Arreglar: La asignatura no existe
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(null);
            const ID_INVALIDO = 99;

            // Actuar y Afirmar
            await expect(casosUso.crearPlanEstudio({ ...MOCK_PLAN_ESTUDIO_DTO, idAsignatura: ID_INVALIDO })).rejects.toThrow(ValidacionError);
            await expect(casosUso.crearPlanEstudio({ ...MOCK_PLAN_ESTUDIO_DTO, idAsignatura: ID_INVALIDO })).rejects.toThrow(
                `La Asignatura con ID ${ID_INVALIDO} no existe`
            );
            expect(mockPlanEstudioRepositorio.crearPlanEstudio).not.toHaveBeenCalled();
        });

        it("debe lanzar un ValidacionError si ya existe duplicidad (mismo programa, asignatura y semestre)", async () => {
            // Arreglar: Se encuentra duplicidad
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(true);

            // Actuar y Afirmar
            await expect(casosUso.crearPlanEstudio(MOCK_PLAN_ESTUDIO_DTO)).rejects.toThrow(ValidacionError);
            await expect(casosUso.crearPlanEstudio(MOCK_PLAN_ESTUDIO_DTO)).rejects.toThrow(
                'El plan de estudio ya existe para este programa, asignatura y semestre'
            );
            expect(mockPlanEstudioRepositorio.crearPlanEstudio).not.toHaveBeenCalled();
        });
    });

    // --- PRUEBAS DE ACTUALIZACIÓN DE PLAN DE ESTUDIO ---

    describe("actualizarPlanEstudio", () => {
        const ID_A_ACTUALIZAR = 50;
        const NUEVOS_DATOS: IPlanEstudio = { ...MOCK_PLAN_ESTUDIO_BASE, creditos: 6 };

        beforeEach(() => {
            // Configuramos los mocks para el camino feliz (Happy Path) por defecto
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(MOCK_PLAN_ESTUDIO_BASE);
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(MOCK_PROGRAMA_EXISTENTE as any);
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(MOCK_ASIGNATURA_EXISTENTE as any);
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(false);
            
            // NOTA: La interfaz IPlanEstudioRepositorio.actualizarPlanEstudio devuelve Promise<IPlanEstudio>, 
            // no void. Para ser precisos, mockeamos el valor de retorno.
            mockPlanEstudioRepositorio.actualizarPlanEstudio.mockResolvedValue(NUEVOS_DATOS as IPlanEstudio); 
            
            mockPlanEstudioRepositorio.obtenerPlanEstudioRelacionado.mockResolvedValue({ ...MOCK_PLAN_ESTUDIO_RELACIONADO, creditos: 6 });
        });

        it("debe actualizar el plan de estudio exitosamente y retornar el objeto relacionado", async () => {
            // Actuar
            const resultado = await casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, NUEVOS_DATOS);

            // Afirmar
            expect(mockPlanEstudioRepositorio.obtenerPlanEstudioPorId).toHaveBeenCalledWith(ID_A_ACTUALIZAR);
            expect(mockPlanEstudioRepositorio.existeDuplicidad).toHaveBeenCalledWith(
                NUEVOS_DATOS.idPrograma,
                NUEVOS_DATOS.idAsignatura,
                NUEVOS_DATOS.semestre,
                ID_A_ACTUALIZAR // Importante: Se envía el ID actual para excluirlo de la comprobación
            );
            expect(mockPlanEstudioRepositorio.actualizarPlanEstudio).toHaveBeenCalledWith(ID_A_ACTUALIZAR, NUEVOS_DATOS);
            expect(resultado!.creditos).toBe(6);
        });

        it("debe retornar null si el plan de estudio a actualizar no existe", async () => {
            // Arreglar
            mockPlanEstudioRepositorio.obtenerPlanEstudioPorId.mockResolvedValue(null);

            // Actuar
            const resultado = await casosUso.actualizarPlanEstudio(999, NUEVOS_DATOS);

            // Afirmar
            expect(resultado).toBeNull();
            expect(mockProgramaRepositorio.obtenerProgramaPorId).not.toHaveBeenCalled(); // No debe continuar la lógica
        });

        it("debe lanzar un ValidacionError si el Programa (en los nuevos datos) no existe", async () => {
            // Arreglar
            mockProgramaRepositorio.obtenerProgramaPorId.mockResolvedValue(null);
            const ID_INVALIDO = 99;
            const datosInvalidos = { ...NUEVOS_DATOS, idPrograma: ID_INVALIDO };

            // Actuar y Afirmar
            await expect(casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, datosInvalidos)).rejects.toThrow(ValidacionError);
            await expect(casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, datosInvalidos)).rejects.toThrow(
                `El Programa con ID ${ID_INVALIDO} no existe.`
            );
            expect(mockPlanEstudioRepositorio.actualizarPlanEstudio).not.toHaveBeenCalled();
        });

        it("debe lanzar un ValidacionError si la Asignatura (en los nuevos datos) no existe", async () => {
            // Arreglar
            mockAsignaturaRepositorio.obtenerAsignaturaPorId.mockResolvedValue(null);
            const ID_INVALIDO = 99;
            const datosInvalidos = { ...NUEVOS_DATOS, idAsignatura: ID_INVALIDO };

            // Actuar y Afirmar
            await expect(casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, datosInvalidos)).rejects.toThrow(ValidacionError);
            await expect(casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, datosInvalidos)).rejects.toThrow(
                `La Asignatura con ID ${ID_INVALIDO} no existe.`
            );
            expect(mockPlanEstudioRepositorio.actualizarPlanEstudio).not.toHaveBeenCalled();
        });

        it("debe lanzar un ValidacionError si los nuevos datos causan duplicidad con otro plan existente", async () => {
            // Arreglar
            mockPlanEstudioRepositorio.existeDuplicidad.mockResolvedValue(true);

            // Actuar y Afirmar
            await expect(casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, NUEVOS_DATOS)).rejects.toThrow(ValidacionError);
            await expect(casosUso.actualizarPlanEstudio(ID_A_ACTUALIZAR, NUEVOS_DATOS)).rejects.toThrow(
                'El plan de estudio ya existe con la misma asignatura y semestre en este programa.'
            );
            expect(mockPlanEstudioRepositorio.actualizarPlanEstudio).not.toHaveBeenCalled();
        });
    });

    // --- PRUEBAS DE ELIMINACIÓN DE PLAN DE ESTUDIO ---

    describe("eliminiarPlanEstudio", () => {
        it("debe llamar al repositorio para eliminar el plan de estudio y retornar el plan eliminado", async () => {
            // Arreglar
            mockPlanEstudioRepositorio.eliminarPlanEstudio.mockResolvedValue(MOCK_PLAN_ESTUDIO_BASE);

            // Actuar
            const resultado = await casosUso.eliminiarPlanEstudio(50);

            // Afirmar
            expect(mockPlanEstudioRepositorio.eliminarPlanEstudio).toHaveBeenCalledWith(50);
            expect(resultado).toEqual(MOCK_PLAN_ESTUDIO_BASE);
        });

        it("debe retornar null si el plan de estudio a eliminar no existe", async () => {
            // Arreglar
            // SOLUCIÓN FORZADA: Usamos 'as jest.Mock' para forzar a Jest a aceptar 'null', 
            // resolviendo errores de inferencia de tipo estrictos.
            (mockPlanEstudioRepositorio.eliminarPlanEstudio as jest.Mock).mockResolvedValue(null);

            // Actuar
            const resultado = await casosUso.eliminiarPlanEstudio(999);

            // Afirmar
            expect(mockPlanEstudioRepositorio.eliminarPlanEstudio).toHaveBeenCalledWith(999);
            expect(resultado).toBeNull();
        });
    });
});