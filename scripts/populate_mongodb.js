// Script para popular o MongoDB com dados de exemplo
// Execute: docker exec -i mongodb-dev mongosh -u admin -p password --authenticationDatabase admin < populate_mongodb.js

// Usar o banco math-learn
use("math-learn");

// Criar coleção de categorias
db.categories.insertMany([
    {
        name: "Álgebra",
        description: "Estudo de estruturas matemáticas abstratas",
        color: "#3B82F6",
        createdAt: new Date(),
    },
    {
        name: "Combinatória",
        description: "Análise combinatória e contagem",
        color: "#10B981",
        createdAt: new Date(),
    },
    {
        name: "Geometria",
        description: "Estudo das formas e espaços",
        color: "#F59E0B",
        createdAt: new Date(),
    },
]);

// Criar coleção de teorias
db.theories.insertMany([
    {
        title: "Equações do Segundo Grau",
        content:
            "Uma equação do segundo grau é expressa na forma $ax^2 + bx + c = 0$",
        category: "Álgebra",
        published: true,
        createdAt: new Date(),
    },
    {
        title: "Princípio Fundamental da Contagem",
        content:
            "Se um evento pode ocorrer de $n$ maneiras e outro de $m$ maneiras...",
        category: "Combinatória",
        published: true,
        createdAt: new Date(),
    },
]);

// Criar coleção de questões
db.questions.insertMany([
    {
        question: "Qual é a raiz da equação $x^2 - 5x + 6 = 0$?",
        alternatives: [
            "x = 2 ou x = 3",
            "x = 1 ou x = 6",
            "x = -2 ou x = -3",
            "x = 0 ou x = 5",
            "x = 1 ou x = 4",
        ],
        correctAnswer: 0,
        explanation:
            "Usando a fórmula de Bhaskara ou fatoração: $(x-2)(x-3) = 0$",
        category: "Álgebra",
        difficulty: "medium",
        published: true,
        createdAt: new Date(),
    },
    {
        question: "De quantas maneiras 5 pessoas podem se sentar em uma fila?",
        alternatives: ["120", "25", "10", "60", "720"],
        correctAnswer: 0,
        explanation: "Permutação simples: $P_5 = 5! = 120$",
        category: "Combinatória",
        difficulty: "easy",
        published: true,
        createdAt: new Date(),
    },
]);

// Criar coleção de flashcards
db.flashcards.insertMany([
    {
        question: "O que é o discriminante de uma equação do segundo grau?",
        answer: "É $\\Delta = b^2 - 4ac$, usado na fórmula de Bhaskara",
        category: "Álgebra",
        published: true,
        createdAt: new Date(),
    },
    {
        question: "Qual a fórmula da permutação simples?",
        answer: "$P_n = n!$ (n fatorial)",
        category: "Combinatória",
        published: true,
        createdAt: new Date(),
    },
]);

print("✅ Dados de exemplo inseridos com sucesso!");
print("📊 Estatísticas:");
print("- Categorias:", db.categories.countDocuments());
print("- Teorias:", db.theories.countDocuments());
print("- Questões:", db.questions.countDocuments());
print("- Flashcards:", db.flashcards.countDocuments());
