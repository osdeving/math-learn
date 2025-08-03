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

                        // LaTeX block ($$...$$)
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

                        // Código normal com syntax highlighting
                        if (!inline && language && language !== "math") {
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
                    // Processamento customizado de texto para capturar LaTeX inline
                    text: ({ children }) => {
                        if (typeof children !== "string") return children;

                        // Dividir o texto em partes, separando LaTeX inline
                        const parts = children.split(/(\$[^$\n]+\$)/g);

                        return (
                            <>
                                {parts.map((part, index) => {
                                    // Se a parte começa e termina com $, é LaTeX inline
                                    if (
                                        part.startsWith("$") &&
                                        part.endsWith("$") &&
                                        part.length > 2
                                    ) {
                                        const latex = part.slice(1, -1);
                                        try {
                                            return (
                                                <InlineMath
                                                    key={index}
                                                    math={latex}
                                                />
                                            );
                                        } catch (error) {
                                            console.warn(
                                                "Erro ao renderizar LaTeX inline:",
                                                latex,
                                                error
                                            );
                                            return (
                                                <code
                                                    key={index}
                                                    className="bg-red-100 text-red-600 px-2 py-1 rounded"
                                                >
                                                    {latex}
                                                </code>
                                            );
                                        }
                                    }
                                    // Caso contrário, retorna o texto normal
                                    return part;
                                })}
                            </>
                        );
                    },
                    // Headers com estilo customizado
                    h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-l-4 border-blue-500 pl-4">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
                            {children}
                        </h3>
                    ),
                    // Parágrafos com melhor espaçamento
                    p: ({ children }) => (
                        <p className="text-gray-700 leading-relaxed mb-4">
                            {children}
                        </p>
                    ),
                    // Listas numeradas
                    ol: ({ children }) => (
                        <ol className="list-decimal list-inside space-y-2 mb-4 ml-4">
                            {children}
                        </ol>
                    ),
                    // Listas com marcadores
                    ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                            {children}
                        </ul>
                    ),
                    // Items de lista
                    li: ({ children }) => (
                        <li className="text-gray-700">{children}</li>
                    ),
                    // Links
                    a: ({ children, href }) => (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    // Citações/blockquotes
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600 bg-gray-50 rounded-r">
                            {children}
                        </blockquote>
                    ),
                    // Tabelas
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-gray-300">
                                {children}
                            </table>
                        </div>
                    ),
                    th: ({ children }) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border border-gray-300 px-4 py-2">
                            {children}
                        </td>
                    ),
                    // Divisórias horizontais
                    hr: () => <hr className="my-8 border-gray-300" />,
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
