"use client"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {useEffect, useState} from "react"
import {
    Calendar,
    ChevronDown,
    DollarSign,
    Edit,
    Folder,
    List,
    Loader2,
    MapPin,
    PauseIcon,
    Plus,
    Shield,
    Star,
    Trash2,
    Wrench,
} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Textarea} from "@/components/ui/textarea"
import {PinballImageCarousel} from "@/components/PinballImageCarousel"
import {useToast} from "@/hooks/use-toast"
import Link from "next/link"
import {CreateMaintenanceEntryDto, MaintenanceEntry, MaintenanceType} from "@/components/object/MaintenanceDto"
import {useApi} from "@/lib/api";
import {LocationResult} from "@/components/object/LocationResult";
import {PinballDto} from "@/components/object/PinballDto";
import {CollectionDto} from "@/components/object/CollectionDto";
import {useAuth} from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import {Footer} from "react-day-picker";
import {useLanguage} from "@/lib/language-context";
import {Currencies} from "@/components/object/Currencies";
import InputCity from "@/components/InputCity";
import {QueryLocationResult} from "@/components/object/QueryLocationResult";
import {DefaultFeatures, FeaturesType} from "@/components/object/Features";
import {maintenanceSuggestions} from "@/components/object/MaintenanceSuggestion";


export default function MyCollectionPage() {
    const [collections, setCollections] = useState<CollectionDto[]>([])
    const [currentCollection, setCurrentCollection] = useState<CollectionDto | null>(null)
    const [machines, setMachines] = useState<PinballDto[]>([])
    const [loading, setLoading] = useState(true)
    const [editingMachine, setEditingMachine] = useState<PinballDto | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [sellDialogOpen, setSellDialogOpen] = useState<number | null>(null)
    const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState<number | null>(null)
    const [sellPrice, setSellPrice] = useState("")
    const [currency, setCurrency] = useState('EUR')
    const [locationQuery, setLocationQuery] = useState("")
    const [locationResults, setLocationResults] = useState<LocationResult[]>([])
    const [selectedLocation, setSelectedLocation] = useState<QueryLocationResult | null>(null)
    const [searchingLocation, setSearchingLocation] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [machineMaintenanceLogs, setMachineMaintenanceLogs] = useState<MaintenanceEntry[]>([])
    const [selectedMachineForMaintenance, setSelectedMachineForMaintenance] = useState<PinballDto | null>(null)
    const [exchangeDialogOpen, setExchangeDialogOpen] = useState<number | null>(null)
    const [transferDialogOpen, setTransferDialogOpen] = useState<number | null>(null)
    const [transferEmail, setTransferEmail] = useState("")
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
    const [maintenanceFormData, setMaintenanceFormData] = useState<MaintenanceEntry>({
        id: null,
        date: new Date().toISOString().split("T")[0],
        type: MaintenanceType.cleaning,
        description: "",
        cost: null,
        parts: null,
        notes: "",
    })
    const [showSuggestions, setShowSuggestions] = useState(false)
    const currentSuggestions = maintenanceSuggestions[maintenanceFormData.type] || []

    const {toast} = useToast()
    const {t} = useLanguage()
    const {user, token} = useAuth()
    const {apiGet, apiPost, apiPut, apiDelete} = useApi()

    useEffect(() => {
        if (!token) return;
        fetchCollectionsAndSetDefault()
    }, [token])

    useEffect(() => {
        if (currentCollection) {
            fetchMachinesForCollection(currentCollection.id)
        }
    }, [currentCollection])

    const fetchCollectionsAndSetDefault = async () => {
        try {
            setLoading(true)
            apiGet("/api/collections").then((res) => {
                setCollections(res);
                setCurrentCollection(res[0])
            }).catch((err) => console.log(err))

        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger vos collections. Veuillez réessayer.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchMachinesForCollection = async (collectionId: number) => {
        try {
            setLoading(true)
            apiGet(`/api/collections/${collectionId}`).then((res) => {setMachines(res)  ;          console.log(res)

            }).catch((err) => console.log(err))
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de charger les machines. Veuillez réessayer.",
                variant: "destructive",
            })
        }finally {
            setLoading(false)
        }
    }

    const handleCollectionChange = (collection: CollectionDto) => {
        setCurrentCollection(collection)
    }

    const handleDelete = async (id: number) => {
        apiDelete(`/api/machines/${id}`).then((res) => {
            setMachines((prev) => prev.filter((machine) => machine.id !== id))
            setDeleteConfirm(null)
            toast({
                title: t("toasts.success"),
                description: t('collection.toasts.collectionDeleted'),
                variant: "success",
            })
        }).catch((err) => {
            toast({
                title: t("toasts.error"),
                description: err instanceof Error ? err.message : t("toasts.unknownError"),
                variant: "destructive",
            })
        })
    }

    const handleAddMachine = (collectionId: number) => {
        window.location.href = `/collection/${collectionId}/machine`;
    }

    const searchLocation = async (query: string) => {
        if (query.length < 3) {
            setLocationResults([])
            return
        }

        try {
            setSearchingLocation(true)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
                {
                    headers: {
                        "User-Agent": "PinballMarketplace/1.0",
                    },
                },
            )
            const data = await response.json()
            setLocationResults(data)
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de rechercher la localisation. Veuillez réessayer.",
                variant: "destructive",
            })
        } finally {
            setSearchingLocation(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (locationQuery) {
                searchLocation(locationQuery)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [locationQuery])

    const handleDeleteSell = (machineId: number) => {
        apiDelete(`/api/machine/${machineId}/sell`).then((data: PinballDto) => {
            toast({
                title: t("success"),
                description: t('sell.removedFromSales'),
                variant: "success",
            })
            setSellDialogOpen(null)
            setConfirmDelete(null)
            setMachines((prev) => prev.map((machine) => (machine.id === machineId ? data : machine)))
        })
    }

    const handleUpdateSale = (machineId: number) => {
        if (sellPrice && Number(sellPrice) > 0) {
            setMachines((prev) =>
                prev.map((machine) =>
                    machine.id === machineId ? {...machine, status: "For Sale", price: Number(sellPrice)} : machine,
                ),
            )

            const sellMachine = {
                price: Number(sellPrice),
                currency: currency,
                location: selectedLocation,
            }

            apiPut(`/api/machine/${machineId}/sell`, sellMachine).then((data: PinballDto) => {
                setMachines((prev) => prev.map((machine) => (machine.id === machineId ? data : machine)))

                toast({
                    title: t("success"),
                    description: t('sell.machineOnSalesUpdated'),
                    variant: "success",
                })
                setSellDialogOpen(null)
            })
        }
    }

    const handlePutForSale = (machineId: number) => {
        if (sellPrice && Number(sellPrice) > 0) {
            setMachines((prev) =>
                prev.map((machine) =>
                    machine.id === machineId ? {...machine, status: "For Sale", price: Number(sellPrice)} : machine,
                ),
            )

            const sellMachine = {
                price: Number(sellPrice),
                currency: currency,
                location: selectedLocation,
            }

            apiPost(`/api/machine/${machineId}/sell`, sellMachine).then((data: PinballDto) => {
                setMachines((prev) => prev.map((machine) => (machine.id === machineId ? data : machine)))

                toast({
                    title: t("success"),
                    description: t('sell.machineOnSales'),
                    variant: "success",
                })
                setSellDialogOpen(null)
            })
        }
    }


    const handleAddMaintenanceEntry = async (machineId: number, entry: any) => {
        try {
            console.log("[v0] Adding maintenance entry for machine:", machineId)
            // In a real app, this would call an API endpoint
            // For now, we'll add it to local state
            const newEntry: MaintenanceEntry = {
                id: `${Date.now()}`,
                machineId: machineId.toString(),
                ...entry,
                createdAt: new Date().toISOString(),
            }

            setMachineMaintenanceLogs([...machineMaintenanceLogs, newEntry])

            toast({
                title: "Succès",
                description: "Entrée d'entretien enregistrée avec succès.",
            })
        } catch (error) {
            console.error("[v0] Error adding maintenance entry:", error)
            toast({
                title: "Erreur",
                description: "Impossible d'enregistrer l'entrée d'entretien.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteMaintenanceEntry = (entryId: string) => {
        setMachineMaintenanceLogs(machineMaintenanceLogs.filter((entry) => entry.id !== entryId))
        toast({
            title: "Succès",
            description: "Entrée d'entretien supprimée.",
        })
    }

    const handleEdit = (machine: PinballDto) => {
        window.location.href = `/machine/${machine.id}`;
    }

    const handleProposeExchange = async (machineId: number) => {
        try {
            toast({
                title: "Succès",
                description: "Machine proposée à l'échange. Les intéressés peuvent vous contacter.",
            })
            setExchangeDialogOpen(null)
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de proposer l'échange.",
                variant: "destructive",
            })
        }
    }

    const handleTransferMachine = async (machineId: number) => {
        if (!transferEmail) {
            toast({
                title: "Erreur",
                description: "Veuillez entrer un email valide.",
                variant: "destructive",
            })
            return
        }

        try {
            console.log("[v0] Transferring machine to:", transferEmail)
            toast({
                title: "Succès",
                description: `Machine transférée à ${transferEmail}.`,
            })
            setTransferDialogOpen(null)
            setTransferEmail("")
        } catch (error) {
            console.error("[v0] Error transferring machine:", error)
            toast({
                title: "Erreur",
                description: "Impossible de transférer la machine.",
                variant: "destructive",
            })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary"/>
                    <p className="text-muted-foreground">Chargement de votre Collection...</p>
                </div>
            </div>
        )
    }

    const handleSubmitMaintenance = (machine: PinballDto) => {
        if (!maintenanceFormData.description.trim()) {
            alert("Veuillez entrer une description")
            return
        }
        try {
            machine.maintenanceLogs = [...machine.maintenanceLogs, maintenanceFormData];
            apiPut(`/api/machine/${machine.id}`, machine).then((data: PinballDto) => {
                setMachines((prev) => prev.map((machine) => (machine.id === data.id ? data : machine)))
                toast({
                    title: t("success"),
                    description: t('collection.toasts.maintenanceAdded'),
                    variant: "success",
                })
                setMaintenanceFormData({
                    id: null,
                    date: new Date().toISOString().split("T")[0],
                    type: MaintenanceType.cleaning,
                    description: "",
                    cost: null,
                    parts: null,
                    notes: "",
                })
                setMaintenanceDialogOpen(null)
            }).catch((err) => {
                toast({
                    title: t("Error"),
                    description: "Impossible d'enregistrer l'entrée d'entretien.",
                    variant: "destructive",
                })
            })

        } catch (error) {
            toast({
                title: t("Error"),
                description: "Impossible d'enregistrer l'entrée d'entretien.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - User Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <Avatar className="w-24 h-24 mx-auto mb-4">
                                        <AvatarImage src={user.avatar || "/placeholder.svg"}/>
                                        <AvatarFallback className="text-2xl">
                                            {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                                        {user.verified && <Shield className="w-5 h-5 text-primary"/>}
                                    </div>
                                    <p className="text-muted-foreground">@{user.username}</p>
                                    <div className="flex items-center justify-center gap-1 mt-2">
                                        <Star className="w-4 h-4 fill-accent text-accent"/>
                                        <span className="font-medium">{user.rating}</span>
                                        <span className="text-muted-foreground">({user.reviewCount} avis)</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-muted-foreground">{user.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-muted-foreground">Membre depuis {user.memberSince}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{machines.length}</div>
                                        <div className="text-xs text-muted-foreground">Machines</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{user?.stats?.totalViews}</div>
                                        <div className="text-xs text-muted-foreground">Vues totales</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{user?.stats?.responseRate}%
                                        </div>
                                        <div className="text-xs text-muted-foreground">Taux de réponse</div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="text-sm font-medium text-foreground mb-3">Mes Collections</h4>
                                    <div className="space-y-2">
                                        {collections.map((collection) => (
                                            <button
                                                key={collection.id}
                                                onClick={() => handleCollectionChange(collection)}
                                                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                                                    currentCollection?.id === collection.id
                                                        ? "bg-primary/10 text-primary border border-primary/20"
                                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Folder className="w-4 h-4"/>
                                                    <span className="flex-1 truncate">{collection.name}</span>
                                                    <span className="text-xs">{collection.machineCount}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <Button asChild variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                                        <Link href="/collections">Gérer les collections</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold text-foreground">{t('collection.myCollection')}</h3>
                                            {currentCollection && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="gap-2 bg-transparent cursor-pointer">
                                                            <Folder className="w-4 h-4"/>
                                                            {currentCollection.name}
                                                            <ChevronDown className="w-4 h-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-64">
                                                        {collections.map((collection) => (
                                                            <DropdownMenuItem
                                                                key={collection.id}
                                                                onClick={() => handleCollectionChange(collection)}
                                                                className={`${currentCollection.id === collection.id ? "bg-primary/10" : ""} cursor-pointer`}
                                                            >
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <Folder className="w-4 h-4"/>
                                                                    <div className="flex-1">
                                                                        <div
                                                                            className="font-medium">{collection.name}</div>
                                                                        <div className="text-xs text-muted-foreground">
                                                                            {t('collection.xMachines', {count: collection.machineCount}, collection.machineCount)}
                                                                        </div>
                                                                    </div>
                                                                    {collection.isDefault && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            Défaut
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </DropdownMenuItem>
                                                        ))}
                                                        <DropdownMenuSeparator/>
                                                        <DropdownMenuItem asChild>
                                                            <Link href="/collections" className="w-full cursor-pointer">
                                                                <Plus className="w-4 h-4 mr-2"/>
                                                                {t('collection.manageCollections')}
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground">
                                            {currentCollection
                                                ? t('collection.countMachineInCollectionName', {count:machines.length, name: currentCollection.name}, machines.length)
                                                : t('collection.countMachineInCollection', {count:machines.length}, machines.length)
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button onClick={(e) => handleAddMachine(currentCollection?.id ?? 0)}
                                        className="gap-2 cursor-pointer">
                                    <Plus className="w-4 h-4"/>
                                    {t('collection.addMachine')}
                                </Button>
                            </div>

                            {machines.length === 0 ? (
                                <Card className="p-12 text-center">
                                    <div className="text-muted-foreground">
                                        <p className="text-lg mb-2">
                                            {currentCollection ? t('collection.withNameIsEmpty', {name: currentCollection.name}) : t('collection.isEmpty')}
                                        </p>
                                        <p className="text-sm mb-4">
                                            {t('collection.addYourFirstMachine')}</p>
                                        <Button onClick={(e) => handleAddMachine(currentCollection?.id ?? 0)}
                                                className="gap-2 cursor-pointer">
                                            <Plus className="w-4 h-4"/>
                                            {t('collection.addMachine')}
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <div className="space-y-4">
                                    {machines.map((machine) => (
                                        <Card key={machine.id}
                                              className="group hover:shadow-md transition-all duration-200 p-0">
                                            <CardContent className="p-0">
                                                <div
                                                    className="grid grid-cols-1 lg:grid-cols-4 gap-0 h-full items-center">
                                                    {/* Left Section - Portrait Image */}
                                                    <div className="lg:col-span-1">
                                                        <div className="relative h-48 lg:h-full">
                                                            <PinballImageCarousel
                                                                machine={machine}
                                                                showActions={false}
                                                                className="overflow-hidden h-full"
                                                            />
                                                            <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                                                <Badge
                                                                    variant={machine.isForSale ? "default" : "secondary"}
                                                                    className="text-xs"
                                                                >
                                                                    {machine.isForSale ? "À vendre" : "Collection"}
                                                                </Badge>
                                                                {machine.maintenanceLogs && machine.maintenanceLogs.length > 0 && (
                                                                    <Badge variant="outline"
                                                                           className="text-xs gap-1 flex items-center bg-background/80">
                                                                        <Wrench className="w-3 h-3"/>
                                                                        {machine.maintenanceLogs.length}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Middle Section - Info and Features */}
                                                    <div className="lg:col-span-2 h-full p-2">
                                                        <div className=" flex flex-col justify-between h-full">
                                                            {/* Header Info */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div>
                                                                        <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                                                            {machine.name}
                                                                        </h4>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {machine.manufacturer} • {machine.year}
                                                                        </p>
                                                                    </div>
                                                                    {machine.isForSale && (
                                                                        <div className="text-right">
                                                                            <div
                                                                                className="text-lg font-bold text-primary">
                                                                                ${machine.price?.toLocaleString()}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground line-clamp-6">{machine.description}</p>
                                                            </div>

                                                            <div className="space-y-2 bg-muted/50 p-2 rounded-lg">
                                                                <div className="flex justify-content-between items-center">
                                                                    <div>
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {t(`sell.conditions.${machine.condition.toLowerCase().replace(/[-/\s]/g, "")}`)}
                                                                        </Badge>
                                                                    </div>
                                                                    {machine.isForSale && (
                                                                        <div className={'pl-2'}>
                                                                            <div
                                                                                className="flex items-center gap-1 text-xs text-foreground">
                                                                                <MapPin className="w-3 h-3"/>
                                                                                {machine.location.city}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="space-y-2 pt-2 border-t">
                                                                    {Object.values(machine.features).filter((feature) => feature).length == 0 && (<div
                                                                        className="text-xs font-medium text-muted-foreground">
                                                                        {t('collection.noPinballFeatures')}
                                                                    </div>)}
                                                                    <div
                                                                        className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                                                        {Object.entries(DefaultFeatures).map(([category, features]) => {
                                                                            const hasFeatures = Object.entries(features).some(([feature]) => machine.features[feature as keyof FeaturesType]);

                                                                            if (!hasFeatures) return null;

                                                                            return (
                                                                                <div key={category} className="mb-2">
                                                                                    <h4 className="font-semibold mb-2 capitalize">{t(`sell.${category}`)}</h4>
                                                                                    {Object.entries(features).length > 0 && !Object.entries(features).some(([feature]) => machine.features[feature as keyof FeaturesType]) ? (
                                                                                        <div
                                                                                            className="text-muted-foreground">{t('sell.noFeature')}</div>
                                                                                    ) : (
                                                                                        Object.entries(features).map(([feature]) => machine.features[feature as keyof FeaturesType] ? (
                                                                                                <div key={feature}
                                                                                                     className="flex items-center gap-2">
                                                                                                    <div
                                                                                                        className="w-2 h-2 bg-primary rounded-full"/>
                                                                                                    <span
                                                                                                        className="text-muted-foreground">
                                                                                                    {t(`sell.${feature}`)}
                                                                                                  </span>
                                                                                                </div>
                                                                                            ) : (<div key={feature}></div>)
                                                                                        )
                                                                                    )}

                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Section - Action Buttons */}
                                                    <div
                                                        className="lg:col-span-1 p-4 flex-col border-t lg:border-t-0 lg:border-l bg-muted/30 flex h-full justify-between">
                                                        {/* Top Section - Buttons */}
                                                        <div className="space-y-2">
                                                            {/* Edit Button */}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="gap-2 bg-background w-full justify-start cursor-pointer"
                                                                onClick={() => handleEdit(machine)}
                                                            >
                                                                <Edit className="w-4 h-4"/>
                                                                {t('collection.edit')}
                                                            </Button>

                                                            {/* Maintenance Button */}
                                                            <Dialog
                                                                open={maintenanceDialogOpen === machine.id}
                                                                onOpenChange={(open) => setMaintenanceDialogOpen(open ? machine.id : null)}
                                                            >
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="gap-2 bg-background w-full justify-start cursor-pointer"
                                                                        onClick={() => {

                                                                        }}
                                                                    >
                                                                        <Wrench className="w-4 h-4"/>
                                                                        {t('maintenance.quickAdd')}
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>
                                                                            {t('maintenance.quickAddTitle')}
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            {t('maintenance.quickAddDescription', {machine: machine.name})}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4 py-4">
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <Label
                                                                                    htmlFor="maintenance-date">{t('maintenance.date')}</Label>
                                                                                <Input
                                                                                    id="maintenance-date"
                                                                                    type="date"
                                                                                    value={maintenanceFormData.date}
                                                                                    onChange={(e) =>
                                                                                        setMaintenanceFormData({
                                                                                            ...maintenanceFormData,
                                                                                            date: e.target.value
                                                                                        })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="space-y-2">
                                                                                <Label
                                                                                    htmlFor="maintenance-type">{t('maintenance.type')}</Label>
                                                                                <Select
                                                                                    value={maintenanceFormData.type}
                                                                                    onValueChange={(value) =>
                                                                                        setMaintenanceFormData({
                                                                                            ...maintenanceFormData,
                                                                                            type: value as CreateMaintenanceEntryDto["type"],
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <SelectTrigger>
                                                                                        <SelectValue/>
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {Object.values(MaintenanceType).map((type) => (
                                                                                            <SelectItem key={type}
                                                                                                        value={type}>
                                                                                                {t(`maintenance.${type}.title`)}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <div
                                                                                className="flex items-center justify-between">
                                                                                <Label
                                                                                    htmlFor="maintenance-description">{t('maintenance.description')}</Label>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                                                                    className="text-xs text-primary hover:underline cursor-pointer"
                                                                                >
                                                                                    {showSuggestions ? t('maintenance.hideSuggestions') : t('maintenance.showSuggestions')}
                                                                                </button>
                                                                            </div>

                                                                            <Textarea
                                                                                id="maintenance-description"
                                                                                placeholder={t('maintenance.descriptionPlaceholder')}
                                                                                value={maintenanceFormData.description}
                                                                                onChange={(e) =>
                                                                                    setMaintenanceFormData({
                                                                                        ...maintenanceFormData,
                                                                                        description: e.target.value
                                                                                    })
                                                                                }
                                                                                rows={3}
                                                                            />

                                                                            {showSuggestions && currentSuggestions.length > 0 && (
                                                                                <div
                                                                                    className="border rounded-lg p-3 bg-muted space-y-2">
                                                                                    <p className="text-sm font-medium">{t('maintenance.suggestions')} :</p>
                                                                                    <div
                                                                                        className="flex flex-wrap gap-2">
                                                                                        {currentSuggestions.map((suggestion, index) => (
                                                                                            <button
                                                                                                key={index}
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    setMaintenanceFormData({
                                                                                                        ...maintenanceFormData,
                                                                                                        description: t(`maintenance.${maintenanceFormData.type}.suggestions.${suggestion}`),
                                                                                                    })
                                                                                                }
                                                                                                className="cursor-pointer text-xs px-2 py-1 bg-background border rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                                                                                            >
                                                                                                {t(`maintenance.${maintenanceFormData.type}.suggestions.${suggestion}`)}
                                                                                            </button>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div className="space-y-2">
                                                                                <Label
                                                                                    htmlFor="maintenance-cost">{t('maintenance.cost')}</Label>
                                                                                <Input
                                                                                    id="maintenance-cost"
                                                                                    type="number"
                                                                                    placeholder="0.00"
                                                                                    value={maintenanceFormData.cost || ""}
                                                                                    onChange={(e) =>
                                                                                        setMaintenanceFormData({
                                                                                            ...maintenanceFormData,
                                                                                            cost: e.target.value ? Number(e.target.value) : null,
                                                                                        })
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="space-y-2">
                                                                                <Label
                                                                                    htmlFor="maintenance-technician">{t('maintenance.replacedParts')}</Label>
                                                                                <Input
                                                                                    id="maintenance-technician"
                                                                                    placeholder={t('maintenance.replacedPartsPlaceholder')}
                                                                                    value={maintenanceFormData.parts?.join(", ") || ""}
                                                                                    onChange={(e) =>
                                                                                        setMaintenanceFormData({
                                                                                            ...maintenanceFormData,
                                                                                            parts: e.target.value
                                                                                                .split(",")
                                                                                                .map((p) => p.trim())
                                                                                                .filter((p) => p),
                                                                                        })
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <Label
                                                                                htmlFor="maintenance-notes">{t('maintenance.additionalNotes')}</Label>
                                                                            <Textarea
                                                                                id="maintenance-notes"
                                                                                placeholder=""
                                                                                value={maintenanceFormData.notes || ""}
                                                                                onChange={(e) =>
                                                                                    setMaintenanceFormData({
                                                                                        ...maintenanceFormData,
                                                                                        notes: e.target.value
                                                                                    })
                                                                                }
                                                                                rows={2}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <DialogFooter>
                                                                        <Button
                                                                            variant="outline"
                                                                            onClick={() => setMaintenanceDialogOpen(null)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            {t('cancel')}
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() => handleSubmitMaintenance(machine)}
                                                                            className="cursor-pointer">
                                                                            {t('add')}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                            {/* Sell Button */}
                                                            <Dialog
                                                                open={sellDialogOpen === machine.id}
                                                                onOpenChange={(open) => setSellDialogOpen(open ? machine.id : null)}
                                                            >
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="gap-2 bg-background w-full justify-start cursor-pointer"
                                                                        onClick={() => {
                                                                            if (machine.isForSale) {
                                                                                setCurrency(machine.currency?.toString());
                                                                                setSellPrice(machine.price.toString());
                                                                                setLocationQuery(machine.location?.city || "");

                                                                                setSelectedLocation({
                                                                                    city: machine.location?.city,
                                                                                    display_name: machine.location?.city,
                                                                                    lat: machine.location?.lat,
                                                                                    lon: machine.location?.lon
                                                                                })
                                                                                setSearchingLocation(false)
                                                                            }
                                                                        }}
                                                                    >
                                                                        <DollarSign className="w-4 h-4"/>
                                                                        {!machine.isForSale ? t('collection.sell') : t('collection.editSell')}
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>{t('collection.putSell')}
                                                                            {/*Mettre en vente*/}
                                                                        </DialogTitle>
                                                                        <DialogDescription>
                                                                            {t('collection.sellDescription', {machine: machine.name})}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="space-y-4 py-4">
                                                                        <div className="space-y-2">
                                                                            <Label
                                                                                htmlFor="sell-price">{t('collection.machine.price')} *</Label>
                                                                            <div className="flex gap-2">
                                                                                <Select
                                                                                    required={true}
                                                                                    value={currency}
                                                                                    onValueChange={(value) => setCurrency(value as string)}
                                                                                >
                                                                                    <SelectTrigger
                                                                                        className="w-[100px]">
                                                                                        <SelectValue
                                                                                            placeholder="Currency"/>
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {Object.entries(Currencies).map(([value, label]) => (
                                                                                            <SelectItem key={value}
                                                                                                        value={value}>{label}</SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <Input
                                                                                    id="sell-price"
                                                                                    type="number"
                                                                                    required={true}
                                                                                    placeholder="Ex: 5000"
                                                                                    value={sellPrice}
                                                                                    onChange={(e) => setSellPrice(e.target.value)}
                                                                                    className="flex-1"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label
                                                                                htmlFor="location-search">{t('collection.machine.locationCity')} *</Label>
                                                                            <InputCity
                                                                                onSelected={(location: QueryLocationResult | null) => setSelectedLocation(location)}
                                                                                presetLocation={selectedLocation}></InputCity>
                                                                        </div>
                                                                    </div>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            className={'cursor-pointer'}
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                setSellDialogOpen(null)
                                                                                setConfirmDelete(null)
                                                                            }}
                                                                        >
                                                                            {t('cancel')}

                                                                        </Button>
                                                                        {!machine.isForSale && (<Button
                                                                            className={'cursor-pointer'}
                                                                            onClick={() => handlePutForSale(machine.id)}
                                                                            disabled={!sellPrice || Number(sellPrice) <= 0}
                                                                        >
                                                                            {t('collection.sell')}
                                                                        </Button>)}
                                                                        {machine.isForSale && (
                                                                            <>
                                                                                <Button
                                                                                    className={'cursor-pointer'}
                                                                                    onClick={() => handleUpdateSale(machine.id)}
                                                                                    disabled={!sellPrice || Number(sellPrice) <= 0}
                                                                                >
                                                                                    {t('update')}
                                                                                </Button>
                                                                                <Button variant="destructive"
                                                                                        className="cursor-pointer"
                                                                                        onClick={() => {
                                                                                            if (!confirmDelete) {
                                                                                                setConfirmDelete(machine.id)
                                                                                                return;
                                                                                            }

                                                                                            handleDeleteSell(machine.id);
                                                                                        }}>
                                                                                    <PauseIcon
                                                                                        className="w-5 h-5"/> {confirmDelete == machine.id && (<>Confirm
                                                                                    ?</>)}
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>

                                                            {/*/!* Exchange Button *!/*/}
                                                            {/*<Dialog*/}
                                                            {/*    open={exchangeDialogOpen === machine.id}*/}
                                                            {/*    onOpenChange={(open) => setExchangeDialogOpen(open ? machine.id : null)}*/}
                                                            {/*>*/}
                                                            {/*    <DialogTrigger asChild>*/}
                                                            {/*        <Button*/}
                                                            {/*            size="sm"*/}
                                                            {/*            variant="outline"*/}
                                                            {/*            className="gap-2 bg-background w-full justify-start"*/}
                                                            {/*        >*/}
                                                            {/*            <Gift className="w-4 h-4"/>*/}
                                                            {/*            Échange*/}
                                                            {/*        </Button>*/}
                                                            {/*    </DialogTrigger>*/}
                                                            {/*    <DialogContent>*/}
                                                            {/*        <DialogHeader>*/}
                                                            {/*            <DialogTitle>Proposer à l'échange</DialogTitle>*/}
                                                            {/*            <DialogDescription>*/}
                                                            {/*                Mettez "{machine.name}" à disposition pour un*/}
                                                            {/*                échange.*/}
                                                            {/*            </DialogDescription>*/}
                                                            {/*        </DialogHeader>*/}
                                                            {/*        <div className="space-y-4 py-4">*/}
                                                            {/*            <div className="p-4 bg-muted rounded-lg">*/}
                                                            {/*                <p className="text-sm font-medium mb-2">Machine*/}
                                                            {/*                    proposée :</p>*/}
                                                            {/*                <p className="text-sm text-muted-foreground">{machine.name}</p>*/}
                                                            {/*            </div>*/}
                                                            {/*            <div className="space-y-2">*/}
                                                            {/*                <Label>Conditions d'échange</Label>*/}
                                                            {/*                <Textarea*/}
                                                            {/*                    placeholder="Décrivez ce que vous recherchez en échange..."*/}
                                                            {/*                    rows={3}/>*/}
                                                            {/*            </div>*/}
                                                            {/*        </div>*/}
                                                            {/*        <DialogFooter>*/}
                                                            {/*            <Button variant="outline"*/}
                                                            {/*                    onClick={() => setExchangeDialogOpen(null)}>*/}
                                                            {/*                Annuler*/}
                                                            {/*            </Button>*/}
                                                            {/*            <Button*/}
                                                            {/*                onClick={() => handleProposeExchange(machine.id)}>*/}
                                                            {/*                Proposer à l'échange*/}
                                                            {/*            </Button>*/}
                                                            {/*        </DialogFooter>*/}
                                                            {/*    </DialogContent>*/}
                                                            {/*</Dialog>*/}

                                                            {/*/!* Transfer Button *!/*/}
                                                            {/*<Dialog*/}
                                                            {/*    open={transferDialogOpen === machine.id}*/}
                                                            {/*    onOpenChange={(open) => setTransferDialogOpen(open ? machine.id : null)}*/}
                                                            {/*>*/}
                                                            {/*    <DialogTrigger asChild>*/}
                                                            {/*        <Button*/}
                                                            {/*            size="sm"*/}
                                                            {/*            variant="outline"*/}
                                                            {/*            className="gap-2 bg-background w-full justify-start"*/}
                                                            {/*        >*/}
                                                            {/*            <Share2 className="w-4 h-4"/>*/}
                                                            {/*            Transférer*/}
                                                            {/*        </Button>*/}
                                                            {/*    </DialogTrigger>*/}
                                                            {/*    <DialogContent>*/}
                                                            {/*        <DialogHeader>*/}
                                                            {/*            <DialogTitle>Transférer la machine</DialogTitle>*/}
                                                            {/*            <DialogDescription>*/}
                                                            {/*                Transférez la propriété de "{machine.name}" à*/}
                                                            {/*                quelqu'un d'autre.*/}
                                                            {/*            </DialogDescription>*/}
                                                            {/*        </DialogHeader>*/}
                                                            {/*        <div className="space-y-4 py-4">*/}
                                                            {/*            <div className="space-y-2">*/}
                                                            {/*                <Label htmlFor="transfer-email">Email du*/}
                                                            {/*                    destinataire</Label>*/}
                                                            {/*                <Input*/}
                                                            {/*                    id="transfer-email"*/}
                                                            {/*                    type="email"*/}
                                                            {/*                    placeholder="exemple@email.com"*/}
                                                            {/*                    value={transferEmail}*/}
                                                            {/*                    onChange={(e) => setTransferEmail(e.target.value)}*/}
                                                            {/*                />*/}
                                                            {/*            </div>*/}
                                                            {/*        </div>*/}
                                                            {/*        <DialogFooter>*/}
                                                            {/*            <Button*/}
                                                            {/*                variant="outline"*/}
                                                            {/*                onClick={() => {*/}
                                                            {/*                    setTransferDialogOpen(null)*/}
                                                            {/*                    setTransferEmail("")*/}
                                                            {/*                }}*/}
                                                            {/*            >*/}
                                                            {/*                Annuler*/}
                                                            {/*            </Button>*/}
                                                            {/*            <Button*/}
                                                            {/*                onClick={() => handleTransferMachine(machine.id)}>*/}
                                                            {/*                Envoyer l'invitation*/}
                                                            {/*            </Button>*/}
                                                            {/*        </DialogFooter>*/}
                                                            {/*    </DialogContent>*/}
                                                            {/*</Dialog>*/}

                                                            {/* Delete Button */}
                                                            <Dialog
                                                                open={deleteConfirm === machine.id}
                                                                onOpenChange={(open) => setDeleteConfirm(open ? machine.id : null)}
                                                            >
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="gap-2 bg-background w-full justify-start text-destructive hover:text-destructive cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-4 h-4"/>
                                                                        {t('collection.confirmDeleteDialog.remove')}
                                                                    </Button>
                                                                </DialogTrigger>

                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>{t('collection.confirmDeleteDialog.deleteCollection')}</DialogTitle>
                                                                        <DialogDescription>
                                                                            {t('collection.confirmDeleteDialog.confirm', {name: machine.name})}
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="outline"
                                                                                className="cursor-pointer"
                                                                                onClick={() => setDeleteConfirm(null)}>
                                                                            {t('collection.confirmDeleteDialog.cancel')}
                                                                        </Button>
                                                                        <Button variant="destructive"
                                                                                className="cursor-pointer"
                                                                                onClick={() => handleDelete(machine.id)}>
                                                                            {t('collection.confirmDeleteDialog.remove')}
                                                                        </Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                        <div
                                                            className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            {/* Bottom Section - Info */}
                                                            <div
                                                                className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div
                                                                                className="flex items-center gap-1 cursor-help">
                                                                                <Wrench className="w-4 h-4"/>
                                                                                <span>{machine.maintenanceLogs?.length || 0}</span>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('maintenance.count', {count: machine.maintenanceLogs?.length || 0})}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>

                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <div
                                                                                className="flex items-center gap-1 cursor-help">
                                                                                <List className="w-4 h-4"/>
                                                                                <span>{Object.values(machine.features).filter(Boolean).length}</span>
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{t('features.count', {count: Object.values(machine.features).filter(Boolean).length})}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}
