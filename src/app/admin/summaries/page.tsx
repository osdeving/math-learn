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

interface Summary {
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

export default function SummariesListPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <SummariesListContent />
        </Suspense>
    );
}

function SummariesListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [summaries, setSummaries] = useState<Summary[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        current: 1,
        total: 1,
        count: 0,
        totalCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchSummaries = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams(searchParams);
            const response = await fetch(`/api/summaries?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch summaries");
            }

            const data = await response.json();
            setSummaries(data.data?.summaries || []);
            setPagination(
                data.data?.pagination || {
                    current: 1,
                    total: 1,
                    count: 0,
                    totalCount: 0,
                }
            );
        } catch (error) {
            console.error("Error fetching summaries:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os resumos.",
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
        fetchSummaries();
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este resumo?")) return;

        try {
            const response = await fetch(`/api/summaries/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete summary");
            }

            toast({
                title: "Sucesso",
                description: "Resumo excluído com sucesso.",
            });

            fetchSummaries();
        } catch (error) {
            console.error("Error deleting summary:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir o resumo.",
                variant: "destructive",
            });
        }
    };

    const handleTogglePublish = async (id: string, published: boolean) => {
        try {
            const response = await fetch(`/api/summaries/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: published }),
            });

            if (!response.ok) {
                throw new Error("Failed to update summary");
            }

            toast({
                title: "Sucesso",
                description: `Resumo ${
                    published ? "publicado" : "despublicado"
                } com sucesso.`,
            });

            fetchSummaries();
        } catch (error) {
            console.error("Error updating summary:", error);
            toast({
                title: "Erro",
                description: "Não foi possível atualizar o resumo.",
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
                        Resumos
                    </h1>
                    <p className="text-gray-600">
                        Gerencie os resumos de conteúdo da plataforma
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/summaries/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Resumo
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ContentFilters
                categories={categories}
                basePath="/admin/summaries"
            />

            {/* Table */}
            <ContentTable
                items={summaries}
                basePath="/admin/summaries"
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && (
                <ContentPagination
                    pagination={pagination}
                    basePath="/admin/summaries"
                />
            )}
        </div>
    );
}
