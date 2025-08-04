"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CategoryFormData {
    name: string;
    description: string;
    slug: string;
    isPublished: boolean;
}

interface CategoryFormProps {
    categoryId?: string;
    isEditing?: boolean;
}

export default function CategoryForm({
    categoryId,
    isEditing = false,
}: CategoryFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        description: "",
        slug: "",
        isPublished: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(isEditing);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "")
            .trim();
    };

    // Fetch existing category for editing
    useEffect(() => {
        if (!isEditing || !categoryId) return;

        const fetchCategory = async () => {
            try {
                setIsInitialLoading(true);
                const response = await fetch(`/api/categories/${categoryId}`);

                if (!response.ok) {
                    throw new Error("Category not found");
                }

                const data = await response.json();
                const categoryData = data.data;
                setFormData({
                    name: categoryData.name,
                    description: categoryData.description,
                    slug: categoryData.slug,
                    isPublished: categoryData.isPublished,
                });
            } catch (error) {
                console.error("Error fetching category:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar a categoria.",
                    variant: "destructive",
                });
                router.push("/admin/categories");
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchCategory();
    }, [isEditing, categoryId, toast, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const url = isEditing
                ? `/api/categories/${categoryId}`
                : "/api/categories";

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
                    const formErrors: Record<string, string> = {};
                    data.errors.forEach(
                        (error: { field: string; message: string }) => {
                            formErrors[error.field] = error.message;
                        }
                    );
                    setErrors(formErrors);
                    return;
                }
                throw new Error(data.message || "Failed to save category");
            }

            toast({
                title: "Sucesso",
                description: `Categoria ${
                    isEditing ? "atualizada" : "criada"
                } com sucesso.`,
            });

            router.push("/admin/categories");
        } catch (error: any) {
            console.error("Error saving category:", error);
            toast({
                title: "Erro",
                description:
                    error.message ||
                    `Não foi possível ${
                        isEditing ? "atualizar" : "criar"
                    } a categoria.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof CategoryFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Auto-generate slug when name changes
        if (field === "name" && !isEditing) {
            setFormData((prev) => ({
                ...prev,
                name: value,
                slug: generateSlug(value),
            }));
        }

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
                <div className="h-32 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/categories">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Editar Categoria" : "Nova Categoria"}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing
                            ? "Atualize os dados da categoria"
                            : "Crie uma nova categoria de matemática"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Digite o nome da categoria..."
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <Label htmlFor="description">Descrição *</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            handleChange("description", e.target.value)
                        }
                        placeholder="Digite a descrição da categoria..."
                        className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.description}
                        </p>
                    )}
                </div>

                {/* Slug */}
                <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => handleChange("slug", e.target.value)}
                        placeholder="slug-da-categoria"
                        className={errors.slug ? "border-red-500" : ""}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        URL amigável da categoria. Gerada automaticamente, mas
                        pode ser editada.
                    </p>
                    {errors.slug && (
                        <p className="text-sm text-red-600 mt-1">
                            {errors.slug}
                        </p>
                    )}
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
                            ? "Atualizar Categoria"
                            : "Criar Categoria"}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/categories">Cancelar</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
