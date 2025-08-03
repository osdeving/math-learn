import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { summarySchema } from "@/lib/validations/content";
import Summary from "@/models/Summary";
import { NextRequest } from "next/server";

// GET /api/summaries/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const summary = await Summary.findById(params.id)
            .populate("categoryIds", "name slug")
            .lean();

        if (!summary) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Summary not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(summary);
    } catch (error) {
        return handleError(error);
    }
}

// PUT /api/summaries/[id]
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const validatedData = summarySchema.partial().parse(body);

        const summary = await Summary.findByIdAndUpdate(
            params.id,
            { ...validatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("categoryIds", "name slug");

        if (!summary) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Summary not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(summary, "Summary updated successfully");
    } catch (error) {
        return handleError(error);
    }
}

// DELETE /api/summaries/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const summary = await Summary.findByIdAndDelete(params.id);

        if (!summary) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Summary not found",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        return successResponse(
            { id: params.id },
            "Summary deleted successfully"
        );
    } catch (error) {
        return handleError(error);
    }
}
