/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuração para Docker deployment
    output: "standalone",

    experimental: {
        appDir: true,
    },
    images: {
        domains: ["localhost"],
    },
    // Otimizações para performance
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },

    // Configurações para ambiente Docker
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },

    // Headers de segurança
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
