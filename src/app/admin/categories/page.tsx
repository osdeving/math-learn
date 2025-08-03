"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Category {
    _id: string;
    name: string;
    description: string;
    slug: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CategoriesResponse {
    categories: Category[];
    pagination: {
        current: number;
        total: number;
        count: number;
        totalCount: number;
    };
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/categories");
            const data = await response.json();

            if (data.success) {
                setCategories(data.data.categories);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Erro ao carregar categorias");
        } finally {
            setLoading(false);
        }
    };

    const togglePublished = async (id: string, isPublished: boolean) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: !isPublished }),
            });

            if (response.ok) {
                fetchCategories(); // Recarregar lista
            }
        } catch (err) {
            console.error("Erro ao atualizar categoria:", err);
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
            return;
        }

        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchCategories(); // Recarregar lista
            }
        } catch (err) {
            console.error("Erro ao excluir categoria:", err);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4">Carregando categorias...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Erro</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                        <Button className="mt-4" onClick={fetchCategories}>
                            Tentar Novamente
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Categorias</h1>
                    <p className="text-muted-foreground">
                        Gerencie as categorias de matemática
                    </p>
                </div>
                <div className="space-x-2">
                    <Button asChild>
                        <Link href="/admin/categories/new">Nova Categoria</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/admin">Voltar</Link>
                    </Button>
                </div>
            </div>

            {categories.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Nenhuma categoria encontrada</CardTitle>
                        <CardDescription>
                            Comece criando sua primeira categoria de matemática
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/admin/categories/new">
                                Criar Primeira Categoria
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Categorias</CardTitle>
                        <CardDescription>
                            {categories.length} categorias encontradas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="text-right">
                                        Ações
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium">
                                            {category.name}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {category.description}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-sm bg-muted px-1 py-0.5 rounded">
                                                {category.slug}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    category.isPublished
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    togglePublished(
                                                        category._id,
                                                        category.isPublished
                                                    )
                                                }
                                            >
                                                {category.isPublished
                                                    ? "Publicado"
                                                    : "Rascunho"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                category.createdAt
                                            ).toLocaleDateString("pt-BR")}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={`/admin/categories/${category._id}/edit`}
                                                >
                                                    Editar
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    deleteCategory(category._id)
                                                }
                                            >
                                                Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
