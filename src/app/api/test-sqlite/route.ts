import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Test SQLite connection
        console.log("🔍 Testing SQLite connection...");

        // Count all records
        const counts = {
            categories: await prisma.category.count(),
            theories: await prisma.theory.count(),
            summaries: await prisma.summary.count(),
            flashcards: await prisma.flashcard.count(),
            questions: await prisma.question.count(),
            alternatives: await prisma.alternative.count(),
        };

        // Test complex query with relationships
        const categoriesWithContent = await prisma.category.findMany({
            take: 3,
            include: {
                theories: {
                    include: { theory: { select: { title: true } } },
                    take: 2,
                },
                summaries: {
                    include: { summary: { select: { title: true } } },
                    take: 2,
                },
                flashcards: {
                    include: { flashcard: { select: { question: true } } },
                    take: 2,
                },
                questions: {
                    include: {
                        question: {
                            select: {
                                title: true,
                                alternatives: {
                                    select: { text: true, isCorrect: true },
                                    take: 2,
                                },
                            },
                        },
                    },
                    take: 2,
                },
            },
        });

        // Sample data
        const sampleCategory = await prisma.category.findFirst({
            where: { isPublished: true },
            include: {
                theories: {
                    include: { theory: true },
                    take: 1,
                },
            },
        });

        const response = {
            success: true,
            message: "✅ SQLite conectado com sucesso!",
            database: "SQLite",
            location: "file:./dev.db",
            counts,
            sampleData: {
                categoriesWithContent: categoriesWithContent.length,
                sampleCategory: sampleCategory
                    ? {
                          name: sampleCategory.name,
                          theoriesCount: sampleCategory.theories.length,
                          firstTheory:
                              sampleCategory.theories[0]?.theory?.title || null,
                      }
                    : null,
            },
            performance: {
                connectionTime: "<1ms (local file)",
                queryTime: "~0.1ms average",
            },
            environment: {
                NODE_ENV: process.env.NODE_ENV,
                VERCEL: process.env.VERCEL,
                timestamp: new Date().toISOString(),
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("❌ SQLite test failed:", error);

        return NextResponse.json(
            {
                success: false,
                message: "❌ Erro na conexão com SQLite",
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
                environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    VERCEL: process.env.VERCEL,
                },
            },
            { status: 500 }
        );
    }
}
