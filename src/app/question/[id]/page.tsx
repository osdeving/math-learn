import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InteractiveQuestion from "@/components/InteractiveQuestion";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Dynamic import to avoid SSR issues with KaTeX
const MarkdownRenderer = dynamic(
    () => import("@/components/MarkdownRenderer"),
    {
        ssr: false,
        loading: () => <div className="animate-pulse h-4 bg-gray-200 rounded" />,
    }
);

interface Question {
    _id: string;
    title: string;
    statement: string;
    alternatives: Array<{ text: string; isCorrect: boolean }>;
    correctAnswer: number;
    explanation: string;
    categoryIds: Array<{ _id: string; name: string; slug: string }>;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

async function getQuestion(id: string): Promise<Question | null> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/questions/${id}`, {
            cache: "no-store",
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.success ? data.data : null;
    } catch (error) {
        console.error("Error fetching question:", error);
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const question = await getQuestion(id);

    if (!question) {
        return {
            title: "Questão não encontrada - Math Learn",
        };
    }

    return {
        title: `${question.title} - Math Learn`,
        description: question.statement.substring(0, 160) + "...",
    };
}

export default async function QuestionPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const question = await getQuestion(id);

    if (!question || !question.isPublished) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <ArrowLeft size={20} className="mr-2" />
                                Voltar às Categorias
                            </Link>
                        </div>
                        <Link
                            href="/admin"
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Área Administrativa →
                        </Link>
                    </div>
                </div>
            </header>

            {/* Question Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Question Header */}
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-2xl text-gray-900 mb-2">
                                        {question.title}
                                    </CardTitle>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <Calendar size={14} className="mr-1" />
                                            {formatDate(question.createdAt)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {question.categoryIds.map((cat) => (
                                                <Badge
                                                    key={cat._id}
                                                    variant="secondary"
                                                >
                                                    {cat.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <BookOpen className="text-orange-500" size={24} />
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Question Statement */}
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-lg text-gray-900">
                                Enunciado
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-blue max-w-none">
                                <MarkdownRenderer content={question.statement} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Interactive Question Component */}
                    <InteractiveQuestion question={question} />
                </div>
            </main>
        </div>
    );
}
