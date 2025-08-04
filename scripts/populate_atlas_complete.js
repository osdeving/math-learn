// Script completo para popular MongoDB Atlas com dados da aplicação Math-Learn
// Baseado nos modelos TypeScript da aplicação

console.log("🚀 Iniciando população do MongoDB Atlas...");

// Limpar dados existentes (opcional - descomente se quiser resetar)
// db.categories.deleteMany({});
// db.theories.deleteMany({});
// db.questions.deleteMany({});
// db.flashcards.deleteMany({});
// db.summaries.deleteMany({});

// 1. CATEGORIAS (baseado em Category.ts)
console.log("\n📚 Inserindo Categorias...");
const categories = [
    {
        name: "Álgebra",
        description:
            "Estudo de estruturas matemáticas abstratas, equações e operações",
        slug: "algebra",
        isPublished: true,
    },
    {
        name: "Combinatória",
        description:
            "Análise combinatória, permutações, arranjos e combinações",
        slug: "combinatoria",
        isPublished: true,
    },
    {
        name: "Geometria",
        description: "Estudo das formas, espaços e suas propriedades",
        slug: "geometria",
        isPublished: true,
    },
    {
        name: "Estatística",
        description: "Coleta, organização, análise e interpretação de dados",
        slug: "estatistica",
        isPublished: true,
    },
    {
        name: "Trigonometria",
        description: "Relações entre ângulos e lados de triângulos",
        slug: "trigonometria",
        isPublished: true,
    },
    {
        name: "Cálculo",
        description: "Derivadas, integrais e limites",
        slug: "calculo",
        isPublished: false, // Ainda não implementado
    },
];

const categoryResults = db.categories.insertMany(categories);
console.log(`✅ ${categoryResults.insertedIds.length} categorias inseridas`);

// Obter IDs das categorias para referência
const algebraId = categoryResults.insertedIds[0];
const combinatoriaId = categoryResults.insertedIds[1];
const geometriaId = categoryResults.insertedIds[2];
const estatisticaId = categoryResults.insertedIds[3];
const trigonometriaId = categoryResults.insertedIds[4];

// 2. TEORIAS (baseado em Theory.ts)
console.log("\n📖 Inserindo Teorias...");
const theories = [
    {
        title: "Equações do Segundo Grau",
        content: `# Equações do Segundo Grau

Uma **equação do segundo grau** é toda equação da forma:

$$ax^2 + bx + c = 0$$

Onde $a$, $b$ e $c$ são números reais e $a \\neq 0$.

## Fórmula de Bhaskara

Para resolver uma equação do segundo grau, utilizamos a fórmula:

$$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$$

Onde o **discriminante** é:

$$\\Delta = b^2 - 4ac$$

## Análise do Discriminante

- Se $\\Delta > 0$: duas raízes reais e distintas
- Se $\\Delta = 0$: uma raiz real (raiz dupla)
- Se $\\Delta < 0$: nenhuma raiz real`,
        categoryIds: [algebraId],
        isPublished: true,
    },
    {
        title: "Princípio Fundamental da Contagem",
        content: `# Princípio Fundamental da Contagem

Se um evento pode ocorrer de $m$ maneiras diferentes e, para cada uma dessas maneiras, um segundo evento pode ocorrer de $n$ maneiras diferentes, então o número total de maneiras de ocorrerem os dois eventos é:

$$m \\times n$$

## Exemplo

Para ir de A até C passando por B:
- A → B: 3 caminhos
- B → C: 2 caminhos
- A → C: $3 \\times 2 = 6$ caminhos possíveis

## Generalização

Para $k$ eventos independentes:
$$n_1 \\times n_2 \\times n_3 \\times ... \\times n_k$$`,
        categoryIds: [combinatoriaId],
        isPublished: true,
    },
    {
        title: "Teorema de Pitágoras",
        content: `# Teorema de Pitágoras

Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos.

$$a^2 + b^2 = c^2$$

Onde:
- $a$ e $b$ são os catetos
- $c$ é a hipotenusa

## Aplicações

O Teorema de Pitágoras é fundamental para:
- Calcular distâncias
- Resolver problemas de geometria
- Verificar se um triângulo é retângulo`,
        categoryIds: [geometriaId],
        isPublished: true,
    },
    {
        title: "Funções Trigonométricas",
        content: `# Funções Trigonométricas

As principais funções trigonométricas são:

## Seno, Cosseno e Tangente

$$\\sin(\\theta) = \\frac{\\text{cateto oposto}}{\\text{hipotenusa}}$$

$$\\cos(\\theta) = \\frac{\\text{cateto adjacente}}{\\text{hipotenusa}}$$

$$\\tan(\\theta) = \\frac{\\sin(\\theta)}{\\cos(\\theta)} = \\frac{\\text{cateto oposto}}{\\text{cateto adjacente}}$$

## Identidades Fundamentais

$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$`,
        categoryIds: [trigonometriaId],
        isPublished: true,
    },
    {
        title: "Medidas de Tendência Central",
        content: `# Medidas de Tendência Central

## Média Aritmética
$$\\bar{x} = \\frac{x_1 + x_2 + ... + x_n}{n}$$

## Mediana
Valor central quando os dados estão ordenados.

## Moda
Valor que aparece com maior frequência.

Essas medidas nos ajudam a entender o comportamento central de um conjunto de dados.`,
        categoryIds: [estatisticaId],
        isPublished: true,
    },
];

const theoryResults = db.theories.insertMany(theories);
console.log(`✅ ${theoryResults.insertedIds.length} teorias inseridas`);

// 3. QUESTÕES (baseado em Question.ts - exatamente 5 alternativas)
console.log("\n❓ Inserindo Questões...");
const questions = [
    {
        title: "Raízes de Equação Quadrática",
        statement: "Qual é a solução da equação $x^2 - 5x + 6 = 0$?",
        alternatives: [
            { text: "$x = 2$ ou $x = 3$", isCorrect: true },
            { text: "$x = 1$ ou $x = 6$", isCorrect: false },
            { text: "$x = -2$ ou $x = -3$", isCorrect: false },
            { text: "$x = 0$ ou $x = 5$", isCorrect: false },
            { text: "$x = 1$ ou $x = 4$", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "Usando a fórmula de Bhaskara ou fatoração: $(x-2)(x-3) = 0$, obtemos $x = 2$ ou $x = 3$.",
        categoryIds: [algebraId],
        isPublished: true,
    },
    {
        title: "Discriminante de Equação Quadrática",
        statement:
            "Se o discriminante $\\Delta = b^2 - 4ac$ de uma equação do segundo grau é igual a zero, quantas raízes reais a equação possui?",
        alternatives: [
            { text: "Nenhuma raiz real", isCorrect: false },
            { text: "Uma raiz real (raiz dupla)", isCorrect: true },
            { text: "Duas raízes reais distintas", isCorrect: false },
            { text: "Três raízes reais", isCorrect: false },
            { text: "Infinitas raízes", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "Quando $\\Delta = 0$, a equação possui uma raiz real dupla, ou seja, duas raízes iguais.",
        categoryIds: [algebraId],
        isPublished: true,
    },
    {
        title: "Permutação Simples",
        statement: "De quantas maneiras 5 pessoas podem se sentar em uma fila?",
        alternatives: [
            { text: "120", isCorrect: true },
            { text: "25", isCorrect: false },
            { text: "10", isCorrect: false },
            { text: "60", isCorrect: false },
            { text: "720", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "Permutação simples de 5 elementos: $P_5 = 5! = 5 \\times 4 \\times 3 \\times 2 \\times 1 = 120$",
        categoryIds: [combinatoriaId],
        isPublished: true,
    },
    {
        title: "Combinação",
        statement:
            "De quantas maneiras podemos escolher 3 pessoas de um grupo de 5?",
        alternatives: [
            { text: "15", isCorrect: false },
            { text: "10", isCorrect: true },
            { text: "60", isCorrect: false },
            { text: "125", isCorrect: false },
            { text: "20", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "Combinação: $C_{5,3} = \\frac{5!}{3!(5-3)!} = \\frac{5!}{3!2!} = \\frac{120}{6 \\times 2} = 10$",
        categoryIds: [combinatoriaId],
        isPublished: true,
    },
    {
        title: "Teorema de Pitágoras",
        statement:
            "Em um triângulo retângulo, os catetos medem 3 cm e 4 cm. Qual é a medida da hipotenusa?",
        alternatives: [
            { text: "5 cm", isCorrect: true },
            { text: "7 cm", isCorrect: false },
            { text: "6 cm", isCorrect: false },
            { text: "12 cm", isCorrect: false },
            { text: "25 cm", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "Pelo Teorema de Pitágoras: $c^2 = a^2 + b^2 = 3^2 + 4^2 = 9 + 16 = 25$, então $c = 5$ cm.",
        categoryIds: [geometriaId],
        isPublished: true,
    },
    {
        title: "Área do Círculo",
        statement: "Qual é a área de um círculo com raio igual a 3 cm?",
        alternatives: [
            { text: "$6\\pi$ cm²", isCorrect: false },
            { text: "$9\\pi$ cm²", isCorrect: true },
            { text: "$3\\pi$ cm²", isCorrect: false },
            { text: "$18\\pi$ cm²", isCorrect: false },
            { text: "$12\\pi$ cm²", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "A área do círculo é $A = \\pi r^2 = \\pi \\times 3^2 = 9\\pi$ cm².",
        categoryIds: [geometriaId],
        isPublished: true,
    },
    {
        title: "Função Seno",
        statement: "Qual é o valor de $\\sin(30°)$?",
        alternatives: [
            { text: "$\\frac{1}{2}$", isCorrect: true },
            { text: "$\\frac{\\sqrt{2}}{2}$", isCorrect: false },
            { text: "$\\frac{\\sqrt{3}}{2}$", isCorrect: false },
            { text: "$1$", isCorrect: false },
            { text: "$\\frac{\\sqrt{3}}{3}$", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "O seno de 30° é $\\sin(30°) = \\frac{1}{2}$. Este é um valor fundamental da trigonometria.",
        categoryIds: [trigonometriaId],
        isPublished: true,
    },
    {
        title: "Média Aritmética",
        statement: "A média aritmética dos números 2, 4, 6, 8 e 10 é:",
        alternatives: [
            { text: "5", isCorrect: false },
            { text: "6", isCorrect: true },
            { text: "7", isCorrect: false },
            { text: "8", isCorrect: false },
            { text: "4", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: "Média = $\\frac{2+4+6+8+10}{5} = \\frac{30}{5} = 6$",
        categoryIds: [estatisticaId],
        isPublished: true,
    },
];

const questionResults = db.questions.insertMany(questions);
console.log(`✅ ${questionResults.insertedIds.length} questões inseridas`);

// 4. FLASHCARDS (baseado em Flashcard.ts)
console.log("\n🎯 Inserindo Flashcards...");
const flashcards = [
    {
        question: "O que é o discriminante de uma equação do segundo grau?",
        answer: "É $\\Delta = b^2 - 4ac$, usado na fórmula de Bhaskara para determinar o número de raízes reais.",
        categoryIds: [algebraId],
        isPublished: true,
    },
    {
        question: "Qual a fórmula da permutação simples?",
        answer: "$P_n = n!$ (n fatorial). Representa o número de maneiras de organizar n objetos distintos.",
        categoryIds: [combinatoriaId],
        isPublished: true,
    },
    {
        question: "Enuncie o Teorema de Pitágoras",
        answer: "Em um triângulo retângulo: $a^2 + b^2 = c^2$, onde a e b são catetos e c é a hipotenusa.",
        categoryIds: [geometriaId],
        isPublished: true,
    },
    {
        question: "Qual o valor de $\\sin(90°)$?",
        answer: "$\\sin(90°) = 1$. Este é o valor máximo da função seno.",
        categoryIds: [trigonometriaId],
        isPublished: true,
    },
    {
        question: "Como calcular a média aritmética?",
        answer: "$\\bar{x} = \\frac{x_1 + x_2 + ... + x_n}{n}$. Soma todos os valores e divide pela quantidade.",
        categoryIds: [estatisticaId],
        isPublished: true,
    },
    {
        question: "Qual a fórmula da combinação?",
        answer: "$C_{n,k} = \\frac{n!}{k!(n-k)!}$. Número de maneiras de escolher k objetos de n objetos.",
        categoryIds: [combinatoriaId],
        isPublished: true,
    },
    {
        question: "Qual a identidade trigonométrica fundamental?",
        answer: "$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$. Válida para qualquer ângulo θ.",
        categoryIds: [trigonometriaId],
        isPublished: true,
    },
    {
        question: "Qual a área de um círculo?",
        answer: "$A = \\pi r^2$, onde r é o raio do círculo.",
        categoryIds: [geometriaId],
        isPublished: true,
    },
];

const flashcardResults = db.flashcards.insertMany(flashcards);
console.log(`✅ ${flashcardResults.insertedIds.length} flashcards inseridos`);

// 5. RESUMOS (baseado em Summary.ts)
console.log("\n📝 Inserindo Resumos...");
const summaries = [
    {
        title: "Resumo: Equações do 2º Grau",
        content:
            "Equação: $ax^2 + bx + c = 0$ (a≠0). Fórmula de Bhaskara: $x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$. Discriminante: $\\Delta = b^2 - 4ac$. Se Δ>0: 2 raízes reais; Δ=0: 1 raiz real; Δ<0: sem raízes reais.",
        categoryIds: [algebraId],
        isPublished: true,
    },
    {
        title: "Resumo: Análise Combinatória",
        content:
            "Permutação: $P_n = n!$ (arranjo de n objetos). Arranjo: $A_{n,k} = \\frac{n!}{(n-k)!}$ (ordem importa). Combinação: $C_{n,k} = \\frac{n!}{k!(n-k)!}$ (ordem não importa). Princípio fundamental: eventos independentes se multiplicam.",
        categoryIds: [combinatoriaId],
        isPublished: true,
    },
    {
        title: "Resumo: Geometria Básica",
        content:
            "Teorema de Pitágoras: $a^2 + b^2 = c^2$. Área do círculo: $A = \\pi r^2$. Perímetro do círculo: $P = 2\\pi r$. Área do triângulo: $A = \\frac{base \\times altura}{2}$. Área do retângulo: $A = base \\times altura$.",
        categoryIds: [geometriaId],
        isPublished: true,
    },
    {
        title: "Resumo: Trigonometria",
        content:
            "Sen: $\\frac{cateto\\ oposto}{hipotenusa}$. Cos: $\\frac{cateto\\ adjacente}{hipotenusa}$. Tan: $\\frac{sen}{cos}$. Valores especiais: sen(30°)=1/2, cos(30°)=√3/2, sen(60°)=√3/2, cos(60°)=1/2. Identidade: $sen^2 + cos^2 = 1$.",
        categoryIds: [trigonometriaId],
        isPublished: true,
    },
    {
        title: "Resumo: Estatística Descritiva",
        content:
            "Média: $\\bar{x} = \\frac{\\sum x_i}{n}$. Mediana: valor central dos dados ordenados. Moda: valor mais frequente. Variância: $\\sigma^2 = \\frac{\\sum(x_i - \\bar{x})^2}{n}$. Desvio padrão: $\\sigma = \\sqrt{variância}$.",
        categoryIds: [estatisticaId],
        isPublished: true,
    },
];

const summaryResults = db.summaries.insertMany(summaries);
console.log(`✅ ${summaryResults.insertedIds.length} resumos inseridos`);

// ESTATÍSTICAS FINAIS
console.log("\n📊 ESTATÍSTICAS FINAIS:");
console.log("========================");
console.log("📚 Categorias:", db.categories.countDocuments());
console.log("📖 Teorias:", db.theories.countDocuments());
console.log("❓ Questões:", db.questions.countDocuments());
console.log("🎯 Flashcards:", db.flashcards.countDocuments());
console.log("📝 Resumos:", db.summaries.countDocuments());
console.log("========================");
console.log("🎉 População do banco concluída com sucesso!");

// Verificar integridade dos dados
console.log("\n🔍 VERIFICAÇÃO DE INTEGRIDADE:");
console.log(
    "Questões com exatamente 5 alternativas:",
    db.questions.countDocuments({
        "alternatives.4": { $exists: true },
        "alternatives.5": { $exists: false },
    })
);
console.log(
    "Conteúdo publicado:",
    db.categories.countDocuments({ isPublished: true }) +
        db.theories.countDocuments({ isPublished: true }) +
        db.questions.countDocuments({ isPublished: true }) +
        db.flashcards.countDocuments({ isPublished: true }) +
        db.summaries.countDocuments({ isPublished: true })
);
