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

interface Flashcard {
    _id: string;
    question: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    categoryIds: Array<{ name: string; slug: string }>;
    // Adapting to ContentTable interface
    title: string;
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

export default function FlashcardsListPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        current: 1,
        total: 1,
        count: 0,
        totalCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const fetchFlashcards = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams(searchParams);
            const response = await fetch(
                `/api/flashcards?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch flashcards");
            }

            const data = await response.json();
            // Adapt flashcards to ContentTable interface
            const adaptedFlashcards = (data.data?.flashcards || []).map(
                (flashcard: any) => ({
                    ...flashcard,
                    title: flashcard.question, // Use question as title for ContentTable
                })
            );
            setFlashcards(adaptedFlashcards);
            setPagination(
                data.data?.pagination || {
                    current: 1,
                    total: 1,
                    count: 0,
                    totalCount: 0,
                }
            );
        } catch (error) {
            console.error("Error fetching flashcards:", error);
            toast({
                title: "Erro",
                description: "Não foi possível carregar os flashcards.",
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
        fetchFlashcards();
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este flashcard?")) return;

        try {
            const response = await fetch(`/api/flashcards/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete flashcard");
            }

            toast({
                title: "Sucesso",
                description: "Flashcard excluído com sucesso.",
            });

            fetchFlashcards();
        } catch (error) {
            console.error("Error deleting flashcard:", error);
            toast({
                title: "Erro",
                description: "Não foi possível excluir o flashcard.",
                variant: "destructive",
            });
        }
    };

    const handleTogglePublish = async (id: string, published: boolean) => {
        try {
            const response = await fetch(`/api/flashcards/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: published }),
            });

            if (!response.ok) {
                throw new Error("Failed to update flashcard");
            }

            toast({
                title: "Sucesso",
                description: `Flashcard ${
                    published ? "publicado" : "despublicado"
                } com sucesso.`,
            });

            fetchFlashcards();
        } catch (error) {
            console.error("Error updating flashcard:", error);
            toast({
                title: "Erro",
                description: "Não foi possível atualizar o flashcard.",
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
                        Flashcards
                    </h1>
                    <p className="text-gray-600">
                        Gerencie os flashcards para memorização
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/flashcards/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Flashcard
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <ContentFilters
                categories={categories}
                basePath="/admin/flashcards"
            />

            {/* Table */}
            <ContentTable
                items={flashcards}
                basePath="/admin/flashcards"
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
                isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && (
                <ContentPagination
                    pagination={pagination}
                    basePath="/admin/flashcards"
                />
            )}
        </div>
    );
}
