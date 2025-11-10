import { z } from "zod";

export const CrearPeriodoAcademicoEsquema = z.object({
  semestre: z

    .string()
    .nonempty("El semestre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(10, "No puede superar los 10 caracteres"),

  fechaInicio: z
    .string()
    .nonempty("La fecha de inicio es obligatoria")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(10, "No puede superar los 10 caracteres"),

  fechaFin: z
    .string()
    .nonempty("La fecha de finalización es obligatoria")
    .min(3, "Debe tener al menos 3 caracteres")
    .max(10, "No puede superar los 10 caracteres"),

  idEstado: z
    .coerce.number({
      message: "El idEstado debe ser un campo obligatorio"
    })
    .min(1, "El idEstado debe ser mayor a 0")
    .int("El idEstado debe ser un número entero")
    .positive()
    .describe("ID del estado en el que se encuentra el periodo"),
});

export type PeriodoAcademicoDTO = z.infer<typeof CrearPeriodoAcademicoEsquema>;
