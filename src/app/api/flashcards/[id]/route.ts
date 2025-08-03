import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { flashcardSchema } from "@/lib/validations/content";
import Flashcard from "@/models/Flashcard";
import { NextRequest } from "next/server";

// GET /api/flashcards/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const flashcard = await Flashcard.findById(params.id)
            .populate("categoryIds", "name slug")
            .lean();

        if (!flashcard) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Flashcard not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(flashcard);
    } catch (error) {
        return handleError(error);
    }
}

// PUT /api/flashcards/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = flashcardSchema.partial().parse(body);

        const flashcard = await Flashcard.findByIdAndUpdate(
            params.id,
            { ...validatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("categoryIds", "name slug");

        if (!flashcard) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Flashcard not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(flashcard, "Flashcard updated successfully");
    } catch (error) {
        return handleError(error);
    }
}

// DELETE /api/flashcards/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const flashcard = await Flashcard.findByIdAndDelete(params.id);

        if (!flashcard) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Flashcard not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(
            { id: params.id },
            "Flashcard deleted successfully"
        );
    } catch (error) {
        return handleError(error);
    }
}
