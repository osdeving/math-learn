// Dados de exemplo para Math Learn Platform - População Completa

db = db.getSiblingDB("mathlearn_dev");

// Inserir categorias de exemplo
const categories = [
    {
        name: "Cálculo Diferencial",
        slug: "calculo-diferencial",
        description: "Estudo de limites, derivadas e suas aplicações",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: "Álgebra Linear",
        slug: "algebra-linear",
        description: "Vetores, matrizes e transformações lineares",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: "Estatística",
        slug: "estatistica",
        description: "Análise de dados e probabilidade",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: "Geometria Analítica",
        slug: "geometria-analitica",
        description: "Estudo de figuras geométricas através de coordenadas",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: "Trigonometria",
        slug: "trigonometria",
        description: "Funções trigonométricas e suas propriedades",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        name: "Combinatória",
        slug: "combinatoria",
        description: "Análise combinatória e probabilidade",
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const insertedCategories = db.categories.insertMany(categories);
print("Categorias inseridas:", insertedCategories.insertedIds);

// Obter IDs das categorias para referência
const calculoId = insertedCategories.insertedIds[0];
const algebraId = insertedCategories.insertedIds[1];
const estatisticaId = insertedCategories.insertedIds[2];
const geometriaId = insertedCategories.insertedIds[3];
const trigonometriaId = insertedCategories.insertedIds[4];
const combinatoriaId = insertedCategories.insertedIds[5];

// Inserir teorias de exemplo
const theories = [
    {
        title: "Definição de Limite",
        content: `# Definição de Limite

Um **limite** é o valor que uma função f(x) se aproxima conforme x se aproxima de um determinado valor.

## Definição Formal

Dizemos que o limite de f(x) quando x tende a a é L, escrito como:

$$\\lim_{x \\to a} f(x) = L$$

Se para todo ε > 0, existe δ > 0 tal que:

$$0 < |x - a| < \\delta \\implies |f(x) - L| < \\varepsilon$$

## Propriedades dos Limites

1. **Limite da soma**: $\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)$
2. **Limite do produto**: $\\lim_{x \\to a} [f(x) \\cdot g(x)] = \\lim_{x \\to a} f(x) \\cdot \\lim_{x \\to a} g(x)$
3. **Limite do quociente**: $\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{\\lim_{x \\to a} f(x)}{\\lim_{x \\to a} g(x)}$`,
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Derivadas - Regras Básicas",
        content: `# Derivadas - Regras Básicas

A **derivada** de uma função representa a taxa de variação instantânea.

## Definição

$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

## Regras de Derivação

### Regra da Potência
$$\\frac{d}{dx}[x^n] = nx^{n-1}$$

### Regra da Soma
$$\\frac{d}{dx}[f(x) + g(x)] = f'(x) + g'(x)$$

### Regra do Produto
$$\\frac{d}{dx}[f(x) \\cdot g(x)] = f'(x)g(x) + f(x)g'(x)$$

### Regra da Cadeia
$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$`,
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Espaços Vetoriais",
        content: `# Espaços Vetoriais

Um **espaço vetorial** é um conjunto V munido de duas operações: adição de vetores e multiplicação por escalar.

## Axiomas

Para todo u, v, w ∈ V e α, β ∈ ℝ:

1. **Comutatividade**: u + v = v + u
2. **Associatividade**: (u + v) + w = u + (v + w)
3. **Elemento neutro**: ∃ 0 ∈ V tal que v + 0 = v
4. **Elemento oposto**: ∀ v ∈ V, ∃ (-v) tal que v + (-v) = 0

$$V = \\{(x_1, x_2, ..., x_n) : x_i \\in \\mathbb{R}\\}$$

## Exemplos de Espaços Vetoriais

- **ℝⁿ**: Vetores n-dimensionais
- **Polinômios**: P(x) = a₀ + a₁x + ... + aₙxⁿ
- **Matrizes**: M_{m×n}(ℝ)`,
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Determinantes",
        content: `# Determinantes

O **determinante** é um número associado a uma matriz quadrada.

## Matriz 2×2

Para uma matriz $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$:

$$\\det(A) = ad - bc$$

## Matriz 3×3 (Regra de Sarrus)

Para uma matriz 3×3, expandimos usando cofatores:

$$\\det(A) = a_{11}(a_{22}a_{33} - a_{23}a_{32}) - a_{12}(a_{21}a_{33} - a_{23}a_{31}) + a_{13}(a_{21}a_{32} - a_{22}a_{31})$$

## Propriedades

1. Se duas linhas são iguais, det(A) = 0
2. det(AB) = det(A)det(B)
3. det(Aᵀ) = det(A)`,
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Distribuição Normal",
        content: `# Distribuição Normal

A **distribuição normal** é uma das distribuições mais importantes em estatística.

## Função Densidade de Probabilidade

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$

Onde:
- μ = média
- σ = desvio padrão

## Propriedades

1. **Simétrica** em relação à média μ
2. **Regra 68-95-99.7**:
   - 68% dos dados estão dentro de 1σ da média
   - 95% dos dados estão dentro de 2σ da média
   - 99.7% dos dados estão dentro de 3σ da média

## Distribuição Normal Padrão

Quando μ = 0 e σ = 1:

$$Z = \\frac{X - \\mu}{\\sigma} \\sim N(0,1)$$`,
        categoryIds: [estatisticaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Círculo - Equação Geral",
        content: `# Círculo - Equação Geral

Um **círculo** no plano cartesiano pode ser representado por sua equação.

## Equação Padrão

Para um círculo com centro (h, k) e raio r:

$$(x - h)^2 + (y - k)^2 = r^2$$

## Equação Geral

Expandindo a equação padrão:

$$x^2 + y^2 + Dx + Ey + F = 0$$

Onde:
- D = -2h
- E = -2k
- F = h² + k² - r²

## Centro e Raio pela Equação Geral

$$\\text{Centro: } \\left(-\\frac{D}{2}, -\\frac{E}{2}\\right)$$

$$\\text{Raio: } r = \\sqrt{\\left(\\frac{D}{2}\\right)^2 + \\left(\\frac{E}{2}\\right)^2 - F}$$`,
        categoryIds: [geometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Funções Trigonométricas",
        content: `# Funções Trigonométricas

As **funções trigonométricas** relacionam ângulos com razões de lados em triângulos.

## Definições no Círculo Unitário

Para um ângulo θ no círculo unitário:

- **Seno**: $\\sin(\\theta) = y$
- **Cosseno**: $\\cos(\\theta) = x$
- **Tangente**: $\\tan(\\theta) = \\frac{y}{x} = \\frac{\\sin(\\theta)}{\\cos(\\theta)}$

## Identidades Fundamentais

### Identidade Pitagórica
$$\\sin^2(\\theta) + \\cos^2(\\theta) = 1$$

### Identidades de Soma
$$\\sin(a + b) = \\sin(a)\\cos(b) + \\cos(a)\\sin(b)$$
$$\\cos(a + b) = \\cos(a)\\cos(b) - \\sin(a)\\sin(b)$$

## Valores Especiais

| θ | sin(θ) | cos(θ) | tan(θ) |
|---|--------|--------|--------|
| 0° | 0 | 1 | 0 |
| 30° | 1/2 | √3/2 | √3/3 |
| 45° | √2/2 | √2/2 | 1 |
| 60° | √3/2 | 1/2 | √3 |
| 90° | 1 | 0 | ∞ |`,
        categoryIds: [trigonometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Princípios de Contagem",
        content: `# Princípios de Contagem

Os **princípios de contagem** são fundamentais para resolver problemas combinatórios.

## Princípio Fundamental da Contagem

Se um evento pode ocorrer de **m** maneiras e outro evento pode ocorrer de **n** maneiras, então ambos podem ocorrer de **m × n** maneiras.

## Permutações

### Permutação Simples
Número de maneiras de arranjar n objetos distintos:

$$P_n = n!$$

### Permutação com Repetição
Com n₁ objetos do tipo 1, n₂ do tipo 2, etc:

$$P_n^{n_1, n_2, ...} = \\frac{n!}{n_1! \\cdot n_2! \\cdot ...}$$

## Combinações

Número de maneiras de escolher k objetos de n objetos:

$$C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$

## Arranjos

Número de maneiras de arranjar k objetos de n objetos:

$$A_n^k = \\frac{n!}{(n-k)!}$$`,
        categoryIds: [combinatoriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

db.theories.insertMany(theories);
print("Teorias inseridas com sucesso");

// Inserir resumos de exemplo
const summaries = [
    {
        title: "Limites - Resumo",
        content: `## 📝 Resumo: Limites

### Conceito Principal
- Limite = valor que função **se aproxima**
- Notação: $\\lim_{x \\to a} f(x) = L$

### Propriedades Essenciais
1. **Soma**: $\\lim[f+g] = \\lim f + \\lim g$
2. **Produto**: $\\lim[f \\cdot g] = \\lim f \\cdot \\lim g$
3. **Quociente**: $\\lim[f/g] = \\frac{\\lim f}{\\lim g}$ (se $\\lim g \\neq 0$)

### Casos Especiais
- **Limite lateral**: $\\lim_{x \\to a^+}$ e $\\lim_{x \\to a^-}$
- **Limite infinito**: $\\lim_{x \\to \\infty} f(x)$
- **Indeterminações**: $\\frac{0}{0}$, $\\frac{\\infty}{\\infty}$`,
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Derivadas - Resumo",
        content: `## 📝 Resumo: Derivadas

### Conceito Principal
- Derivada = **taxa de variação instantânea**
- Interpretação geométrica: **inclinação da tangente**

### Regras Básicas
- **Potência**: $(x^n)' = nx^{n-1}$
- **Soma**: $(f+g)' = f' + g'$
- **Produto**: $(fg)' = f'g + fg'$
- **Quociente**: $\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}$
- **Cadeia**: $(f(g(x)))' = f'(g(x)) \\cdot g'(x)$

### Derivadas Importantes
- $(\\sin x)' = \\cos x$
- $(\\cos x)' = -\\sin x$
- $(e^x)' = e^x$
- $(\\ln x)' = \\frac{1}{x}$`,
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Matrizes - Resumo",
        content: `## 📝 Resumo: Matrizes

### Operações Básicas
- **Soma**: $(A + B)_{ij} = a_{ij} + b_{ij}$
- **Multiplicação por escalar**: $(kA)_{ij} = k \\cdot a_{ij}$
- **Produto**: $(AB)_{ij} = \\sum_{k} a_{ik}b_{kj}$

### Determinante
- **2×2**: $\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$
- **3×3**: Expansão por cofatores

### Propriedades Importantes
- $(AB)^T = B^T A^T$
- $\\det(AB) = \\det(A) \\det(B)$
- Se $\\det(A) \\neq 0$, então A é invertível`,
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Trigonometria - Resumo",
        content: `## 📝 Resumo: Trigonometria

### Razões Básicas
- **Seno**: cateto oposto / hipotenusa
- **Cosseno**: cateto adjacente / hipotenusa
- **Tangente**: cateto oposto / cateto adjacente

### Identidade Fundamental
$$\\sin^2\\theta + \\cos^2\\theta = 1$$

### Ângulos Notáveis
| θ | sen | cos | tan |
|---|-----|-----|-----|
| 30° | 1/2 | √3/2 | √3/3 |
| 45° | √2/2 | √2/2 | 1 |
| 60° | √3/2 | 1/2 | √3 |

### Fórmulas de Adição
- $\\sin(a ± b) = \\sin a \\cos b ± \\cos a \\sin b$
- $\\cos(a ± b) = \\cos a \\cos b ∓ \\sin a \\sin b$`,
        categoryIds: [trigonometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

db.summaries.insertMany(summaries);
print("Resumos inseridos com sucesso");

// Inserir flashcards de exemplo
const flashcards = [
    {
        question: "O que é a derivada de uma função?",
        answer: "A derivada representa a taxa de variação instantânea de uma função. Geometricamente, é a inclinação da reta tangente à curva em um ponto.",
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "Qual é a derivada de x²?",
        answer: "A derivada de x² é 2x. Aplicamos a regra da potência: d/dx(xⁿ) = n·x^(n-1)",
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "Como calcular o determinante de uma matriz 2×2?",
        answer: "Para uma matriz [[a,b],[c,d]], o determinante é ad - bc",
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "O que é um espaço vetorial?",
        answer: "Um espaço vetorial é um conjunto munido de duas operações (adição de vetores e multiplicação por escalar) que satisfaz 8 axiomas fundamentais.",
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "Qual é o valor de sen(30°)?",
        answer: "sen(30°) = 1/2. Este é um dos ângulos notáveis que devemos memorizar.",
        categoryIds: [trigonometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "O que diz a identidade trigonométrica fundamental?",
        answer: "sen²θ + cos²θ = 1. Esta identidade é válida para qualquer ângulo θ.",
        categoryIds: [trigonometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "Como interpretar a distribuição normal?",
        answer: "A distribuição normal é simétrica em relação à média, com forma de sino. 68% dos dados estão dentro de 1 desvio padrão da média.",
        categoryIds: [estatisticaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "O que é uma combinação?",
        answer: "Combinação é o número de maneiras de escolher k objetos de n objetos, sem considerar a ordem. Fórmula: C(n,k) = n!/(k!(n-k)!)",
        categoryIds: [combinatoriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "Qual é a equação de um círculo?",
        answer: "A equação padrão de um círculo com centro (h,k) e raio r é: (x-h)² + (y-k)² = r²",
        categoryIds: [geometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        question: "O que é o princípio fundamental da contagem?",
        answer: "Se um evento pode ocorrer de m maneiras e outro de n maneiras, então ambos podem ocorrer de m×n maneiras.",
        categoryIds: [combinatoriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

db.flashcards.insertMany(flashcards);
print("Flashcards inseridos com sucesso");

// Inserir questões de exemplo (expandidas)
const questions = [
    // Cálculo Diferencial
    {
        title: "Derivada de Função Quadrática",
        statement: "Qual é a derivada da função f(x) = x² + 3x - 2?",
        alternatives: [
            { text: "f'(x) = x + 3", isCorrect: false },
            { text: "f'(x) = 2x + 3", isCorrect: true },
            { text: "f'(x) = x² + 3", isCorrect: false },
            { text: "f'(x) = 2x + 3x", isCorrect: false },
            { text: "f'(x) = 2x - 2", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "Aplicando a regra da potência: d/dx(x²) = 2x, d/dx(3x) = 3, d/dx(-2) = 0. Portanto, f'(x) = 2x + 3.",
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Limite Fundamental",
        statement: "Calcule o limite: lim(x→2) (x² - 4)/(x - 2)",
        alternatives: [
            { text: "0", isCorrect: false },
            { text: "2", isCorrect: false },
            { text: "4", isCorrect: true },
            { text: "∞", isCorrect: false },
            { text: "Não existe", isCorrect: false },
        ],
        correctAnswer: 2,
        explanation:
            "Fatorando o numerador: (x²-4) = (x-2)(x+2). Simplificando: (x-2)(x+2)/(x-2) = x+2. Portanto, lim(x→2) = 2+2 = 4.",
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Regra da Cadeia",
        statement: "Qual é a derivada de f(x) = (2x + 1)³?",
        alternatives: [
            { text: "6(2x + 1)²", isCorrect: true },
            { text: "3(2x + 1)²", isCorrect: false },
            { text: "(2x + 1)²", isCorrect: false },
            { text: "6x + 3", isCorrect: false },
            { text: "2(2x + 1)²", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "Usando a regra da cadeia: f'(x) = 3(2x+1)² × 2 = 6(2x+1)²",
        categoryIds: [calculoId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // Álgebra Linear
    {
        title: "Determinante de Matriz 2x2",
        statement: "Qual é o determinante da matriz A = [[2, 3], [1, 4]]?",
        alternatives: [
            { text: "5", isCorrect: true },
            { text: "8", isCorrect: false },
            { text: "10", isCorrect: false },
            { text: "11", isCorrect: false },
            { text: "14", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "Para uma matriz 2x2, det(A) = ad - bc = (2)(4) - (3)(1) = 8 - 3 = 5.",
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Multiplicação de Matrizes",
        statement:
            "Qual é o elemento a₁₁ do produto AB, onde A = [[1, 2], [3, 4]] e B = [[5, 6], [7, 8]]?",
        alternatives: [
            { text: "11", isCorrect: false },
            { text: "19", isCorrect: true },
            { text: "23", isCorrect: false },
            { text: "43", isCorrect: false },
            { text: "50", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: "a₁₁ = (1×5) + (2×7) = 5 + 14 = 19",
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Independência Linear",
        statement: "Os vetores v₁ = (1, 2) e v₂ = (2, 4) são:",
        alternatives: [
            { text: "Linearmente independentes", isCorrect: false },
            { text: "Linearmente dependentes", isCorrect: true },
            { text: "Ortogonais", isCorrect: false },
            { text: "Ortonormais", isCorrect: false },
            { text: "Paralelos não colineares", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "v₂ = 2v₁, portanto existe uma combinação linear não trivial: 2v₁ - v₂ = 0. Logo, são linearmente dependentes.",
        categoryIds: [algebraId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // Trigonometria
    {
        title: "Valores Trigonométricos",
        statement: "Qual é o valor de cos(60°)?",
        alternatives: [
            { text: "1/2", isCorrect: true },
            { text: "√2/2", isCorrect: false },
            { text: "√3/2", isCorrect: false },
            { text: "1", isCorrect: false },
            { text: "0", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "cos(60°) = 1/2. Este é um dos ângulos notáveis que devemos memorizar.",
        categoryIds: [trigonometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Identidade Trigonométrica",
        statement:
            "Se sen(θ) = 3/5, qual é o valor de cos(θ) (considerando θ no primeiro quadrante)?",
        alternatives: [
            { text: "3/5", isCorrect: false },
            { text: "4/5", isCorrect: true },
            { text: "5/3", isCorrect: false },
            { text: "5/4", isCorrect: false },
            { text: "1", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "Usando sen²θ + cos²θ = 1: (3/5)² + cos²θ = 1 → 9/25 + cos²θ = 1 → cos²θ = 16/25 → cos θ = 4/5",
        categoryIds: [trigonometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // Estatística
    {
        title: "Média Aritmética",
        statement: "A média dos números 2, 4, 6, 8, 10 é:",
        alternatives: [
            { text: "5", isCorrect: false },
            { text: "6", isCorrect: true },
            { text: "7", isCorrect: false },
            { text: "8", isCorrect: false },
            { text: "10", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation: "Média = (2+4+6+8+10)/5 = 30/5 = 6",
        categoryIds: [estatisticaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Distribuição Normal",
        statement:
            "Na distribuição normal padrão (μ=0, σ=1), aproximadamente que porcentagem dos valores está entre -1 e +1?",
        alternatives: [
            { text: "50%", isCorrect: false },
            { text: "68%", isCorrect: true },
            { text: "95%", isCorrect: false },
            { text: "99.7%", isCorrect: false },
            { text: "100%", isCorrect: false },
        ],
        correctAnswer: 1,
        explanation:
            "Pela regra 68-95-99.7, aproximadamente 68% dos valores estão dentro de 1 desvio padrão da média.",
        categoryIds: [estatisticaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // Geometria Analítica
    {
        title: "Distância entre Pontos",
        statement: "Qual é a distância entre os pontos A(1, 2) e B(4, 6)?",
        alternatives: [
            { text: "3", isCorrect: false },
            { text: "4", isCorrect: false },
            { text: "5", isCorrect: true },
            { text: "7", isCorrect: false },
            { text: "25", isCorrect: false },
        ],
        correctAnswer: 2,
        explanation: "d = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5",
        categoryIds: [geometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Equação da Reta",
        statement:
            "A equação da reta que passa pelos pontos (0, 2) e (3, 8) é:",
        alternatives: [
            { text: "y = 2x + 2", isCorrect: true },
            { text: "y = 2x - 2", isCorrect: false },
            { text: "y = 3x + 2", isCorrect: false },
            { text: "y = x + 2", isCorrect: false },
            { text: "y = 2x + 8", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation:
            "Coeficiente angular: m = (8-2)/(3-0) = 6/3 = 2. Como passa por (0,2), temos y = 2x + 2.",
        categoryIds: [geometriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // Combinatória
    {
        title: "Combinação Simples",
        statement:
            "De quantas maneiras podemos escolher 3 pessoas de um grupo de 5?",
        alternatives: [
            { text: "10", isCorrect: true },
            { text: "15", isCorrect: false },
            { text: "20", isCorrect: false },
            { text: "60", isCorrect: false },
            { text: "125", isCorrect: false },
        ],
        correctAnswer: 0,
        explanation: "C(5,3) = 5!/(3!×2!) = (5×4)/(2×1) = 10",
        categoryIds: [combinatoriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        title: "Permutação",
        statement:
            "Quantos anagramas podem ser formados com as letras da palavra MATH?",
        alternatives: [
            { text: "12", isCorrect: false },
            { text: "16", isCorrect: false },
            { text: "20", isCorrect: false },
            { text: "24", isCorrect: true },
            { text: "32", isCorrect: false },
        ],
        correctAnswer: 3,
        explanation:
            "Como todas as letras são distintas, temos P₄ = 4! = 24 anagramas.",
        categoryIds: [combinatoriaId],
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

db.questions.insertMany(questions);
print("Questões inseridas com sucesso");

print("=".repeat(50));
print("📚 DADOS DE EXEMPLO INSERIDOS COM SUCESSO! 📚");
print("=".repeat(50));
print("📊 Estatísticas:");
print("- Categorias:", db.categories.countDocuments());
print("- Teorias:", db.theories.countDocuments());
print("- Resumos:", db.summaries.countDocuments());
print("- Flashcards:", db.flashcards.countDocuments());
print("- Questões:", db.questions.countDocuments());
print("=".repeat(50));
print("🎯 Plataforma pronta para testes do usuário!");
print("✅ Interface pública populada com conteúdo real");
print("✅ Dados diversificados para todas as funcionalidades");
print("✅ Experiência de usuário completa disponível");
print("=".repeat(50));
