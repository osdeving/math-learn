"use client";

import ContentFilters from "@/components/admin/ContentFilters";
import ContentPagination from "@/components/admin/ContentPagination";
import ContentTable from "@/components/admin/ContentTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Theory {
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

export default function TheoryListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [theories, setTheories] = useState<Theory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        current: 1,
        total: 1,
        count: 0,
        totalCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTheories = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams(searchParams);
            const response = await fetch(`/api/theories?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Failed to fetch theories");
            }

            const data = await response.json();
            setTheories(data.theories || []);
            setPagination(data.pagination || {
                current: 1,
                total: 1,
                count: 0,
                totalCount: 0,
            });
        } catch (error) {
            console.error("Error fetching theories:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar as teorias.",
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
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchTheories();
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta teoria?")) return;

        try {
            const response = await fetch(`/api/theories/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete theory");
            }

            toast({
                title: "Sucesso",
                description: "Teoria excluída com sucesso.",
            });

            fetchTheories();
        } catch (error) {
            console.error("Error deleting theory:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir a teoria.",
                variant: "destructive",
            });
        }
    };

    const handleTogglePublish = async (id: string, published: boolean) => {
        try {
            const response = await fetch(`/api/theories/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: published }),
            });

            if (!response.ok) {
                throw new Error("Failed to update theory");
            }

            toast({
                title: "Sucesso",
                description: `Teoria ${
                    published ? "publicada" : "despublicada"
                } com sucesso.`,
            });

            fetchTheories();
        } catch (error) {
            console.error("Error updating theory:", error);
            toast({
                title: "Erro",
                description: "Não foi possível atualizar a teoria.",
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
                        Teorias
                    </h1>
                    <p className="text-gray-600">
                        Gerencie o conteúdo teórico da plataforma
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/theory/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Teoria
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ContentFilters categories={categories} basePath="/admin/theory" />

            {/* Table */}
            <ContentTable
                items={theories}
                basePath="/admin/theory"
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && (
                <ContentPagination
                    pagination={pagination}
                    basePath="/admin/theory"
                />
            )}
        </div>
    );
}
