"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamic import to avoid SSR issues with KaTeX
const MarkdownRenderer = dynamic(
    () => import("@/components/MarkdownRenderer"),
    {
        ssr: false,
        loading: () => <div className="animate-pulse h-4 bg-gray-200 rounded" />,
    }
);

interface Alternative {
    text: string;
    isCorrect: boolean;
}

interface Question {
    _id: string;
    title: string;
    statement: string;
    alternatives: Alternative[];
    correctAnswer: number;
    explanation: string;
    categoryIds: Array<{ _id: string; name: string; slug: string }>;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

interface InteractiveQuestionProps {
    question: Question;
}

export default function InteractiveQuestion({
    question,
}: InteractiveQuestionProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        setShowResult(true);
        setHasAnswered(true);
    };

    const handleReset = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setHasAnswered(false);
    };

    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
        <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                    Alternativas
                </CardTitle>
                <CardDescription>
                    {hasAnswered
                        ? isCorrect
                            ? "✅ Parabéns! Você acertou!"
                            : "❌ Resposta incorreta. Veja a explicação abaixo."
                        : "Selecione a alternativa que você considera correta"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Alternatives */}
                    {question.alternatives.map((alternative, index) => (
                        <AlternativeCard
                            key={index}
                            alternative={alternative}
                            index={index}
                            isSelected={selectedAnswer === index}
                            onSelect={() => !hasAnswered && setSelectedAnswer(index)}
                            showResult={showResult}
                            isCorrect={index === question.correctAnswer}
                            disabled={hasAnswered}
                        />
                    ))}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t">
                        {!hasAnswered ? (
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedAnswer === null}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Confirmar Resposta
                            </Button>
                        ) : (
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                                Tentar Novamente
                            </Button>
                        )}
                    </div>

                    {/* Explanation */}
                    {showResult && (
                        <Card className="mt-6 border-l-4 border-l-blue-500 bg-blue-50/50">
                            <CardHeader>
                                <CardTitle className="text-base text-blue-900">
                                    Explicação
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-blue prose-sm max-w-none">
                                    <MarkdownRenderer content={question.explanation} />
                                </div>
                                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center text-sm text-green-800">
                                        <CheckCircle size={16} className="mr-2" />
                                        <span className="font-medium">
                                            Resposta correta: {String.fromCharCode(65 + question.correctAnswer)}) 
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-green-700">
                                        <MarkdownRenderer 
                                            content={question.alternatives[question.correctAnswer].text} 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

interface AlternativeCardProps {
    alternative: Alternative;
    index: number;
    isSelected: boolean;
    onSelect: () => void;
    showResult: boolean;
    isCorrect: boolean;
    disabled: boolean;
}

function AlternativeCard({
    alternative,
    index,
    isSelected,
    onSelect,
    showResult,
    isCorrect,
    disabled,
}: AlternativeCardProps) {
    const getCardStyle = () => {
        if (!showResult) {
            return isSelected
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300";
        }

        if (isCorrect) {
            return "border-green-500 bg-green-50";
        }

        if (isSelected && !isCorrect) {
            return "border-red-500 bg-red-50";
        }

        return "border-gray-200 opacity-60";
    };

    const getIconStyle = () => {
        if (!showResult) {
            return isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800";
        }

        if (isCorrect) {
            return "bg-green-500 text-white";
        }

        if (isSelected && !isCorrect) {
            return "bg-red-500 text-white";
        }

        return "bg-gray-100 text-gray-600";
    };

    return (
        <div
            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${getCardStyle()} ${
                disabled ? "cursor-not-allowed" : ""
            }`}
            onClick={onSelect}
        >
            <div className="flex items-start space-x-3">
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${getIconStyle()}`}
                >
                    {String.fromCharCode(65 + index)}
                </div>
                <div className="flex-1">
                    <div className="prose prose-sm max-w-none">
                        <MarkdownRenderer content={alternative.text} />
                    </div>
                </div>
                {showResult && isCorrect && (
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                )}
                {showResult && isSelected && !isCorrect && (
                    <XCircle className="text-red-500 flex-shrink-0" size={20} />
                )}
            </div>
        </div>
    );
}
