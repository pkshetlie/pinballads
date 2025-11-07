"use client"


import {useLanguage} from "@/lib/language-context";
import * as Sentry from "@sentry/react";
import React from "react";

export default function Footer() {
    const { t } = useLanguage()

    Sentry.init({
        dsn: "https://b6c01400b8bfc7764f2929b6f084cf87@o139094.ingest.us.sentry.io/4510255670493184",
        // Setting this option to true will send default PII data to Sentry.
        // For example, automatic IP address collection on events
        sendDefaultPii: true
    });

    return (
    <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground text-lg">
                                <img src="/images/logo.svg" alt="Logo"/>
                            </span>
                        </div>
                        <span className="text-xl font-bold text-foreground">Crazy Pinball</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{t("footer.premierMarketplace")}</p>
                </div>
                <div>
                    <h5 className="font-semibold text-foreground mb-3">{t("footer.marketplace")}</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <a href="#" className="hover:text-foreground transition-colors">
                                {t("footer.browseMachines")}
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-foreground transition-colors">
                                {t("footer.sellYourMachine")}
                            </a>
                        </li>
                        {/*<li>*/}
                        {/*    <a href="#" className="hover:text-foreground transition-colors">*/}
                        {/*        {t("footer.priceGuide")}*/}
                        {/*    </a>*/}
                        {/*</li>*/}
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-foreground mb-3">{t("footer.support")}</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {/*<li>*/}
                        {/*    <a href="#" className="hover:text-foreground transition-colors">*/}
                        {/*        {t("footer.helpCenter")}*/}
                        {/*    </a>*/}
                        {/*</li>*/}
                        <li>
                            <a href="/terms-of-service" className="hover:text-foreground transition-colors">
                                {t("auth.termsAndConditions")}
                            </a>
                        </li>
                        <li>
                            <a href="mailto:contact@crazy-pinball.com" className="hover:text-foreground transition-colors">
                                {t("footer.contactUs")}
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-foreground mb-3">{t("footer.community")}</h5>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <a href="https://www.facebook.com/crazypinballcom" target="_blank" className="hover:text-foreground transition-colors">
                                {t("footer.facebook")}
                            </a>
                        </li>
                        <li>
                            <a href="https://discord.gg/vS393ZSvE2" target="_blank" className="hover:text-foreground transition-colors">
                                {t("footer.discord")}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                <p>&copy; 2025 crazy-pinball. {t("footer.allRightsReserved")}.</p>
                <img referrerPolicy="no-referrer-when-downgrade" src="https://matomo.ragnacustoms.com/matomo.php?idsite=5&amp;rec=1" style={{border:0}} />
            </div>
        </div>
    </footer>)
}
