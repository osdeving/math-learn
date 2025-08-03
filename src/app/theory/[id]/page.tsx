import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dbConnect from "@/lib/mongodb";
import Theory from "@/models/Theory";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TheoryPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getTheory(id: string) {
    try {
        await dbConnect();

        const theory = await Theory.findById(id)
            .populate("categoryIds", "name slug")
            .lean();

        if (!theory) {
            return null;
        }

        return {
            ...theory,
            _id: theory._id.toString(),
            categories: theory.categoryIds.map((cat: any) => ({
                ...cat,
                _id: cat._id.toString(),
            })),
            createdAt: theory.createdAt?.toISOString(),
            updatedAt: theory.updatedAt?.toISOString(),
        };
    } catch (error) {
        console.error("Erro ao buscar teoria:", error);
        return null;
    }
}

export default async function TheoryPage({ params }: TheoryPageProps) {
    const { id } = await params;
    const theory = await getTheory(id);
    if (!theory) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header com navegação */}
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Home
                        </Button>
                    </Link>

                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                                        {theory.title}
                                    </CardTitle>

                                    {/* Categorias */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {theory.categories?.map(
                                            (category: any) => (
                                                <Link
                                                    key={category._id}
                                                    href={`/category/${category.slug}`}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="hover:bg-blue-100 cursor-pointer transition-colors"
                                                    >
                                                        {category.name}
                                                    </Badge>
                                                </Link>
                                            )
                                        )}
                                    </div>

                                    {/* Metadados */}
                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4" />
                                            <span>Teoria</span>
                                        </div>

                                        {theory.createdAt && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(
                                                        theory.createdAt
                                                    ).toLocaleDateString(
                                                        "pt-BR"
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Conteúdo principal */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-8">
                        <MarkdownRenderer
                            content={theory.content}
                            className="text-gray-800"
                        />
                    </CardContent>
                </Card>

                {/* Footer com ações */}
                <div className="mt-8 text-center">
                    <Link href="/">
                        <Button variant="outline" size="lg">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Explorar mais conteúdo
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
