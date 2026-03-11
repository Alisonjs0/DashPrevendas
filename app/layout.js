import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Dashboard de Clientes",
    description: "Monitoramento de satisfação e status de clientes",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" className="dark">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
