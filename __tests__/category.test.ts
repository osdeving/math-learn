import { categorySchema, generateSlug } from "@/lib/validations/category";

describe("Category Validation", () => {
    describe("generateSlug", () => {
        it("should generate slug from text", () => {
            expect(generateSlug("Álgebra Linear")).toBe("algebra-linear");
            expect(generateSlug("Cálculo I & II")).toBe("calculo-i-ii");
            expect(generateSlug("  Combinatória  ")).toBe("combinatoria");
        });

        it("should handle special characters", () => {
            expect(generateSlug("Função & Gráficos")).toBe("funcao-graficos");
            expect(generateSlug("Área, Volume & Perímetro")).toBe(
                "area-volume-perimetro"
            );
        });
    });

    describe("categorySchema", () => {
        it("should validate correct category data", () => {
            const validCategory = {
                name: "Álgebra",
                description: "Estudo de estruturas algébricas",
                isPublished: false,
            };

            const result = categorySchema.parse(validCategory);
            expect(result.name).toBe("Álgebra");
            expect(result.description).toBe("Estudo de estruturas algébricas");
            expect(result.isPublished).toBe(false);
        });

        it("should reject invalid data", () => {
            const invalidCategory = {
                name: "", // Nome vazio
                description: "a".repeat(501), // Muito longo
            };

            expect(() => categorySchema.parse(invalidCategory)).toThrow();
        });

        it("should use default values", () => {
            const minimalCategory = {
                name: "Matemática",
                description: "Matemática geral",
            };

            const result = categorySchema.parse(minimalCategory);
            expect(result.isPublished).toBe(false);
        });
    });
});
