import { z } from "zod";

export const crearProgramaEsquema = z.object({
    nombrePrograma: z
        .string()
        .nonempty("El nombre del programa es obligatorio")
        .min(1)
        .max(20),

    nivelEducativo: z
        .string()
        .nonempty("El nivel es obligatorio")
        .min(1)
        .max(20),

    modalidad: z
        .string()
        .nonempty("La modalidad es obligatorio")
        .min(1)
        .max(20),

    duracionMeses: z
        .string()
        .nonempty("La duracion de los meses es obligatorio")
        .min(1)
        .max(20),
});

export type ProgramaDTO = z.infer<typeof crearProgramaEsquema>