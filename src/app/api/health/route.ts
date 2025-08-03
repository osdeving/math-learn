import { errorResponse, successResponse } from "@/lib/api-helpers";
import dbConnect from "@/lib/mongodb";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        return successResponse(
            {
                status: "connected",
                timestamp: new Date().toISOString(),
                database: "MongoDB connected successfully",
            },
            "Database connection test successful"
        );
    } catch (error) {
        return errorResponse("Database connection failed", 500);
    }
}
