import { z } from "zod";

export const CrearAsignaturaEsquema = z.object({
    nombreAsignatura: z
        .string()
        .nonempty("El nombre de la asignatura es obligatorio")
        .min(5)
        .max(20),

    creditos: z
        .string()
        .nonempty("Los créditos son obligatorios")
        .min(5)
        .max(20),

    cargaHoraria: z
        .string()
        .nonempty("La carga horaria es obligatoria")
        .min(1)
        .max(20),

    formatoClase: z
        .string()
        .nonempty("El formato de la clase es obligatorio")
        .min(5)
        .max(20),

    informacion: z
        .string()
        .optional()
        .transform((val) => val ?? null),
});

export type AsignaturaDTO = z.infer<typeof CrearAsignaturaEsquema>;
