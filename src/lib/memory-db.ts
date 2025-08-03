import { MongoMemoryServer } from "mongodb-memory-server-core";

let mongod: MongoMemoryServer | undefined;

export async function startInMemoryMongoDB() {
    if (mongod) {
        return mongod.getUri();
    }

    console.log("🚀 Iniciando MongoDB Memory Server...");

    mongod = await MongoMemoryServer.create({
        instance: {
            dbName: "mathlearn-dev",
            port: 27017,
        },
    });

    const uri = mongod.getUri();
    console.log("✅ MongoDB Memory Server iniciado em:", uri);

    // Definir a URI no environment
    process.env.MONGODB_URI = uri;

    return uri;
}

export async function stopInMemoryMongoDB() {
    if (mongod) {
        console.log("🛑 Parando MongoDB Memory Server...");
        await mongod.stop();
        mongod = undefined;
        console.log("✅ MongoDB Memory Server parado");
    }
}

// Cleanup automático
process.on("SIGINT", async () => {
    await stopInMemoryMongoDB();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await stopInMemoryMongoDB();
    process.exit(0);
});
