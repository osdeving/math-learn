import { errorResponse, successResponse } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import {
    categoryQuerySchema,
    categorySchema,
} from "@/lib/validations/category";
import { NextRequest } from "next/server";

// GET /api/categories
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const validationResult = categoryQuerySchema.safeParse({
            page: searchParams.get("page") || "1",
            limit: searchParams.get("limit") || "10",
            search: searchParams.get("search") || undefined,
            published: searchParams.get("published") || undefined,
        });

        if (!validationResult.success) {
            return errorResponse("Invalid query parameters", 400);
        }

        const { page, limit, search, published } = validationResult.data;
        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};

        if (published !== undefined) {
            where.isPublished = published === "true";
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        // Get total count for pagination
        const totalCount = await prisma.category.count({ where });

        // Get categories with pagination
        const categories = await prisma.category.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: "asc" },
        });

        const pagination = {
            current: page,
            total: Math.ceil(totalCount / limit),
            count: categories.length,
            totalCount,
        };

        return successResponse({
            categories,
            pagination,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return errorResponse("Failed to fetch categories");
    }
}

// POST /api/categories
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validationResult = categorySchema.safeParse(body);

        if (!validationResult.success) {
            const errors = validationResult.error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            return errorResponse("Validation failed", 400, errors);
        }

        const { name, description, slug, isPublished } = validationResult.data;

        // Generate slug if not provided
        const finalSlug =
            slug ||
            name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .trim();

        const category = await prisma.category.create({
            data: {
                name,
                description,
                slug: finalSlug,
                isPublished: isPublished ?? false,
            },
        });

        return successResponse(
            { category },
            "Category created successfully",
            201
        );
    } catch (error: any) {
        console.error("Error creating category:", error);

        // Handle unique constraint violations
        if (error.code === "P2002") {
            const field = error.meta?.target?.[0];
            return errorResponse(
                `${field === "name" ? "Name" : "Slug"} already exists`,
                409
            );
        }

        return errorResponse("Failed to create category");
    }
}
