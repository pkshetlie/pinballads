"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

export default function TermsOfService() {
  const t = useTranslations("Terms")
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
                {t("backHome")}
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {t("title")}
            </h1>
            <p className="text-muted-foreground">
              {t("lastUpdated")} {lastUpdatedDate}
            </p>
          </div>

          <div className="space-y-6">
            {/* Mentions légales */}
            <Card>
              <CardHeader>
                <CardTitle>{t("mentionsTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t("mentionsContent", { websiteName })}</p>
              </CardContent>
            </Card>

            {/* CGU : Objet */}
            <Card>
              <CardHeader>
                <CardTitle>{t("objectTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("objectContent", { websiteName })}</p>
              </CardContent>
            </Card>

            {/* Utilisation */}
            <Card>
              <CardHeader>
                <CardTitle>{t("usageTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t("usageRule1")}</li>
                  <li>{t("usageRule2")}</li>
                  <li>{t("usageRule3")}</li>
                </ul>
              </CardContent>
            </Card>

            {/* Responsabilités */}
            <Card>
              <CardHeader>
                <CardTitle>{t("responsibilityTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t("responsibilityContent1")}</p>
                <p>{t("responsibilityContent2")}</p>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card>
              <CardHeader>
                <CardTitle>{t("ipTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("ipContent")}</p>
              </CardContent>
            </Card>

            {/* Politique de confidentialité */}
            <Card>
              <CardHeader>
                <CardTitle>{t("privacyTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{t("privacyContent1")}</p>
                <p>{t("privacyContent2")}</p>
                <p>{t("privacyContent3")}</p>
                <p>
                  {t("privacyRights")} {contactEmail}
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card>
              <CardHeader>
                <CardTitle>{t("cookiesTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{t("cookiesContent")}</p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle>{t("contactTitle")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {t("contactContent")} {contactEmail}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
