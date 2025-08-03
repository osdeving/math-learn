#!/usr/bin/env node
const { startInMemoryMongoDB } = require("./src/lib/memory-db.ts");

async function startDev() {
    try {
        // Inicializar MongoDB em memória
        await startInMemoryMongoDB();

        // Inicializar Next.js
        const { spawn } = require("child_process");
        const nextDev = spawn("npx", ["next", "dev"], {
            stdio: "inherit",
            shell: true,
        });

        nextDev.on("close", (code) => {
            console.log(`Next.js dev server exited with code ${code}`);
            process.exit(code);
        });
    } catch (error) {
        console.error(
            "Erro ao inicializar ambiente de desenvolvimento:",
            error
        );
        process.exit(1);
    }
}

startDev();
