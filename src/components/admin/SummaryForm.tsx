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

interface SummaryFormData {
    title: string;
    content: string;
    categoryIds: string[];
    isPublished: boolean;
}

interface SummaryFormProps {
    summaryId?: string;
    isEditing?: boolean;
}

export default function SummaryForm({
    summaryId,
    isEditing = false,
}: SummaryFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState<SummaryFormData>({
        title: "",
        content: "",
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
                    setCategories(data.data?.categories || []);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch existing summary for editing
    useEffect(() => {
        if (!isEditing || !summaryId) return;

        const fetchSummary = async () => {
            try {
                setIsInitialLoading(true);
                const response = await fetch(`/api/summaries/${summaryId}`);

                if (!response.ok) {
                    throw new Error("Summary not found");
                }

                const data = await response.json();
                const summaryData = data.data;
                setFormData({
                    title: summaryData.title,
                    content: summaryData.content,
                    categoryIds: summaryData.categoryIds.map(
                        (cat: any) => cat._id || cat
                    ),
                    isPublished: summaryData.isPublished,
                });
            } catch (error) {
                console.error("Error fetching summary:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar o resumo.",
                    variant: "destructive",
                });
                router.push("/admin/summaries");
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchSummary();
    }, [isEditing, summaryId, toast, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const url = isEditing
                ? `/api/summaries/${summaryId}`
                : "/api/summaries";

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
                throw new Error(data.message || "Failed to save summary");
            }

            toast({
                title: "Sucesso",
                description: `Resumo ${
                    isEditing ? "atualizado" : "criado"
                } com sucesso.`,
            });

            router.push("/admin/summaries");
        } catch (error: any) {
            console.error("Error saving summary:", error);
            toast({
                title: "Erro",
                description:
                    error.message ||
                    `Não foi possível ${
                        isEditing ? "atualizar" : "criar"
                    } o resumo.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof SummaryFormData, value: any) => {
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
                    <Link href="/admin/summaries">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Editar Resumo" : "Novo Resumo"}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing
                            ? "Atualize o resumo de conteúdo"
                            : "Crie novo resumo conciso com suporte a LaTeX"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        placeholder="Digite o título do resumo..."
                        className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.title}
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

                {/* Content */}
                <div>
                    <Label>Conteúdo *</Label>
                    <MarkdownEditor
                        value={formData.content}
                        onChange={(content) => handleChange("content", content)}
                        error={errors.content}
                        placeholder="Digite o resumo em Markdown. Use LaTeX para fórmulas: $x^2$ para inline e $$x^2$$ para bloco..."
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
                            ? "Atualizar Resumo"
                            : "Criar Resumo"}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/summaries">Cancelar</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
