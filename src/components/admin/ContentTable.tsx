"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";

export interface ContentItem {
    _id: string;
    title: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    categoryIds?: Array<{ name: string; slug: string }>;
}

interface ContentTableProps {
    items: ContentItem[];
    basePath: string;
    onDelete?: (id: string) => void;
    onTogglePublish?: (id: string, published: boolean) => void;
    isLoading?: boolean;
}

export default function ContentTable({
    items,
    basePath,
    onDelete,
    onTogglePublish,
    isLoading = false,
}: ContentTableProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Nenhum item encontrado.</p>
                <Button asChild className="mt-4">
                    <Link href={`${basePath}/new`}>Criar primeiro item</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categorias</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead>Atualizado em</TableHead>
                        <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell className="font-medium">
                                <Link
                                    href={`${basePath}/${item._id}`}
                                    className="hover:underline"
                                >
                                    {item.title}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {item.categoryIds?.map((category) => (
                                        <Badge
                                            key={category.slug}
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={item.isPublished ? "default" : "secondary"}
                                >
                                    {item.isPublished ? "Publicado" : "Rascunho"}
                                </Badge>
                            </TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                            <TableCell>{formatDate(item.updatedAt)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`${basePath}/${item._id}`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`${basePath}/${item._id}/preview`}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview
                                            </Link>
                                        </DropdownMenuItem>
                                        {onTogglePublish && (
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onTogglePublish(item._id, !item.isPublished)
                                                }
                                            >
                                                {item.isPublished ? "Despublicar" : "Publicar"}
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {onDelete && (
                                            <DropdownMenuItem
                                                onClick={() => onDelete(item._id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Excluir
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
