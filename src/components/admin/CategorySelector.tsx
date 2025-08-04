"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface CategorySelectorProps {
    categories: Category[];
    selectedIds: string[];
    onChange: (selectedIds: string[]) => void;
    error?: string;
    className?: string;
}

export default function CategorySelector({
    categories,
    selectedIds,
    onChange,
    error,
    className,
}: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCategories = categories.filter((cat) =>
        selectedIds.includes(cat._id)
    );

    const handleToggle = (categoryId: string) => {
        const newSelectedIds = selectedIds.includes(categoryId)
            ? selectedIds.filter((id) => id !== categoryId)
            : [...selectedIds, categoryId];
        onChange(newSelectedIds);
    };

    const handleRemove = (categoryId: string) => {
        onChange(selectedIds.filter((id) => id !== categoryId));
    };

    const handleClearAll = () => {
        onChange([]);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {/* Selected Categories */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                        <Badge
                            key={category._id}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            {category.name}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-3 w-3 p-0 hover:bg-transparent"
                                onClick={() => handleRemove(category._id)}
                            >
                                <X className="h-2 w-2" />
                            </Button>
                        </Badge>
                    ))}
                    {selectedCategories.length > 1 && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                            Limpar todos
                        </Button>
                    )}
                </div>
            )}

            {/* Selector */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className={cn(
                            "w-full justify-between",
                            error && "border-red-500"
                        )}
                    >
                        <span className="text-left truncate">
                            {selectedCategories.length > 0
                                ? `${selectedCategories.length} categoria${
                                      selectedCategories.length > 1 ? "s" : ""
                                  } selecionada${
                                      selectedCategories.length > 1 ? "s" : ""
                                  }`
                                : "Selecione as categorias"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <div className="max-h-60 overflow-y-auto">
                        {categories.length === 0 ? (
                            <p className="p-4 text-sm text-gray-500">
                                Nenhuma categoria disponível
                            </p>
                        ) : (
                            <div className="p-2">
                                {categories.map((category) => (
                                    <div
                                        key={category._id}
                                        className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                        onClick={() =>
                                            handleToggle(category._id)
                                        }
                                    >
                                        <Checkbox
                                            checked={selectedIds.includes(
                                                category._id
                                            )}
                                            onChange={() =>
                                                handleToggle(category._id)
                                            }
                                        />
                                        <label className="flex-1 text-sm cursor-pointer">
                                            {category.name}
                                        </label>
                                        {selectedIds.includes(category._id) && (
                                            <Check className="h-4 w-4 text-blue-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Error */}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
