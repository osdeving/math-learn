import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    name: string;
    description: string;
    slug: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9-]+$/,
                "Slug can only contain lowercase letters, numbers and hyphens",
            ],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for better performance
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ isPublished: 1 });
CategorySchema.index({ createdAt: -1 });

// Static methods
CategorySchema.statics.findPublished = function () {
    return this.find({ isPublished: true }).sort({ name: 1 });
};

// Instance methods
CategorySchema.methods.publish = function () {
    this.isPublished = true;
    return this.save();
};

CategorySchema.methods.unpublish = function () {
    this.isPublished = false;
    return this.save();
};

// Prevent re-compilation during development
const Category: Model<ICategory> =
    mongoose.models.Category ||
    mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
