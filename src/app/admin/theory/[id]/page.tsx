import TheoryForm from "@/components/admin/TheoryForm";

interface EditTheoryPageProps {
    params: {
        id: string;
    };
}

export default function EditTheoryPage({ params }: EditTheoryPageProps) {
    return <TheoryForm theoryId={params.id} isEditing />;
}
