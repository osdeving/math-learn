"use client";

import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({
    content,
    className = "",
}: MarkdownRendererProps) {
    // Pré-processar o conteúdo para melhor renderização do LaTeX
    const processedContent = content
        // Converter blocos LaTeX para markdown code blocks
        .replace(/\$\$([\s\S]*?)\$\$/g, (match, latex) => {
            return `\n\n\`\`\`math\n${latex.trim()}\n\`\`\`\n\n`;
        })
        // Converter LaTeX inline para markdown inline code
        .replace(/\$([^$\n]+)\$/g, (match, latex) => {
            return `\`math:${latex.trim()}\``;
        });

    return (
        <div className={`prose prose-lg max-w-none ${className}`}>
            <ReactMarkdown
                components={{
                    // Renderizar código
                    code: ({ inline, className, children, ...props }) => {
                        const textContent = String(children).replace(/\n$/, "");
                        const match = /language-(\w+)/.exec(className || "");
                        const language = match ? match[1] : "";

                        // LaTeX inline
                        if (inline && textContent.startsWith("math:")) {
                            const latex = textContent.replace("math:", "");
                            try {
                                return <InlineMath math={latex} />;
                            } catch (error) {
                                console.warn(
                                    "Erro ao renderizar LaTeX inline:",
                                    latex,
                                    error
                                );
                                return (
                                    <code className="bg-red-100 text-red-600 px-2 py-1 rounded">
                                        {latex}
                                    </code>
                                );
                            }
                        }

                        // LaTeX block
                        if (!inline && language === "math") {
                            try {
                                return <BlockMath math={textContent} />;
                            } catch (error) {
                                console.warn(
                                    "Erro ao renderizar LaTeX block:",
                                    textContent,
                                    error
                                );
                                return (
                                    <pre className="bg-red-100 text-red-600 p-4 rounded">
                                        {textContent}
                                    </pre>
                                );
                            }
                        }

                        // Código normal
                        if (!inline && language) {
                            return (
                                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            );
                        }

                        // Código inline normal
                        if (inline) {
                            return (
                                <code
                                    className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                    // Melhorar renderização de parágrafos
                    p: ({ children }) => (
                        <p className="mb-4 leading-relaxed">{children}</p>
                    ),
                    // Melhorar renderização de títulos
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mb-4 mt-6 text-gray-800">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold mb-3 mt-5 text-gray-700">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="text-lg font-medium mb-2 mt-4 text-gray-600">
                            {children}
                        </h4>
                    ),
                    // Melhorar listas
                    ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-4 space-y-2">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                    ),
                    // Melhorar tabelas
                    table: ({ children }) => (
                        <div className="overflow-x-auto mb-6">
                            <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-gray-50">{children}</thead>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-300 px-4 py-2 text-gray-600">
                            {children}
                        </td>
                    ),
                    // Melhorar blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700">
                            {children}
                        </blockquote>
                    ),
                    // Melhorar código em linha
                    inlineCode: ({ children }) => (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                            {children}
                        </code>
                    ),
                    // Melhorar blocos de código
                    pre: ({ children }) => (
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
                            {children}
                        </pre>
                    ),
                }}
                remarkPlugins={[]}
                rehypePlugins={[]}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
