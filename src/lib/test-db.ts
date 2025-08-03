import { MongoMemoryServer } from "mongodb-memory-server";

let mongod: MongoMemoryServer | null = null;

export async function startDatabase() {
    if (mongod) {
        return mongod.getUri();
    }

    mongod = await MongoMemoryServer.create({
        instance: {
            dbName: "mathlearn-test",
        },
    });

    const uri = mongod.getUri();
    console.log("MongoDB Memory Server started at:", uri);

    return uri;
}

export async function stopDatabase() {
    if (mongod) {
        await mongod.stop();
        mongod = null;
    }
}

// Para usar em desenvolvimento, descomente as linhas abaixo:
if (
    process.env.NODE_ENV === "development" &&
    process.env.USE_MEMORY_DB === "true"
) {
    startDatabase().then((uri) => {
        process.env.MONGODB_URI = uri;
    });
}

// Cleanup quando o processo for terminado
process.on("SIGINT", async () => {
    await stopDatabase();
    process.exit(0);
});
