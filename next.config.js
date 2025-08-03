/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
