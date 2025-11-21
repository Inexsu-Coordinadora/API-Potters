// import { ProgramaCasosUso } from "../programaacademicocasosuso"; // Ajusta la ruta si es necesario
// import { ProgramaDTO } from "../../../presentacion/esquemas/programaAcademicoEsquema"; // Ajusta la ruta si es necesario

import { IPrograma } from "../../src/core/dominio/programa/IPrograma";
import { IProgramaRepositorio } from "../../src/core/dominio/repositorio/IProgramaRepositorio";
import { ProgramaDTO }

// 1. Mockear la dependencia IProgramaRepositorio
const mockProgramaRepositorio: IProgramaRepositorio = {
    crearPrograma: jest.fn(),
    listarPrograma: jest.fn(),
    obtenerProgramaPorId: jest.fn(),
    actualizarPrograma: jest.fn(),
    eliminarPrograma: jest.fn(),
};

// 2. Instanciar el Caso de Uso con el Mock
const programaCasosUso = new ProgramaCasosUso(mockProgramaRepositorio);

describe('ProgramaCasosUso', () => {

    // Limpiar los mocks antes de cada prueba para asegurar independencia
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --- Prueba para obtenerPrograma (Listar) ---
    describe('obtenerPrograma', () => {
        it('debe llamar a listarPrograma del repositorio y devolver la lista de programas', async () => {
            // Arrange
            const programasMock: IPrograma[] = [
                { idPrograma: 1, nombrePrograma: 'Ingeniería de Software', idNivel: 1, idModalidad: 1, duracionMeses: 48 },
                { idPrograma: 2, nombrePrograma: 'Diseño Gráfico', idNivel: 2, idModalidad: 2, duracionMeses: 36 },
            ];
            (mockProgramaRepositorio.listarPrograma as jest.Mock).mockResolvedValue(programasMock);

            // Act
            const resultado = await programaCasosUso.obtenerPrograma();

            // Assert
            expect(mockProgramaRepositorio.listarPrograma).toHaveBeenCalledTimes(1);
            expect(mockProgramaRepositorio.listarPrograma).toHaveBeenCalledWith(undefined); // Sin límite
            expect(resultado).toEqual(programasMock);
        });

        it('debe llamar a listarPrograma con el límite especificado', async () => {
            // Arrange
            const limite = 5;
            (mockProgramaRepositorio.listarPrograma as jest.Mock).mockResolvedValue([]);

            // Act
            await programaCasosUso.obtenerPrograma(limite);

            // Assert
            expect(mockProgramaRepositorio.listarPrograma).toHaveBeenCalledWith(limite);
        });
    });

    // --- Prueba para obtenerProgramasPorId ---
    describe('obtenerProgramasPorId', () => {
        it('debe llamar a obtenerProgramaPorId y devolver el programa si existe', async () => {
            // Arrange
            const idPrograma = 10;
            const programaMock: IPrograma = { idPrograma, nombrePrograma: 'Matemáticas', idNivel: 3, idModalidad: 1, duracionMeses: 24 };
            (mockProgramaRepositorio.obtenerProgramaPorId as jest.Mock).mockResolvedValue(programaMock);

            // Act
            const resultado = await programaCasosUso.obtenerProgramasPorId(idPrograma);

            // Assert
            expect(mockProgramaRepositorio.obtenerProgramaPorId).toHaveBeenCalledWith(idPrograma);
            expect(resultado).toEqual(programaMock);
        });

        it('debe llamar a obtenerProgramaPorId y devolver null si no existe el programa', async () => {
            // Arrange
            const idPrograma = 999;
            (mockProgramaRepositorio.obtenerProgramaPorId as jest.Mock).mockResolvedValue(null);

            // Act
            const resultado = await programaCasosUso.obtenerProgramasPorId(idPrograma);

            // Assert
            expect(mockProgramaRepositorio.obtenerProgramaPorId).toHaveBeenCalledWith(idPrograma);
            expect(resultado).toBeNull();
        });
    });

    // --- Prueba para crearPrograma ---
    describe('crearPrograma', () => {
        it('debe llamar a crearPrograma del repositorio y devolver el ID del nuevo programa', async () => {
            // Arrange
            const nuevoProgramaDTO: ProgramaDTO = {
                nombrePrograma: 'Física Avanzada', idNivel: 4, idModalidad: 2, duracionMeses: 36
            };
            const idEsperado = 'insert-uuid-123';
            (mockProgramaRepositorio.crearPrograma as jest.Mock).mockResolvedValue(idEsperado);

            // Act
            const resultado = await programaCasosUso.crearPrograma(nuevoProgramaDTO);

            // Assert
            expect(mockProgramaRepositorio.crearPrograma).toHaveBeenCalledWith(nuevoProgramaDTO);
            expect(resultado).toBe(idEsperado);
        });
    });

    // --- Prueba para actualizarPrograma ---
    describe('actualizarPrograma', () => {
        it('debe llamar a actualizarPrograma del repositorio y devolver el programa actualizado', async () => {
            // Arrange
            const idPrograma = 15;
            const programaActualizado: IPrograma = { idPrograma, nombrePrograma: 'Música V2', idNivel: 2, idModalidad: 1, duracionMeses: 30 };
            (mockProgramaRepositorio.actualizarPrograma as jest.Mock).mockResolvedValue(programaActualizado);

            // Act
            const resultado = await programaCasosUso.actualizarPrograma(idPrograma, programaActualizado);

            // Assert
            expect(mockProgramaRepositorio.actualizarPrograma).toHaveBeenCalledWith(idPrograma, programaActualizado);
            expect(resultado).toEqual(programaActualizado);
        });

        it('debe llamar a actualizarPrograma y devolver null si el repositorio no encuentra el programa', async () => {
            // Arrange
            const idPrograma = 999;
            const datosPrograma: IPrograma = { nombrePrograma: 'No Existente', idNivel: 1, idModalidad: 1, duracionMeses: 12 };
            (mockProgramaRepositorio.actualizarPrograma as jest.Mock).mockResolvedValue(undefined); // El repositorio devuelve undefined

            // Act
            const resultado = await programaCasosUso.actualizarPrograma(idPrograma, datosPrograma);

            // Assert
            expect(mockProgramaRepositorio.actualizarPrograma).toHaveBeenCalledWith(idPrograma, datosPrograma);
            expect(resultado).toBeNull();
        });
    });

    // --- Prueba para eliminarPrograma ---
    describe('eliminarPrograma', () => {
        it('debe llamar a eliminarPrograma del repositorio y devolver el programa eliminado', async () => {
            // Arrange
            const idPrograma = 20;
            const programaEliminadoMock: IPrograma = { idPrograma, nombrePrograma: 'Artes', idNivel: 2, idModalidad: 2, duracionMeses: 24 };
            (mockProgramaRepositorio.eliminarPrograma as jest.Mock).mockResolvedValue(programaEliminadoMock);

            // Act
            const resultado = await programaCasosUso.eliminarPrograma(idPrograma);

            // Assert
            expect(mockProgramaRepositorio.eliminarPrograma).toHaveBeenCalledWith(idPrograma);
            expect(resultado).toEqual(programaEliminadoMock);
        });

        it('debe llamar a eliminarPrograma y devolver null si el programa no existe', async () => {
            // Arrange
            const idPrograma = 999;
            (mockProgramaRepositorio.eliminarPrograma as jest.Mock).mockResolvedValue(null);

            // Act
            const resultado = await programaCasosUso.eliminarPrograma(idPrograma);

            // Assert
            expect(mockProgramaRepositorio.eliminarPrograma).toHaveBeenCalledWith(idPrograma);
            expect(resultado).toBeNull();
        });
    });
});