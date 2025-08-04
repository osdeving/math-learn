import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export default function LaTeXTestPage() {
    const testContent = `# Teste de LaTeX

## Equações Inline
Aqui temos uma equação inline: $x^2 + y^2 = z^2$

E outra: $E = mc^2$

## Equações em Bloco

Integral de Gauss:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

Distribuição Normal:
$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}$$

Fórmula de Euler:
$$e^{i\\pi} + 1 = 0$$

## Texto Normal
Este é um texto normal sem LaTeX para verificar se tudo está funcionando corretamente.

- Item 1
- Item 2
- Item 3

**Texto em negrito** e *texto em itálico*.
`;

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">
                Teste de Renderização LaTeX
            </h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
                <MarkdownRenderer content={testContent} />
            </div>
        </div>
    );
}
