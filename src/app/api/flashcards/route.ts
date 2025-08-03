import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { contentQuerySchema, flashcardSchema } from "@/lib/validations/content";
import Flashcard from "@/models/Flashcard";
import { NextRequest } from "next/server";

// GET /api/flashcards
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

        const skip = (queryParams.page - 1) * queryParams.limit;
        const [flashcards, total] = await Promise.all([
            Flashcard.find(filters)
                .populate("categoryIds", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(queryParams.limit)
                .lean(),
            Flashcard.countDocuments(filters),
        ]);

        const totalPages = Math.ceil(total / queryParams.limit);

        return successResponse({
            flashcards,
            pagination: {
                current: queryParams.page,
                total: totalPages,
                count: flashcards.length,
                totalCount: total,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}

// POST /api/flashcards
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = flashcardSchema.parse(body);

        const flashcard = new Flashcard(validatedData);
        await flashcard.save();
        await flashcard.populate("categoryIds", "name slug");

        return successResponse(
            flashcard,
            "Flashcard created successfully",
            201
        );
    } catch (error) {
        return handleError(error);
    }
}
