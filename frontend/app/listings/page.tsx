"use client"

import {ChevronDown, ChevronUp, Filter, Grid, List, MapPin, Search, Star, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import debounce from "lodash/debounce"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Separator} from "@/components/ui/separator"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {Slider} from "@/components/ui/slider"
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import {useLanguage} from "@/lib/language-context"
import {useEffect, useState} from "react"
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";
import {PinballImageCarousel} from "@/components/PinballImageCarousel";
import {Manufacturers} from "@/components/object/Manufacturer";
import {Currencies} from "@/components/object/Currencies";
import FeaturesList from "@/components/filters/FeaturesList";
import {useApi} from "@/lib/api";
import {PinballDto} from "@/components/object/PinballDto";
import {toast} from "@/components/ui/use-toast";
import SearchDropdown from "@/components/SearchDropdown";
import {useSearchParams} from 'next/navigation';
import {GameDto} from "@/components/object/GameDto";
import InputCity from "@/components/InputCity";
import {QueryLocationResult} from "@/components/object/QueryLocationType";
import {SliderMax} from "@/components/ui/sliderMax";

// Mock data for pinball machine listings

function FilterSidebar({
                           className = "",
                           onChange,
                           selectedGame
                       }:
                       {
                           className?: string,
                           onChange: (arg0: FiltersSidebarProps) => void,
                           selectedGame?: GameDto | null
                       },
) {
    const searchParams = useSearchParams();
    const features = searchParams.get('features') ? searchParams.get('features')?.split(',') : [];
    const years = searchParams.get('years') ? searchParams.get('years')?.split(',').map(Number) : [];

    const {t} = useLanguage()
    const [filterLoaded, setfilterLoaded] = useState(false)
    const [currency, setCurrency] = useState('EUR')
    const [priceRange, setPriceRange] = useState([200, 50000])
    const [finalPriceRange, setFinalPriceRange] = useState([200, 50000])
    const [distanceRange, setDistanceRange] = useState(50)
    const [manufacturerOpen, setManufacturerOpen] = useState(true)
    const [yearOpen, setYearOpen] = useState(true)
    const [featuresOpen, setFeaturesOpen] = useState(true)
    const [conditionOpen, setConditionOpen] = useState(true)
    const [searchQuery, setSearchQuery] = useState(""); // Pour la recherche
    const [showAll, setShowAll] = useState(false); // Contrôle l'état "Afficher plus"
    const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
    const [selectedDecades, setSelectedDecades] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<QueryLocationResult | null>(null)

    useEffect(() => {
        if (filterLoaded) return;

        const selectedDecadesFromYears = decades
            .filter(decade => years?.some(year => year >= decade.min && year <= decade.max))
            .map(decade => decade.key);

        setSelectedDecades(selectedDecadesFromYears);
        setfilterLoaded(true);

    }, [filterLoaded]);


    useEffect(() => {
        const debouncedOnChange = debounce((filters) => {
            onChange(filters);
        }, 500);

        debouncedOnChange(filterAll());

        return () => {
            debouncedOnChange.cancel();
        };
    }, [selectedFeatures, selectedManufacturers, selectedDecades, selectedConditions, finalPriceRange, distanceRange, currency, selectedGame]);

    const manufacturerList = Object.values(Manufacturers);
    const filteredManufacturers = manufacturerList.filter((manufacturer) =>
        manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const displayedManufacturers = showAll
        ? filteredManufacturers
        : filteredManufacturers.slice(0, 8);
    filteredManufacturers.slice(0, 8);


    const conditions = [
        {key: 'excellent', name: "sell.conditions.excellent", count: 'x'},
        {key: 'veryGood', name: "sell.conditions.veryGood", count: 'x'},
        {key: 'good', name: "sell.conditions.good", count: 'x'},
        {key: 'fair', name: "sell.conditions.fair", count: 'x'},
        {key: 'project', name: "sell.conditions.project", count: 'x'},
    ]

    const decades = [
        {key: '2020', name: "2020s", count: 'x', min: 2020, max: 2030},
        {key: '2010', name: "2010s", count: 'x', min: 2010, max: 2019},
        {key: '2000', name: "2000s", count: 'x', min: 2000, max: 2009},
        {key: '1990', name: "1990s", count: 'x', min: 1990, max: 1999},
        {key: '1980', name: "1980s", count: 'x', min: 1980, max: 1989},
        {key: '1970', name: "1970s", count: 'x', min: 1970, max: 1979},
    ]

    const resetFilters = () => {
        setPriceRange([200, 50000]);
        setDistanceRange(50);
        setSelectedManufacturers([]);
        setSelectedFeatures([]);
        setSelectedDecades([]);
    }

    const filterAll = () => {
        return {
            game: selectedGame,
            location: {
                lon: selectedLocation?.lon ?? null,
                lat: selectedLocation?.lat ?? null,
            },
            price: {
                min: priceRange[0],
                max: priceRange[1],
                currency: currency,
            },
            distance: distanceRange,
            manufacturers: selectedManufacturers.map(m => m.toLowerCase()),
            conditions: selectedConditions.map(c => c.toLowerCase()),
            features: selectedFeatures,
            decades: selectedDecades.map(d => d.toLowerCase()),
        }
    }

    return (
        <div className={`bg-card border-r h-full ${className}`}>
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-foreground">{t("listings.filters")}</h3>
                <Button variant="ghost" onClick={()=>resetFilters()} size="sm" className="mt-2 text-muted-foreground hover:text-foreground cursor-pointer">
                    {t("listings.clearAll")}
                </Button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
                {/* Price Range Filter */}
                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">{t("listings.priceRange")}</h4>
                    <div className="space-y-3">
                        <Slider
                            value={priceRange}
                            onValueChange={(value) => setPriceRange(value)}
                            onValueCommit={(value) => setFinalPriceRange(value)}
                            max={50000}
                            min={200}
                            step={100}
                            className="w-full cursor-ew-resize"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{Currencies[currency as keyof typeof Currencies]}{priceRange[0].toLocaleString()}</span>
                            <span>{Currencies[currency as keyof typeof Currencies]}{priceRange[1].toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Min" value={priceRange[0]} className="h-8 text-sm" readOnly/>
                            <Input placeholder="Max" value={priceRange[1]} className="h-8 text-sm" readOnly/>
                            <Select
                                required={true}
                                value={currency}
                                onValueChange={(value) => setCurrency(value as string)}
                            >
                                <SelectTrigger className="text-sm select-sm w-[100px]">
                                    <SelectValue placeholder="Currency"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(Currencies).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Distance Filter */}
                <div className="space-y-4">
                    <h4 className="font-medium text-foreground">{t("listings.distance")}</h4>
                    <InputCity onSelected={(location:QueryLocationResult|null)=> setSelectedLocation(location)}></InputCity>
                    <div className={`space-y-3 ${selectedLocation ? '' : 'hidden'}`}>
                                <SliderMax
                                    value={distanceRange}
                                    onValueChange={setDistanceRange}
                                    max={250}
                                    step={5}
                                    className="w-full cursor-ew-resize"
                                />
                                <div className="text-sm text-muted-foreground">
                                    {t("listings.within")} {distanceRange} {t("listings.miles")}
                                </div>
                            </div>
                </div>

                {/* Manufacturer Filter */}
                <Collapsible open={manufacturerOpen} onOpenChange={setManufacturerOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <h4 className="font-medium text-foreground">{t("listings.manufacturer")}</h4>
                        {manufacturerOpen ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-3">
                        <div className="space-y-4">
                            {/* Barre de recherche */}
                            <Input
                                type="text"
                                placeholder="Rechercher un fabricant..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />

                            {/* Liste des fabricants */}
                            <div className="space-y-2">
                                {Object.entries(Manufacturers).map(([key, manufacturer]) => (
                                    displayedManufacturers.includes(manufacturer) && (
                                        <div
                                            key={key}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`manufacturer-${key}`}
                                                className="cursor-pointer"
                                                checked={selectedManufacturers.includes(key)}
                                                onCheckedChange={(checked) => {
                                                    const newSelected = checked
                                                        ? [...selectedManufacturers, key]
                                                        : selectedManufacturers.filter(m => m !== key);
                                                    setSelectedManufacturers(newSelected);
                                                }}
                                            />
                                            <label
                                                htmlFor={`manufacturer-${key}`}
                                                className="text-sm text-foreground cursor-pointer"
                                            >
                                                {manufacturer}
                                            </label>
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Bouton "Afficher plus" ou "Afficher moins" */}
                            {filteredManufacturers.length > 8 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAll((prev) => !prev)}
                                    className="w-full"
                                >
                                    {showAll ? "Afficher moins" : "Afficher plus"}
                                </Button>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Year/Decade Filter */}
                <Collapsible open={yearOpen} onOpenChange={setYearOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <h4 className="font-medium text-foreground">{t("listings.era")}</h4>
                        {yearOpen ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-3">
                        {decades.map((decade) => (
                            <div key={decade.name} className="flex items-center space-x-2">
                                <Checkbox className={'cursor-pointer'}
                                          id={`decade-${decade.name}`}
                                          checked={selectedDecades?.includes(decade.key)}
                                          onCheckedChange={(checked) => {
                                              const newSelected = checked
                                                  ? [...selectedDecades, decade.key]
                                                  : selectedDecades.filter(d => d !== decade.key);
                                              setSelectedDecades(newSelected);
                                          }}
                                />
                                <Label
                                    htmlFor={`decade-${decade.name}`}
                                    className="text-sm text-foreground cursor-pointer flex-1">
                                    {decade.name}
                                </Label>
                                <span className="text-xs text-muted-foreground">({decade.count})</span>
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>

                {/* Condition Filter */}
                <Collapsible open={conditionOpen} onOpenChange={setConditionOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <h4 className="font-medium text-foreground">{t("listings.condition")}</h4>
                        {conditionOpen ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-3">
                        {conditions.map((condition) => (
                            <div key={condition.key} className="flex items-center space-x-2">
                                <Checkbox id={`condition-${condition.key}`}
                                          className={'cursor-pointer'}
                                          checked={selectedConditions?.includes(condition.key)}
                                          onCheckedChange={(checked) => {
                                              const newSelected = checked
                                                  ? [...selectedConditions, condition.key]
                                                  : selectedConditions.filter(c => c !== condition.key);
                                              setSelectedConditions(newSelected);
                                          }}
                                />
                                <Label
                                    htmlFor={`condition-${condition.key}`}
                                    className="text-sm text-foreground cursor-pointer flex-1"
                                >
                                    {t(condition.name)}
                                </Label>
                                {/*<span className="text-xs text-muted-foreground">({condition.count})</span>*/}
                            </div>
                        ))}
                    </CollapsibleContent>
                </Collapsible>

                <Collapsible open={featuresOpen} onOpenChange={setFeaturesOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <h4 className="font-medium text-foreground">{t("listings.features")}</h4>
                        {featuresOpen ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer"/>
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 mt-3">
                        <FeaturesList handleFeatureSelection={(features) => {
                            setSelectedFeatures(features);
                        }} preselectedFeatures={[]}></FeaturesList>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    )
}

interface FiltersSidebarProps {
    opdbId?: string | null,
    game?: GameDto | null,
    location: {
        lon: string | null,
        lat: string | null
    },
    price: {
        min: number,
        max: number,
        currency: string
    },
    distance: number,
    manufacturers: string[],
    conditions: string[],
    features: string[],
    decades: string[]
}

export default function ListingsPage() {
    const {t} = useLanguage()
    const {apiGet} = useApi()
    const searchParams = useSearchParams();
    const [opdbid, setOpdbid] = useState(searchParams.get('opdbId') ?? null);
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [pinballMachines, setPinballMachines] = useState<PinballDto[] | []>([]); // Afficher les résultats supplémentaires
    const {apiPost} = useApi();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [filters, setFilters] = useState<FiltersSidebarProps | null>(null)
    const [isLoadingMachine, setIsLoadingMachine] = useState(true)
    const [query, setQuery] = useState<string>("");
    const [selectedGame, setSelectedGame] = useState<GameDto | null>(null);

   useEffect(() => {
        if (!opdbid) return;

        apiGet(`/api/public/search/game/${opdbid}`).then((data) => {
            setSelectedGame(data);
            setQuery(data.name);
        });
    }, [opdbid]);

    const fetchCollection = async () => {
        setIsLoadingMachine(true);

        try {
            const result = await apiPost(`/api/public/sales`, filters ?? {});

            if (result) {
                setPinballMachines(result.pinballs)
                setIsLoadingMachine(false);
            } else {
                toast({
                    title: "Erreur",
                    description: `${t('collection.cantLoadMachines')}`,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: `${t('collection.cantLoadMachines')}`,
                variant: "destructive",
            })
        }
    }

    const handleSelectGame = (game: GameDto) => {
        setSelectedGame(game);
        setOpdbid(game?.opdb_id);
        setQuery(game?.name);
    }

    useEffect(() => {
        if (!filters ) return;
        fetchCollection()
    }, [filters]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>
            {/* Search and Filter Bar */}
            <section className="bg-muted/30 border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Inputs */}
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <SearchDropdown
                                    id="title"
                                    placeholder={t("collection.searchForGame")}
                                    className={'pl-10 h-12 text-lg"'}
                                    query={query}
                                    setQuery={setQuery}
                                    onGameSelect={handleSelectGame}
                                ></SearchDropdown>
                            </div>
                        </div>

                        {/* Sort and View Controls */}
                        <div className="flex items-center gap-4">
                            <Select defaultValue="relevance">
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t("listings.sortBy")}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">{t("listings.relevance")}</SelectItem>
                                    <SelectItem value="price-low">{t("listings.priceLowHigh")}</SelectItem>
                                    <SelectItem value="price-high">{t("listings.priceHighLow")}</SelectItem>
                                    <SelectItem value="year-new">{t("listings.yearNewest")}</SelectItem>
                                    <SelectItem value="year-old">{t("listings.yearOldest")}</SelectItem>
                                    <SelectItem value="distance">{t("listings.distance")}</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-r-none cursor-pointer"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4"/>
                                </Button>
                                <Separator orientation="vertical" className="h-6"/>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-l-none cursor-pointer"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4"/>
                                </Button>
                            </div>

                            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="gap-2 bg-transparent lg:hidden">
                                        <Filter className="w-4 h-4"/>
                                        {t("listings.filters")}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 p-0">
                                    <SheetHeader className="p-6 border-b">
                                        <SheetTitle>{t("listings.filters")}</SheetTitle>
                                    </SheetHeader>
                                    <FilterSidebar onChange={(filters) => setFilters(filters)}/>
                                </SheetContent>
                            </Sheet>

                            <Button variant="outline" className="gap-2 bg-transparent hidden lg:flex">
                                <Filter className="w-4 h-4"/>
                                {t("listings.filters")}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="flex">
                <aside className="hidden lg:block w-80 min-h-screen">
                    <FilterSidebar onChange={(filters) => setFilters(filters)} selectedGame={selectedGame}/>
                </aside>
                {isLoadingMachine ? (
                    <main className="flex-1">
                        <section className="container mx-auto px-4 pb-12 lg:px-6">
                            <div className="flex flex-col items-center justify-center py-20">
                                <div
                                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"/>
                                <p className="text-lg text-muted-foreground">{t('listings.searchPlaceholder')}</p>
                            </div>
                        </section>
                    </main>
                ) : (
                    <main className="flex-1">
                        <section className="container mx-auto px-4 py-6 lg:px-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">{t("listings.pinballMachines")}</h2>
                                    <p className="text-muted-foreground">
                                        {pinballMachines.length} {t("listings.machinesFound")}
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {t("listings.showing")} 1-{pinballMachines.length} {t("listings.of")} {pinballMachines.length}{" "}
                                    {t("listings.results")}
                                </div>
                            </div>
                        </section>
                        <section className="container mx-auto px-4 pb-12 lg:px-6">
                            {viewMode === "grid" ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {pinballMachines.map((machine) => (
                                        <Card noPadding={true} key={machine.id}
                                              className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                            <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                                                <PinballImageCarousel machine={machine}></PinballImageCarousel>
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant="secondary"
                                                           className="bg-background/90 text-foreground">
                                                        {machine.condition}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-foreground text-lg leading-tight line-clamp-2">
                                                        {machine.name}
                                                    </h4>
                                                    <div
                                                        className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                                                        <Star className="w-4 h-4 fill-accent text-accent"/>
                                                        {machine.rating ?? 5}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {Manufacturers[machine.manufacturer]} • {machine.year}
                                                </p>
                                                <div
                                                    className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-4">
                                                    <User className="w-4 h-4"/>
                                                    <div>{machine.currentOwner?.name}</div>
                                                </div>
                                                <div
                                                    className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                                    <MapPin className="w-4 h-4"/>
                                                    {machine.location?.city} {machine.distance && (<>- {machine.distance ?? 0} km away</>)}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0">
                                                <div className="flex items-center justify-between w-full">
                                            <span
                                                className="text-xl font-bold text-primary">{Currencies[machine.currency as keyof typeof Currencies]}{machine.price.toLocaleString()}</span>
                                                    <Link href={`/listings/detail?id=${machine.id}`}>

                                                        <Button size="sm" className={'cursor-pointer'}
                                                                variant="outline">
                                                            {t("listings.viewDetails")}
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pinballMachines.map((machine) => (
                                        <Card key={machine.id}
                                              noPadding={true}
                                              className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                            <div className="flex flex-col sm:flex-row">
                                                <div
                                                    className="sm:w-64 aspect-[4/3] sm:aspect-auto overflow-hidden relative">
                                                    <PinballImageCarousel machine={machine}></PinballImageCarousel>
                                                    <div className="absolute top-3 right-3">
                                                        <Badge variant="secondary"
                                                               className="bg-background/90 text-foreground">
                                                            {machine.condition}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex-1 pt-6 pl-6 pr-6">
                                                    <div
                                                        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h4 className="font-semibold text-foreground text-xl leading-tight">{machine.name}</h4>
                                                                <div
                                                                    className="flex items-center gap-1 text-sm text-muted-foreground ml-4">
                                                                    <Star className="w-4 h-4 fill-accent text-accent"/>
                                                                    {machine.rating ?? 5}
                                                                </div>
                                                            </div>
                                                            <p className="text-muted-foreground mb-4">
                                                                {machine.manufacturer} • {machine.year}
                                                            </p>
                                                            <div
                                                                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4"/>
                                                                    {machine.location?.city ?? ''}
                                                                </div>
                                                                {machine.distance && (<div>{machine.distance ?? 0} km away</div>)}
                                                            </div>
                                                            <div
                                                                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                                                <User className="w-4 h-4"/>
                                                                <div>{machine.currentOwner?.name}</div>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {machine.description}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-3 sm:min-w-[180px]">
                                                        <span
                                                            className="text-2xl font-bold text-primary">{Currencies[machine.currency as keyof typeof Currencies]}{machine.price.toLocaleString()}</span>
                                                            <Button className="w-full sm:w-auto cursor-pointer">{t('viewDetails')}</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </section>
                        {/*<section className="container mx-auto px-4 pb-12 lg:px-6">*/}
                        {/*    <div className="flex items-center justify-center gap-2">*/}
                        {/*        <Button variant="outline" disabled>*/}
                        {/*            {t("listings.previous")}*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="default" size="sm">*/}
                        {/*            1*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="outline" size="sm">*/}
                        {/*            2*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="outline" size="sm">*/}
                        {/*            3*/}
                        {/*        </Button>*/}
                        {/*        <span className="text-muted-foreground px-2">...</span>*/}
                        {/*        <Button variant="outline" size="sm">*/}
                        {/*            10*/}
                        {/*        </Button>*/}
                        {/*        <Button variant="outline">{t("listings.next")}</Button>*/}
                        {/*    </div>*/}
                        {/*</section>*/}
                    </main>
                )}
            </div>
            <Footer/>
        </div>
    )
}
