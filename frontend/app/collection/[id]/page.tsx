"use client"

import {useEffect, useState} from "react"
import {Calendar, Edit, Eye, Loader2, MapPin, Plus, Shield, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter} from "@/components/ui/card"
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
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {useApi} from "@/lib/api";
import {PinballDto} from "@/components/object/pinballDto";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {useToast} from "@/hooks/use-toast"
import {useAuth} from "@/lib/auth-context";
import {PinballImageCarousel} from "@/components/PinballImageCarousel";
import {useLanguage} from "@/lib/language-context";
import {useParams} from "next/navigation"
import {currencies} from "@/components/object/currencies";
import {Manufacturers} from "@/components/object/manufacturer";

interface LocationResult {
    display_name: string
    lat: string
    lon: string
    postcode: string
    county: string
    name: string
    address: {
        city?: string
        town?: string
        village?: string
        country?: string
    }
}

export default function MyCollectionPage() {
    const [collection, setCollection] = useState<PinballDto[]>([])
    const [editingMachine, setEditingMachine] = useState<any>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [sellDialogOpen, setSellDialogOpen] = useState<number | null>(null)
    const [sellPrice, setSellPrice] = useState("")
    const [currency, setCurrency] = useState("EUR")
    const {apiGet} = useApi();
    const {token} = useAuth();
    const [loading, setLoading] = useState(true)
    const {toast} = useToast()
    const {t} = useLanguage();
    const {id} = useParams()
    const {apiDelete, apiPost, apiPut} = useApi();
    const {user} = useAuth();

    const [locationQuery, setLocationQuery] = useState("")
    const [locationResults, setLocationResults] = useState<LocationResult[]>([])
    const [selectedLocation, setSelectedLocation] = useState<{
        city: string|null,
        display_name :string|null,
        lat: number|null,
        lon: number|null
    } | null>(null)
    const [searchingLocation, setSearchingLocation] = useState(false)

    const handleEdit = (machine: any) => {
        window.location.href = `/machine/${machine.id}`
    }

    const handleDelete = (id: number) => {
        apiDelete(`/api/machine/${id}`).then(data => {
            setCollection((prev) => prev.filter((machine) => machine.id !== id))
            setDeleteConfirm(null)
        });
    }

    const handleAddMachine = () => {
        window.location.href = `/collection/${id}/machine/`
    }

    const handleDeleteSell = (machineId:number) => {

    }

    const handleUpdateSale = (machineId:number) => {
        if (sellPrice && Number(sellPrice) > 0) {
            setCollection((prev) =>
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
                setCollection((prev) => prev.map((machine) => (machine.id === machineId ? data : machine)))

                toast({
                    title: t("success"),
                    description: t('collection.machineOnSalesUpdated'),
                    variant: "success",
                })
            })
        }
    }
    const handlePutForSale = (machineId: number) => {
        if (sellPrice && Number(sellPrice) > 0) {
            setCollection((prev) =>
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
                setCollection((prev) => prev.map((machine) => (machine.id === machineId ? data : machine)))

                toast({
                    title: t("success"),
                    description: t('collection.machineOnSales'),
                    variant: "success",
                })
            })
        }
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
                        "User-Agent": "CrazyPinball/1.0",
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

    useEffect(() => {
        if (!token) return;
        fetchCollection();
    }, [token]);

    const fetchCollection = async () => {
        try {
            setLoading(true)
            const result = await apiGet(`collection/${id}`)

            if (result) {
                setCollection(result)
            } else {
                throw new Error(result.error || "Failed to fetch collection")
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: `${t('collection.cantLoadMachines')}`,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary"/>
                    <p className="text-muted-foreground">{t('collection.loadingAll')}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Navbar/>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - User Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <Avatar className="w-24 h-24 mx-auto mb-4">
                                        <AvatarImage src={user?.avatar || "/placeholder.svg"}/>
                                        <AvatarFallback className="text-2xl">
                                            {user?.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                                        {user?.isVerified && <Shield className="w-5 h-5 text-primary"/>}
                                    </div>
                                    <p className="text-muted-foreground">@{user?.name}</p>
                                    {/*<div className="flex items-center justify-center gap-1 mt-2">*/}
                                    {/*    <Star className="w-4 h-4 fill-accent text-accent"/>*/}
                                    {/*    <span className="font-medium">{user?.rating}</span>*/}
                                    {/*    <span className="text-muted-foreground">({user?.reviewCount} avis)</span>*/}
                                    {/*</div>*/}
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-muted-foreground">{user?.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-muted-foreground">Membre depuis {user?.createdAt}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="text-center">
                                        <div
                                            className="text-2xl font-bold text-primary">{user?.numberOfMachine}</div>
                                        <div className="text-xs text-muted-foreground">Machines</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{user?.responseRate}%
                                        </div>
                                        <div className="text-xs text-muted-foreground">Taux de réponse</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground">{t('collection.myCollection')}</h3>
                                    <p className="text-muted-foreground">{t('collection.xMachinesInYourCollection', {count: collection.length}, collection.length)}</p>
                                </div>
                                <Button onClick={handleAddMachine} className="gap-2 cursor-pointer">
                                    <Plus className="w-4 h-4"/>
                                    {t('collection.add')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {collection.map((machine) => (
                                    <Card key={machine.id}
                                          className="group hover:shadow-lg transition-all duration-200"
                                          noPadding={true}>
                                        <div className="relative">
                                            <PinballImageCarousel
                                                machine={machine}
                                                showActions={false}
                                                className="rounded-t-lg overflow-hidden"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge variant={machine.isForSale ? "default" : "secondary"}
                                                       className="text-xs">
                                                    {machine.isForSale ? "À vendre" : "Collection"}
                                                </Badge>
                                            </div>
                                            {machine.isForSale && (
                                                <div className="absolute top-3 right-3">
                                                    <div
                                                        className="flex items-center gap-1 bg-background/90 rounded-full px-2 py-1 text-xs">
                                                        <Eye className="w-3 h-3"/>
                                                        {machine.views}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                    {machine.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {Manufacturers[machine.manufacturer]} • {machine.year}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="text-xs">
                                                        {machine.condition}
                                                    </Badge>
                                                    {machine.price > 0 && (
                                                        <>
                                                            <div
                                                                className="font-bold text-primary">
                                                                {currencies[machine.currency ?? 'EUR']}
                                                                {machine.price?.toLocaleString()}
                                                            </div>

                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{machine.description}</p>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <div className="flex gap-2 w-full">
                                                <Button size="sm" className="flex-1 gap-2 cursor-pointer"
                                                        onClick={() => handleEdit(machine)}>
                                                    <Edit className="w-4 h-4"/>
                                                    {t('collection.edit')}
                                                </Button>
                                                {(
                                                    // Replace the Button with destructive variant with this Dialog component
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                className="cursor-pointer"
                                                            >
                                                                <Trash2 className="w-5 h-5"/>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>{t('collection.deleteSell')}</DialogTitle>
                                                                <DialogDescription>
                                                                    {t('collection.confirmDeleteSell')}
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button 
                                                                    variant="outline" 
                                                                    onClick={() => {
                                                                        const dialogElement = document.querySelector('[role="dialog"]');
                                                                        if (dialogElement) {
                                                                            dialogElement.setAttribute('data-state', 'closed');
                                                                        }
                                                                    }}
                                                                >
                                                                    {t('cancel')}
                                                                </Button>
                                                                <Button 
                                                                    variant="destructive"
                                                                    onClick={() => {
                                                                        handleDeleteSell(machine.id);
                                                                        const dialogElement = document.querySelector('[role="dialog"]');
                                                                        if (dialogElement) {
                                                                            dialogElement.setAttribute('data-state', 'closed');
                                                                        }
                                                                    }}
                                                                >
                                                                    {t('delete')}
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}

                                                <Dialog
                                                    open={deleteConfirm === machine.id}
                                                    onOpenChange={(open) => setDeleteConfirm(open ? machine.id : null)}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="destructive"
                                                                className="cursor-pointer">
                                                            <Trash2 className="w-4 h-4"/>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Supprimer la machine</DialogTitle>
                                                            <DialogDescription>
                                                                Êtes-vous sûr de vouloir supprimer "{machine.name}" de
                                                                votre collection ? Cette action
                                                                ne peut pas être annulée.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button variant="outline"
                                                                    className="cursor-pointer"
                                                                    onClick={() => setDeleteConfirm(null)}>
                                                                {t('cancel')}
                                                            </Button>
                                                            <Button variant="destructive"
                                                                    className={'cursor-pointer'}
                                                                    onClick={() => handleDelete(machine.id)}>
                                                                {t('delete')}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer/>
        </div>
    )
}
