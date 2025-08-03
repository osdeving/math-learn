import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Administração</h1>
                <p className="text-muted-foreground">
                    Gerencie o conteúdo da plataforma Math Learn
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📂 Categorias
                        </CardTitle>
                        <CardDescription>
                            Gerencie as categorias de matemática
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Criar, editar e organizar categorias de conteúdo
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/admin/categories">
                                    Gerenciar Categorias
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📚 Teoria
                        </CardTitle>
                        <CardDescription>
                            Gerencie conteúdo teórico
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Criar e editar conteúdo teórico com LaTeX
                            </p>
                            <Button disabled className="w-full">
                                Em Breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            📝 Resumos
                        </CardTitle>
                        <CardDescription>
                            Gerencie resumos de tópicos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Criar resumos concisos dos tópicos principais
                            </p>
                            <Button disabled className="w-full">
                                Em Breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🎴 Flashcards
                        </CardTitle>
                        <CardDescription>Gerencie flashcards</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Criar e editar flashcards para memorização
                            </p>
                            <Button disabled className="w-full">
                                Em Breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            ❓ Questões
                        </CardTitle>
                        <CardDescription>
                            Gerencie questões práticas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Criar questões de múltipla escolha
                            </p>
                            <Button disabled className="w-full">
                                Em Breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            ⚙️ Configurações
                        </CardTitle>
                        <CardDescription>
                            Configurações do sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Configurações gerais da plataforma
                            </p>
                            <Button disabled className="w-full">
                                Em Breve
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
