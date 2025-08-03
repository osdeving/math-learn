import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleTheory = {
    title: "Limites - Conceitos Fundamentais",
    content: `# Limites: Conceitos Fundamentais

## Definição de Limite

O conceito de limite é fundamental no cálculo diferencial e integral. Dizemos que:

$$\\lim_{x \\to a} f(x) = L$$

quando os valores de $f(x)$ se aproximam arbitrariamente de $L$ conforme $x$ se aproxima de $a$.

## Propriedades dos Limites

Sejam $f(x)$ e $g(x)$ funções com limites existentes quando $x$ se aproxima de $a$:

1. **Soma**: $\\lim_{x \\to a} [f(x) + g(x)] = \\lim_{x \\to a} f(x) + \\lim_{x \\to a} g(x)$

2. **Produto**: $\\lim_{x \\to a} [f(x) \\cdot g(x)] = \\lim_{x \\to a} f(x) \\cdot \\lim_{x \\to a} g(x)$

3. **Quociente**: $\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\frac{\\lim_{x \\to a} f(x)}{\\lim_{x \\to a} g(x)}$, desde que $\\lim_{x \\to a} g(x) \\neq 0$

## Exemplo Prático

Considere a função $f(x) = \\frac{x^2 - 4}{x - 2}$. Para encontrar $\\lim_{x \\to 2} f(x)$:

$$\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2} (x + 2) = 4$$

## Limites Importantes

Alguns limites fundamentais incluem:

- $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$
- $\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e$
- $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$

## Aplicações

Os limites são essenciais para:

- Definir derivadas: $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$
- Definir integrais definidas
- Estudar continuidade de funções
- Analisar comportamento assintótico

> **Nota**: A compreensão sólida dos limites é fundamental para o sucesso em cálculo diferencial e integral.`,
};

export default function TestKaTeX() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Teste de Renderização KaTeX
                    </h1>
                    <p className="text-center text-gray-600">
                        Esta página demonstra como as fórmulas matemáticas são
                        renderizadas
                    </p>
                </div>

                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-gray-900">
                            {sampleTheory.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <MarkdownRenderer
                            content={sampleTheory.content}
                            className="text-gray-800"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
