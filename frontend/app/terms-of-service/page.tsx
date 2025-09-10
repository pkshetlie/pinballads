"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {useLanguage} from "@/lib/language-context";

export default function TermsOfService() {
  const {t} = useLanguage()
  const lastUpdatedDate = "2025-09-09"
  const websiteName = "Crazy Pinball"
  const contactEmail = "contact@crazy-pinball.com"

  return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("terms.backHome")}
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t("terms.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("terms.lastUpdated")} {lastUpdatedDate}
            </p>
          </div>

          <div className="space-y-6">
            {/* Mentions légales */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.mentionsTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t("terms.mentionsContent")}</p>
              </CardContent>
            </Card>

            {/* CGU : Objet */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.objectTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("terms.objectContent")}</p>
              </CardContent>
            </Card>

            {/* Utilisation */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.usageTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t("terms.usageRule1")}</li>
                  <li>{t("terms.usageRule2")}</li>
                  <li>{t("terms.usageRule3")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Responsabilités */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.responsibilityTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t("terms.responsibilityContent1")}</p>
                <p>{t("terms.responsibilityContent2")}</p>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.ipTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("terms.ipContent")}</p>
              </CardContent>
            </Card>

            {/* Politique de confidentialité */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.privacyTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t("terms.privacyContent1")}</p>
                <p>{t("terms.privacyContent2")}</p>
                <p>{t("terms.privacyContent3")}</p>
                <p>
                  {t("terms.privacyRights")} {contactEmail}
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.cookiesTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("terms.cookiesContent")}</p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>{t("terms.contactTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {t("terms.contactContent")} {contactEmail}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
