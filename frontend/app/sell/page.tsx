"use client"

import type React from "react"

import {
    User,
    ListCheck,
    Gamepad2, DollarSign
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/Navbar";
import {useLanguage} from "@/lib/language-context";
import Footer from "@/components/Footer";



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
            <Footer></Footer>
        </>
    )
}
