// frontend/components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context"; // Importez votre AuthContext pour gérer l'état utilisateur
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import {useLanguage} from "@/lib/language-context";
import {LogOutIcon, Moon, Radar, Sun, User} from "lucide-react"

function LanguageToggleWrapper() {
    const { language, setLanguage } = useLanguage()

    return <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
}

export default function Navbar() {
    const { user, logout } = useAuth(); // Récupère les données utilisateur via le contexte
    const { t } = useLanguage()
    const [isReady, setIsReady] = useState(false); // Nouvel état pour vérifier que tout est prêt
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Nouvel état pour vérifier que tout est prêt

    useEffect(() => {
        // Simule un délai pour que le contexte soit prêt
        const timeout = setTimeout(() => setIsReady(true), 100); // Attendre 100ms
        return () => clearTimeout(timeout); // Cleanup timeout si Layout est démonté
    }, []);

    if (!isReady) {
        // Placeholder pendant le chargement pour éviter un rendu non connecté
        return (
            <header className="border-b bg-card/80 backdrop-blur-sm md:sticky fixed top-0 w-full z-50">
            <div className="container mx-auto px-4 py-4">Loading...</div>
            </header>
        );
    }

    return (
        <header className="border-b bg-card md:sticky fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground text-lg">
                                <img src="/images/logo.svg" alt="Logo"/>
                            </span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Crazy Pinball</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        <button
                            className="md:hidden text-foreground cursor-pointer"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                )}
                            </svg>
                        </button>
                        <div
                            className={`${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 fixed md:relative top-[73px] md:top-auto right-0 h-screen md:h-auto w-80 md:w-auto bg-card md:bg-transparent p-4 md:p-0 border-l md:border-0 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none`}>
                            <a href="/"
                               className={`text-muted-foreground hover:text-foreground transition-colors ${isMobileMenuOpen ? 'text-2xl': ''}`}>
                                {t("nav.home")}
                            </a>
                            <a href="/pricing"
                               className={`text-muted-foreground hover:text-foreground transition-colors ${isMobileMenuOpen ? 'text-2xl': ''}`}>
                                {t("nav.pricing")}
                            </a>
                            <a href="/listings"
                               className={`text-muted-foreground hover:text-foreground transition-colors ${isMobileMenuOpen ? 'text-2xl': ''}`}>
                                {t("nav.browse")}
                            </a>
                            {user ? (<>
                                <Button size='default' asChild>
                                    <a href="/collection" className={`text-foreground font-medium ${isMobileMenuOpen ? 'text-2xl' : ''}`}>{t('collection.myCollections')}</a>
                                </Button>

                                <span className={`text-foreground flex gap-2 font-medium ${isMobileMenuOpen ? 'text-2xl' : ''}`}>
                                    <User/>
                                    {user.name}
                                </span>
                                <div className="block md:hidden">
                                    <Button
                                        onClick={() => logout()}
                                        variant="outline"
                                        className="cursor-pointer w-full"
                                    >
                                        <span className="text-lg md:text-2xl">Logout</span>
                                        <LogOutIcon/>
                                    </Button>
                                </div>

                            </>) : (
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/signin" className="text-base">{t('nav.signIn')}</a>
                                </Button>
                            )}
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <LanguageToggleWrapper/>
                            <ThemeToggle/>
                            {user ?
                                <Button onClick={() => logout()} variant="secondary" size="icon"
                                        className={'cursor-pointer'}>
                                    <LogOutIcon/>
                                    <span className="sr-only">Logout</span>
                                </Button> : <></>}
                        </div>

                    </nav>
                </div>
            </div>
        </header>
    );
}
