"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    FileText,
    FolderTree,
    HelpCircle,
    Menu,
    MessageSquare,
    Settings,
    Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: FolderTree,
    },
    {
        name: "Categorias",
        href: "/admin/categories",
        icon: FolderTree,
    },
    {
        name: "Teoria",
        href: "/admin/theory",
        icon: BookOpen,
    },
    {
        name: "Questões",
        href: "/admin/questions",
        icon: HelpCircle,
    },
    {
        name: "Flashcards",
        href: "/admin/flashcards",
        icon: MessageSquare,
    },
    {
        name: "Resumos",
        href: "/admin/summaries",
        icon: FileText,
    },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64">
                                <nav className="flex flex-col space-y-2 mt-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                                isActive(item.href)
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        {/* Logo */}
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="bg-blue-600 text-white px-2 py-1 rounded font-bold text-sm">
                                ML
                            </div>
                            <span className="font-semibold text-gray-900">
                                Math Learn Admin
                            </span>
                        </Link>
                    </div>

                    {/* User menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Users className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link href="/admin/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Configurações
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Ver Site
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 bg-white border-r border-gray-200">
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 lg:pl-64">
                    <div className="px-4 py-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
