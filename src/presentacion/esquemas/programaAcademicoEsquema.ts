import { z } from "zod";

export const crearProgramaEsquema = z.object({
    nombrePrograma: z
        .string()
        .nonempty("El nombre del programa es obligatorio")
        .min(3, "Debe tener al menos 3 caracteres")
        .max(100, "No puede superar los 100 caracteres"),

    idNivel: z
        .coerce.number({
            message: "El idNivel debe ser un campo obligatorio"
        })
        .min(1, "El idNivel debe ser mayor a 0")
        .int("El idNivel debe ser un número entero positivo")
        .positive()
        .describe("ID del nivel educativo"),

    idModalidad: z
        .coerce.number({
            message: "El idModalidad debe ser un campo obligatorio"
        })
        .min(1, "El idModalidad debe ser mayor a 0")
        .int("El idModalidad debe ser un número entero positivo")
        .positive()
        .describe("ID de la modalidad de estudio"),

    duracionMeses: z
        .coerce.number({
            message: "La duracionMeses debe ser un campo obligatorio"
        })
        .min(1, "La duracionMeses debe ser mayor a 0")
        .max(100, "La duración del programa no debe durar más de 100 meses")
        .int("La duracionMeses debe ser un número entero positivo")
        .positive()
        .describe("Duración en meses del programa académico"),
});

export type ProgramaDTO = z.infer<typeof crearProgramaEsquema>
