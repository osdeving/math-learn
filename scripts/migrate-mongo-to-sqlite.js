const { PrismaClient } = require("@prisma/client");
const mongoose = require("mongoose");
require("dotenv").config();

const prisma = new PrismaClient();

// MongoDB connection
async function connectMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

// Define MongoDB schemas directly
const CategorySchema = new mongoose.Schema({
    name: String,
    description: String,
    slug: String,
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const TheorySchema = new mongoose.Schema({
    title: String,
    content: String,
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const SummarySchema = new mongoose.Schema({
    title: String,
    content: String,
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const FlashcardSchema = new mongoose.Schema({
    question: String,
    answer: String,
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const QuestionSchema = new mongoose.Schema({
    title: String,
    statement: String,
    alternatives: [
        {
            text: String,
            isCorrect: Boolean,
        },
    ],
    correctAnswer: Number,
    explanation: String,
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isPublished: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

// MongoDB Models
const Category = mongoose.model("Category", CategorySchema);
const Theory = mongoose.model("Theory", TheorySchema);
const Summary = mongoose.model("Summary", SummarySchema);
const Flashcard = mongoose.model("Flashcard", FlashcardSchema);
const Question = mongoose.model("Question", QuestionSchema);

async function migrateCategories() {
    console.log("\n🏷️ Migrating Categories...");

    const mongoCategories = await Category.find({}).lean();
    console.log(`Found ${mongoCategories.length} categories in MongoDB`);

    for (const category of mongoCategories) {
        const prismaCategory = await prisma.category.create({
            data: {
                name: category.name,
                description: category.description,
                slug: category.slug,
                isPublished: category.isPublished,
                createdAt: new Date(category.createdAt),
                updatedAt: new Date(category.updatedAt),
            },
        });

        // Store mapping for reference
        category._prismaId = prismaCategory.id;

        console.log(
            `✅ Migrated category: ${category.name} (${category._id} → ${prismaCategory.id})`
        );
    }

    return mongoCategories;
}

async function migrateTheories(categoryMap) {
    console.log("\n📖 Migrating Theories...");

    const mongoTheories = await Theory.find({}).populate("categoryIds").lean();
    console.log(`Found ${mongoTheories.length} theories in MongoDB`);

    for (const theory of mongoTheories) {
        const prismaTheory = await prisma.theory.create({
            data: {
                title: theory.title,
                content: theory.content,
                isPublished: theory.isPublished,
                createdAt: new Date(theory.createdAt),
                updatedAt: new Date(theory.updatedAt),
            },
        });

        // Create category relationships
        for (const categoryId of theory.categoryIds) {
            const categoryMap_id = categoryId._id || categoryId;
            const category = categoryMap.find(
                (c) => c._id.toString() === categoryMap_id.toString()
            );

            if (category) {
                await prisma.theoryCategory.create({
                    data: {
                        theoryId: prismaTheory.id,
                        categoryId: category._prismaId,
                    },
                });
            }
        }

        console.log(
            `✅ Migrated theory: ${theory.title} (${theory._id} → ${prismaTheory.id})`
        );
    }
}

async function migrateSummaries(categoryMap) {
    console.log("\n📝 Migrating Summaries...");

    const mongoSummaries = await Summary.find({})
        .populate("categoryIds")
        .lean();
    console.log(`Found ${mongoSummaries.length} summaries in MongoDB`);

    for (const summary of mongoSummaries) {
        const prismaSummary = await prisma.summary.create({
            data: {
                title: summary.title,
                content: summary.content,
                isPublished: summary.isPublished,
                createdAt: new Date(summary.createdAt),
                updatedAt: new Date(summary.updatedAt),
            },
        });

        // Create category relationships
        for (const categoryId of summary.categoryIds) {
            const categoryMap_id = categoryId._id || categoryId;
            const category = categoryMap.find(
                (c) => c._id.toString() === categoryMap_id.toString()
            );

            if (category) {
                await prisma.summaryCategory.create({
                    data: {
                        summaryId: prismaSummary.id,
                        categoryId: category._prismaId,
                    },
                });
            }
        }

        console.log(
            `✅ Migrated summary: ${summary.title} (${summary._id} → ${prismaSummary.id})`
        );
    }
}

async function migrateFlashcards(categoryMap) {
    console.log("\n🎯 Migrating Flashcards...");

    const mongoFlashcards = await Flashcard.find({})
        .populate("categoryIds")
        .lean();
    console.log(`Found ${mongoFlashcards.length} flashcards in MongoDB`);

    for (const flashcard of mongoFlashcards) {
        const prismaFlashcard = await prisma.flashcard.create({
            data: {
                question: flashcard.question,
                answer: flashcard.answer,
                isPublished: flashcard.isPublished,
                createdAt: new Date(flashcard.createdAt),
                updatedAt: new Date(flashcard.updatedAt),
            },
        });

        // Create category relationships
        for (const categoryId of flashcard.categoryIds) {
            const categoryMap_id = categoryId._id || categoryId;
            const category = categoryMap.find(
                (c) => c._id.toString() === categoryMap_id.toString()
            );

            if (category) {
                await prisma.flashcardCategory.create({
                    data: {
                        flashcardId: prismaFlashcard.id,
                        categoryId: category._prismaId,
                    },
                });
            }
        }

        console.log(
            `✅ Migrated flashcard: ${flashcard.question.substring(
                0,
                50
            )}... (${flashcard._id} → ${prismaFlashcard.id})`
        );
    }
}

async function migrateQuestions(categoryMap) {
    console.log("\n❓ Migrating Questions...");

    const mongoQuestions = await Question.find({})
        .populate("categoryIds")
        .lean();
    console.log(`Found ${mongoQuestions.length} questions in MongoDB`);

    for (const question of mongoQuestions) {
        const prismaQuestion = await prisma.question.create({
            data: {
                title: question.title,
                statement: question.statement,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                isPublished: question.isPublished,
                createdAt: new Date(question.createdAt),
                updatedAt: new Date(question.updatedAt),
            },
        });

        // Create alternatives
        for (let i = 0; i < question.alternatives.length; i++) {
            const alternative = question.alternatives[i];
            await prisma.alternative.create({
                data: {
                    text: alternative.text,
                    isCorrect: alternative.isCorrect,
                    questionId: prismaQuestion.id,
                },
            });
        }

        // Create category relationships
        for (const categoryId of question.categoryIds) {
            const categoryMap_id = categoryId._id || categoryId;
            const category = categoryMap.find(
                (c) => c._id.toString() === categoryMap_id.toString()
            );

            if (category) {
                await prisma.questionCategory.create({
                    data: {
                        questionId: prismaQuestion.id,
                        categoryId: category._prismaId,
                    },
                });
            }
        }

        console.log(
            `✅ Migrated question: ${question.title} (${question._id} → ${prismaQuestion.id})`
        );
    }
}

async function validateMigration() {
    console.log("\n🔍 Validating Migration...");

    const counts = {
        categories: await prisma.category.count(),
        theories: await prisma.theory.count(),
        summaries: await prisma.summary.count(),
        flashcards: await prisma.flashcard.count(),
        questions: await prisma.question.count(),
        alternatives: await prisma.alternative.count(),
    };

    console.log("\n📊 SQLite Database Counts:");
    console.log(`Categories: ${counts.categories}`);
    console.log(`Theories: ${counts.theories}`);
    console.log(`Summaries: ${counts.summaries}`);
    console.log(`Flashcards: ${counts.flashcards}`);
    console.log(`Questions: ${counts.questions}`);
    console.log(`Alternatives: ${counts.alternatives}`);

    // Test complex query with relationships
    const categoriesWithContent = await prisma.category.findMany({
        include: {
            theories: { include: { theory: true } },
            summaries: { include: { summary: true } },
            flashcards: { include: { flashcard: true } },
            questions: { include: { question: true } },
        },
    });

    console.log("\n✅ Relationship test successful!");
    console.log(
        `Found ${categoriesWithContent.length} categories with all relationships`
    );

    return counts;
}

async function main() {
    try {
        console.log("🚀 Starting MongoDB to SQLite Migration...");

        await connectMongoDB();

        // Clear existing SQLite data
        console.log("\n🧹 Clearing existing SQLite data...");
        await prisma.$executeRaw`DELETE FROM favorites`;
        await prisma.$executeRaw`DELETE FROM alternatives`;
        await prisma.$executeRaw`DELETE FROM question_categories`;
        await prisma.$executeRaw`DELETE FROM flashcard_categories`;
        await prisma.$executeRaw`DELETE FROM summary_categories`;
        await prisma.$executeRaw`DELETE FROM theory_categories`;
        await prisma.$executeRaw`DELETE FROM questions`;
        await prisma.$executeRaw`DELETE FROM flashcards`;
        await prisma.$executeRaw`DELETE FROM summaries`;
        await prisma.$executeRaw`DELETE FROM theories`;
        await prisma.$executeRaw`DELETE FROM categories`;

        // Migrate in order due to relationships
        const categoryMap = await migrateCategories();
        await migrateTheories(categoryMap);
        await migrateSummaries(categoryMap);
        await migrateFlashcards(categoryMap);
        await migrateQuestions(categoryMap);

        // Validate
        await validateMigration();

        console.log("\n✅ Migration completed successfully!");
        console.log("🎯 SQLite database is ready to use");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        await prisma.$disconnect();
    }
}

main();
