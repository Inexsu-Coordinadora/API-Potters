import { z } from "zod";

export const CrearPeriodoAcademicoEsquema = z.object({
  semestre: z
    .string()
    .nonempty("El semestre es obligatorio")
    .min(3)
    .max(20),

  fechaInicio: z
    .string()
    .nonempty("La fecha de inicio es obligatoria"),

  fechaFin: z
    .string()
    .nonempty("La fecha de finalización es obligatoria"),

  estadoPeriodo: z
    .string()
    .nonempty("El estado del periodo es obligatorio")
    .min(3)
    .max(20),
});

export type PeriodoAcademicoDTO = z.infer<typeof CrearPeriodoAcademicoEsquema>;
