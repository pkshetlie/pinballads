"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import Link from "next/link"
import { ArrowLeft, Upload, X, Plus, DollarSign, MapPin, Settings } from "lucide-react"
import { useState } from "react"
import {useLanguage} from "@/lib/language-context"
import Navbar from "@/app/components/Navbar";

export default function SellMachinePage() {
  const {t} = useLanguage()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{t("sell.listYourMachine")}</h1>
            <p className="text-muted-foreground">{t("sell.listingDescription")}</p>
          </div>

          <form className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-primary" />
                  {t("sell.basicInformation")}
                </CardTitle>
                <CardDescription>{t("sell.basicInformationDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('sell.machineTitle')} *</Label>
                    <Input id="title" placeholder="e.g., Medieval Madness (Williams 1997)" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">{t('sell.manufacturer')} *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="williams">Williams</SelectItem>
                        <SelectItem value="bally">Bally</SelectItem>
                        <SelectItem value="gottlieb">Gottlieb</SelectItem>
                        <SelectItem value="stern">Stern</SelectItem>
                        <SelectItem value="data-east">Data East</SelectItem>
                        <SelectItem value="sega">Sega</SelectItem>
                        <SelectItem value="chicago-coin">Chicago Coin</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year">{t('sell.year')} *</Label>
                    <Input id="year" type="number" placeholder="1997" min="1930" max="2024" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">{t('sell.condition')} *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder={t('sell.selectCondition')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">{t('sell.conditions.excellent')}</SelectItem>
                        <SelectItem value="very-good">{t('sell.conditions.veryGood')}</SelectItem>
                        <SelectItem value="good">{t('sell.conditions.good')}</SelectItem>
                        <SelectItem value="fair">{t('sell.conditions.fair')}</SelectItem>
                        <SelectItem value="project">{t('sell.conditions.projectRestauration')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">{t('sell.price')} *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="price" type="number" placeholder="8500" className="pl-10" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('sell.description')} *</Label>
                  <Textarea
                    id="description"
                    placeholder={t('sell.describeTheMachineCondition')}
                    className="min-h-32"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-primary" />
                  {t('sell.uploadPhotos')}
                </CardTitle>
                <CardDescription>
                  {t('sell.addHighQualityPhotosToShowcaseYourMachine')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2"> {t('sell.addPhotos')}</p>
                  <p className="text-sm text-muted-foreground">{t('sell.photoRequirements')}</p>
                  <Button type="button" variant="outline" className="mt-4 bg-transparent">
                    {t('sell.chooseFiles')}
                  </Button>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground">
                            Main Photo
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  {t('sell.locationContact')}
                </CardTitle>
                <CardDescription>{t('sell.locationContactDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('sell.city')} *</Label>
                    <Input id="city" placeholder="Lyon" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t('sell.state')} *</Label>
                    <Input id="state" placeholder="Rhône" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="zip">{t('sell.zip')}</Label>
                    <Input id="zip" placeholder="69000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('sell.phone')}</Label>
                    <Input id="phone" type="tel" placeholder="+33612345678" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="delivery" />
                  <Label htmlFor="delivery">{t('sell.delivery')}</Label>
                </div>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sell.additionalFeatures')}</CardTitle>
                <CardDescription>{t('sell.additionalFeaturesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder={t('sell.addFeaturePlaceholder')}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="working" />
                    <Label htmlFor="working">{t('sell.working')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="original-parts" />
                    <Label htmlFor="original-parts">{t('sell.originalParts')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="manual" />
                    <Label htmlFor="manual">{t('sell.manual')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="keys" />
                    <Label htmlFor="keys">{t('sell.keys')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="coin-door" />
                    <Label htmlFor="coin-door">{t('sell.coinDoor')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="home-use" />
                    <Label htmlFor="home-use">{t('sell.homeUse')}</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                {t('sell.saveDraft')}
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {t('sell.pubishListing')}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
