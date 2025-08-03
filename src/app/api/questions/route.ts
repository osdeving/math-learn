import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { contentQuerySchema, questionSchema } from "@/lib/validations/content";
import Question from "@/models/Question";
import { NextRequest } from "next/server";

// GET /api/questions
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
        const [questions, total] = await Promise.all([
            Question.find(filters)
                .populate("categoryIds", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(queryParams.limit)
                .lean(),
            Question.countDocuments(filters),
        ]);

        const totalPages = Math.ceil(total / queryParams.limit);

        return successResponse({
            questions,
            pagination: {
                current: queryParams.page,
                total: totalPages,
                count: questions.length,
                totalCount: total,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}

// POST /api/questions - RN6: Exatamente 5 alternativas
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = questionSchema.parse(body);

        const question = new Question(validatedData);
        await question.save();
        await question.populate("categoryIds", "name slug");

        return successResponse(question, "Question created successfully", 201);
    } catch (error) {
        return handleError(error);
    }
}
