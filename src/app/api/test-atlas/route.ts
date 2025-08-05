import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Conectar ao MongoDB
        await dbConnect();

        // Importar mongoose para usar a conexão
        const mongoose = await import("mongoose");

        // Verificar se a conexão está ativa
        if (!mongoose.connection.readyState || !mongoose.connection.db) {
            throw new Error("MongoDB connection not established");
        }

        // Listar coleções
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();

        // Contar documentos em cada coleção
        const stats: Record<string, any> = {};
        const testCollections = [
            "categories",
            "theories",
            "questions",
            "flashcards",
            "summaries",
        ];

        for (const collectionName of testCollections) {
            try {
                const collection =
                    mongoose.connection.db!.collection(collectionName);
                const count = await collection.countDocuments();
                const sample =
                    count > 0
                        ? await collection.findOne(
                              {},
                              {
                                  projection: {
                                      title: 1,
                                      name: 1,
                                      question: 1,
                                      _id: 0,
                                  },
                              }
                          )
                        : null;

                stats[collectionName] = {
                    count,
                    sample: sample
                        ? sample.title ||
                          sample.name ||
                          sample.question ||
                          "N/A"
                        : null,
                };
            } catch (err) {
                stats[collectionName] = {
                    count: 0,
                    error: err instanceof Error ? err.message : "Unknown error",
                };
            }
        }

        // Informações de ambiente
        const environment = {
            NODE_ENV: process.env.NODE_ENV,
            VERCEL: process.env.VERCEL,
            VERCEL_ENV: process.env.VERCEL_ENV,
            VERCEL_REGION: process.env.VERCEL_REGION,
            timestamp: new Date().toISOString(),
        };

        return NextResponse.json({
            success: true,
            message: "✅ MongoDB Atlas conectado com sucesso!",
            connection: {
                state: mongoose.connection.readyState,
                host: mongoose.connection.host,
                name: mongoose.connection.name,
            },
            collections: {
                total: collections.length,
                found: collections.map((c) => c.name),
            },
            stats,
            environment,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "❌ Erro na conexão com MongoDB Atlas",
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
                environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    VERCEL: process.env.VERCEL,
                    VERCEL_ENV: process.env.VERCEL_ENV,
                    hasMongoUri: !!process.env.MONGODB_URI,
                },
            },
            { status: 500 }
        );
    }
}
