import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"

export function LanguageToggle() {
    const { t,language: currentLanguage, setLanguage } = useLanguage()
    const languages = [
        { code: "fr", name: "Français", flag: "🇫🇷" },
        { code: "en", name: "English", flag: "🇺🇸" },
        // { code: "de", name: "Deutsch", flag: "🇩🇪" },
    ]

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={'cursor-pointer'}>
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t('nav.toggleLanguage')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => setLanguage(language.code)}
                        className={currentLanguage === language.code ? "bg-accent" : ""}
                    >
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
