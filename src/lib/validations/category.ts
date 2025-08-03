import { z } from "zod";

// Função auxiliar para gerar slug
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
        .replace(/\s+/g, "-") // Espaços viram hífens
        .replace(/-+/g, "-") // Remove hífens duplicados
        .replace(/^-+|-+$/g, "") // Remove hífens do início e fim
        .trim();
}

// Schema de validação para Category
export const categorySchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(100, "Nome não pode ter mais que 100 caracteres")
        .trim(),
    description: z
        .string()
        .min(1, "Descrição é obrigatória")
        .max(500, "Descrição não pode ter mais que 500 caracteres")
        .trim(),
    slug: z
        .string()
        .min(1, "Slug é obrigatório")
        .regex(
            /^[a-z0-9-]+$/,
            "Slug pode conter apenas letras minúsculas, números e hífens"
        )
        .optional(), // Será gerado automaticamente se não fornecido
    isPublished: z.boolean().default(false),
});

export const categoryUpdateSchema = categorySchema.partial();

// Tipos derivados dos schemas
export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;

// Schema para parâmetros de query
export const categoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    published: z.enum(["true", "false"]).optional(),
});
