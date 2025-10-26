"use client"
import {
  ArrowLeft,
  Star,
  MapPin,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Calendar,
  Gauge,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation"
import {useEffect, useState} from "react";
import {useApi} from "@/lib/api";
import {PinballDto} from "@/components/object/PinballDto";
import {PinballImageCarousel} from "@/components/PinballImageCarousel";
import {DefaultFeatures, FeaturesType} from "@/components/object/Features";
import {useLanguage} from "@/lib/language-context";
import {Currencies} from "@/components/object/Currencies";
import Footer from "@/components/Footer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {useAuth} from "@/lib/auth-context";

export default function DetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [pinballMachine, setPinballMachine] = useState<PinballDto | null>(null)
  const { apiGet } = useApi();
  const {t} = useLanguage()
  const {user} = useAuth()
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [offerAmount, setOfferAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendMessage = async () => {
    alert("coming soon")
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Sending message:", { message, offerAmount })

    // Reset form and close dialog
    setMessage("")
    setOfferAmount("")
    setIsContactDialogOpen(false)
    setIsSubmitting(false)

    // Show success message (you can add a toast here)
  }


  useEffect(() => {
    if (pinballMachine !== null) {
      return;
    }

    apiGet(`/api/public/sales/machine/${id}`).then(
      (res) => {
        setPinballMachine(res);
      }
    )
  },[pinballMachine])

  if (!pinballMachine) return <div className="p-8">Machine not found</div>

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar/>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative">
                  <PinballImageCarousel machine={pinballMachine} />
            </div>

            {/* Machine Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{pinballMachine.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>
                        {pinballMachine.manufacturer} • {pinballMachine.year}
                      </span>
                      {/*<div className="flex items-center gap-1">*/}
                      {/*  <Star className="w-4 h-4 fill-accent text-accent" />*/}
                      {/*  <span>{pinballMachine.rating}</span>*/}
                      {/*  <span>({pinballMachine.reviewCount} reviews)</span>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {pinballMachine.condition}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {pinballMachine.location?.city ?? 'nowhere'}
                  </div>
                  <span>•</span>
                  <span>{pinballMachine.distance} away</span>
                </div>

                <div className="text-4xl font-bold text-primary mb-6">{Currencies[pinballMachine?.currency as keyof typeof Currencies]}{pinballMachine.price.toLocaleString()}</div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
                <div className="prose prose-gray max-w-none">
                  {pinballMachine?.description?.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{t('sell.featuresUpgrades')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(DefaultFeatures).map(([category, features]) => (
                      <div key={category} className="mb-4">
                        <h4 className="font-semibold mb-2 capitalize">{t(`sell.${category}`)}</h4>
                        {Object.entries(features).length > 0 && !Object.entries(features).some(([feature]) => pinballMachine.features[feature as keyof FeaturesType]) ? (
                            <div className="text-muted-foreground">{t('sell.noFeature')}</div>
                        ) : (
                            Object.entries(features).map(([feature]) => pinballMachine.features[feature as keyof FeaturesType] ? (
                                    <div key={feature} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-primary rounded-full"/>
                                      <span className="text-muted-foreground">
                                {t(`sell.${feature}`)}
                              </span>
                                    </div>
                                ) : (<div key={feature}></div>)
                            )
                        )}
                      </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Seller Info and Contact */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">{t('details.contactSeller')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{Currencies[pinballMachine.currency as keyof typeof Currencies]}{pinballMachine.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {pinballMachine.location?.city?? 'nowhere'} • {pinballMachine.distance ?? 0} away
                  </div>
                </div>

                <div className="space-y-3">
                  <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                    <DialogTrigger asChild>
                      { pinballMachine.currentOwner?.id !== user?.id && (
                          <Button className="w-full gap-2 cursor-pointer" size="lg">
                            <MessageCircle className="w-5 h-5" />
                            {t('details.sendMessage')}
                          </Button>
                      )}

                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Contact Seller</DialogTitle>
                        <DialogDescription>
                          {t('details.sendAMessageToSellerAboutThisPinballMachineYouCanAlsoMakeAnOptionalOffer',{name: pinballMachine.name})}

                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        {/* Message field */}
                        <div className="space-y-2">
                          <Label htmlFor="message">
                            {t('details.message')} <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                              id="message"
                              placeholder={t('details.hiImInterestedInYourPinballMachine')}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              rows={5}
                              className="resize-none"
                          />
                        </div>

                        {/* Optional offer field */}
                        <div className="space-y-2">
                          <Label htmlFor="offer">{t('details.makeAnOffer')}</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                                id="offer"
                                type="number"
                                placeholder={t('details.enterAmount')}
                                value={offerAmount}
                                onChange={(e) => setOfferAmount(e.target.value)}
                                className="pl-7"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {t('details.listedPrice',{currency:Currencies[pinballMachine.currency as keyof typeof Currencies], 'price':pinballMachine.price.toLocaleString() })}
                          </p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsContactDialogOpen(false)} disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button className={'cursor-pointer'} onClick={handleSendMessage} disabled={!message.trim() || isSubmitting}>
                          {isSubmitting ? t('details.sending') : t('details.sendMessage')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/*<Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">*/}
                  {/*  <Phone className="w-5 h-5" />*/}
                  {/*  Call Seller*/}
                  {/*</Button>*/}
                  {/*<Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">*/}
                  {/*  <Mail className="w-5 h-5" />*/}
                  {/*  Email Seller*/}
                  {/*</Button>*/}
                </div>

                <Separator />

                {/* Seller Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={pinballMachine.currentOwner?.avatar} />
                      <AvatarFallback>
                        {pinballMachine.currentOwner?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{pinballMachine.currentOwner?.name}</h4>
                        {pinballMachine.currentOwner?.verified && <Shield className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span>{pinballMachine.currentOwner?.rating}</span>
                        <span>({pinballMachine.currentOwner?.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since:</span>
                      <span className="font-medium">{pinballMachine.currentOwner?.createdAt}</span>
                    </div>
                    {/*<div className="flex justify-between">*/}
                    {/*  <span className="text-muted-foreground">Total sales:</span>*/}
                    {/*  <span className="font-medium">{pinballMachine.currentOwner?.}</span>*/}
                    {/*</div>*/}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response time:</span>
                      <span className="font-medium text-primary">Fast</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">{pinballMachine.currentOwner?.responseRate}</div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {t('details.safetyTips')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{t('details.testAllFunctionBeforePurchase')}</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{t('details.useSecurePaymentMethods')}</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>{t('details.verifySellerIdentity')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  )
}
