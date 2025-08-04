"use client";

import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
    params: { id: string };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
    if (!params.id) {
        notFound();
    }

    return <CategoryForm categoryId={params.id} isEditing={true} />;
}
