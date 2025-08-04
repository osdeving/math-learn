import FlashcardForm from "@/components/admin/FlashcardForm";

interface FlashcardEditPageProps {
    params: {
        id: string;
    };
}

export default function FlashcardEditPage({ params }: FlashcardEditPageProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <FlashcardForm flashcardId={params.id} isEditing />
        </div>
    );
}
