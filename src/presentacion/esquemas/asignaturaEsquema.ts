// import { z } from "zod";

// export const CrearAsignaturaEsquema = z.object({
//     nombreAsignatura: z
//         .string()
//         .nonempty("El nombre de la asignatura es obligatorio")
//         .min(3, "Debe tener al menos 3 caracteres")
//         .max(100, "No puede superar 100 caracteres"),

//     cargaHoraria: z
//         .coerce.number({
//             message: "La cargaHoraria debe ser un campo obligatorio"
//         })

//         .min(1, "Debe tener al menos un caracter")
//         .max(10, "La carga no puede exceder los 10 caracteres")
//         .int("La carga horaria debe ser un número entero")
//         .positive("La carga horaria debe ser mayor a 0"),

//     idFormato: z
//         .coerce.number({
//             message: "El idFormato debe ser un campo obligatorio"
//         })

//         .min(1, "Debe tener al menos un caracter")
//         .max(10, "El idFormato no puede exceder los 10 caracteres")
//         .int("El formato debe ser un número entero válido")
//         .positive("Debe seleccionar un formato válido"),

//     informacion: z
//         .string()
//         .min(1, "Debe tener al menos un caracter")
//         .max(200, "La informacion no puede exceder los 200 caracteres")
//         .optional()
//         .transform((val) => val ?? null),
// });

// export type AsignaturaDTO = z.infer<typeof CrearAsignaturaEsquema>;

import { z } from "zod";

export const CrearAsignaturaEsquema = z.object({
    nombreAsignatura: z
        .string()
        .nonempty("El nombre de la asignatura es obligatorio")
        .min(3, "Debe tener al menos 3 caracteres")
        .max(100, "No puede superar los 100 caracteres"),

    cargaHoraria: z
        .coerce.number({
            message: "La carga horaria debe enviarse como número o texto numérico"
        })
        .int("La carga horaria debe ser un número entero")
        .min(1, "La carga horaria debe ser mayor a 0")
        .max(200, "La carga horaria no puede ser mayor a 200"),

    idFormato: z
        .coerce.number({
            message: "El idFormato debe enviarse como número o texto numérico"
        })
        .int("El formato debe ser un número entero válido")
        .min(1, "Debe seleccionar un formato válido"),

    informacion: z
        .string()
        .max(200, "La información no puede exceder los 200 caracteres")
        .optional()
        .transform((val) => val ?? null),
});

export type AsignaturaDTO = z.infer<typeof CrearAsignaturaEsquema>;

