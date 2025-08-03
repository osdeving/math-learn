import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAlternative {
    text: string;
    isCorrect: boolean;
}

export interface IQuestion extends Document {
    _id: string;
    title: string;
    statement: string;
    alternatives: IAlternative[]; // Exatamente 5 alternativas (RN6)
    correctAnswer: number; // Index da alternativa correta (0-4)
    explanation: string;
    categoryIds: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AlternativeSchema = new Schema<IAlternative>(
    {
        text: {
            type: String,
            required: [true, "Alternative text is required"],
            trim: true,
            maxlength: [200, "Alternative cannot be more than 200 characters"],
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
    },
    { _id: false }
);

const QuestionSchema = new Schema<IQuestion>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot be more than 200 characters"],
        },
        statement: {
            type: String,
            required: [true, "Statement is required"],
            trim: true,
            maxlength: [1000, "Statement cannot be more than 1000 characters"],
        },
        alternatives: {
            type: [AlternativeSchema],
            required: true,
            validate: {
                validator: function (alternatives: IAlternative[]) {
                    // RN6: Exatamente 5 alternativas
                    if (alternatives.length !== 5) {
                        return false;
                    }

                    // Exatamente uma alternativa correta
                    const correctCount = alternatives.filter(
                        (alt) => alt.isCorrect
                    ).length;
                    return correctCount === 1;
                },
                message:
                    "Question must have exactly 5 alternatives with exactly one correct answer",
            },
        },
        correctAnswer: {
            type: Number,
            required: true,
            min: 0,
            max: 4,
            validate: {
                validator: function (correctAnswer: number) {
                    // Verificar se o índice corresponde à alternativa correta
                    return (
                        this.alternatives &&
                        this.alternatives[correctAnswer]?.isCorrect === true
                    );
                },
                message:
                    "Correct answer index must match the correct alternative",
            },
        },
        explanation: {
            type: String,
            required: [true, "Explanation is required"],
            trim: true,
            maxlength: [
                1000,
                "Explanation cannot be more than 1000 characters",
            ],
        },
        categoryIds: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category",
                required: true,
            },
        ],
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
QuestionSchema.index({ categoryIds: 1 });
QuestionSchema.index({ isPublished: 1 });
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ title: "text", statement: "text" });

const Question: Model<IQuestion> =
    mongoose.models.Question ||
    mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
