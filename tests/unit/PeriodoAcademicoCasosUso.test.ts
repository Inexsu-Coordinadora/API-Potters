import { PeriodoAcademicoCasosUso } from "../../src/core/aplicacion/casos-uso/PeriodoAcademicoCasosUso";
import { IPeriodoAcademicoRepositorio } from "../../src/core/dominio/repositorio/IPeriodoAcademicoRepositorio";
import { PeriodoAcademicoDTO } from "../../src/presentacion/esquemas/periodoAcademicoEsquema";
import { IPeriodoRelacionado } from "../../src/core/dominio/periodoAcademico/IPeriodoRelacionado";
import { IPeriodoAcademico } from "../../src/core/dominio/periodoAcademico/IPeriodoAcademico"; // Importación necesaria para mocks de PeriodoAcademico

// --- Datos de MOCK comunes para todas las pruebas ---

// MOCK basado en PeriodoAcademicoDTO
const MOCK_PERIODO_DTO: PeriodoAcademicoDTO = {
    // CORREGIDO: Usamos 'semestre' en lugar de 'nombre'
    semestre: "2026-I",
    // FIX: Usamos T12:00:00Z para evitar problemas de zona horaria en el test runner
    fechaInicio: new Date("2026-07-01T12:00:00Z"),
    fechaFin: new Date("2026-12-31T12:00:00Z"),
    idEstado: 1, // Preparación
    // idTipoPeriodo REMOVIDO: No existe en la definición DTO
};

// MOCK basado en IPeriodoRelacionado (Objeto de retorno tras crear/actualizar)
const MOCK_PERIODO_RELACIONADO: IPeriodoRelacionado = {
    idPeriodo: 10,
    // CORREGIDO: Usamos 'semestre' en lugar de 'nombre'
    semestre: "2026-I",
    // FIX: Usamos T12:00:00Z para evitar problemas de zona horaria en el test runner
    fechaInicio: new Date("2026-07-01T12:00:00Z"),
    fechaFin: new Date("2026-12-31T12:00:00Z"),
    // CORREGIDO: Usamos 'estadoperiodo' en lugar de 'nombreEstado'
    estadoperiodo: "Preparación", 
    // idEstado e idTipoPeriodo REMOVIDOS: No existen en IPeriodoRelacionado
};

// MOCK basado en IPeriodoAcademico (Objeto retornado por obtenerPeriodoPorId)
const MOCK_PERIODO_ACADEMICO_BASE: IPeriodoAcademico = {
    idPeriodo: 1,
    // CORREGIDO: Usamos 'semestre' en lugar de 'nombre'
    semestre: "2025-II",
    // FIX: Usamos T12:00:00Z para evitar problemas de zona horaria en el test runner
    fechaInicio: new Date("2025-07-01T12:00:00Z"),
    fechaFin: new Date("2025-12-31T12:00:00Z"),
    idEstado: 1, // Estado de ejemplo
    // idTipoPeriodo REMOVIDO: No existe en la definición de IPeriodoAcademico
};


// --- ESTRUCTURA DE PRUEBAS ---
describe("PeriodoAcademicoCasosUso", () => {
    let casosUso: PeriodoAcademicoCasosUso;
    // Creamos un mock tipado para asegurar que Jest imite correctamente la interfaz del Repositorio.
    let mockRepositorio: jest.Mocked<IPeriodoAcademicoRepositorio>;

    beforeEach(() => {
        // Inicialización del mock Repositorio con todas sus funciones como Mocks de Jest
        mockRepositorio = {
            listarPeriodos: jest.fn(),
            obtenerPeriodoPorId: jest.fn(),
            crearPeriodo: jest.fn(),
            actualizarPeriodo: jest.fn(),
            eliminarPeriodo: jest.fn(),
            consultarTraslapeFechas: jest.fn(),
            obtenerPeriodoRelacionado: jest.fn()
        };

        // Inyección de dependencias: se inyecta el mock en la clase de Caso de Uso
        casosUso = new PeriodoAcademicoCasosUso(mockRepositorio);
    });

    // --- PRUEBAS DE FUNCIONES SIMPLES ---

    describe("Métodos de consulta básicos", () => {
        it("debe obtener lista de periodos y llamar al repositorio con el límite correcto", async () => {
            // Arreglar: El mock retorna un array vacío
            mockRepositorio.listarPeriodos.mockResolvedValue([]);

            // Actuar: Llamar al método del Caso de Uso
            const resultado = await casosUso.obtenerPeriodos(5);

            // Afirmar: Verificar que el repositorio fue llamado y que el resultado es el esperado
            expect(mockRepositorio.listarPeriodos).toHaveBeenCalledWith(5);
            expect(resultado).toEqual([]);
        });

        it("debe retornar un periodo por ID y llamar al repositorio", async () => {
            // Arreglar: El mock retorna un objeto simulado
            mockRepositorio.obtenerPeriodoPorId.mockResolvedValue(MOCK_PERIODO_ACADEMICO_BASE);

            // Actuar
            const periodo = await casosUso.obtenerPeriodoPorId(1);

            // Afirmar
            expect(periodo).toBeDefined();
            expect(periodo?.idPeriodo).toBe(1);
            expect(mockRepositorio.obtenerPeriodoPorId).toHaveBeenCalledWith(1);
        });

        it("debe formatear correctamente la fecha (utilidad interna)", () => {
            // Arreglar: Usamos una fecha que podría tener problemas de zona horaria (UTC)
            const fecha = new Date("2026-07-01T12:00:00Z"); 
            
            // Actuar
            const resultado = casosUso.formatearFecha(fecha);

            // Afirmar: Aseguramos el formato YYYY-MM-DD
            expect(resultado).toBe("2026-07-01");
        });
    });

    // --- PRUEBAS DE LÓGICA DE NEGOCIO: CREAR PERIODO ---

    describe("crearPeriodo", () => {
        it("debe crear un periodo exitosamente cuando no hay traslape de fechas", async () => {
            // Arreglar
            // 1. No debe encontrar traslape
            mockRepositorio.consultarTraslapeFechas.mockResolvedValue(null);
            // 2. La creación debe retornar el ID del nuevo periodo
            mockRepositorio.crearPeriodo.mockResolvedValue(10);
            // 3. Obtener el periodo creado (relacionado)
            mockRepositorio.obtenerPeriodoRelacionado.mockResolvedValue(MOCK_PERIODO_RELACIONADO);

            // Actuar
            const resultado = await casosUso.crearPeriodo(MOCK_PERIODO_DTO);

            // Afirmar
            // 1. Se debe haber consultado el traslape (primera validación)
            expect(mockRepositorio.consultarTraslapeFechas).toHaveBeenCalledWith(MOCK_PERIODO_DTO, 0);
            // 2. Se debe haber llamado a crearPeriodo
            expect(mockRepositorio.crearPeriodo).toHaveBeenCalledWith(MOCK_PERIODO_DTO);
            // 3. Se debe haber llamado a obtenerPeriodoRelacionado
            expect(mockRepositorio.obtenerPeriodoRelacionado).toHaveBeenCalledWith(10);
            // 4. El resultado debe ser el objeto esperado
            expect(resultado).toEqual(MOCK_PERIODO_RELACIONADO);
        });

        it("debe lanzar un error si se encuentra un traslape de fechas", async () => {
            // Arreglar: El mock retorna un periodo traslapado (basado en IPeriodoAcademico)
            const periodoTraslapado: IPeriodoAcademico = {
                idPeriodo: 5,
                semestre: "2026-I-Traslapo",
                // FIX: Usamos T12:00:00Z para evitar el rollback de fechas por zona horaria
                fechaInicio: new Date("2026-06-01T12:00:00Z"),
                fechaFin: new Date("2026-08-01T12:00:00Z"),
                idEstado: 2,
            };
            mockRepositorio.consultarTraslapeFechas.mockResolvedValue(periodoTraslapado);

            // Actuar y Afirmar: Usamos `rejects` para probar que la promesa lanza un error
            // CORREGIDO: Usamos una expresión regular para la comparación del mensaje de error.
            await expect(casosUso.crearPeriodo(MOCK_PERIODO_DTO)).rejects.toThrow(
                /Se encontró un periodo activo con una fecha traslapada:idPeriodo 5 periodo desde 2026-06-01 hasta 2026-08-01/
            );

            // Afirmar: NO se debe llamar a la creación si hay error de traslape
            expect(mockRepositorio.crearPeriodo).not.toHaveBeenCalled();
        });
    });

    // --- PRUEBAS DE LÓGICA DE NEGOCIO: ACTUALIZAR PERIODO (TRANSICIÓN DE ESTADOS) ---

    describe("actualizarPeriodo", () => {
        const ID_A_ACTUALIZAR = 1;
        
        it("debe actualizar un periodo exitosamente si la transición de estado es válida (1 -> 2)", async () => {
            // Arreglar: Datos existentes (estado 1: Preparación)
            mockRepositorio.obtenerPeriodoPorId.mockResolvedValue({ ...MOCK_PERIODO_ACADEMICO_BASE, idEstado: 1 });
            // Arreglar: Nuevos datos (estado 2: Activo)
            const datosActualizados = { ...MOCK_PERIODO_DTO, idEstado: 2 };
            // Arreglar: No hay traslape
            mockRepositorio.consultarTraslapeFechas.mockResolvedValue(null);
            // Arreglar: Retorno exitoso
            mockRepositorio.obtenerPeriodoRelacionado.mockResolvedValue({ ...MOCK_PERIODO_RELACIONADO, estadoperiodo: "Activo" });

            // Actuar
            await casosUso.actualizarPeriodo(ID_A_ACTUALIZAR, datosActualizados);

            // Afirmar
            // 1. Se llama a la consulta inicial
            expect(mockRepositorio.obtenerPeriodoPorId).toHaveBeenCalledWith(ID_A_ACTUALIZAR);
            // 2. Se llama a la actualización
            expect(mockRepositorio.actualizarPeriodo).toHaveBeenCalledWith(ID_A_ACTUALIZAR, datosActualizados);
            // 3. Se llama a obtener el resultado final
            expect(mockRepositorio.obtenerPeriodoRelacionado).toHaveBeenCalledWith(ID_A_ACTUALIZAR);
        });

        it.each([
            [1, 3, "Preparación", "Cerrado"], // 1 -> 3 (Válido)
            [2, 3, "Activo", "Cerrado"],         // 2 -> 3 (Válido)
            [3, 3, "Cerrado", "Cerrado"], // 3 -> 3 (Válido)
        ])("debe permitir la transición válida de estado %i a %i (de %s a %s)", async (estadoActual, nuevoEstado, nombreActual, nombreNuevo) => {
            // Arreglar
            mockRepositorio.obtenerPeriodoPorId.mockResolvedValue({ ...MOCK_PERIODO_ACADEMICO_BASE, idEstado: estadoActual });
            const datosActualizados = { ...MOCK_PERIODO_DTO, idEstado: nuevoEstado };
            mockRepositorio.consultarTraslapeFechas.mockResolvedValue(null);
            mockRepositorio.obtenerPeriodoRelacionado.mockResolvedValue({ ...MOCK_PERIODO_RELACIONADO, estadoperiodo: nombreNuevo });

            // Actuar
            await casosUso.actualizarPeriodo(ID_A_ACTUALIZAR, datosActualizados);

            // Afirmar: Se debe haber llamado a la actualización
            expect(mockRepositorio.actualizarPeriodo).toHaveBeenCalled();
        });

        it.each([
            [2, 1, "Activo", "Preparación"], // NO permitido: 2 -> 1
            [3, 1, "Cerrado", "Preparación"], // NO permitido: 3 -> 1
            [3, 2, "Cerrado", "Activo"],   // NO permitido: 3 -> 2
        ])("debe lanzar un error en la transición NO permitida de estado %i a %i", async (estadoActual, nuevoEstado, nombreActual, nombreNuevo) => {
            // Arreglar
            mockRepositorio.obtenerPeriodoPorId.mockResolvedValue({ ...MOCK_PERIODO_ACADEMICO_BASE, idEstado: estadoActual });
            const datosActualizados = { ...MOCK_PERIODO_DTO, idEstado: nuevoEstado };
            mockRepositorio.consultarTraslapeFechas.mockResolvedValue(null);

            // Actuar y Afirmar: La promesa debe fallar
            await expect(casosUso.actualizarPeriodo(ID_A_ACTUALIZAR, datosActualizados)).rejects.toThrow(
                `Transición de estado no permitida: no se puede cambiar de ${nombreActual} a ${nombreNuevo}`
            );

            // Afirmar: NO se debe llamar a la actualización si hay error de transición
            expect(mockRepositorio.actualizarPeriodo).not.toHaveBeenCalled();
        });

        it("debe lanzar un error si se encuentra traslape de fechas durante la actualización", async () => {
            // Arreglar
            // 1. Estado original: Preparación (1)
            mockRepositorio.obtenerPeriodoPorId.mockResolvedValue({ ...MOCK_PERIODO_ACADEMICO_BASE, idEstado: 1 });
            const datosActualizados = { ...MOCK_PERIODO_DTO, idEstado: 2 };
            // 2. Se encuentra traslape con otro ID (ID=99)
            const periodoTraslapado: IPeriodoAcademico = {
                idPeriodo: 99,
                semestre: "2026-II-Traslapo",
                // FIX: Usamos T12:00:00Z para evitar el rollback de fechas por zona horaria
                fechaInicio: new Date("2026-06-01T12:00:00Z"),
                fechaFin: new Date("2026-08-01T12:00:00Z"),
                idEstado: 2,
            };
            mockRepositorio.consultarTraslapeFechas.mockResolvedValue(periodoTraslapado);

            // Actuar y Afirmar
            // CORREGIDO: Usamos una expresión regular para la comparación del mensaje de error.
            await expect(casosUso.actualizarPeriodo(ID_A_ACTUALIZAR, datosActualizados)).rejects.toThrow(
                /Se encontró un periodo activo con una fecha traslapada:idPeriodo 99 periodo desde 2026-06-01 hasta 2026-08-01/
            );

            // Afirmar: NO se debe llamar a la actualización
            expect(mockRepositorio.actualizarPeriodo).not.toHaveBeenCalled();
        });
    });

    // --- PRUEBAS DE ELIMINAR PERIODO ---

    describe("eliminarPeriodo", () => {
        it("debe llamar al repositorio para eliminar un periodo", async () => {
            // Arreglar
            const periodoEliminado: IPeriodoAcademico = { ...MOCK_PERIODO_ACADEMICO_BASE, semestre: "Eliminado" };
            mockRepositorio.eliminarPeriodo.mockResolvedValue(periodoEliminado);

            // Actuar
            const resultado = await casosUso.eliminarPeriodo(1);

            // Afirmar
            expect(mockRepositorio.eliminarPeriodo).toHaveBeenCalledWith(1);
            expect(resultado).toEqual(periodoEliminado);
        });
    });
});