import { handleError, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import { NextRequest } from "next/server";

// GET /api/favorites/check?userId=xxx&contentId=xxx&contentType=xxx
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const contentId = searchParams.get("contentId");
        const contentType = searchParams.get("contentType");

        if (!userId || !contentId || !contentType) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message:
                        "Missing required parameters: userId, contentId, contentType",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const favorite = await Favorite.findOne({
            userId,
            contentId,
            contentType,
        });

        return successResponse({
            favorited: !!favorite,
        });
    } catch (error) {
        return handleError(error);
    }
}
