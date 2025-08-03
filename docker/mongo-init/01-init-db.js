// Script de inicialização do MongoDB para Math Learn Platform

// Conectar ao banco mathlearn
db = db.getSiblingDB("mathlearn");

// Criar usuário específico para a aplicação
db.createUser({
    user: "mathlearn_user",
    pwd: "mathlearn_password",
    roles: [
        {
            role: "readWrite",
            db: "mathlearn",
        },
    ],
});

// Criar coleções com validação
db.createCollection("categories", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "slug", "description"],
            properties: {
                name: {
                    bsonType: "string",
                    minLength: 1,
                    maxLength: 100,
                },
                slug: {
                    bsonType: "string",
                    pattern: "^[a-z0-9-]+$",
                },
                description: {
                    bsonType: "string",
                    maxLength: 500,
                },
                isPublished: {
                    bsonType: "bool",
                },
            },
        },
    },
});

db.createCollection("theories", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "content", "categoryIds"],
            properties: {
                title: {
                    bsonType: "string",
                    minLength: 1,
                    maxLength: 200,
                },
                content: {
                    bsonType: "string",
                    minLength: 1,
                },
                categoryIds: {
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "objectId",
                    },
                },
                isPublished: {
                    bsonType: "bool",
                },
            },
        },
    },
});

db.createCollection("questions", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [
                "title",
                "statement",
                "alternatives",
                "correctAnswer",
                "explanation",
                "categoryIds",
            ],
            properties: {
                title: {
                    bsonType: "string",
                    minLength: 1,
                    maxLength: 200,
                },
                statement: {
                    bsonType: "string",
                    minLength: 1,
                },
                alternatives: {
                    bsonType: "array",
                    minItems: 5,
                    maxItems: 5,
                    items: {
                        bsonType: "object",
                        required: ["text", "isCorrect"],
                        properties: {
                            text: {
                                bsonType: "string",
                                minLength: 1,
                            },
                            isCorrect: {
                                bsonType: "bool",
                            },
                        },
                    },
                },
                correctAnswer: {
                    bsonType: "int",
                    minimum: 0,
                    maximum: 4,
                },
                explanation: {
                    bsonType: "string",
                    minLength: 1,
                },
                categoryIds: {
                    bsonType: "array",
                    minItems: 1,
                    items: {
                        bsonType: "objectId",
                    },
                },
                isPublished: {
                    bsonType: "bool",
                },
            },
        },
    },
});

// Criar índices para performance
db.categories.createIndex({ slug: 1 }, { unique: true });
db.categories.createIndex({ name: "text", description: "text" });
db.categories.createIndex({ isPublished: 1 });

db.theories.createIndex({ categoryIds: 1 });
db.theories.createIndex({ title: "text", content: "text" });
db.theories.createIndex({ isPublished: 1 });
db.theories.createIndex({ createdAt: -1 });

db.questions.createIndex({ categoryIds: 1 });
db.questions.createIndex({ title: "text", statement: "text" });
db.questions.createIndex({ isPublished: 1 });
db.questions.createIndex({ createdAt: -1 });

print("Math Learn Database initialized successfully!");
print("Collections created with validation schemas");
print("Indexes created for optimal performance");
