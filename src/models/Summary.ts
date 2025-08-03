import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISummary extends Document {
    _id: string;
    title: string;
    content: string; // Texto curto e direto
    categoryIds: string[];
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SummarySchema = new Schema<ISummary>(
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
            maxlength: [
                1000,
                "Summary content cannot be more than 1000 characters",
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
SummarySchema.index({ categoryIds: 1 });
SummarySchema.index({ isPublished: 1 });
SummarySchema.index({ createdAt: -1 });
SummarySchema.index({ title: "text", content: "text" });

const Summary: Model<ISummary> =
    mongoose.models.Summary ||
    mongoose.model<ISummary>("Summary", SummarySchema);

export default Summary;
