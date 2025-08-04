"use client";

import CategorySelector from "@/components/admin/CategorySelector";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface Alternative {
    text: string;
    isCorrect: boolean;
}

interface QuestionFormData {
    title: string;
    statement: string;
    alternatives: Alternative[];
    correctAnswer: number;
    explanation: string;
    categoryIds: string[];
    isPublished: boolean;
}

interface QuestionFormProps {
    questionId?: string;
    isEditing?: boolean;
}

export default function QuestionForm({ questionId, isEditing = false }: QuestionFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState<QuestionFormData>({
        title: "",
        statement: "",
        alternatives: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: "",
        categoryIds: [],
        isPublished: false,
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(isEditing);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories?published=true&limit=100");
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

    // Fetch existing question for editing
    useEffect(() => {
        if (!isEditing || !questionId) return;

        const fetchQuestion = async () => {
            try {
                setIsInitialLoading(true);
                const response = await fetch(`/api/questions/${questionId}`);
                
                if (!response.ok) {
                    throw new Error("Question not found");
                }

                const data = await response.json();
                setFormData({
                    title: data.title,
                    statement: data.statement,
                    alternatives: data.alternatives,
                    correctAnswer: data.correctAnswer,
                    explanation: data.explanation,
                    categoryIds: data.categoryIds.map((cat: any) => cat._id || cat),
                    isPublished: data.isPublished,
                });
            } catch (error) {
                console.error("Error fetching question:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar a questão.",
                    variant: "destructive",
                });
                router.push("/admin/questions");
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchQuestion();
    }, [isEditing, questionId, toast, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        // Client-side validation
        const newErrors: Record<string, any> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Título é obrigatório";
        }

        if (!formData.statement.trim()) {
            newErrors.statement = "Enunciado é obrigatório";
        }

        if (formData.categoryIds.length === 0) {
            newErrors.categoryIds = "Pelo menos uma categoria é obrigatória";
        }

        if (!formData.explanation.trim()) {
            newErrors.explanation = "Explicação é obrigatória";
        }

        // Validate alternatives
        const emptyAlternatives = formData.alternatives.filter(alt => !alt.text.trim());
        if (emptyAlternatives.length > 0) {
            newErrors.alternatives = "Todas as alternativas devem ser preenchidas";
        }

        const correctCount = formData.alternatives.filter(alt => alt.isCorrect).length;
        if (correctCount !== 1) {
            newErrors.alternatives = "Exatamente uma alternativa deve estar marcada como correta";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const url = isEditing
                ? `/api/questions/${questionId}`
                : "/api/questions";
            
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
                throw new Error(data.message || "Failed to save question");
            }

            toast({
                title: "Sucesso",
                description: `Questão ${isEditing ? "atualizada" : "criada"} com sucesso.`,
            });

            router.push("/admin/questions");
        } catch (error: any) {
            console.error("Error saving question:", error);
            toast({
                title: "Erro",
                description: error.message || `Não foi possível ${isEditing ? "atualizar" : "criar"} a questão.`,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof QuestionFormData, value: any) => {
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

    const handleAlternativeChange = (index: number, field: keyof Alternative, value: any) => {
        const newAlternatives = [...formData.alternatives];
        newAlternatives[index] = {
            ...newAlternatives[index],
            [field]: value,
        };

        // If marking as correct, unmark others
        if (field === "isCorrect" && value === true) {
            newAlternatives.forEach((alt, i) => {
                if (i !== index) {
                    alt.isCorrect = false;
                }
            });
            setFormData(prev => ({ ...prev, correctAnswer: index }));
        }

        setFormData(prev => ({ 
            ...prev, 
            alternatives: newAlternatives 
        }));

        // Clear alternatives error
        if (errors.alternatives) {
            setErrors((prev) => ({
                ...prev,
                alternatives: "",
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
                    <Link href="/admin/questions">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? "Editar Questão" : "Nova Questão"}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing
                            ? "Atualize a questão com 5 alternativas"
                            : "Crie uma nova questão de múltipla escolha"}
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
                        placeholder="Digite o título da questão..."
                        className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                    )}
                </div>

                {/* Statement */}
                <div>
                    <Label htmlFor="statement">Enunciado *</Label>
                    <Textarea
                        id="statement"
                        value={formData.statement}
                        onChange={(e) => handleChange("statement", e.target.value)}
                        placeholder="Digite o enunciado da questão..."
                        className={cn("min-h-[120px]", errors.statement ? "border-red-500" : "")}
                    />
                    {errors.statement && (
                        <p className="text-sm text-red-600 mt-1">{errors.statement}</p>
                    )}
                </div>

                {/* Alternatives */}
                <div>
                    <Label>Alternativas * (exatamente 5, sendo 1 correta)</Label>
                    <div className="space-y-3 mt-2">
                        {formData.alternatives.map((alternative, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-medium text-gray-600">
                                        {String.fromCharCode(65 + index)})
                                    </span>
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={alternative.isCorrect}
                                        onChange={(e) => handleAlternativeChange(index, "isCorrect", e.target.checked)}
                                        className="text-blue-600"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Textarea
                                        value={alternative.text}
                                        onChange={(e) => handleAlternativeChange(index, "text", e.target.value)}
                                        placeholder={`Digite a alternativa ${String.fromCharCode(65 + index)}...`}
                                        className="min-h-[60px] resize-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {errors.alternatives && (
                        <p className="text-sm text-red-600 mt-1">{errors.alternatives}</p>
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

                {/* Explanation */}
                <div>
                    <Label>Explicação *</Label>
                    <MarkdownEditor
                        value={formData.explanation}
                        onChange={(explanation) => handleChange("explanation", explanation)}
                        placeholder="Digite a explicação da resposta correta..."
                        error={errors.explanation}
                    />
                </div>

                {/* Published */}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="published"
                        checked={formData.isPublished}
                        onCheckedChange={(checked: boolean) => handleChange("isPublished", checked)}
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
                            ? "Atualizar Questão"
                            : "Criar Questão"}
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin/questions">Cancelar</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
