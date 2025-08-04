"use client";

import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Edit, Eye } from "lucide-react";
import { useState } from "react";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder = "Digite o conteúdo em Markdown...",
    className,
    error,
}: MarkdownEditorProps) {
    const [isPreview, setIsPreview] = useState(false);

    return (
        <div className={cn("space-y-2", className)}>
            {/* Editor/Preview Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 rounded-md p-1">
                    <Button
                        type="button"
                        variant={!isPreview ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setIsPreview(false)}
                        className="h-8"
                    >
                        <Edit className="mr-2 h-3 w-3" />
                        Editor
                    </Button>
                    <Button
                        type="button"
                        variant={isPreview ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setIsPreview(true)}
                        className="h-8"
                    >
                        <Eye className="mr-2 h-3 w-3" />
                        Preview
                    </Button>
                </div>
                <div className="text-sm text-gray-500">
                    Suporte a LaTeX: $inline$ e $$block$$
                </div>
            </div>

            {/* Editor/Preview Content */}
            <div className="border rounded-md">
                {isPreview ? (
                    <div className="min-h-[300px] p-4 bg-white">
                        {value ? (
                            <MarkdownRenderer content={value} />
                        ) : (
                            <p className="text-gray-500 italic">
                                Nada para visualizar. Digite algo no editor.
                            </p>
                        )}
                    </div>
                ) : (
                    <Textarea
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                            onChange(e.target.value)
                        }
                        placeholder={placeholder}
                        className="min-h-[300px] border-0 resize-none font-mono text-sm"
                        style={{ outline: "none", boxShadow: "none" }}
                    />
                )}
            </div>

            {/* Help Text */}
            {!isPreview && (
                <div className="text-xs text-gray-500 space-y-1">
                    <p>
                        <strong>Dicas:</strong>
                    </p>
                    <p>• Use # para títulos, ## para subtítulos</p>
                    <p>• Use **texto** para negrito, *texto* para itálico</p>
                    <p>
                        • Use $x^2$ para fórmulas inline e $$x^2$$ para fórmulas
                        em bloco
                    </p>
                    <p>• Use - ou 1. para listas</p>
                </div>
            )}

            {/* Error */}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
