import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Math Learn - Plataforma de Estudo de Matemática",
    description:
        "Plataforma modular para estudo de matemática com teoria, resumos, flashcards e questões",
    keywords: "matemática, estudo, educação, álgebra, combinatória",
    authors: [{ name: "Math Learn Team" }],
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body className="antialiased">
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
