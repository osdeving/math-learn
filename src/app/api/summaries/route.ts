import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { contentQuerySchema, summarySchema } from "@/lib/validations/content";
import Summary from "@/models/Summary";
import { NextRequest } from "next/server";

// GET /api/summaries
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
        const [summaries, total] = await Promise.all([
            Summary.find(filters)
                .populate("categoryIds", "name slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(queryParams.limit)
                .lean(),
            Summary.countDocuments(filters),
        ]);

        const totalPages = Math.ceil(total / queryParams.limit);

        return successResponse({
            summaries,
            pagination: {
                current: queryParams.page,
                total: totalPages,
                count: summaries.length,
                totalCount: total,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}

// POST /api/summaries
export async function POST(request: NextRequest) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = summarySchema.parse(body);

        const summary = new Summary(validatedData);
        await summary.save();
        await summary.populate("categoryIds", "name slug");

        return successResponse(summary, "Summary created successfully", 201);
    } catch (error) {
        return handleError(error);
    }
}
