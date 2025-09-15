"use client"

import {useEffect, useState} from "react"
import {Calendar, DollarSign, Edit, Eye, Loader2, MapPin, Plus, Shield, Star, Trash2} from "lucide-react"
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
import {Textarea} from "@/components/ui/textarea"
import {useApi} from "@/lib/api";
import {PinballDto} from "@/components/Object/pinball";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {useToast} from "@/hooks/use-toast"
import {useAuth} from "@/lib/auth-context";
import {PinballImageCarousel} from "@/components/PinballImageCarousel";
import {useLanguage} from "@/lib/language-context";

// Mock user data
const user = {
    name: "Mike Johnson",
    username: "mikej_pinball",
    avatar: "/seller-avatar.jpg",
    location: "Los Angeles, CA",
    memberSince: "2019",
    verified: true,
    rating: 5,
    reviewCount: 0,
    stats: {
        machinesOwned: 0,
        totalViews: 0,
        responseRate: 100,
    },
}

export default function MyCollectionPage() {
    const [collection, setCollection] = useState<PinballDto[]>([])
    const [editingMachine, setEditingMachine] = useState<any>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [sellDialogOpen, setSellDialogOpen] = useState<number | null>(null)
    const [sellPrice, setSellPrice] = useState("")
    const {get} = useApi();
    const {token} = useAuth();
    const [loading, setLoading] = useState(true)
    const {toast} = useToast()
    const {t} = useLanguage()

    const handleEdit = (machine: any) => {
        window.location.href = `/collection/${machine.id}`
    }

    const handleSaveEdit = () => {
        if (editingMachine) {
            setCollection((prev) => prev.map((machine) => (machine.id === editingMachine.id ? editingMachine : machine)))
            setIsEditDialogOpen(false)
            setEditingMachine(null)
        }
    }

    const handleDelete = (id: number) => {
        setCollection((prev) => prev.filter((machine) => machine.id !== id))
        setDeleteConfirm(null)
    }

    const handleAddMachine = () => {
        window.location.href = "/sell"
    }

    const handlePutForSale = (machineId: number) => {
        if (sellPrice && Number(sellPrice) > 0) {
            setCollection((prev) =>
                prev.map((machine) =>
                    machine.id === machineId ? {...machine, status: "For Sale", price: Number(sellPrice)} : machine,
                ),
            )
            setSellDialogOpen(null)
            setSellPrice("")
        }
    }

    useEffect(() => {
        if (!token) return; // ⬅️ attendre que le token soit dispo
        fetchCollection();
    }, [token]);

    const fetchCollection = async () => {
        try {
            setLoading(true)
            const result = await get("collection/all")

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
                                        <div
                                            className="text-2xl font-bold text-primary">{user.stats.machinesOwned}</div>
                                        <div className="text-xs text-muted-foreground">Machines</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{user.stats.totalViews}</div>
                                        <div className="text-xs text-muted-foreground">Vues totales</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{user.stats.responseRate}%
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
                                <Button onClick={handleAddMachine} className="gap-2">
                                    <Plus className="w-4 h-4"/>
                                    {t('collection.add')}
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {collection.map((machine) => (
                                    <Card key={machine.id}
                                          className="group hover:shadow-lg transition-all duration-200">
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
                                                    {machine.manufacturer} • {machine.year}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <Badge variant="outline" className="text-xs">
                                                        {machine.condition}
                                                    </Badge>
                                                    {machine.price > 0 && (
                                                        <span
                                                            className="font-bold text-primary">{machine.devise}{machine.price?.toLocaleString()}</span>
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
                                                {!machine.isForSale && (
                                                    <Dialog
                                                        open={sellDialogOpen === machine.id}
                                                        onOpenChange={(open) => setSellDialogOpen(open ? machine.id : null)}
                                                    >
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" variant="outline"
                                                                    className="gap-2 bg-transparent cursor-pointer">
                                                                {t('collection.sell')}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Mettre en vente</DialogTitle>
                                                                <DialogDescription>
                                                                    Définissez le prix de vente pour "{machine.name}".
                                                                    Cette machine sera visible dans
                                                                    les annonces publiques.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="space-y-2">
                                                                    <Label
                                                                        htmlFor="sell-price">{t('pinball.price')}</Label>
                                                                    <div className="flex gap-2">
                                                                        <Select
                                                                            defaultValue="EUR"
                                                                            onValueChange={(value) => setCurrency(value)}
                                                                        >
                                                                            <SelectTrigger className="w-[100px]">
                                                                                <SelectValue placeholder="Currency"/>
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="EUR">€ EUR</SelectItem>
                                                                                <SelectItem value="USD">$ USD</SelectItem>
                                                                                <SelectItem value="GBP">£ GBP</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <Input
                                                                            id="sell-price"
                                                                            type="number"
                                                                            placeholder="Ex: 5000"
                                                                            value={sellPrice}
                                                                            onChange={(e) => setSellPrice(e.target.value)}
                                                                            className="flex-1"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setSellDialogOpen(null)
                                                                        setSellPrice("")
                                                                    }}
                                                                >
                                                                    Annuler
                                                                </Button>
                                                                <Button
                                                                    onClick={() => handlePutForSale(machine.id)}
                                                                    disabled={!sellPrice || Number(sellPrice) <= 0}
                                                                >
                                                                    {t('collection.sell')}
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
                                                        <Button size="sm" variant="destructive" className="cursor-pointer">
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
                                                                    onClick={() => setDeleteConfirm(null)}>
                                                                Annuler
                                                            </Button>
                                                            <Button variant="destructive"
                                                                    onClick={() => handleDelete(machine.id)}>
                                                                Supprimer
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Éditer la machine</DialogTitle>
                        <DialogDescription>Modifiez les informations de votre machine pinball.</DialogDescription>
                    </DialogHeader>
                    {editingMachine && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titre</Label>
                                    <Input
                                        id="title"
                                        value={editingMachine.title}
                                        onChange={(e) => setEditingMachine({...editingMachine, title: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="manufacturer">Fabricant</Label>
                                    <Input
                                        id="manufacturer"
                                        value={editingMachine.manufacturer}
                                        onChange={(e) => setEditingMachine({
                                            ...editingMachine,
                                            manufacturer: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="year">Année</Label>
                                    <Input
                                        id="year"
                                        type="number"
                                        value={editingMachine.year}
                                        onChange={(e) => setEditingMachine({
                                            ...editingMachine,
                                            year: Number.parseInt(e.target.value)
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="condition">État</Label>
                                    <Select
                                        value={editingMachine.condition}
                                        onValueChange={(value) => setEditingMachine({
                                            ...editingMachine,
                                            condition: value
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Excellent">Excellent</SelectItem>
                                            <SelectItem value="Very Good">Très bon</SelectItem>
                                            <SelectItem value="Good">Bon</SelectItem>
                                            <SelectItem value="Fair">Correct</SelectItem>
                                            <SelectItem value="Poor">Mauvais</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Statut</Label>
                                    <Select
                                        value={editingMachine.status}
                                        onValueChange={(value) => setEditingMachine({...editingMachine, status: value})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Collection">Collection</SelectItem>
                                            <SelectItem value="For Sale">À vendre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {editingMachine.status === "For Sale" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Prix ($)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={editingMachine.price || ""}
                                            onChange={(e) =>
                                                setEditingMachine({
                                                    ...editingMachine,
                                                    price: Number.parseInt(e.target.value) || null
                                                })
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={editingMachine.description}
                                    onChange={(e) => setEditingMachine({
                                        ...editingMachine,
                                        description: e.target.value
                                    })}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleSaveEdit}>Sauvegarder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Footer */}
            <Footer/>
        </div>
    )
}
