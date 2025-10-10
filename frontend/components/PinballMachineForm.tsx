"use client"

import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {Settings, Upload} from "lucide-react"
import PhotoUploader from "@/components/PhotoUploader"
import {useLanguage} from "@/lib/language-context"
import {useApi} from "@/lib/api";
import {PinballDto} from "@/components/object/pinballDto";
import {Manufacturers} from "@/components/object/manufacturer";
import {useToast} from "@/hooks/use-toast";
import {defaultFeatures, featuresType} from '@/components/object/features';


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
    images: UploadedImageResult[];
}

type MachineFormProps = {
    initialData?: PinballDto;
    onSubmit: (data: MachineFormData) => void;
    buttonText: string;
}

export type MachineFormData = {
    name: string;
    opdbId?: string;
    manufacturer: string;
    year: string;
    description: string;
    features: featuresType;
    condition: string;
    startDate?: string;
    images: UploadedImageResult[];
}

type UploadedImageResult = {
    file: File; // URL Blob de l'image
    url: string; // URL Blob de l'image
    title: string; // Titre de l'image
    uid: string; // Titre de l'image
};

type UploadedImage = {
    url: string; // URL Blob de l'image
    title: string; // Titre de l'image
    uid: string; // Titre de l'image
};

type AnyObj = Record<string, string>;

function isPlainObject(v: any): v is AnyObj {
    return v !== null && typeof v === "object" && !Array.isArray(v);
}

function deepMerge<T extends AnyObj>(target: T, source: Partial<T>): T {
    const output: AnyObj = { ...target };
    if (!isPlainObject(source)) return output as T;

    for (const key of Object.keys(source)) {
        const sVal = (source as AnyObj)[key];
        const tVal = output[key];

        if (isPlainObject(tVal) && isPlainObject(sVal)) {
            output[key] = deepMerge(tVal, sVal);
        } else {
            output[key] = sVal;
        }
    }

    return output as T;
}

/**
 * Déplace les anciennes clés qui étaient dans `other` (ou au root)
 * vers `cabinet` si `cabinet` n'a pas déjà la valeur.
 */
function migrateLegacyFeatures(features: AnyObj): featuresType {
    if (!isPlainObject(features)) return defaultFeatures;

    // Mapper les valeurs existantes sur l'objet par défaut
    return Object.entries(defaultFeatures).reduce((acc, [category, categoryDefaults]) => {
        acc[category as keyof featuresType] = Object.keys(categoryDefaults).reduce((subAcc, key) => {
            const value = features[key];
            // Gestion spéciale pour numberOfPlayers qui est un number
            if (key === 'numberOfPlayers') {
                subAcc[key] = typeof value === 'number' ? value : 4;
            } else {
                subAcc[key] = !!value;
            }
            return subAcc;
        }, {...categoryDefaults});
        return acc;
    }, {...defaultFeatures});
}




export default function MachineForm({initialData, onSubmit, buttonText}: MachineFormProps) {
    const {t} = useLanguage();
    const {apiGet} = useApi();
    const [query, setQuery] = useState(initialData?.name || "");
    const [opdbId, setOpdbId] = useState(initialData?.opdbId || "");
    const [manufacturer, setManufacturer] = useState(initialData?.manufacturer || "");
    const [year, setYear] = useState(initialData?.year || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [condition, setCondition] = useState(initialData?.condition || "");
    const [startDate, setStartDate] = useState(initialData?.owningDate || "");
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialData?.images||[]);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [results, setResults] = useState<any[]>([]); // Pour autocomplete si nécessaire
    const {toast} = useToast();

    const additionalOptionsData = {
        pinsound: {
            blaster: false,
            invision: false,
            sonataSpk: false,
            noMoreReset: false,
            headphoneStationUltra: false,
            headphoneStationMaster: false,
            motionControlShakerKit: false,
            subwooferAndLineOutConnector: false
        },
        dmd: {
            xl: false,
            color: false,
        },
        cabinet : {
            artBlade: false,
            mirrorBlade: false,
            fullLed: false,
            sternInsider: false,
            mods: false,
            playfieldProtector: false,
            coinAcceptor: false
        },
        other: {
            coverMate: false,
            numberOfPlayers: 4,
            officialTopper: false,
            customTopper: false,
            HomeUseOnly: false,
            manual: false,
        }
    }

    const [additionalOptions, setAdditionalOptions] = useState<featuresType>(() => {
        if (initialData?.features) {
            const normalized = migrateLegacyFeatures(initialData.features);
            return deepMerge(additionalOptionsData, normalized);
        }
        return additionalOptionsData;
    });




    const [showDropdown, setShowDropdown] = useState(false); // Contrôle de l'ouverture du menu.

    const handleKeyDown = () => {
        // Si une saisie au clavier est détectée, activez le menu.
        setShowDropdown(true);
    };
    const handleInput = (value: string) => {
        setQuery(value);

        // Si la saisie provient d'un script (comme lors du chargement), ne pas afficher la liste déroulante.
        if (!selectedGame || value !== selectedGame.name) {
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };
    // Gestion des changements par catégorie pour les options supplémentaires
    const handleOptionChange = (category: string, key: string, value: boolean | number | string) => {
        setAdditionalOptions((prev) => ({
            ...prev,
            [category]: {
                // @ts-ignore
                ...prev[category],
                [key]: value,
            },
        }));
    };

    useEffect(() => {
        if (query.length < 3 || !showDropdown) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            // Exemple d'appel API pour chercher des jeux correspondants
            apiGet(`/api/search/game?query=${encodeURIComponent(query)}`)
                .then((data) => setResults(data))
                .catch(() => setResults([]));
        }, 400);

        return () => clearTimeout(timer);
    }, [query, showDropdown]);

    const handleSelectGame = (game: Game) => {
        setSelectedGame(game);
        setOpdbId(game.opdb_id)
        setQuery(game.name);
        setShowDropdown(false);
        setManufacturer(game.manufacturer?.name.toLowerCase()
            .replace(/\./g, "")      // enlève tous les points
            .replace(/&/g, "and")    // remplace tous les &
            .replace(/\s+/g, "-")    // tous les espaces (1+)
            .trim() || "");
        setYear(game.manufacture_date ? new Date(game.manufacture_date).getFullYear().toString() : "");
        setDescription(game.description || "");

        setResults([]); // on ferme la liste
    };

    const convertBlobUrlsToFiles = async (blobUrls: UploadedImage[]): Promise<UploadedImageResult[]> => {
        const responses = blobUrls.map(async (blobUrl) => {
            if (blobUrl.uid !== 'none') return (
                {
                    file: new File([], 'empty.jpg', {type: 'image/jpeg'}),
                    url: blobUrl.url,
                    title: blobUrl.title,
                    uid: blobUrl.uid
                }
            )
            const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
            const response = await fetch(blobUrl.url);
            const blob = await response.blob();
            const fileName = `image-${Date.now()}.jpg`;
            return {
                file: new File([blob], fileName, {type: blob.type}),
                url: blobUrl.url,
                title: blobUrl.title,
                uid: blobUrl.uid
            };
        });

        return Promise.all(responses);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const files = await convertBlobUrlsToFiles(uploadedImages);

        onSubmit({
            name: query,
            opdbId,
            manufacturer,
            year,
            description,
            condition,
            startDate,
            features: additionalOptions,
            images: files
        })
    }

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Basic Info */}
            <Card className="py-6">
                <CardHeader>
                    <CardTitle className="flex items-center"><Settings
                        className="w-5 h-5 mr-2 text-primary"/> {t("sell.basicInformation")}</CardTitle>
                    <CardDescription>{t("collection.basicInformationDesc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('sell.machineTitle')} *</Label>
                            <Input id="title"
                                   placeholder={t('collection.searchForGame')}
                                   required value={query}
                                   onKeyDown={handleKeyDown} // Ne s'active que sur saisie clavier
                                   onChange={(e) => setQuery(e.target.value)}/>
                            {showDropdown && results.length > 0 && (
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
                            <Select required
                                    value={manufacturer}
                                    onValueChange={(value) => setManufacturer(value as string)}
                                    disabled={!!manufacturer}>
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
                            <Input
                                id="year"
                                type="number"
                                placeholder="1997"
                                value={year}
                                onChange={(e) => setYear(e.target.value)} 
                                min="1930" 
                                required
                                disabled={!!year} // Disable the input if year has a value
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condition">{t('sell.condition')} *</Label>
                            <Select required value={condition} onValueChange={(value) => setCondition(value)}>
                                <SelectTrigger><SelectValue placeholder={t('sell.selectCondition')}/></SelectTrigger>
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
                            <Label htmlFor="start-date">{t('collection.startDate')} *</Label>
                            <Input id="start-date" type="date" required
                                   value={startDate}
                                   onChange={(e) => setStartDate(e.target.value)}/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t('collection.description')} *</Label>
                        <Textarea id="description" placeholder={t('sell.describeTheMachineCondition')}
                                  className="min-h-32" required value={description}
                                  onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                </CardContent>
            </Card>

            {/* Images */}
            <Card className="py-6">
                <CardHeader>
                    <CardTitle className="flex items-center"><Upload
                        className="w-5 h-5 mr-2 text-primary"/> {t('sell.uploadPhotos')}</CardTitle>
                    <CardDescription>{t('sell.addHighQualityPhotosToShowcaseYourMachine')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <PhotoUploader uploadedImages={uploadedImages} setUploadedImages={setUploadedImages}/>
                </CardContent>
            </Card>

            {/* Options supplémentaires */}
            <Card className="py-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-primary"/>
                        {t("sell.additionalOptions")}
                    </CardTitle>
                    <CardDescription>
                        {t("sell.additionalOptionsDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(additionalOptionsData).map(([category, options]) => (
                        <div key={category}>
                            <Label className={'mb-2'}>{t(`sell.${category}`)}</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(options).map(([key, defaultValue]) => {
                                    // Traitement spécial pour numberOfPlayers qui est un input number
                                    if (typeof defaultValue === "number") {
                                        return (
                                            <div key={key} className="space-y-2">
                                                <Label>{t("sell.numberOfPlayers")}</Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={10}
                                                    // @ts-ignore
                                                    value={additionalOptions[category][key]}
                                                    onChange={(e) =>
                                                        handleOptionChange(category,
                                                            key,
                                                            parseInt(e.target.value, 10)
                                                        )
                                                    }
                                                />
                                            </div>
                                        )
                                    }

                                    // Pour tous les autres champs qui sont des checkboxes
                                    return (
                                        <div key={key} className="flex items-center space-x-2">
                                            <Checkbox
                                                className="cursor-pointer"
                                                id={`${category}-${key}`}
                                                // @ts-ignore
                                                checked={additionalOptions[category][key]}
                                                onCheckedChange={(v) =>
                                                    handleOptionChange(category, key, v as boolean)
                                                }
                                            />
                                            <Label 
                                                className="cursor-pointer" 
                                                htmlFor={`${category}-${key}`}
                                            >
                                                {t(`sell.${key}`)}
                                            </Label>
                                        </div>
                                    )
                                })}
                            </div>
                            {category !== Object.keys(additionalOptionsData).pop() && <hr className={'mt-4'}/>}
                        </div>
                    ))}
                </CardContent>
            </Card>
            <div className="flex justify-end space-x-4">
                <Button type="submit"
                        className="bg-primary hover:bg-primary/90 cursor-pointer">{buttonText}</Button>
            </div>
        </form>
    )
}

function CheckboxOption({label, checked, setChecked}: {
    label: string;
    checked: boolean;
    setChecked: (v: boolean) => void
}) {
    return (
        <div className="flex items-center space-x-2 ">
            <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v as boolean)}/>
            <Label>{label}</Label>
        </div>
    );
}

