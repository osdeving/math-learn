import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFlashcard extends Document {
    _id: string;
    question: string;
    answer: string;
    categoryIds: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>(
    {
        question: {
            type: String,
            required: [true, "Question is required"],
            trim: true,
            maxlength: [500, "Question cannot be more than 500 characters"],
        },
        answer: {
            type: String,
            required: [true, "Answer is required"],
            trim: true,
            maxlength: [1000, "Answer cannot be more than 1000 characters"],
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
FlashcardSchema.index({ categoryIds: 1 });
FlashcardSchema.index({ isPublished: 1 });
FlashcardSchema.index({ createdAt: -1 });
FlashcardSchema.index({ question: "text", answer: "text" });

const Flashcard: Model<IFlashcard> =
    mongoose.models.Flashcard ||
    mongoose.model<IFlashcard>("Flashcard", FlashcardSchema);

export default Flashcard;
