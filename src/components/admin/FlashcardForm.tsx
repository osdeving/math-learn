"use client";

import CategorySelector from "@/components/admin/CategorySelector";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface FlashcardFormData {
    question: string;
    answer: string;
    categoryIds: string[];
    isPublished: boolean;
}

interface FlashcardFormProps {
    flashcardId?: string;
    isEditing?: boolean;
}

export default function FlashcardForm({
    flashcardId,
    isEditing = false,
}: FlashcardFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState<FlashcardFormData>({
        question: "",
        answer: "",
        categoryIds: [],
        isPublished: false,
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(isEditing);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    "/api/categories?published=true&limit=100"
                );
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || []);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch existing flashcard for editing
    useEffect(() => {
        if (!isEditing || !flashcardId) return;

        const fetchFlashcard = async () => {
            try {
                setIsInitialLoading(true);
                const response = await fetch(`/api/flashcards/${flashcardId}`);

                if (!response.ok) {
                    throw new Error("Flashcard not found");
                }

                const data = await response.json();
                setFormData({
                    question: data.question,
                    answer: data.answer,
                    categoryIds: data.categoryIds.map(
                        (cat: any) => cat._id || cat
                    ),
                    isPublished: data.isPublished,
                });
            } catch (error) {
                console.error("Error fetching flashcard:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar o flashcard.",
                    variant: "destructive",
                });
                router.push("/admin/flashcards");
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchFlashcard();
    }, [isEditing, flashcardId, toast, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const url = isEditing
                ? `/api/flashcards/${flashcardId}`
                : "/api/flashcards";

            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                    return;
                }
                throw new Error(data.message || "Failed to save flashcard");
            }

            toast({
                title: "Sucesso",
                description: `Flashcard ${
                    isEditing ? "atualizado" : "criado"
                } com sucesso.`,
            });

            router.push("/admin/flashcards");
        } catch (error: any) {
            console.error("Error saving flashcard:", error);
            toast({
                title: "Erro",
                description:
                    error.message ||
                    `Não foi possível ${
                        isEditing ? "atualizar" : "criar"
                    } o flashcard.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof FlashcardFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-64 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/flashcards">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Editar Flashcard" : "Novo Flashcard"}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing
                            ? "Atualize o flashcard"
                            : "Crie um novo flashcard para memorização"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div>
                    <Label htmlFor="question">Pergunta *</Label>
                    <Input
                        id="question"
                        value={formData.question}
                        onChange={(e) =>
                            handleChange("question", e.target.value)
                        }
                        placeholder="Digite a pergunta do flashcard..."
                        className={errors.question ? "border-red-500" : ""}
                    />
                    {errors.question && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.question}
                        </p>
                    )}
                </div>

                {/* Categories */}
                <div>
                    <Label>Categorias *</Label>
                    <CategorySelector
                        categories={categories}
                        selectedIds={formData.categoryIds}
                        onChange={(ids) => handleChange("categoryIds", ids)}
                        error={errors.categoryIds}
                    />
                </div>

                {/* Answer */}
                <div>
                    <Label>Resposta *</Label>
                    <MarkdownEditor
                        value={formData.answer}
                        onChange={(answer) => handleChange("answer", answer)}
                        placeholder="Digite a resposta do flashcard..."
                        error={errors.answer}
                    />
                </div>

                {/* Published */}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="published"
                        checked={formData.isPublished}
                        onCheckedChange={(checked: boolean) =>
                            handleChange("isPublished", checked)
                        }
                    />
                    <Label htmlFor="published">Publicar imediatamente</Label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6">
                    <Button type="submit" disabled={isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading
                            ? isEditing
                                ? "Atualizando..."
                                : "Criando..."
                            : isEditing
                            ? "Atualizar Flashcard"
                            : "Criar Flashcard"}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/flashcards">Cancelar</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
