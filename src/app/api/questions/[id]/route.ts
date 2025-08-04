import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { questionSchema } from "@/lib/validations/content";
import Question from "@/models/Question";
import { NextRequest } from "next/server";

// GET /api/questions/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const question = await Question.findById(params.id)
            .populate("categoryIds", "name slug")
            .lean();

        if (!question) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Question not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(question);
    } catch (error) {
        return handleError(error);
    }
}

// PUT /api/questions/[id] - RN6: Mantém validação de exatamente 5 alternativas
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = questionSchema.parse(body);

        const question = await Question.findByIdAndUpdate(
            params.id,
            { ...validatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("categoryIds", "name slug");

        if (!question) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Question not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(question, "Question updated successfully");
    } catch (error) {
        return handleError(error);
    }
}

// PATCH /api/questions/[id] - Toggle publish/unpublish
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const { isPublished } = body;

        if (typeof isPublished !== "boolean") {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "isPublished must be a boolean",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const question = await Question.findByIdAndUpdate(
            params.id,
            { isPublished, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("categoryIds", "name slug");

        if (!question) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Question not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(
            question,
            `Question ${isPublished ? "published" : "unpublished"} successfully`
        );
    } catch (error) {
        return handleError(error);
    }
}

// DELETE /api/questions/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const question = await Question.findByIdAndDelete(params.id);

        if (!question) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Question not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(
            { id: params.id },
            "Question deleted successfully"
        );
    } catch (error) {
        return handleError(error);
    }
}
