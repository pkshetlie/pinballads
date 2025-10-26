"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    const { language } = useLanguage()
    const {t} = useLanguage()

    return (<>
        <Navbar></Navbar>
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4 cursor-pointer">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === "fr" ? "Retour" : "Back"}
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{t("privacy.title")}</h1>
                    <p className="text-muted-foreground">
                        {t("privacy.lastUpdated")}: <span className="font-mono">2025-10-07</span>
                    </p>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground leading-relaxed">{t("privacy.intro")}</p>
                        </CardContent>
                    </Card>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Card key={num}>
                            <CardHeader>
                                <CardTitle>
                                    {num}. {t(`privacy.section${num}Title`)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t(`privacy.section${num}Content`)}
                                </p>
                                {num === 9 && (
                                    <div className="bg-muted p-2 rounded-lg space-y-2 mt-4">
                                        {/*<p className="font-semibold">{t("privacy.companyName")}</p>*/}
                                        {/*<p>{t("privacy.companyAddress")}</p>*/}
                                        {/*<p>{t("privacy.companyCity")}</p>*/}
                                        {/*<p>{t("privacy.companyCountry")}</p>*/}
                                        {/*<p className="pt-2">*/}
                                        {/*    <strong>Email:</strong> {t("privacy.companyEmail")}*/}
                                        {/*</p>*/}
                                        {/*<p>*/}
                                        {/*    <strong>{language === "fr" ? "Téléphone" : "Phone"}:</strong> {t("privacy.companyPhone")}*/}
                                        {/*</p>*/}
                                        <div className="border-t border-border">
                                            {/*<p className="text-sm">{t("privacy.dataProtectionOfficer")}</p>*/}
                                            <p className="text-sm">{t("privacy.companyEmail")}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
        <Footer></Footer>
        </>
    )
}
