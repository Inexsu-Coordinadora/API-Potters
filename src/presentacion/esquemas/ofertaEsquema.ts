import { z } from "zod";

export const CrearOfertaEsquema = z.object({
  idPrograma: z.coerce.number({
    message: "El idPrograma debe ser un campo obligatorio"
  })

    .min(1, "El idPrograma debe ser mayor a 0")
    .int("El idPrograma debe ser un número entero positivo")
    .positive()
    .describe("ID del programa"),

  idPeriodo: z.coerce.number({
    message: "El idPeriodo debe ser un campo obligatorio"
  })

    .min(1, "El idPeriodo debe ser mayor a 0")
    .int("El idPeriodo debe ser un número entero positivo")
    .positive()
    .describe("ID del periodo académico"),

  idAsignatura: z.coerce.number({
    message: "El idAsignatura debe ser un campo obligatorio"
  })

    .min(1, "El idAsignatura debe ser mayor a 0")
    .int("El idAsignatura debe ser un número entero positivo")
    .positive()
    .describe("ID de la asignatura"),

  grupo: z.coerce.number({
    message: "El grupo debe ser un campo obligatorio"
  })

    .min(1, "El grupo debe ser mayor a 0")
    .max(50, "El grupo no ser mayor a 50")
    .int("El grupo debe ser un número entero positivo")
    .positive()
    .describe("Cantidad de grupos por oferta"),

  cupo: z.coerce.number({
    message: "El cupo debe ser un campo obligatorio"
  })

    .min(10, "El cupo debe tener al menos 10 estudiantes")
    .max(200, "El cupo no puede exceder más de 200 caracteres")
    .int("El cupo debe ser un número entero positivo")
    .positive()
    .describe("Cantidad de estudiantes por oferta"),
});

export type OfertaDTO = z.infer<typeof CrearOfertaEsquema>;

