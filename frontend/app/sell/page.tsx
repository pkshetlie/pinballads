"use client"

import type React from "react"

import {
    Camera,
    MapPin,
    Bell,
    Globe,
    Palette,
    User,
    Save,
    Loader2,
    Lock,
    Trash2,
    Shield,
    ListCheck,
    Gamepad2, DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import {useLanguage} from "@/lib/language-context";



export default function SettingsPage() {
    const { t } = useLanguage()

    return (<>
            <Navbar></Navbar>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">{t('sell.howToSell')}</h1>
                    <p className="text-muted-foreground">{t('sell.howToSellDescription')}</p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                {t('sell.step1')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {t('sell.step1Description')}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ListCheck className="w-5 h-5" />
                                {t('sell.step2')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {t('sell.step2Description')}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gamepad2 className="w-5 h-5" />
                                {t('sell.step3')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {t('sell.step3Description')}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                {t('sell.step4')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {t('sell.step4Description')}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
