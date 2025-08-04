import QuestionForm from "@/components/admin/QuestionForm";

interface EditQuestionPageProps {
    params: {
        id: string;
    };
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
    return <QuestionForm questionId={params.id} isEditing />;
}
