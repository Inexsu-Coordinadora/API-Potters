import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PUERTO: z
        .string()
        .min(1, "PUERTO no puede estar vacío")
        .refine((v) => !isNaN(Number(v)), "PUERTO debe ser numérico")
        .transform(Number),

    PGHOST: z
        .string()
        .min(1, "PGHOST no puede estar vacío"),

    PGPORT: z
        .string()
        .min(1, "PGPORT no puede estar vacía")
        .refine((v) => !isNaN(Number(v)), "PGPORT debe ser numérica")
        .transform(Number),

    PGUSER: z
        .string()
        .min(1, "PGUSER no puede estar vacío"),

    PGPASSWORD: z
        .string()
        .min(1, "PGPASSWORD no puede estar vacío"),

    PGDBNAME: z
        .string()
        .min(1, "PGDBNAME no puede estar vacío"),
});

const validated = envSchema.safeParse(process.env);

if (!validated.success) {
    console.error("❌ Error en variables de entorno:");
    console.error(validated.error.format()); // nueva forma recomendada
    process.exit(1);
}

export const envEsquema = validated.data;
