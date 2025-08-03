import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { contentQuerySchema, theorySchema } from "@/lib/validations/content";
import Theory from "@/models/Theory";
import { NextRequest } from "next/server";

// GET /api/theory - Lista teorias (com filtros)
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const queryParams = contentQuerySchema.parse({
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "10",
            search: searchParams.get("search") || undefined,
            published: searchParams.get("published") || undefined,
            categoryId: searchParams.get("categoryId") || undefined,
        });

        // Construir filtros
        const filters: any = {};

        if (queryParams.published !== undefined) {
            filters.isPublished = queryParams.published === "true";
        }

        if (queryParams.categoryId) {
            filters.categoryIds = queryParams.categoryId;
        }

        if (queryParams.search) {
            filters.$text = { $search: queryParams.search };
        }

        // Executar query com paginação
        const skip = (queryParams.page - 1) * queryParams.limit;
        const [theories, total] = await Promise.all([
            Theory.find(filters)
                .populate("categoryIds", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(queryParams.limit)
                .lean(),
            Theory.countDocuments(filters),
        ]);

        const totalPages = Math.ceil(total / queryParams.limit);

        return successResponse({
            theories,
            pagination: {
                current: queryParams.page,
                total: totalPages,
                count: theories.length,
                totalCount: total,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}

// POST /api/theory - Criar nova teoria
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = theorySchema.parse(body);

        const theory = new Theory(validatedData);
        await theory.save();

        // Popular as categorias para retorno
        await theory.populate("categoryIds", "name slug");

        return successResponse(theory, "Theory created successfully", 201);
    } catch (error) {
        return handleError(error);
    }
}
