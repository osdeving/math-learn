import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITheory extends Document {
    _id: string;
    title: string;
    content: string; // Markdown + LaTeX
    categoryIds: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TheorySchema = new Schema<ITheory>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot be more than 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            trim: true,
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
TheorySchema.index({ categoryIds: 1 });
TheorySchema.index({ isPublished: 1 });
TheorySchema.index({ createdAt: -1 });
TheorySchema.index({ title: "text", content: "text" });

// Prevent re-compilation during development
const Theory: Model<ITheory> =
    mongoose.models.Theory || mongoose.model<ITheory>("Theory", TheorySchema);

export default Theory;
