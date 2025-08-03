import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowRight,
    BookOpen,
    CreditCard,
    FileText,
    HelpCircle,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    description: string;
    slug: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ContentCounts {
    theories: number;
    summaries: number;
    flashcards: number;
    questions: number;
}

async function getPublishedCategories(): Promise<Category[]> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const response = await fetch(
            `${baseUrl}/api/categories?published=true&limit=100`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        return data.success ? data.data.categories : [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

async function getContentCounts(categoryId: string): Promise<ContentCounts> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        const [theories, summaries, flashcards, questions] = await Promise.all([
            fetch(
                `${baseUrl}/api/theories?published=true&categoryId=${categoryId}&limit=1`
            ),
            fetch(
                `${baseUrl}/api/summaries?published=true&categoryId=${categoryId}&limit=1`
            ),
            fetch(
                `${baseUrl}/api/flashcards?published=true&categoryId=${categoryId}&limit=1`
            ),
            fetch(
                `${baseUrl}/api/questions?published=true&categoryId=${categoryId}&limit=1`
            ),
        ]);

        const [theoriesData, summariesData, flashcardsData, questionsData] =
            await Promise.all([
                theories.json(),
                summaries.json(),
                flashcards.json(),
                questions.json(),
            ]);

        return {
            theories: theoriesData.success
                ? theoriesData.data.pagination.totalCount
                : 0,
            summaries: summariesData.success
                ? summariesData.data.pagination.totalCount
                : 0,
            flashcards: flashcardsData.success
                ? flashcardsData.data.pagination.totalCount
                : 0,
            questions: questionsData.success
                ? questionsData.data.pagination.totalCount
                : 0,
        };
    } catch (error) {
        console.error("Error fetching content counts:", error);
        return { theories: 0, summaries: 0, flashcards: 0, questions: 0 };
    }
}

export const metadata: Metadata = {
    title: "Categorias - Math Learn",
    description:
        "Explore as categorias de conteúdo matemático disponíveis na plataforma Math Learn.",
};

export default async function CategoriesPage() {
    const categories = await getPublishedCategories();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Math Learn
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Plataforma de aprendizado matemático
                            </p>
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

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Explore por Categoria
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Descubra conteúdos organizados por área matemática. Cada
                        categoria contém teoria, resumos, flashcards e questões
                        práticas.
                    </p>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <BookOpen size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Nenhuma categoria disponível
                        </h3>
                        <p className="text-gray-500">
                            As categorias serão exibidas aqui quando estiverem
                            publicadas.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category._id}
                                category={category}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-gray-600">
                        <p>
                            &copy; 2024 Math Learn - Plataforma de Aprendizado
                            Matemático
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

async function CategoryCard({ category }: { category: Category }) {
    const counts = await getContentCounts(category._id);
    const totalContent =
        counts.theories +
        counts.summaries +
        counts.flashcards +
        counts.questions;

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-blue-100">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                        </CardTitle>
                        <CardDescription className="mt-2 text-gray-600">
                            {category.description}
                        </CardDescription>
                    </div>
                    <Badge
                        variant="secondary"
                        className="ml-2 bg-blue-100 text-blue-800"
                    >
                        {totalContent} itens
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {/* Content Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <BookOpen size={16} className="mr-2 text-blue-500" />
                        {counts.theories} Teorias
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <FileText size={16} className="mr-2 text-green-500" />
                        {counts.summaries} Resumos
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <CreditCard
                            size={16}
                            className="mr-2 text-purple-500"
                        />
                        {counts.flashcards} Flashcards
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <HelpCircle
                            size={16}
                            className="mr-2 text-orange-500"
                        />
                        {counts.questions} Questões
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
                >
                    Explorar Categoria
                    <ArrowRight
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                    />
                </Link>
            </CardContent>
        </Card>
    );
}
