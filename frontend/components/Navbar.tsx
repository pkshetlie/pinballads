// frontend/components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context"; // Importez votre AuthContext pour gérer l'état utilisateur
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import {useLanguage} from "@/lib/language-context";
import { Radar } from "lucide-react"

function LanguageToggleWrapper() {
    const { language, setLanguage } = useLanguage()

    return <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
}

export default function Navbar() {
    const { user, logout } = useAuth(); // Récupère les données utilisateur via le contexte
    const { t } = useLanguage()
    const [isReady, setIsReady] = useState(false); // Nouvel état pour vérifier que tout est prêt

    useEffect(() => {
        // Simule un délai pour que le contexte soit prêt
        const timeout = setTimeout(() => setIsReady(true), 100); // Attendre 100ms
        return () => clearTimeout(timeout); // Cleanup timeout si Layout est démonté
    }, []);

    if (!isReady) {
        // Placeholder pendant le chargement pour éviter un rendu non connecté
        return (
            <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">Loading...</div>
            </header>
        );
    }

    return (
        <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg"><Radar/></span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Crazy Pinball</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-6">
                            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                {t("nav.home")}
                            </a>
                            <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                                {t("nav.pricing")}
                            </a>
                            <a href="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
                                {t("nav.browse")}
                            </a>
                            {user ? (<>
                                <a href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
                                    {t("nav.sell")}
                                </a>
                                <span className="text-sm text-foreground font-medium">{user.email}</span>

                                <Button size="sm" asChild>
                                    <a href="/collection">{t('collection.myCollections')}</a>
                                </Button>
                            </>) : (
                                // Sinon, afficher le bouton Sign In
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/signin">{t('nav.signIn')}</a>
                                </Button>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageToggleWrapper />
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
