"use client";

import ContentFilters from "@/components/admin/ContentFilters";
import ContentPagination from "@/components/admin/ContentPagination";
import ContentTable from "@/components/admin/ContentTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface Question {
    _id: string;
    title: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    categoryIds: Array<{ name: string; slug: string }>;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface PaginationInfo {
    current: number;
    total: number;
    count: number;
    totalCount: number;
}

export default function QuestionsListPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <QuestionsListContent />
        </Suspense>
    );
}

function QuestionsListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        current: 1,
        total: 1,
        count: 0,
        totalCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams(searchParams);
            const response = await fetch(`/api/questions?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch questions");
            }

            const data = await response.json();
            setQuestions(data.data?.questions || []);
            setPagination(
                data.data?.pagination || {
                    current: 1,
                    total: 1,
                    count: 0,
                    totalCount: 0,
                }
            );
        } catch (error) {
            console.error("Error fetching questions:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as questões.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                "/api/categories?published=true&limit=100"
            );
            if (!response.ok) return;

            const data = await response.json();
            setCategories(data.data?.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta questão?")) return;

        try {
            const response = await fetch(`/api/questions/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete question");
            }

            toast({
                title: "Sucesso",
                description: "Questão excluída com sucesso.",
            });

            fetchQuestions();
        } catch (error) {
            console.error("Error deleting question:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir a questão.",
                variant: "destructive",
            });
        }
    };

    const handleTogglePublish = async (id: string, published: boolean) => {
        try {
            const response = await fetch(`/api/questions/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: published }),
            });

            if (!response.ok) {
                throw new Error("Failed to update question");
            }

            toast({
                title: "Sucesso",
                description: `Questão ${
                    published ? "publicada" : "despublicada"
                } com sucesso.`,
            });

            fetchQuestions();
        } catch (error) {
            console.error("Error updating question:", error);
            toast({
                title: "Erro",
                description: "Não foi possível atualizar a questão.",
                variant: "destructive",
            });
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Questões
                    </h1>
                    <p className="text-gray-600">
                        Gerencie as questões de múltipla escolha
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/questions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Questão
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ContentFilters
                categories={categories}
                basePath="/admin/questions"
            />

            {/* Table */}
            <ContentTable
                items={questions}
                basePath="/admin/questions"
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && (
                <ContentPagination
                    pagination={pagination}
                    basePath="/admin/questions"
                />
            )}
        </div>
    );
}
