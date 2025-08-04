"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationInfo {
    current: number;
    total: number;
    count: number;
    totalCount: number;
}

interface ContentPaginationProps {
    pagination: PaginationInfo;
    basePath: string;
}

export default function ContentPagination({
    pagination,
    basePath,
}: ContentPaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updatePage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }
        router.push(`${basePath}?${params.toString()}`);
    };

    const updateLimit = (limit: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("limit", limit);
        params.delete("page"); // Reset to first page
        router.push(`${basePath}?${params.toString()}`);
    };

    const { current, total, count, totalCount } = pagination;

    if (total <= 1) return null;

    const startItem = (current - 1) * count + 1;
    const endItem = Math.min(current * count, totalCount);

    return (
        <div className="flex items-center justify-between px-2 py-4">
            {/* Results info */}
            <div className="flex items-center space-x-2">
                <p className="text-sm text-gray-700">
                    Mostrando {startItem} a {endItem} de {totalCount} resultados
                </p>
                <Select
                    value={searchParams.get("limit") || "10"}
                    onValueChange={updateLimit}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-gray-700">por página</span>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePage(current - 1)}
                    disabled={current <= 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(7, total) }, (_, i) => {
                        let page;
                        if (total <= 7) {
                            page = i + 1;
                        } else if (current <= 4) {
                            page = i + 1;
                        } else if (current >= total - 3) {
                            page = total - 6 + i;
                        } else {
                            page = current - 3 + i;
                        }

                        return (
                            <Button
                                key={page}
                                variant={
                                    current === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => updatePage(page)}
                                className="w-10"
                            >
                                {page}
                            </Button>
                        );
                    })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePage(current + 1)}
                    disabled={current >= total}
                >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
