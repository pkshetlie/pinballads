"use client"

import React, {useEffect, useState} from "react"

import {Camera, MapPin, Bell, Globe, Palette, User, Save, Loader2, Lock, Trash2, Shield} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Switch} from "@/components/ui/switch"
import {useAuth} from "@/lib/auth-context"
import {useLanguage} from "@/lib/language-context"
import {useTheme} from "next-themes"
import {useToast} from "@/hooks/use-toast"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {QueryLocationResult} from "@/components/object/QueryLocationResult";
import InputCity from "@/components/InputCity";
import {useApi} from "@/lib/api";
import {SliderMax} from "@/components/ui/sliderMax";

export default function SettingsPage() {
    const {user, refreshUser} = useAuth()
    const {language, setLanguage} = useLanguage()
    const {theme, setTheme} = useTheme()
    const {toast} = useToast()
    const {t} = useLanguage()
    const {apiPost} = useApi()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [currency, setCurrency] = useState("EUR")
    const [profilePublic, setProfilePublic] = useState(false)
    const [messageNotifications, setMessageNotifications] = useState(false)
    const [nextUsernameChangeDate, setNextUsernameChangeDate] = useState<string|null>(null)
    const [newsletter, setNewsletter] = useState(false)

    const [bio, setBio] = useState<string>("")
    const [avatarUrl, setAvatarUrl] = useState<string>("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [selectedLocation, setSelectedLocation] = useState<QueryLocationResult | null>(null)
    const [searchDistance, setSearchDistance] = useState<number>(50)
    const [isSaving, setIsSaving] = useState(false)

    // Load user settings on mount
    // useEffect(() => {
    //     if (user) {
    //         console.log("User settings loaded:", user.settings)
    //         const settings = user.settings
    //         setAvatarUrl(user.avatar || "")
    //         setFullName(user.name || "")
    //         setEmail(user.email || user.email || "")
    //         console.log("settings loaded:", settings)
    //
    //
    //         setEmailNotifications(settings.isEmailNotificationAllowed ?? true)
    //         setMessageNotifications(settings.isEmailMessageNotificationAllowed ?? false)
    //         setNewsletter(settings.isEmailNewsletterNotificationAllowed ?? false)
    //         setProfilePublic(settings.isPublicProfile ?? false)
    //
    //         // setPreferredCity(settings.preferredCity || "")
    //         setSelectedLocation(settings.defaultSearchLocation || null)
    //         setSearchDistance(settings.defaultSearchDistance || null)
    //         setCurrency(settings.currency || "EUR")
    //
    //         console.log("defaultSearchLocation:", selectedLocation, settings.defaultSearchLocation)
    //
    //
    //     }
    // }, [user])

    useEffect(() => {
        if (!user?.settings) return;

        const s = user.settings;

        // On applique les settings aux états locaux
        setAvatarUrl(user.avatar || "");
        setFullName(user.name || "");
        setEmail(user.email || "");

        setEmailNotifications(s.isEmailNotificationAllowed ?? true);
        setMessageNotifications(s.isEmailMessageNotificationAllowed ?? false);
        setNewsletter(s.isEmailNewsletterNotificationAllowed ?? false);
        setProfilePublic(s.isPublicProfile ?? false);

        setSelectedLocation(s.defaultSearchLocation || null);
        setSearchDistance(s.defaultSearchDistance || 50);
        setCurrency(s.currency || "EUR");

        const lastChange = user.settings?.lastUsernameChange
            ? new Date(user.settings.lastUsernameChange)
            : null;

        if (lastChange) {
            const nextAllowed = new Date(lastChange.getTime() + (30 * 24 * 60 * 60 * 1000));
            const now = new Date();

            if (nextAllowed > now) {
                const diff = nextAllowed.getTime() - now.getTime();
                const days = Math.floor(diff / (24 * 60 * 60 * 1000));
                const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

                setNextUsernameChangeDate(`${days}j ${hours}h ${minutes}min`);
            }
        }


    }, [user]);

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


    const handleSaveSettings = async () => {
        if (!user) return

        setIsSaving(true)
        // Simulate API call
        await apiPost('/api/settings', {
            settings : {
                language,
                defaultSearchLocation: selectedLocation,
                defaultSearchDistance: searchDistance,
                isPublicProfile: profilePublic,
                bio,
                theme,
                currency,
                isEmailNotificationAllowed: emailNotifications,
                isEmailMessageNotificationAllowed: messageNotifications,
                isEmailNewsletterNotificationAllowed: newsletter,
            },
            user: {
                email,
                displayName: fullName,
            }
        }).then((response) => {
            refreshUser(response)
            toast({
                title: "Paramètres sauvegardés",
                description: "Vos paramètres ont été mis à jour avec succès",
                variant: "success",
            })
        }).catch((e) => {
            toast({
                title: t("error"),
                description: e.message,
                variant: "destructive",
            })
        }).finally(() => {
            setIsSaving(false)
        });
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
    if (!user || !fullName) {
        return <></>
    }
    return (<>
            <Navbar></Navbar>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres</h1>
                    <p className="text-muted-foreground">Gérez vos préférences et informations personnelles</p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5"/>
                                Informations du compte
                            </CardTitle>
                            <CardDescription>Gérez vos informations personnelles</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/*<Label >Téléchargez une photo de profil pour personnaliser votre compte</Label>*/}
                            {/*<div className="flex items-center gap-6">*/}
                            {/*    <Avatar className="w-24 h-24">*/}
                            {/*        <AvatarImage src={avatarUrl} />*/}
                            {/*        <AvatarFallback className="text-2xl">*/}
                            {/*            {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}*/}
                            {/*        </AvatarFallback>*/}
                            {/*    </Avatar>*/}
                            {/*    <div className="flex-1">*/}
                            {/*        <Label htmlFor="avatar-upload" className="cursor-pointer">*/}
                            {/*            <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit">*/}
                            {/*                <Camera className="w-4 h-4" />*/}
                            {/*                Changer la photo*/}
                            {/*            </div>*/}
                            {/*            <Input*/}
                            {/*                id="avatar-upload"*/}
                            {/*                type="file"*/}
                            {/*                accept="image/*"*/}
                            {/*                className="hidden"*/}
                            {/*                onChange={handleAvatarChange}*/}
                            {/*            />*/}
                            {/*        </Label>*/}
                            {/*        <p className="text-sm text-muted-foreground mt-2">JPG, PNG ou GIF. Max 5MB.</p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Nom affiché</Label>
                                <Input
                                    id="full-name"
                                    type="text"
                                    disabled={nextUsernameChangeDate != null}
                                    placeholder="Votre nom complet"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <small className={'text-destructive'}>{nextUsernameChangeDate && (<>Prochain changement
                                    possible dans {nextUsernameChangeDate}</>)}</small>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="profile-public cursor-pointer">Profil public</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Permettre aux autres utilisateurs de voir votre profil (seules les collections
                                        publiques sont visibles)
                                    </p>
                                </div>
                                <Switch className={'cursor-pointer'} id="profile-public" checked={profilePublic} onCheckedChange={setProfilePublic}/>
                            </div>
                            <Separator/>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email (reste privé)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5"/>
                                Préférences de recherche
                            </CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div>
                                    <Label htmlFor="city-search pb-2">Définissez votre ville pour voir les annonces à
                                        proximité</Label>
                                    <InputCity onSelected={(city) => {setSelectedLocation(city)}} presetLocation={selectedLocation}/>
                                    {selectedLocation?.lat && (<div className={`my-5 `}>
                                            <SliderMax
                                                value={searchDistance}
                                                onValueChange={(values) => {
                                                        if (Array.isArray(values)) {
                                                            setSearchDistance(values[1] ?? (values[0] ?? 0));
                                                        } else {
                                                            setSearchDistance(values ?? 0);
                                                        }
                                                    }
                                                }
                                                max={250}
                                                step={5}
                                                className="w-full cursor-ew-resize"
                                            />
                                            <div className="text-sm text-muted-foreground">
                                                {t("listings.within")} {searchDistance} {t("listings.miles")}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="currency-select">Devise</Label>
                                <Select value={currency} onValueChange={setCurrency}>
                                    <SelectTrigger id="currency-select" className="cursor-pointer">
                                        <SelectValue placeholder="Sélectionner une devise"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                                        <SelectItem value="USD">$ Dollar US (USD)</SelectItem>
                                        <SelectItem value="GBP">£ Livre Sterling (GBP)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5"/>
                                Thème
                            </CardTitle>
                            <CardDescription>Choisissez l'apparence de l'interface</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <Label htmlFor="theme-select">Thème de l'interface</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger id="theme-select">
                                        <SelectValue placeholder="Sélectionner un thème"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Clair</SelectItem>
                                        <SelectItem value="dark">Sombre</SelectItem>
                                        <SelectItem value="system">Système</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                <Label htmlFor="language-select">Langue de l'interface</Label>
                                <Select value={language} onValueChange={(value) => {
                                    setLanguage(value as "en" | "fr")
                                }}>
                                    <SelectTrigger id="language-select" className="cursor-pointer">
                                        <SelectValue placeholder="Sélectionner une langue"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">🇺🇸 English</SelectItem>
                                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                                        {/*<SelectItem value="de">🇩🇪 Deutsch</SelectItem>*/}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5"/>
                                Notifications
                            </CardTitle>
                            <CardDescription>Gérez vos préférences de notification</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="message-notifications" className="cursor-pointer">Notifications de
                                        messages</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir des emails pour les nouveaux
                                        messages</p>
                                </div>
                                <Switch className="cursor-pointer"
                                        id="message-notifications"
                                        checked={messageNotifications}
                                        onCheckedChange={setMessageNotifications}
                                />
                            </div>
                            <Separator/>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="email-notifications" className="cursor-pointer">Notifications par
                                        email</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir des emails pour les nouvelles
                                        annonces</p>
                                </div>
                                <Switch id="email-notifications" className="cursor-pointer" checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}/>
                            </div>
                            <Separator/>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="newsletter" className="cursor-pointer">Newsletter</Label>
                                    <p className="text-sm text-muted-foreground">Recevoir la newsletter avec les
                                        actualités et offres</p>
                                </div>
                                <Switch className="cursor-pointer" id="newsletter" checked={newsletter}
                                        onCheckedChange={setNewsletter}/>
                            </div>
                        </CardContent>
                    </Card>


                    {/*<Card className="border-destructive">*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle className="flex items-center gap-2 text-destructive">*/}
                    {/*            <Trash2 className="w-5 h-5" />*/}
                    {/*            Zone de danger*/}
                    {/*        </CardTitle>*/}
                    {/*        <CardDescription>Actions irréversibles sur votre compte</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <AlertDialog>*/}
                    {/*            <AlertDialogTrigger asChild>*/}
                    {/*                <Button variant="destructive" className="gap-2">*/}
                    {/*                    <Trash2 className="w-4 h-4" />*/}
                    {/*                    Supprimer mon compte*/}
                    {/*                </Button>*/}
                    {/*            </AlertDialogTrigger>*/}
                    {/*            <AlertDialogContent>*/}
                    {/*                <AlertDialogHeader>*/}
                    {/*                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>*/}
                    {/*                    <AlertDialogDescription>*/}
                    {/*                        Cette action est irréversible. Cela supprimera définitivement votre compte et toutes vos données*/}
                    {/*                        de nos serveurs, y compris vos collections et annonces.*/}
                    {/*                    </AlertDialogDescription>*/}
                    {/*                </AlertDialogHeader>*/}
                    {/*                <AlertDialogFooter>*/}
                    {/*                    <AlertDialogCancel>Annuler</AlertDialogCancel>*/}
                    {/*                    <AlertDialogAction*/}
                    {/*                        onClick={handleDeleteAccount}*/}
                    {/*                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"*/}
                    {/*                    >*/}
                    {/*                        Oui, supprimer mon compte*/}
                    {/*                    </AlertDialogAction>*/}
                    {/*                </AlertDialogFooter>*/}
                    {/*            </AlertDialogContent>*/}
                    {/*        </AlertDialog>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                    <div className="flex justify-end gap-4">

                        <Button onClick={handleSaveSettings} disabled={isSaving} className="gap-2 cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin"/>
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4"/>
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
