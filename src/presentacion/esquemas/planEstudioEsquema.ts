import { z } from "zod";

export const CrearPlanEstudioEsquema = z.object({
  idPrograma: z.coerce
    .number()
    .int({ message: "El idPrograma debe ser un número entero" })
    .min(1, { message: "El idPrograma debe ser mayor a 0" })
    .positive({ message: "El idPrograma debe ser positivo" })
    .describe("ID del programa académico"),

  idAsignatura: z.coerce
    .number()
    .int({ message: "El idAsignatura debe ser un número entero" })
    .min(1, { message: "El idAsignatura debe ser mayor a 0" })
    .positive({ message: "El idAsignatura debe ser positivo" })
    .describe("ID de la asignatura"),

  semestre: z.coerce
    .number()
    .int({ message: "El semestre debe ser un número entero" })
    .min(1, { message: "El semestre mínimo permitido es 1" })
    .max(12, { message: "El semestre máximo permitido es 12" })
    .describe("Número de semestre en el que se dicta la asignatura"),

  creditos: z.coerce
    .number()
    .int({ message: "Los créditos deben ser un número entero" })
    .min(1, { message: "Debe tener al menos 1 crédito" })
    .max(20, { message: "No puede tener más de 20 créditos" })
    .describe("Cantidad de créditos asignados a la asignatura"),
});

export type PlanEstudioDTO = z.infer<typeof CrearPlanEstudioEsquema>;
