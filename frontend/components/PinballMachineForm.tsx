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
import {PinballDto} from "@/components/object/pinball";
import {Manufacturers} from "@/components/object/manufacturer";
import {Features} from "@/components/object/features";
import {PinballFeaturesSelector} from "@/components/PinballFeaturesSelector";

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
    const [newFeature, setNewFeature] = useState("");

    const [condition, setCondition] = useState(initialData?.condition || "");
    const [startDate, setStartDate] = useState(initialData?.owningDate || "");
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const [results, setResults] = useState<any[]>([]); // Pour autocomplete si nécessaire


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
            condition,
            startDate,
            images: uploadedImages
        })
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Card className="py-6">
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
                                    {Object.entries(Manufacturers).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>
                                            {label}
                                        </SelectItem>
                                    ))}
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
            <Card className="py-6">
                <CardHeader>
                    <CardTitle className="flex items-center"><Upload className="w-5 h-5 mr-2 text-primary"/> {t('sell.uploadPhotos')}</CardTitle>
                    <CardDescription>{t('sell.addHighQualityPhotosToShowcaseYourMachine')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <PhotoUploader uploadedImages={uploadedImages} setUploadedImages={setUploadedImages} />
                </CardContent>
            </Card>

            <PinballFeaturesSelector></PinballFeaturesSelector>

            {/*<Card className="py-6">*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle>{t('sell.additionalFeatures')}</CardTitle>*/}
            {/*        <CardDescription>{t('sell.additionalFeaturesDesc')}</CardDescription>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className="space-y-4">*/}
            {/*        <div className="flex space-x-2">*/}
            {/*            <Input value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder={t('sell.addFeaturePlaceholder')} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />*/}
            {/*            <Button type="button" onClick={addFeature} variant="outline"><Plus className="w-4 h-4"/></Button>*/}
            {/*        </div>*/}
            {/*        {features.length > 0 && (*/}
            {/*            <div className="flex flex-wrap gap-2">*/}
            {/*                {features.map((feature, index) => (*/}
            {/*                    <Badge key={index} variant="secondary" className="flex items-center gap-1">*/}
            {/*                        {feature}*/}
            {/*                        <button type="button" onClick={() => removeFeature(feature)} className="ml-1 hover:text-destructive">*/}
            {/*                            <X className="w-3 h-3"/>*/}
            {/*                        </button>*/}
            {/*                    </Badge>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}

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

