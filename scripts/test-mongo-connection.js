// Script para testar conexão com MongoDB Atlas
const mongoose = require("mongoose");

// Usar variável de ambiente ou string direta
const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb+srv://osdeving:ieXaCn9PKxlKgZUj@mathlearncluster.bprwef1.mongodb.net/math-learn?retryWrites=true&w=majority&appName=MathLearnCluster";

async function testConnection() {
    console.log("🔌 Testando conexão com MongoDB Atlas...");
    console.log(
        "📍 URI:",
        MONGODB_URI.replace(/(:\/\/[^:]+:)[^@]+(@)/, "$1***$2")
    );

    try {
        // Conectar ao MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Conexão estabelecida com sucesso!");

        // Testar operações básicas
        console.log("\n📊 Testando operações...");

        // Listar coleções
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();
        console.log("📁 Coleções encontradas:", collections.length);
        collections.forEach((col) => console.log(`   - ${col.name}`));

        // Testar cada coleção
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
                    mongoose.connection.db.collection(collectionName);
                const count = await collection.countDocuments();
                console.log(`📋 ${collectionName}: ${count} documentos`);

                if (count > 0) {
                    const sample = await collection.findOne();
                    console.log(
                        `   📄 Exemplo: ${
                            sample.title ||
                            sample.name ||
                            sample.question ||
                            "N/A"
                        }`
                    );
                }
            } catch (err) {
                console.log(`❌ ${collectionName}: ${err.message}`);
            }
        }

        console.log("\n✅ Teste de conexão concluído com sucesso!");
    } catch (error) {
        console.error("❌ Erro na conexão:", error.message);

        if (error.message.includes("Authentication failed")) {
            console.log("\n🔑 Dicas para resolver autenticação:");
            console.log("1. Verificar username/password no Atlas");
            console.log("2. Verificar whitelist de IPs (0.0.0.0/0 para todos)");
            console.log("3. Verificar se o cluster está ativo");
        }

        if (error.message.includes("ENOTFOUND")) {
            console.log("\n🌐 Dicas para resolver DNS:");
            console.log("1. Verificar conexão com internet");
            console.log("2. Verificar URL do cluster");
        }
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Conexão encerrada.");
    }
}

// Executar teste
testConnection().catch(console.error);
