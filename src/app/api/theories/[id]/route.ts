import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { theorySchema } from "@/lib/validations/content";
import Theory from "@/models/Theory";
import { NextRequest } from "next/server";

// GET /api/theories/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const theory = await Theory.findById(params.id)
            .populate("categoryIds", "name slug")
            .lean();

        if (!theory) {
            return new Response(
                JSON.stringify({ success: false, message: "Theory not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(theory);
    } catch (error) {
        return handleError(error);
    }
}

// PUT /api/theories/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = theorySchema.partial().parse(body);

        const theory = await Theory.findByIdAndUpdate(
            params.id,
            { ...validatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("categoryIds", "name slug");

        if (!theory) {
            return new Response(
                JSON.stringify({ success: false, message: "Theory not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(theory, "Theory updated successfully");
    } catch (error) {
        return handleError(error);
    }
}

// PATCH /api/theories/[id] - Toggle publish/unpublish
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

        const theory = await Theory.findByIdAndUpdate(
            params.id,
            { isPublished, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("categoryIds", "name slug");

        if (!theory) {
            return new Response(
                JSON.stringify({ success: false, message: "Theory not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(
            theory,
            `Theory ${isPublished ? "published" : "unpublished"} successfully`
        );
    } catch (error) {
        return handleError(error);
    }
}

// DELETE /api/theories/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const theory = await Theory.findByIdAndDelete(params.id);

        if (!theory) {
            return new Response(
                JSON.stringify({ success: false, message: "Theory not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(
            { id: params.id },
            "Theory deleted successfully"
        );
    } catch (error) {
        return handleError(error);
    }
}
