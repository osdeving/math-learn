import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    CreditCard,
    FileText,
    HelpCircle,
    Star,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Category {
    _id: string;
    name: string;
    description: string;
    slug: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ContentItem {
    _id: string;
    title: string;
    description?: string;
    content?: string;
    front?: string;
    back?: string;
    statement?: string;
    alternatives?: Array<{ text: string; isCorrect: boolean }>;
    correctAnswer?: number;
    explanation?: string;
    categoryIds: Array<{ _id: string; name: string; slug: string }>;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface ContentResponse {
    success: boolean;
    data: {
        theories?: ContentItem[];
        summaries?: ContentItem[];
        flashcards?: ContentItem[];
        questions?: ContentItem[];
        pagination: {
            current: number;
            total: number;
            count: number;
            totalCount: number;
        };
    };
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const response = await fetch(
            `${baseUrl}/api/categories?search=${slug}&published=true`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) return null;

        const data = await response.json();
        if (data.success && data.data.categories.length > 0) {
            return (
                data.data.categories.find(
                    (cat: Category) => cat.slug === slug
                ) || null
            );
        }
        return null;
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
}

async function getCategoryContent(categoryId: string) {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

        const [theories, summaries, flashcards, questions] = await Promise.all([
            fetch(
                `${baseUrl}/api/theories?published=true&categoryId=${categoryId}&limit=50`
            ),
            fetch(
                `${baseUrl}/api/summaries?published=true&categoryId=${categoryId}&limit=50`
            ),
            fetch(
                `${baseUrl}/api/flashcards?published=true&categoryId=${categoryId}&limit=50`
            ),
            fetch(
                `${baseUrl}/api/questions?published=true&categoryId=${categoryId}&limit=50`
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
            theories: theoriesData.success ? theoriesData.data.theories : [],
            summaries: summariesData.success
                ? summariesData.data.summaries
                : [],
            flashcards: flashcardsData.success
                ? flashcardsData.data.flashcards
                : [],
            questions: questionsData.success
                ? questionsData.data.questions
                : [],
        };
    } catch (error) {
        console.error("Error fetching category content:", error);
        return { theories: [], summaries: [], flashcards: [], questions: [] };
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: "Categoria não encontrada - Math Learn",
        };
    }

    return {
        title: `${category.name} - Math Learn`,
        description: category.description,
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const content = await getCategoryContent(category._id);
    const totalContent =
        content.theories.length +
        content.summaries.length +
        content.flashcards.length +
        content.questions.length;

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

            {/* Category Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {category.name}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                            {category.description}
                        </p>
                        <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                        >
                            {totalContent} conteúdos disponíveis
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="theories" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger
                            value="theories"
                            className="flex items-center"
                        >
                            <BookOpen size={16} className="mr-2" />
                            Teorias ({content.theories.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="summaries"
                            className="flex items-center"
                        >
                            <FileText size={16} className="mr-2" />
                            Resumos ({content.summaries.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="flashcards"
                            className="flex items-center"
                        >
                            <CreditCard size={16} className="mr-2" />
                            Flashcards ({content.flashcards.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="questions"
                            className="flex items-center"
                        >
                            <HelpCircle size={16} className="mr-2" />
                            Questões ({content.questions.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="theories">
                        <ContentGrid
                            items={content.theories}
                            type="theory"
                            emptyMessage="Nenhuma teoria disponível nesta categoria."
                        />
                    </TabsContent>

                    <TabsContent value="summaries">
                        <ContentGrid
                            items={content.summaries}
                            type="summary"
                            emptyMessage="Nenhum resumo disponível nesta categoria."
                        />
                    </TabsContent>

                    <TabsContent value="flashcards">
                        <ContentGrid
                            items={content.flashcards}
                            type="flashcard"
                            emptyMessage="Nenhum flashcard disponível nesta categoria."
                        />
                    </TabsContent>

                    <TabsContent value="questions">
                        <ContentGrid
                            items={content.questions}
                            type="question"
                            emptyMessage="Nenhuma questão disponível nesta categoria."
                        />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

function ContentGrid({
    items,
    type,
    emptyMessage,
}: {
    items: ContentItem[];
    type: "theory" | "summary" | "flashcard" | "question";
    emptyMessage: string;
}) {
    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    {type === "theory" && (
                        <BookOpen size={64} className="mx-auto" />
                    )}
                    {type === "summary" && (
                        <FileText size={64} className="mx-auto" />
                    )}
                    {type === "flashcard" && (
                        <CreditCard size={64} className="mx-auto" />
                    )}
                    {type === "question" && (
                        <HelpCircle size={64} className="mx-auto" />
                    )}
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {emptyMessage}
                </h3>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <ContentCard key={item._id} item={item} type={type} />
            ))}
        </div>
    );
}

function ContentCard({
    item,
    type,
}: {
    item: ContentItem;
    type: "theory" | "summary" | "flashcard" | "question";
}) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR");
    };

    const getContentPreview = () => {
        switch (type) {
            case "theory":
            case "summary":
                // Remove LaTeX markup for preview
                const cleanContent =
                    item.content
                        ?.replace(/\$\$[\s\S]*?\$\$/g, "[Fórmula Matemática]")
                        ?.replace(/\$[^$\n]+\$/g, "[Equação]")
                        ?.substring(0, 150) + "...";
                return cleanContent || "Sem conteúdo disponível";
            case "flashcard":
                return (
                    item.front?.substring(0, 100) + "..." ||
                    "Sem conteúdo disponível"
                );
            case "question":
                return (
                    item.statement?.substring(0, 150) + "..." ||
                    "Sem conteúdo disponível"
                );
            default:
                return "Conteúdo indisponível";
        }
    };

    const getIcon = () => {
        switch (type) {
            case "theory":
                return <BookOpen size={20} className="text-blue-500" />;
            case "summary":
                return <FileText size={20} className="text-green-500" />;
            case "flashcard":
                return <CreditCard size={20} className="text-purple-500" />;
            case "question":
                return <HelpCircle size={20} className="text-orange-500" />;
        }
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                        {getIcon()}
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {item.title}
                        </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {formatDate(item.createdAt)}
                    </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600">
                    {getContentPreview()}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        Atualizado em {formatDate(item.updatedAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                        {item.categoryIds.map((cat) => (
                            <Badge
                                key={cat._id}
                                variant="secondary"
                                className="text-xs"
                            >
                                {cat.name}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Favorite button placeholder for RN5 */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <button className="flex items-center text-gray-400 hover:text-yellow-500 transition-colors text-sm">
                        <Star size={16} className="mr-2" />
                        Adicionar aos Favoritos
                    </button>

                    {/* Botão para ver conteúdo completo */}
                    {type === "theory" && (
                        <Link href={`/theory/${item._id}`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                            >
                                <BookOpen size={14} className="mr-1" />
                                Ver Completo
                            </Button>
                        </Link>
                    )}

                    {type === "question" && (
                        <Link href={`/question/${item._id}`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                            >
                                <HelpCircle size={14} className="mr-1" />
                                Responder
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
