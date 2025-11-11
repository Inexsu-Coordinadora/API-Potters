import { z } from "zod";

const validarFormatoFecha = (valor: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(valor); // AAAA-MM-DD

const validarRangoAnio = (fecha: Date) =>
  fecha.getFullYear() >= 2010 && fecha.getFullYear() <= 2100;

export const CrearPeriodoAcademicoEsquema = z
  .object({
    semestre: z
      .string()
      .nonempty("El semestre es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(10, "No puede superar los 10 caracteres"),

    fechaInicio: z
      .string()
      .refine(validarFormatoFecha, {
        message: "El formato de la fecha de inicio es inválido. Debe ser AAAA-MM-DD",
      })
      .transform((v) => new Date(v))
      .refine((v) => !isNaN(v.getTime()), {
        message: "La fecha de inicio no es válida en el calendario",
      })
      .refine(validarRangoAnio, {
        message: "El año de la fecha de inicio debe estar entre 2010 y 2100",
      }),

    fechaFin: z
      .string()
      .refine(validarFormatoFecha, {
        message: "El formato de la fecha de finalización es inválido. Debe ser AAAA-MM-DD",
      })
      .transform((v) => new Date(v))
      .refine((v) => !isNaN(v.getTime()), {
        message: "La fecha de finalización no es válida en el calendario",
      })
      .refine(validarRangoAnio, {
        message: "El año de la fecha de finalización debe estar entre 2010 y 2100",
      }),

    idEstado: z
      .coerce.number({
        message: "El idEstado debe ser un campo obligatorio",
      })
      .min(1, "El idEstado debe ser mayor a 0")
      .int("El idEstado debe ser un número entero")
      .positive()
      .describe("ID del estado en el que se encuentra el periodo"),
  })
  .refine((data) => data.fechaInicio <= data.fechaFin, {
    message: "La fecha de inicio no puede ser mayor que la fecha de fin",
    path: ["fechaFin"],
  });

export type PeriodoAcademicoDTO = z.infer<typeof CrearPeriodoAcademicoEsquema>;

