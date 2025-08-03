import mongoose from "mongoose";

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/mathlearn-dev";

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        console.log(`🔌 Conectando ao MongoDB: ${MONGODB_URI}`);

        cached.promise = mongoose
            .connect(MONGODB_URI, opts)
            .then((mongoose) => {
                console.log("✅ MongoDB conectado com sucesso!");
                return mongoose;
            })
            .catch(async (e) => {
                console.log("❌ Falha na conexão com MongoDB:", e.message);

                // Se falhar e estivermos em desenvolvimento, tentar MongoDB em memória
                if (process.env.NODE_ENV === "development") {
                    console.log(
                        "🔄 Tentando inicializar MongoDB em memória..."
                    );
                    try {
                        const { MongoMemoryServer } = await import(
                            "mongodb-memory-server-core"
                        );
                        const mongod = await MongoMemoryServer.create({
                            instance: {
                                dbName: "mathlearn-dev",
                            },
                        });
                        const memoryUri = mongod.getUri();
                        console.log(
                            "✅ MongoDB Memory Server iniciado:",
                            memoryUri
                        );

                        return mongoose
                            .connect(memoryUri, opts)
                            .then((mongoose) => {
                                console.log(
                                    "✅ Conectado ao MongoDB em memória!"
                                );
                                return mongoose;
                            });
                    } catch (memoryError) {
                        console.error(
                            "❌ Falha ao inicializar MongoDB em memória:",
                            memoryError
                        );
                        throw e; // throw original error
                    }
                }
                throw e;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
