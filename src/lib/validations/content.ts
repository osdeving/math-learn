import { z } from "zod";

// Theory validations
export const theorySchema = z.object({
    title: z
        .string()
        .min(1, "Título é obrigatório")
        .max(200, "Título não pode ter mais que 200 caracteres")
        .trim(),
    content: z.string().min(1, "Conteúdo é obrigatório").trim(),
    categoryIds: z
        .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de categoria inválido")
        )
        .min(1, "Pelo menos uma categoria é obrigatória"),
    isPublished: z.boolean().default(false),
});

export const theoryUpdateSchema = theorySchema.partial();

// Summary validations
export const summarySchema = z.object({
    title: z
        .string()
        .min(1, "Título é obrigatório")
        .max(200, "Título não pode ter mais que 200 caracteres")
        .trim(),
    content: z
        .string()
        .min(1, "Conteúdo é obrigatório")
        .max(1000, "Conteúdo não pode ter mais que 1000 caracteres")
        .trim(),
    categoryIds: z
        .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de categoria inválido")
        )
        .min(1, "Pelo menos uma categoria é obrigatória"),
    isPublished: z.boolean().default(false),
});

export const summaryUpdateSchema = summarySchema.partial();

// Flashcard validations
export const flashcardSchema = z.object({
    question: z
        .string()
        .min(1, "Pergunta é obrigatória")
        .max(500, "Pergunta não pode ter mais que 500 caracteres")
        .trim(),
    answer: z
        .string()
        .min(1, "Resposta é obrigatória")
        .max(1000, "Resposta não pode ter mais que 1000 caracteres")
        .trim(),
    categoryIds: z
        .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de categoria inválido")
        )
        .min(1, "Pelo menos uma categoria é obrigatória"),
    isPublished: z.boolean().default(false),
});

export const flashcardUpdateSchema = flashcardSchema.partial();

// Question validations - RN6: Exatamente 5 alternativas
const alternativeSchema = z.object({
    text: z
        .string()
        .min(1, "Texto da alternativa é obrigatório")
        .max(200, "Alternativa não pode ter mais que 200 caracteres")
        .trim(),
    isCorrect: z.boolean(),
});

export const questionSchema = z
    .object({
        title: z
            .string()
            .min(1, "Título é obrigatório")
            .max(200, "Título não pode ter mais que 200 caracteres")
            .trim(),
        statement: z
            .string()
            .min(1, "Enunciado é obrigatório")
            .max(1000, "Enunciado não pode ter mais que 1000 caracteres")
            .trim(),
        alternatives: z
            .array(alternativeSchema)
            .length(5, "Questão deve ter exatamente 5 alternativas")
            .refine((alternatives) => {
                const correctCount = alternatives.filter(
                    (alt) => alt.isCorrect
                ).length;
                return correctCount === 1;
            }, "Deve haver exatamente uma alternativa correta"),
        correctAnswer: z
            .number()
            .min(0, "Índice da resposta deve ser entre 0 e 4")
            .max(4, "Índice da resposta deve ser entre 0 e 4"),
        explanation: z
            .string()
            .min(1, "Explicação é obrigatória")
            .max(1000, "Explicação não pode ter mais que 1000 caracteres")
            .trim(),
        categoryIds: z
            .array(
                z
                    .string()
                    .regex(/^[0-9a-fA-F]{24}$/, "ID de categoria inválido")
            )
            .min(1, "Pelo menos uma categoria é obrigatória"),
        isPublished: z.boolean().default(false),
    })
    .refine(
        (data) => {
            // Verificar se o correctAnswer aponta para a alternativa correta
            return data.alternatives[data.correctAnswer]?.isCorrect === true;
        },
        {
            message:
                "O índice da resposta correta deve corresponder à alternativa marcada como correta",
            path: ["correctAnswer"],
        }
    );

export const questionUpdateSchema = z.object({
    title: z
        .string()
        .min(1, "Título é obrigatório")
        .max(200, "Título não pode ter mais que 200 caracteres")
        .trim()
        .optional(),
    statement: z
        .string()
        .min(1, "Enunciado é obrigatório")
        .max(1000, "Enunciado não pode ter mais que 1000 caracteres")
        .trim()
        .optional(),
    alternatives: z
        .array(alternativeSchema)
        .length(5, "Questão deve ter exatamente 5 alternativas")
        .refine((alternatives) => {
            const correctCount = alternatives.filter(
                (alt) => alt.isCorrect
            ).length;
            return correctCount === 1;
        }, "Deve haver exatamente uma alternativa correta")
        .optional(),
    correctAnswer: z
        .number()
        .min(0, "Índice da resposta deve ser entre 0 e 4")
        .max(4, "Índice da resposta deve ser entre 0 e 4")
        .optional(),
    explanation: z
        .string()
        .min(1, "Explicação é obrigatória")
        .max(1000, "Explicação não pode ter mais que 1000 caracteres")
        .trim()
        .optional(),
    categoryIds: z
        .array(
            z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de categoria inválido")
        )
        .min(1, "Pelo menos uma categoria é obrigatória")
        .optional(),
    isPublished: z.boolean().optional(),
});

// Query schemas
export const contentQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    published: z.enum(["true", "false"]).optional(),
    categoryId: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .optional(),
});

// Type exports
export type TheoryInput = z.infer<typeof theorySchema>;
export type TheoryUpdateInput = z.infer<typeof theoryUpdateSchema>;
export type SummaryInput = z.infer<typeof summarySchema>;
export type SummaryUpdateInput = z.infer<typeof summaryUpdateSchema>;
export type FlashcardInput = z.infer<typeof flashcardSchema>;
export type FlashcardUpdateInput = z.infer<typeof flashcardUpdateSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type QuestionUpdateInput = z.infer<typeof questionUpdateSchema>;
