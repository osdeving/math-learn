"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface ContentFiltersProps {
    categories: Category[];
    basePath: string;
}

export default function ContentFilters({
    categories,
    basePath,
}: ContentFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [categoryId, setCategoryId] = useState(
        searchParams.get("categoryId") || ""
    );
    const [published, setPublished] = useState(
        searchParams.get("published") || ""
    );

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const updateURL = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams);

            Object.entries(updates).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });

            params.delete("page"); // Reset page when filtering
            router.push(`${basePath}?${params.toString()}`);
        },
        [basePath, router, searchParams]
    );

    useEffect(() => {
        updateURL({ search: debouncedSearch });
    }, [debouncedSearch, updateURL]);

    const handleCategoryChange = (value: string) => {
        const finalValue = value === "all" ? "" : value;
        setCategoryId(finalValue);
        updateURL({ categoryId: finalValue });
    };

    const handlePublishedChange = (value: string) => {
        const finalValue = value === "all" ? "" : value;
        setPublished(finalValue);
        updateURL({ published: finalValue });
    };

    const clearFilters = () => {
        setSearch("");
        setCategoryId("");
        setPublished("");
        router.push(basePath);
    };

    const hasFilters = search || categoryId || published;

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Buscar por título ou conteúdo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Category Filter */}
            <Select
                value={categoryId || "all"}
                onValueChange={handleCategoryChange}
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories && categories.length > 0 && categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
                value={published || "all"}
                onValueChange={handlePublishedChange}
            >
                <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Publicado</SelectItem>
                    <SelectItem value="false">Rascunho</SelectItem>
                </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasFilters && (
                <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpar
                </Button>
            )}
        </div>
    );
}
