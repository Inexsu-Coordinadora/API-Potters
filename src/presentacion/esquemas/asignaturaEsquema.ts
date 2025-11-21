import { z } from "zod";

export const CrearAsignaturaEsquema = z.object({
    nombreAsignatura: z
        .string("Este campo solo recibe letras")
        .nonempty("El nombre de la asignatura es obligatorio")
        .min(3, "Debe tener al menos 3 caracteres")
        .max(100, "No puede superar los 100 caracteres"),

    cargaHoraria: z
        .coerce.number({
            message: "La cargaHoraria debe ser un campo obligatorio"
        })
        .min(1, "La cargaHoraria debe ser mayor a 0")
        .max(200, "La cargaHoraria no debe superar las 200 horas")
        .int("La cargaHoraria debe ser un número entero")
        .positive()
        .describe("Es la cargaHoraria por materia en horas"),

    idFormato: z
        .coerce.number({
            message: "El idFormato debe ser un campo obligatorio"
        })
        .min(1, "El idFormato debe ser mayor a 0")
        .max(3, "El idFormato debe ser 1, 2 o 3")
        .int("El idFormato debe ser un número entero")
        .positive()
        .describe("ID del formato de la asignatura"),

    informacion: z
        .string("Este campo solo recibe letras")
        .max(200, "La información no puede exceder los 200 caracteres")
        .optional()
        .transform((val) => val ?? null),
});

export type AsignaturaDTO = z.infer<typeof CrearAsignaturaEsquema>;

