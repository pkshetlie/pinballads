"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, MapPin, Settings } from "lucide-react"
import {useLanguage} from "@/lib/language-context"
import Navbar from "@/components/Navbar";

import { useApi } from '@/lib/api';

type Game = {
  opdb_id: string
  is_machine: boolean
  name: string
  common_name: string | null
  shortname: string | null
  physical_machine: number
  ipdb_id: number | null
  manufacture_date: string | null
  manufacturer: {
    manufacturer_id: number
    name: string
    full_name: string
    created_at: string
    updated_at: string
  } | null
  type: string | null
  display: string | null
  player_count: number | null
  features: string[]
  keywords: string[]
  description: string | null
  created_at: string
  updated_at: string
  images: {
    title: string
    primary: boolean
    type: string
    urls: {
      small: string
      medium: string
      large: string
    }
    sizes: {
      small: { width: number; height: number }
      medium: { width: number; height: number }
      large: { width: number; height: number }
    }
  }[]
}

export default function SellMachinePage() {
  const {t} = useLanguage()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const [manufacturer, setManufacturer] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const { get } = useApi();

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    if (selectedGame && query === selectedGame.name) {
      return;
    }

    const timer = setTimeout(() => {
      get(`/api/search/game?query=${encodeURIComponent(query)}`)
          .then((data) => {
            setResults(data);
            setFeatures([]);
            setManufacturer("");
            setYear("");
          })
          .catch(() => setResults([]));
    }, 400); // délai de 400ms pour éviter trop d’appels

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setQuery(game.name);
    setManufacturer(game.manufacturer?.name.toLowerCase()
        .replace(/\./g, "")      // enlève tous les points
        .replace(/&/g, "and")    // remplace tous les &
        .replace(/\s+/g, "-")    // tous les espaces (1+)
        .trim()  || "");
    setYear(game.manufacture_date ? new Date(game.manufacture_date).getFullYear().toString() : "");
    setDescription(game.description || "");
      if (features.length === 0) {
          setFeatures(game.features)
      }
    setResults([]); // on ferme la liste
  };

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
                    <Input id="title"
                           placeholder="e.g., Medieval Madness (Williams 1997)"
                           required value={query}
                           onChange={(e) => setQuery(e.target.value)} />
                    {results.length > 0 && (
                        <ul className="mt-2 border rounded-lg p-2 bg-card shadow bg-" style={{position: 'absolute', zIndex:200}}>
                          {results.map((game) => (
                              <li
                                  key={game.opdb_id}
                                  className="p-1 hover:bg-card/80 cursor-pointer"
                                  onClick={() => handleSelectGame(game)}
                              >
                                {game.name} ({game.manufacturer?.full_name}  {game.manufacture_date})
                              </li>
                          ))}
                        </ul>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">{t('sell.manufacturer')} *</Label>
                    <Select required value={manufacturer} onValueChange={(value) => setManufacturer(value as string)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('sell.selectManufacturer')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aa-amusements">A.A. Amusements</SelectItem>
                        <SelectItem value="ami">A.M.I.</SelectItem>
                        <SelectItem value="achille-chalvignac">Achille and Chalvignac</SelectItem>
                        <SelectItem value="alben">Alben</SelectItem>
                        <SelectItem value="allied-leisure">Allied Leisure</SelectItem>
                        <SelectItem value="alvin-g-and-co">Alvin G. & Co</SelectItem>
                        <SelectItem value="american-girl">American Girl</SelectItem>
                        <SelectItem value="american-pinball">American Pinball</SelectItem>
                        <SelectItem value="apple-time">Apple Time</SelectItem>
                        <SelectItem value="arkon">Arkon</SelectItem>
                        <SelectItem value="astro-games">Astro Games</SelectItem>
                        <SelectItem value="atari">Atari</SelectItem>
                        <SelectItem value="automaticos">Automaticos</SelectItem>
                        <SelectItem value="bally">Bally</SelectItem>
                        <SelectItem value="bandai-namco">Bandai Namco</SelectItem>
                        <SelectItem value="barni">Barni</SelectItem>
                        <SelectItem value="barrels-of-fun">Barrels of Fun</SelectItem>
                        <SelectItem value="bell-coin-matic">Bell Coin Matic</SelectItem>
                        <SelectItem value="bell-games">Bell Games</SelectItem>
                        <SelectItem value="bigliardini-elettronici-milano">Bigliardini Elettronici Milano</SelectItem>
                        <SelectItem value="block-marble-company">Block Marble Company</SelectItem>
                        <SelectItem value="briarwood">Briarwood</SelectItem>
                        <SelectItem value="brunswick">Brunswick</SelectItem>
                        <SelectItem value="cea">C.E.A.</SelectItem>
                        <SelectItem value="capcom">Capcom</SelectItem>
                        <SelectItem value="chicago-coin">Chicago Coin</SelectItem>
                        <SelectItem value="chicago-gaming">Chicago Gaming</SelectItem>
                        <SelectItem value="cic-play">Cic Play</SelectItem>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="coffee-mat">Coffee Mat</SelectItem>
                        <SelectItem value="data-east">Data East</SelectItem>
                        <SelectItem value="deeproot">deeproot</SelectItem>
                        <SelectItem value="dpx">DPX</SelectItem>
                        <SelectItem value="dutch-pinball">Dutch Pinball</SelectItem>
                        <SelectItem value="elbos">Elbos</SelectItem>
                        <SelectItem value="eric-priepke">Eric Priepke</SelectItem>
                        <SelectItem value="europlay">Europlay</SelectItem>
                        <SelectItem value="exhibit">Exhibit</SelectItem>
                        <SelectItem value="fascination-game">Fascination Game</SelectItem>
                        <SelectItem value="for-amusement-only">For Amusement Only Games</SelectItem>
                        <SelectItem value="game-plan">Game Plan</SelectItem>
                        <SelectItem value="geiger">Geiger</SelectItem>
                        <SelectItem value="genco">Genco</SelectItem>
                        <SelectItem value="giorgio-massiniero">Giorgio Massiniero</SelectItem>
                        <SelectItem value="giuliano-lodola">Giuliano Lodola</SelectItem>
                        <SelectItem value="gottlieb">Gottlieb</SelectItem>
                        <SelectItem value="grand-products">Grand Products</SelectItem>
                        <SelectItem value="haggis-pinball">Haggis Pinball</SelectItem>
                        <SelectItem value="hanilamatic">Hanilamatic</SelectItem>
                        <SelectItem value="hankin">Hankin</SelectItem>
                        <SelectItem value="heighway-pinball">Heighway Pinball</SelectItem>
                        <SelectItem value="hexa-pinball">HEXA Pinball</SelectItem>
                        <SelectItem value="hispamatic">Hispamatic</SelectItem>
                        <SelectItem value="homepin">Homepin</SelectItem>
                        <SelectItem value="idi">I.D.I.</SelectItem>
                        <SelectItem value="ian-harrower">Ian Harrower Games</SelectItem>
                        <SelectItem value="idsa">IDSA</SelectItem>
                        <SelectItem value="inder">Inder</SelectItem>
                        <SelectItem value="ice">Innovative Concepts (ICE)</SelectItem>
                        <SelectItem value="interflip">Interflip</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="j-esteban">J. Esteban</SelectItem>
                        <SelectItem value="jac-van-ham">Jac Van Ham</SelectItem>
                        <SelectItem value="jersey-jack">Jersey Jack Pinball</SelectItem>
                        <SelectItem value="jeutel">Jeutel</SelectItem>
                        <SelectItem value="joctronic">Joctronic</SelectItem>
                        <SelectItem value="juegos-populares">Juegos Populares</SelectItem>
                        <SelectItem value="kc-tabart">K.C. Tabart</SelectItem>
                        <SelectItem value="keeney">Keeney</SelectItem>
                        <SelectItem value="komplett">Komplett</SelectItem>
                        <SelectItem value="komputer-dynamics">Komputer Dynamics</SelectItem>
                        <SelectItem value="ltd-brasil">LTD do Brasil</SelectItem>
                        <SelectItem value="mac-pinball">Maguinas / Mac Pinball</SelectItem>
                        <SelectItem value="mali">Mali</SelectItem>
                        <SelectItem value="mambelli">Mambelli</SelectItem>
                        <SelectItem value="maresa">Maresa</SelectItem>
                        <SelectItem value="marsa-play">Marsa Play</SelectItem>
                        <SelectItem value="marvel">Marvel</SelectItem>
                        <SelectItem value="mattel">Mattel</SelectItem>
                        <SelectItem value="megaverse">Megaverse Project</SelectItem>
                        <SelectItem value="midway">Midway</SelectItem>
                        <SelectItem value="mike-budai">Mike Budai</SelectItem>
                        <SelectItem value="mirco">Mirco Games</SelectItem>
                        <SelectItem value="mocean">Mocean</SelectItem>
                        <SelectItem value="mondialmatic">Mondialmatic</SelectItem>
                        <SelectItem value="mr-game">Mr Game</SelectItem>
                        <SelectItem value="multimorphic">Multimorphic</SelectItem>
                        <SelectItem value="nordamatic">Nordamatic</SelectItem>
                        <SelectItem value="north-star">North Star</SelectItem>
                        <SelectItem value="nsm">Nsm</SelectItem>
                        <SelectItem value="pedretti">Pedretti Gaming</SelectItem>
                        <SelectItem value="petaco">Petaco</SelectItem>
                        <SelectItem value="peyper">Peyper</SelectItem>
                        <SelectItem value="pinball-adventures">Pinball Adventures</SelectItem>
                        <SelectItem value="pinball-brothers">Pinball Brothers</SelectItem>
                        <SelectItem value="pinball-mfg">Pinball Manufacturing Inc.</SelectItem>
                        <SelectItem value="pinball-shop">Pinball Shop</SelectItem>
                        <SelectItem value="pinnovating">Pinnovating</SelectItem>
                        <SelectItem value="pinstar">Pinstar</SelectItem>
                        <SelectItem value="playbar">Playbar</SelectItem>
                        <SelectItem value="playmatic">Playmatic</SelectItem>
                        <SelectItem value="playmec">Playmec Flippers</SelectItem>
                        <SelectItem value="quetzal">Quetzal Pinball</SelectItem>
                        <SelectItem value="rmg">R.M.G.</SelectItem>
                        <SelectItem value="rally">Rally</SelectItem>
                        <SelectItem value="ramps">Ramp's Pinball</SelectItem>
                        <SelectItem value="rebellion">Rebellion Pinball</SelectItem>
                        <SelectItem value="recel">Recel</SelectItem>
                        <SelectItem value="recreativos-franco">Recreativos Franco</SelectItem>
                        <SelectItem value="red-baron">Red Baron Amusements</SelectItem>
                        <SelectItem value="retro-pinball">Retro Pinball</SelectItem>
                        <SelectItem value="riot">Riot Pinball</SelectItem>
                        <SelectItem value="sankyo">Sankyo Seiki</SelectItem>
                        <SelectItem value="sega">Sega</SelectItem>
                        <SelectItem value="segasa">Segasa</SelectItem>
                        <SelectItem value="sentinel">Sentinel</SelectItem>
                        <SelectItem value="sirmo">SIRMO</SelectItem>
                        <SelectItem value="skit-b">Skit-B Pinball</SelectItem>
                        <SelectItem value="sleic">Sleic</SelectItem>
                        <SelectItem value="sonic">Sonic</SelectItem>
                        <SelectItem value="spinball">Spinball</SelectItem>
                        <SelectItem value="spooky">Spooky Pinball</SelectItem>
                        <SelectItem value="sportmatic">Sportmatic</SelectItem>
                        <SelectItem value="staal">Staal</SelectItem>
                        <SelectItem value="stern">Stern</SelectItem>
                        <SelectItem value="stern-electronics">Stern Electronics</SelectItem>
                        <SelectItem value="suncoast">Suncoast Pinball</SelectItem>
                        <SelectItem value="th-bergmann">T.H. Bergmann</SelectItem>
                        <SelectItem value="taito">Taito</SelectItem>
                        <SelectItem value="team-pinball">Team Pinball</SelectItem>
                        <SelectItem value="tecnoplay">Tecnoplay</SelectItem>
                        <SelectItem value="turner-pinball">Turner Pinball</SelectItem>
                        <SelectItem value="unidesa">Unidesa</SelectItem>
                        <SelectItem value="united">United</SelectItem>
                        <SelectItem value="universal">Universal</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                        <SelectItem value="valley">Valley</SelectItem>
                        <SelectItem value="vector">Vector Pinball</SelectItem>
                        <SelectItem value="venture-line">Venture Line</SelectItem>
                        <SelectItem value="videodens">Videodens</SelectItem>
                        <SelectItem value="viza">Viza Manufacturing</SelectItem>
                        <SelectItem value="whizbang">WhizBang Pinball</SelectItem>
                        <SelectItem value="wico">Wico</SelectItem>
                        <SelectItem value="williams">Williams</SelectItem>
                        <SelectItem value="zaccaria">Zaccaria</SelectItem>
                        <SelectItem value="zidware">Zidware</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="year">{t('sell.year')} *</Label>
                    <Input id="year" type="number" placeholder="1997" value={year} onChange={(e) => setYear(e.target.value)} min="1930" required />
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
                      <Input id="price" type="number" placeholder="8500" className="" required />
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
