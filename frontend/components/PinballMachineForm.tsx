"use client"

import {useState} from "react";
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
import {PinballDto} from "@/components/object/PinballDto";
import {Manufacturers} from "@/components/object/Manufacturer";
import {DefaultFeatures, FeaturesType} from '@/components/object/Features';
import SearchDropdown from "@/components/SearchDropdown";
import {UploadedImageResult} from "@/components/object/UploadedImageResult";
import {GameDto} from "@/components/object/GameDto";

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
    features: FeaturesType;
    condition: string;
    startDate?: string;
    images: UploadedImageResult[];
}

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
function migrateLegacyFeatures(features: AnyObj): FeaturesType {
    if (!isPlainObject(features)) return DefaultFeatures;

    // Mapper les valeurs existantes sur l'objet par défaut
    return Object.entries(DefaultFeatures).reduce((acc, [category, categoryDefaults]) => {
        acc[category as keyof FeaturesType] = Object.keys(categoryDefaults).reduce((subAcc, key) => {
            const value = features[key];
            // Gestion spéciale pour numberOfPlayers qui est un number
            // if (key === 'numberOfPlayers') {
            //     subAcc[key] = typeof value === 'number' ? value : 4;
            // } else {
                subAcc[key as keyof FeaturesType] = !!value;
            // }
            return subAcc;
        }, {...categoryDefaults});
        return acc;
    }, {...DefaultFeatures});
}
function normalize(str: string): string {
        return str
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // supprime les accents
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]+/g, "-")                      // tout ce qui n’est pas alphanum → tiret
            // .replace(/\b(inc|co|ltd|sa|games?|pinball|electronics|manufacturing|company|corp|mfg|s\.a\.?)\b/g, "")
            .replace(/-+/g, "-")                              // remplace multiples tirets par un seul
            .replace(/^-|-$/g, "");                           // supprime tiret au début/fin

    // return str
    //     .toLowerCase()
    //     .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // supprime les accents
    //     .replace(/[-_]/g, " ")                             // ✅ remplace tirets ET underscores
    //     .replace(/&/g, "and")
    //     .replace(/[^a-z0-9 ]/g, " ")                      // supprime la ponctuation
    //     .replace(/\b(inc|co|ltd|sa|games?|pinball|electronics|manufacturing|company|corp|mfg|s\.a\.?)\b/g, "")
    //     .replace(/\s+/g, " ")                             // espaces multiples → un seul
    //     .trim();
}

function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

export function findClosestManufacturer(selectedManufacturer: string): string {
    const manufacturersList = Object.keys(Manufacturers);
    const input = normalize(selectedManufacturer);

    let bestMatch = "";
    let bestScore = Infinity;

    // ✅ test d'inclusion + score bonus
    for (const key of manufacturersList) {
        const normalized = normalize(key);

        if (
            input === normalized ||
            input.includes(normalized) ||
            normalized.includes(input) ||
            normalized.replace(/\s/g, "").includes(input.replace(/\s/g, "")) // bonus sans espace
        ) {
            return key;
        }

        // Calculer une "similarité" pondérée
        const distance = levenshteinDistance(input, normalized);
        const score = distance / Math.max(input.length, normalized.length); // normalise sur la longueur

        if (score < bestScore) {
            bestScore = score;
            bestMatch = key;
        }
    }

    return bestMatch || 'unknown';
}

export default function MachineForm({initialData, onSubmit, buttonText}: MachineFormProps) {
    const {t} = useLanguage();
    const [query, setQuery] = useState(initialData?.name || "");
    const [opdbId, setOpdbId] = useState(initialData?.opdbId || "");
    const [manufacturer, setManufacturer] = useState(initialData?.manufacturer || "");
    const [year, setYear] = useState(initialData?.year || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [condition, setCondition] = useState(initialData?.condition || "");
    const [startDate, setStartDate] = useState(initialData?.owningDate || "");
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(initialData?.images||[]);

    const additionalOptionsData = DefaultFeatures;

    const [additionalOptions, setAdditionalOptions] = useState<FeaturesType>(() => {
        if (initialData?.features) {
            const normalized = migrateLegacyFeatures(initialData.features);
            return deepMerge(additionalOptionsData, normalized);
        }
        return additionalOptionsData;
    });

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

    const handleSelectGame = (game: GameDto) => {
        setQuery(game.name);
        setOpdbId(game.opdb_id);

        // Lorsque le fabricant du jeu est défini
        const selectedManufacturer = game.manufacturer?.name?.toLowerCase() || "";
        const closestManufacturer = findClosestManufacturer(selectedManufacturer);
        // Mise à jour avec le fabricant le plus proche trouvé
        console.log(closestManufacturer);
        setManufacturer(closestManufacturer.toLowerCase() || "");

        setYear(game.manufacture_date ? new Date(game.manufacture_date).getFullYear().toString() : "");
        setDescription(game.description || "");
    };

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

                            <SearchDropdown
                                id="title"
                                placeholder={t("collection.searchForGame")}
                                query={query}
                                setQuery={setQuery}
                                onGameSelect={handleSelectGame}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manufacturer">{t('sell.manufacturer')} *</Label>
                            <Select required
                                    value={manufacturer}
                                    onValueChange={(value) => setManufacturer(value as string)}
                                    disabled={true}>
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
                                disabled={true} // Disable the input if year has a value
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="condition">{t('sell.condition')} *</Label>
                            <Select required value={condition ?? 'good'} onValueChange={(value) => setCondition(value)}>
                                <SelectTrigger><SelectValue placeholder={t('sell.selectCondition')}/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="excellent">{t('sell.conditions.excellent')}</SelectItem>
                                    <SelectItem value="very-good">{t('sell.conditions.veryGood')}</SelectItem>
                                    <SelectItem value="good">{t('sell.conditions.good')}</SelectItem>
                                    <SelectItem value="fair">{t('sell.conditions.fair')}</SelectItem>
                                    <SelectItem value="project">{t('sell.conditions.project')}</SelectItem>
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

