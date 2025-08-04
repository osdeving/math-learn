"use client";

import SummaryForm from "@/components/admin/SummaryForm";
import { notFound } from "next/navigation";

interface EditSummaryPageProps {
    params: { id: string };
}

export default function EditSummaryPage({ params }: EditSummaryPageProps) {
    if (!params.id) {
        notFound();
    }

    return <SummaryForm summaryId={params.id} isEditing={true} />;
}
