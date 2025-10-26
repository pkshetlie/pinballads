"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Camera, MapPin, Bell, Globe, Palette, User, Save, Loader2, Lock, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LocationResult {
    display_name: string
    lat: string
    lon: string
}

export default function SettingsPage() {
    const { user } = useAuth()
    const { language, setLanguage } = useLanguage()
    const { theme, setTheme } = useTheme()
    const { toast } = useToast()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [currency, setCurrency] = useState("EUR")
    const [profilePublic, setProfilePublic] = useState(true)
    const [showEmail, setShowEmail] = useState(false)
    const [showPhone, setShowPhone] = useState(false)
    const [messageNotifications, setMessageNotifications] = useState(true)
    const [newsletter, setNewsletter] = useState(false)

    const [avatarUrl, setAvatarUrl] = useState<string>("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [preferredCity, setPreferredCity] = useState("")
    const [citySearch, setCitySearch] = useState("")
    const [cityResults, setCityResults] = useState<LocationResult[]>([])
    const [selectedLocation, setSelectedLocation] = useState<{ lat: string; lon: string } | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Load user settings on mount
    useEffect(() => {
        if (user) {
            const savedSettings = localStorage.getItem(`user_settings_${user.id}`)
            if (savedSettings) {
                const settings = JSON.parse(savedSettings)
                setAvatarUrl(settings.avatarUrl || "")
                setEmailNotifications(settings.emailNotifications ?? true)
                setPreferredCity(settings.preferredCity || "")
                setSelectedLocation(settings.location || null)
                setFullName(settings.fullName || user.name || "")
                setEmail(settings.email || user.email || "")
                setPhone(settings.phone || "")
                setCurrency(settings.currency || "EUR")
                setProfilePublic(settings.profilePublic ?? true)
                setShowEmail(settings.showEmail ?? false)
                setShowPhone(settings.showPhone ?? false)
                setMessageNotifications(settings.messageNotifications ?? true)
                setNewsletter(settings.newsletter ?? false)
            } else {
                setFullName(user.name || "")
                setEmail(user.email || "")
            }
        }
    }, [user])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (citySearch.length < 3) {
            setCityResults([])
            return
        }

        const searchTimeout = setTimeout(async () => {
            setIsSearching(true)
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(citySearch)}&limit=5`,
                )
                const data = await response.json()
                setCityResults(data)
            } catch (error) {
                console.error("Error searching cities:", error)
                toast({
                    title: "Erreur",
                    description: "Impossible de rechercher la ville",
                    variant: "destructive",
                })
            } finally {
                setIsSearching(false)
            }
        }, 500)

        return () => clearTimeout(searchTimeout)
    }, [citySearch, toast])

    const handleCitySelect = (result: LocationResult) => {
        setPreferredCity(result.display_name)
        setSelectedLocation({ lat: result.lat, lon: result.lon })
        setCitySearch("")
        setCityResults([])
    }

    const handleSaveSettings = async () => {
        if (!user) return

        setIsSaving(true)
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            const settings = {
                avatarUrl,
                emailNotifications,
                preferredCity,
                location: selectedLocation,
                theme,
                language,
                fullName,
                email,
                phone,
                currency,
                profilePublic,
                showEmail,
                showPhone,
                messageNotifications,
                newsletter,
            }

            // Save to localStorage (in production, this would be an API call)
            localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings))

            toast({
                title: "Paramètres sauvegardés",
                description: "Vos paramètres ont été mis à jour avec succès",
            })
        } catch (error) {
            console.error("Error saving settings:", error)
            toast({
                title: "Erreur",
                description: "Impossible de sauvegarder les paramètres",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeleteAccount = async () => {
        if (!user) return

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            toast({
                title: "Compte supprimé",
                description: "Votre compte a été supprimé avec succès",
            })

            // In production, this would log out the user and redirect
            window.location.href = "/"
        } catch (error) {
            console.error("Error deleting account:", error)
            toast({
                title: "Erreur",
                description: "Impossible de supprimer le compte",
                variant: "destructive",
            })
        }
    }

    if (!user) {
        return (<>
            <Navbar></Navbar>
                <div className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">Vous devez être connecté pour accéder aux paramètres</p>
                        </CardContent>
                    </Card>
                </div>
        </>)
    }

    return (<>
            <Navbar></Navbar>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres (en cours)</h1>
                    <p className="text-muted-foreground">Gérez vos préférences et informations personnelles</p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Informations du compte
                            </CardTitle>
                            <CardDescription>Gérez vos informations personnelles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Nom complet</Label>
                                <Input
                                    id="full-name"
                                    type="text"
                                    placeholder="Votre nom complet"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+33 6 12 34 56 78"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <Separator />
                            <div>
                                <Link href="/reset-password">
                                    <Button variant="outline" className="gap-2 bg-transparent">
                                        <Lock className="w-4 h-4" />
                                        Changer le mot de passe
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Photo de profil
                            </CardTitle>
                            <CardDescription>Téléchargez une photo de profil pour personnaliser votre compte</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback className="text-2xl">
                                        {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit">
                                            <Camera className="w-4 h-4" />
                                            Changer la photo
                                        </div>
                                        <Input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </Label>
                                    <p className="text-sm text-muted-foreground mt-2">JPG, PNG ou GIF. Max 5MB.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Confidentialité
                            </CardTitle>
                            <CardDescription>Contrôlez la visibilité de vos informations</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="profile-public">Profil public</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Permettre aux autres utilisateurs de voir votre profil
                                    </p>
                                </div>
                                <Switch id="profile-public" checked={profilePublic} onCheckedChange={setProfilePublic} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="show-email">Afficher l'email publiquement</Label>
                                    <p className="text-sm text-muted-foreground">Votre email sera visible sur votre profil public</p>
                                </div>
                                <Switch id="show-email" checked={showEmail} onCheckedChange={setShowEmail} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="show-phone">Afficher le téléphone publiquement</Label>
                                    <p className="text-sm text-muted-foreground">Votre numéro sera visible sur votre profil public</p>
                                </div>
                                <Switch id="show-phone" checked={showPhone} onCheckedChange={setShowPhone} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Thème
                            </CardTitle>
                            <CardDescription>Choisissez l'apparence de l'interface</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Label htmlFor="theme-select">Thème de l'interface</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger id="theme-select">
                                        <SelectValue placeholder="Sélectionner un thème" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Clair</SelectItem>
                                        <SelectItem value="dark">Sombre</SelectItem>
                                        <SelectItem value="system">Système</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Langue et devise
                            </CardTitle>
                            <CardDescription>Choisissez la langue et la devise de l'interface</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language-select">Langue de l'interface</Label>
                                <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "fr" | "de")}>
                                    <SelectTrigger id="language-select">
                                        <SelectValue placeholder="Sélectionner une langue" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">🇺🇸 English</SelectItem>
                                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency-select">Devise</Label>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger id="currency-select">
                                        <SelectValue placeholder="Sélectionner une devise" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                                        <SelectItem value="USD">$ Dollar US (USD)</SelectItem>
                                        <SelectItem value="GBP">£ Livre Sterling (GBP)</SelectItem>
                                        <SelectItem value="CHF">CHF Franc Suisse (CHF)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>Gérez vos préférences de notification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications">Notifications par email</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir des emails pour les nouvelles annonces</p>
                                </div>
                                <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="message-notifications">Notifications de messages</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir des emails pour les nouveaux messages</p>
                                </div>
                                <Switch
                                    id="message-notifications"
                                    checked={messageNotifications}
                                    onCheckedChange={setMessageNotifications}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="newsletter">Newsletter</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir la newsletter avec les actualités et offres</p>
                                </div>
                                <Switch id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Ville préférée
                            </CardTitle>
                            <CardDescription>Définissez votre ville pour voir les annonces à proximité</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="city-search">Rechercher une ville</Label>
                                    <div className="relative">
                                        <Input
                                            id="city-search"
                                            type="text"
                                            placeholder="Entrez le nom d'une ville..."
                                            value={citySearch}
                                            onChange={(e) => setCitySearch(e.target.value)}
                                            className="mt-2"
                                        />
                                        {isSearching && (
                                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
                                        )}
                                    </div>
                                    {cityResults.length > 0 && (
                                        <div className="mt-2 border rounded-md bg-card shadow-lg max-h-48 overflow-y-auto">
                                            {cityResults.map((result, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleCitySelect(result)}
                                                    className="w-full text-left px-4 py-2 hover:bg-accent transition-colors text-sm"
                                                >
                                                    {result.display_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {preferredCity && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{preferredCity}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-destructive">
                                <Trash2 className="w-5 h-5" />
                                Zone de danger
                            </CardTitle>
                            <CardDescription>Actions irréversibles sur votre compte</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="gap-2">
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer mon compte
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible. Cela supprimera définitivement votre compte et toutes vos données
                                            de nos serveurs, y compris vos collections et annonces.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Oui, supprimer mon compte
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => window.history.back()}>
                            Annuler
                        </Button>
                        <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Enregistrer les modifications
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}
