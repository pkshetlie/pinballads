"use client"

import type React from "react"
import {createContext, useContext, useState, useEffect} from "react"
import {translations, type Language, type TranslationKey} from "@/translations/globals"

interface LanguageContextType {
    language: Language
    setLanguage: (language: string) => void
    currentLanguage: string
    t: (key: string, variables?: Record<string, string | number>, count?: number) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({children}: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("fr")

    // Load saved language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language
        if (savedLanguage && translations[savedLanguage]) {
            setLanguage(savedLanguage)
        }
    }, [])

    // Save language to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("language", language)
    }, [language])

    function getNestedTranslation(obj: any, path: string): string | undefined {
        return path.split(".").reduce((acc, part) => acc?.[part], obj);
    }

  const replaceVariables = (text: string, variables?: Record<string, string | number>, count?: number): string => {
    if (!variables && !count) return text;

    let result = text;
    if (variables) {
      result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return (variables[key] ?? match).toString();
      });
    }

    if (count !== undefined) {
      const parts = result.split('|');
      result = count === 1 ? parts[0] : (parts[1] || parts[0]);
    }

    return result;
  }

  const t = (key: string, variables?: Record<string, string | number>, count?: number): string => {
    const translation =
        getNestedTranslation(translations[language], key) ||
        getNestedTranslation(translations.en, key) ||
        key;

    return replaceVariables(translation, variables, count);
  }

  return <LanguageContext.Provider value={{language, setLanguage, t}}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider")
    }
    return context
}
