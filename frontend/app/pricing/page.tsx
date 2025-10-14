"use client"

import {Check, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import Navbar from "@/components/Navbar";

const pricingPlans = [
    {
        name: "Gratuit",
        price: 0,
        period: "mois",
        description: "Parfait pour commencer votre collection",
        popular: false,
        features: [
            {name: "Jusqu'à 2 collections", included: true, soon: true},
            {name: "Jusqu'à 10 machines dans votre collection", included: true, soon: true},
            {name: "10 photos par machine", included: true, soon: true},
            {name: "Profil public basique", included: true, soon: true},
            {name: "Recherche et navigation complète", included: true, soon: true},
            {name: "Historique des prix", included: true, soon: true},
            {name: "Mise en avant des annonces", included: false, soon: true},
            {name: "Statistiques avancées", included: false, soon: true},
            {name: "Badge vérifié", included: false, soon: true},
            {name: "Alertes personnalisées", included: false, soon: true},
            {name: "Export de données", included: false, soon: true},
            {name: "Support prioritaire", included: false, soon: true},
            {name: "Accès API", included: false, soon: true},
        ],
    },
    {
        name: "Basique",
        price: 10,
        period: "mois",
        description: "Pour les collectionneurs passionnés",
        popular: false,
        features: [
            {name: "Jusqu'à 5 collections", included: true, soon: true},
            {name: "Jusqu'à 20 machines dans votre collection", included: true, soon: true},
            {name: "15 photos par machine", included: true, soon: true},
            {name: "Profil public personnalisé", included: true, soon: true},
            {name: "Recherche et navigation complète", included: true, soon: true},
            {name: "Historique des prix", included: true, soon: true},
            {name: "1 mise en avant par mois", included: true, soon: true},
            {name: "Statistiques de base", included: true, soon: true},
            {name: "Badge vérifié", included: false, soon: true},
            {name: "3 alertes personnalisées", included: true, soon: true},
            {name: "Export de données", included: false, soon: true},
            {name: "Support prioritaire", included: false, soon: true},
            {name: "Accès API", included: false, soon: true},
        ],
    },
    {
        name: "Premium",
        price: 30,
        period: "mois",
        description: "Solution complète pour les entreprises",
        popular: false,
        features: [
            {name: "Collections illimitées", included: true, soon: true},
            {name: "Machines illimitées dans votre collection", included: true, soon: true},
            {name: "Photos illimitées par machine", included: true, soon: true},
            {name: "Profil entreprise avec branding complet", included: true, soon: true},
            {name: "Recherche et navigation complète", included: true, soon: true},
            {name: "Historique des prix", included: true, soon: true},
            {name: "Mises en avant illimitées", included: true, soon: true},
            {name: "Statistiques avancées et analytics en temps réel", included: true, soon: true},
            {name: "Badge vérifié premium", included: true, soon: true},
            {name: "Alertes personnalisées illimitées", included: true, soon: true},
            {name: "Export de données", included: true, soon: true},
            {name: "Support prioritaire", included: true, soon: true},
            {name: "Accès API complet", included: true, soon: true},
        ],
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar/>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        Choisissez votre abonnement
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                        Des plans adaptés à tous les passionnés de flipper, du collectionneur débutant au professionnel
                    </p>
                </div>
            </section>

            {/* Billing Toggle */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="monthly" className="w-full">
                        <div className="flex justify-center mb-12">
                            <TabsList>
                                <TabsTrigger value="monthly">Mensuel</TabsTrigger>
                                <TabsTrigger value="yearly">
                                    Annuel
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                        -20%
                                    </Badge>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="monthly">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {pricingPlans.map((plan) => (
                                    <Card
                                        key={plan.name}
                                        className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <Badge className="bg-primary text-primary-foreground px-4 py-1">Plus
                                                    populaire</Badge>
                                            </div>
                                        )}
                                        <CardHeader>
                                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                            <CardDescription className="text-sm">{plan.description}</CardDescription>
                                            <div className="mt-4">
                                                <span className="text-4xl font-bold text-primary">{plan.price}€</span>
                                                <span className="text-muted-foreground">/{plan.period}</span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1">
                                            <ul className="space-y-3">
                                                {plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        {feature.included ? (
                                                            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                                        ) : (
                                                            <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5"/>
                                                        )}
                                                        {feature.soon ? (
                                                                <Badge className="bg-secondary text-secondary-foreground px-2 py-1">soon</Badge>
                                                            )
                                                            :
                                                            (<></>)
                                                        }
                                                        <span
                                                            className={`text-sm ${
                                                                feature.included ? "text-foreground" : "text-muted-foreground line-through"
                                                            }`}
                                                        >
                              {feature.name}
                            </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button className="w-full" variant={plan.popular ? "default" : "outline"}
                                                    size="lg">
                                                {plan.price === 0 ? "Commencer gratuitement" : "S'abonner"}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="yearly">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {pricingPlans.map((plan) => {
                                    const yearlyPrice = plan.price === 0 ? 0 : Math.round(plan.price * 12 * 0.8)
                                    const monthlyEquivalent = plan.price === 0 ? 0 : (yearlyPrice / 12).toFixed(2)

                                    return (
                                        <Card
                                            key={plan.name}
                                            className={`relative flex flex-col ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                                        >
                                            {plan.popular && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Plus
                                                        populaire</Badge>
                                                </div>
                                            )}
                                            <CardHeader>
                                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                                <CardDescription
                                                    className="text-sm">{plan.description}</CardDescription>
                                                <div className="mt-4">
                                                    <span
                                                        className="text-4xl font-bold text-primary">{yearlyPrice}€</span>
                                                    <span className="text-muted-foreground">/an</span>
                                                    {plan.price > 0 && (
                                                        <div
                                                            className="text-sm text-muted-foreground mt-1">Soit {monthlyEquivalent}€/mois</div>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1">
                                                <ul className="space-y-3">
                                                    {plan.features.map((feature, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            {feature.included ? (
                                                                <Check
                                                                    className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                                            ) : (
                                                                <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5"/>
                                                            )}
                                                            {feature.soon ? (
                                                                <Badge className="bg-secondary text-secondary-foreground px-2 py-1">soon</Badge>
                                                               )
                                                                :
                                                                (<></>)
                                                            }
                                                            <span
                                                                className={`text-sm ${
                                                                    feature.included ? "text-foreground" : "text-muted-foreground line-through"
                                                                }`}
                                                            >
                                {feature.name}
                              </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                            <CardFooter>
                                                <Button className="w-full"
                                                        variant={plan.popular ? "default" : "outline"} size="lg">
                                                    {plan.price === 0 ? "Commencer gratuitement" : "S'abonner"}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    )
                                })}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-12">Questions fréquentes</h2>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Puis-je changer d'abonnement à tout moment ?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les
                                    changements prennent effet
                                    immédiatement et nous ajustons la facturation au prorata.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Que se passe-t-il si je dépasse les limites de mon plan
                                    ?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Nous vous enverrons une notification lorsque vous approchez des limites. Vous
                                    pourrez alors mettre à
                                    niveau votre plan ou gérer votre contenu existant.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Les prix incluent-ils la TVA ?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Les prix affichés sont hors taxes. La TVA applicable sera ajoutée lors du paiement
                                    en fonction de
                                    votre pays de résidence.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Puis-je annuler mon abonnement ?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Oui, vous pouvez annuler votre abonnement à tout moment depuis votre profil. Vous
                                    conserverez l'accès
                                    aux fonctionnalités premium jusqu'à la fin de votre période de facturation.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-4">Prêt à commencer ?</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Rejoignez des milliers de passionnés de flipper et gérez votre collection comme un pro
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <a href="/signup">Créer un compte gratuit</a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a href="/listings">Explorer les machines</a>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
