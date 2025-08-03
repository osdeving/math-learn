export default function HomePage() {
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Math Learn
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Plataforma Modular de Estudo de Matemática
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold mb-2">
                            📚 Teoria
                        </h2>
                        <p className="text-gray-600">
                            Conteúdo teórico completo com suporte a LaTeX
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold mb-2">
                            📝 Resumos
                        </h2>
                        <p className="text-gray-600">
                            Resumos concisos dos tópicos principais
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold mb-2">
                            🎴 Flashcards
                        </h2>
                        <p className="text-gray-600">
                            Cartões para memorização e revisão
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h2 className="text-xl font-semibold mb-2">
                            ❓ Questões
                        </h2>
                        <p className="text-gray-600">
                            Exercícios práticos com múltiplas alternativas
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
