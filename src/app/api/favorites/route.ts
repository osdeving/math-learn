import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import { NextRequest } from "next/server";
import { z } from "zod";

const favoriteSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    contentId: z.string().min(1, "Content ID is required"),
    contentType: z.enum(["theory", "summary", "flashcard", "question"]),
});

const querySchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    contentType: z
        .enum(["theory", "summary", "flashcard", "question"])
        .optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

// GET /api/favorites - Lista favoritos do usuário
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const queryParams = querySchema.parse({
            userId: searchParams.get("userId"),
            contentType: searchParams.get("contentType") || undefined,
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "20",
        });

        const filters: any = { userId: queryParams.userId };
        if (queryParams.contentType) {
            filters.contentType = queryParams.contentType;
        }

        const skip = (queryParams.page - 1) * queryParams.limit;
        const [favorites, total] = await Promise.all([
            Favorite.find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(queryParams.limit)
                .lean(),
            Favorite.countDocuments(filters),
        ]);

        // Buscar os conteúdos completos para cada favorito
        const enrichedFavorites = await Promise.all(
            favorites.map(async (fav) => {
                let content = null;

                try {
                    switch (fav.contentType) {
                        case "theory": {
                            const Theory = (await import("@/models/Theory"))
                                .default;
                            content = await Theory.findById(fav.contentId)
                                .populate("categoryIds", "name slug")
                                .lean();
                            break;
                        }
                        case "summary": {
                            const Summary = (await import("@/models/Summary"))
                                .default;
                            content = await Summary.findById(fav.contentId)
                                .populate("categoryIds", "name slug")
                                .lean();
                            break;
                        }
                        case "flashcard": {
                            const Flashcard = (
                                await import("@/models/Flashcard")
                            ).default;
                            content = await Flashcard.findById(fav.contentId)
                                .populate("categoryIds", "name slug")
                                .lean();
                            break;
                        }
                        case "question": {
                            const Question = (await import("@/models/Question"))
                                .default;
                            content = await Question.findById(fav.contentId)
                                .populate("categoryIds", "name slug")
                                .lean();
                            break;
                        }
                    }
                } catch (error) {
                    console.error("Error fetching content:", error);
                }

                return {
                    ...fav,
                    content,
                };
            })
        );

        const totalPages = Math.ceil(total / queryParams.limit);

        return successResponse({
            favorites: enrichedFavorites,
            pagination: {
                current: queryParams.page,
                total: totalPages,
                count: favorites.length,
                totalCount: total,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}

// POST /api/favorites - Toggle favorito (adiciona ou remove)
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = favoriteSchema.parse(body);

        // Verificar se já existe
        const existing = await Favorite.findOne({
            userId: validatedData.userId,
            contentId: validatedData.contentId,
            contentType: validatedData.contentType,
        });

        let result;
        if (existing) {
            await existing.deleteOne();
            result = { favorited: false, message: "Removed from favorites" };
        } else {
            const favorite = new Favorite(validatedData);
            await favorite.save();
            result = { favorited: true, message: "Added to favorites" };
        }

        return successResponse(result, result.message);
    } catch (error) {
        return handleError(error);
    }
}
