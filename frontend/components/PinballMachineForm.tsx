"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Plus, Settings, Upload, X } from "lucide-react"
import PhotoUploader from "@/components/PhotoUploader"
import { useLanguage } from "@/lib/language-context"
import {useApi} from "@/lib/api";
import {PinballDto} from "@/components/Object/pinball";

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
    images:{ title: string; url: string }[];
}

type MachineFormProps = {
    initialData?: PinballDto;
    onSubmit: (data: MachineFormData) => void;
}

export type MachineFormData = {
    name: string;
    opdbId?: string;
    manufacturer: string;
    year: string;
    description: string;
    features: string[];
    working: boolean;
    originalParts: boolean;
    manual: boolean;
    keys: boolean;
    coinDoor: boolean;
    homeUse: boolean;
    condition: string;
    startDate?: string;
    images?: File[];
}
export default function MachineForm({ initialData, onSubmit }: MachineFormProps) {
    const { t } = useLanguage();
    const { get } = useApi();

    const [query, setQuery] = useState(initialData?.name || "");
    const [opdbId, setOpdbId] = useState(initialData?.opdbId || "");
    const [manufacturer, setManufacturer] = useState(initialData?.manufacturer || "");
    const [year, setYear] = useState(initialData?.year || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [features, setFeatures] = useState<string[]>(initialData?.features || []);
    const [newFeature, setNewFeature] = useState("");
    const [working, setWorking] = useState(initialData?.working || false);
    const [originalParts, setOriginalParts] = useState(initialData?.originalParts || false);
    const [manual, setManual] = useState(initialData?.manual || false);
    const [keys, setKeys] = useState(initialData?.keys || false);
    const [coinDoor, setCoinDoor] = useState(initialData?.coinDoor || false);
    const [homeUse, setHomeUse] = useState(initialData?.homeUse || false);
    const [condition, setCondition] = useState(initialData?.condition || "");
    const [startDate, setStartDate] = useState(initialData?.startDate || "");
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const [results, setResults] = useState<any[]>([]); // Pour autocomplete si nécessaire


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
                    setOpdbId("");
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
        setOpdbId(game.opdb_id)
        setQuery(game.name);
        setManufacturer(game.manufacturer?.name.toLowerCase()
            .replace(/\./g, "")      // enlève tous les points
            .replace(/&/g, "and")    // remplace tous les &
            .replace(/\s+/g, "-")    // tous les espaces (1+)
            .trim() || "");
        setYear(game.manufacture_date ? new Date(game.manufacture_date).getFullYear().toString() : "");
        setDescription(game.description || "");

        if (features.length === 0) {
            setFeatures(game.features)
        }

        setResults([]); // on ferme la liste
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name: query,
            opdbId,
            manufacturer,
            year,
            description,
            features,
            working,
            originalParts,
            manual,
            keys,
            coinDoor,
            homeUse,
            condition,
            startDate,
            images: uploadedImages
        })
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Settings className="w-5 h-5 mr-2 text-primary"/> {t("sell.basicInformation")}</CardTitle>
                    <CardDescription>{t("collection.basicInformationDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('sell.machineTitle')} *</Label>
                            <Input id="title"
                                   placeholder={t('collection.searchForGame')}
                                   required value={query}
                                   onChange={(e) => setQuery(e.target.value)}/>
                            {results.length > 0 && (
                                <ul className="mt-2 border rounded-lg p-2 bg-card shadow bg-"
                                    style={{position: 'absolute', zIndex: 200}}>
                                    {results.map((game) => (
                                        <li
                                            key={game.opdb_id}
                                            className="p-1 hover:bg-card/80 cursor-pointer"
                                            onClick={() => handleSelectGame(game)}
                                        >
                                            {game.name} ({game.manufacturer?.full_name} {game.manufacture_date})
                                        </li>
                                    ))}
                                </ul>
                            )} </div>
                        <div className="space-y-2">
                            <Label htmlFor="manufacturer">{t('sell.manufacturer')} *</Label>
                            <Select required value={manufacturer}
                                    onValueChange={(value) => setManufacturer(value as string)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('sell.selectManufacturer')}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aa-amusements">A.A. Amusements</SelectItem>
                                    <SelectItem value="ami">A.M.I.</SelectItem>
                                    <SelectItem value="achille-chalvignac">Achille and
                                        Chalvignac</SelectItem>
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
                                    <SelectItem value="bigliardini-elettronici-milano">Bigliardini
                                        Elettronici Milano</SelectItem>
                                    <SelectItem value="block-marble-company">Block Marble
                                        Company</SelectItem>
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
                                    <SelectItem value="for-amusement-only">For Amusement Only
                                        Games</SelectItem>
                                    <SelectItem value="game-plan">Game Plan</SelectItem>
                                    <SelectItem value="geiger">Geiger</SelectItem>
                                    <SelectItem value="genco">Genco</SelectItem>
                                    <SelectItem value="giorgio-massiniero">Giorgio
                                        Massiniero</SelectItem>
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
                                    <SelectItem value="pinball-adventures">Pinball
                                        Adventures</SelectItem>
                                    <SelectItem value="pinball-brothers">Pinball Brothers</SelectItem>
                                    <SelectItem value="pinball-mfg">Pinball Manufacturing
                                        Inc.</SelectItem>
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
                                    <SelectItem value="recreativos-franco">Recreativos
                                        Franco</SelectItem>
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
                            <Select required value={condition} onValueChange={(value) => setCondition(value)}>
                                <SelectTrigger><SelectValue placeholder={t('sell.selectCondition')} /></SelectTrigger>
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
                            <Label htmlFor="start-date">{t('collection.startDate')}</Label>
                            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t('collection.description')} *</Label>
                        <Textarea id="description" placeholder={t('sell.describeTheMachineCondition')} className="min-h-32" required value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Images */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Upload className="w-5 h-5 mr-2 text-primary"/> {t('sell.uploadPhotos')}</CardTitle>
                    <CardDescription>{t('sell.addHighQualityPhotosToShowcaseYourMachine')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <PhotoUploader uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
                </CardContent>
            </Card>

            {/* Features & Checkboxes */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('sell.additionalFeatures')}</CardTitle>
                    <CardDescription>{t('sell.additionalFeaturesDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                        <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder={t('sell.addFeaturePlaceholder')} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
                        <Button type="button" onClick={addFeature} variant="outline"><Plus className="w-4 h-4"/></Button>
                    </div>
                    {features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {feature}
                                    <button type="button" onClick={() => removeFeature(feature)} className="ml-1 hover:text-destructive">
                                        <X className="w-3 h-3"/>
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                        <CheckboxOption label={t("sell.working")} checked={working} setChecked={setWorking} />
                        <CheckboxOption label={t("sell.originalParts")} checked={originalParts} setChecked={setOriginalParts} />
                        <CheckboxOption label={t("sell.manual")} checked={manual} setChecked={setManual} />
                        <CheckboxOption label={t("sell.keys")} checked={keys} setChecked={setKeys} />
                        <CheckboxOption label={t("sell.coinDoor")} checked={coinDoor} setChecked={setCoinDoor} />
                        <CheckboxOption label={t("sell.homeUse")} checked={homeUse} setChecked={setHomeUse} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90">{t('collection.addToCollection')}</Button>
            </div>
        </form>
    )
}

function CheckboxOption({ label, checked, setChecked }: { label: string; checked: boolean; setChecked: (v: boolean) => void }) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v as boolean)} />
            <Label>{label}</Label>
        </div>
    );
}

