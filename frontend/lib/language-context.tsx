"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language } from "@/translations/globals"
import {useAuth} from "@/lib/auth-context";

interface LanguageContextType {
    language: Language
    setLanguage: (language: Language) => void
    t: (key: string, variables?: Record<string, string | number>, count?: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    // Par défaut : français
    const [language, setLanguage] = useState<Language>()
    const {user} = useAuth()

    // Chargement de la langue enregistrée (si elle existe)
    useEffect(() => {
        if (typeof window === "undefined") return
        if(user) {
            localStorage.setItem("language", user.language)
        }

        const saved = localStorage.getItem("language")
        if (saved) {
            setLanguage(saved as Language)
        }
    }, [user])

    // Sauvegarde à chaque changement
    useEffect(() => {
        if(!language) return
        if (typeof window === "undefined") return
        localStorage.setItem("language", language)
    }, [language])

    // Fonctions utilitaires
    const getNestedTranslation = (obj: any, path: string): string | undefined =>
        path.split(".").reduce((acc, part) => acc?.[part], obj)

    const replaceVariables = (
        text: string,
        variables?: Record<string, string | number>,
        count?: number
    ): string => {
        if (!variables && count === undefined) return text
        let result = text
        if (variables) {
            result = result.replace(/\{\{(\w+)\}\}/g, (_, key) =>
                (variables[key] ?? `{{${key}}}`).toString()
            )
        }
        if (count !== undefined) {
            const parts = result.split("|")
            result = count <= 1 ? parts[0] : parts[1] || parts[0]
        }
        return result
    }

    const t = (key: string, variables?: Record<string, string | number>, count?: number): string => {
        const translation =
            getNestedTranslation(translations[language], key) ||
            getNestedTranslation(translations.en, key) ||
            key
        return replaceVariables(translation, variables, count)
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) throw new Error("useLanguage must be used within a LanguageProvider")
    return context
}
