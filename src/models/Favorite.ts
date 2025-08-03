import mongoose, { Document, Schema } from "mongoose";

// Interface para o documento Favorite
export interface IFavorite extends Document {
    userId: string; // ID do usuário (para futuro sistema de autenticação)
    contentId: string; // ID do conteúdo favoritado
    contentType: "theory" | "summary" | "flashcard" | "question";
    createdAt: Date;
    updatedAt: Date;
}

// Schema do Favorite
const FavoriteSchema = new Schema<IFavorite>(
    {
        userId: {
            type: String,
            required: [true, "User ID is required"],
            index: true,
        },
        contentId: {
            type: String,
            required: [true, "Content ID is required"],
            index: true,
        },
        contentType: {
            type: String,
            required: [true, "Content type is required"],
            enum: ["theory", "summary", "flashcard", "question"],
        },
    },
    {
        timestamps: true,
        collection: "favorites",
    }
);

// Índices compostos para evitar duplicatas e otimizar consultas
FavoriteSchema.index(
    { userId: 1, contentId: 1, contentType: 1 },
    { unique: true }
);
FavoriteSchema.index({ userId: 1, contentType: 1 });
FavoriteSchema.index({ userId: 1, createdAt: -1 });

// Métodos estáticos
FavoriteSchema.statics.findUserFavorites = function (
    userId: string,
    contentType?: string
) {
    const query: any = { userId };
    if (contentType) {
        query.contentType = contentType;
    }
    return this.find(query).sort({ createdAt: -1 });
};

FavoriteSchema.statics.isFavorited = async function (
    userId: string,
    contentId: string,
    contentType: string
) {
    const favorite = await this.findOne({ userId, contentId, contentType });
    return !!favorite;
};

FavoriteSchema.statics.toggleFavorite = async function (
    userId: string,
    contentId: string,
    contentType: string
) {
    const existing = await this.findOne({ userId, contentId, contentType });

    if (existing) {
        await existing.deleteOne();
        return { favorited: false, message: "Removed from favorites" };
    } else {
        const favorite = new this({ userId, contentId, contentType });
        await favorite.save();
        return { favorited: true, message: "Added to favorites" };
    }
};

// Middleware para validar se o content existe
FavoriteSchema.pre("save", async function () {
    // Validar se o conteúdo existe baseado no tipo
    let Model;
    switch (this.contentType) {
        case "theory":
            Model = mongoose.models.Theory;
            break;
        case "summary":
            Model = mongoose.models.Summary;
            break;
        case "flashcard":
            Model = mongoose.models.Flashcard;
            break;
        case "question":
            Model = mongoose.models.Question;
            break;
        default:
            throw new Error("Invalid content type");
    }

    if (Model) {
        const contentExists = await Model.findById(this.contentId);
        if (!contentExists) {
            throw new Error(`${this.contentType} not found`);
        }
    }
});

// Exportar o modelo
const Favorite =
    mongoose.models.Favorite ||
    mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export default Favorite;
