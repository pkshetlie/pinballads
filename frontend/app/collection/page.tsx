"use client"

import {useEffect, useState} from "react"
import {Calendar, Edit, Folder, Loader2, Plus, Settings, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
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
import Navbar from "@/components/Navbar"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {useToast} from "@/hooks/use-toast"
import Link from "next/link"
import {useApi} from "@/lib/api";
import {useAuth} from "@/lib/auth-context";
import {useLanguage} from "@/lib/language-context";
import Footer from "@/components/Footer";

interface Collection {
    id: number
    name: string
    description: string
    isPublic: boolean,
    isDefault: boolean,
    createdAt: string
    machineCount: number
}

export default function CollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
    const [editError, setEditError] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [newCollection, setNewCollection] = useState({name: "", description: "", isPublic: false})
    const {t} = useLanguage()
    const {toast} = useToast()
    const {apiGet, apiPost, apiPut, apiDelete} = useApi()
    const {user, token, logout} = useAuth();

    useEffect(() => {
        if (!token && !user) return;
        fetchCollections();
    }, [token, user])

    const fetchCollections = async () => {
        try {
            setLoading(true)
            const response = await apiGet("/api/collections")
            setCollections(response)
        } catch (error) {
            toast({
                title: t('toasts.error'),
                description: t('collection.toasts.cantLoadCollections'),
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateCollection = async () => {
        if (!newCollection.name.trim()) return

        try {
            setCreating(true)
            setCreateError(null)
            const response = await apiPost("/api/collections", newCollection)

            setCollections((prev) => [...prev, response])
            setIsCreateDialogOpen(false)
            setNewCollection({name: "", description: "", isPublic: false})
            toast({
                title: t('toasts.success'),
                description: t('collection.toasts.collectionCreated'),
                variant: "success",
            });
        } catch (error) {
            setCreateError(error instanceof Error ? error.message : t("toasts.unknownError"))
        } finally {
            setCreating(false)
        }
    }

    const handleEditCollection = (collection: Collection) => {
        setEditingCollection({...collection})
        setIsEditDialogOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingCollection) return

        try {
            setEditError(null)
            const response = await apiPut(`/api/collections/${editingCollection.id}`, editingCollection)

                setCollections((prev) => prev.map((c) => (c.id === editingCollection.id ? response : c)))
                setIsEditDialogOpen(false)
                setEditingCollection(null)
            toast({
                title: t('toasts.success'),
                description: t('collection.toasts.collectionUpdated'),
                variant: "success",
            });
        } catch (error) {
            setEditError(error instanceof Error ? error.message : t("toasts.unknownError"))
        }
    }

    const handleDeleteCollection = async (id: number) => {
        try {
            await apiDelete(`/api/collections/${id}`)

            setCollections((prev) => prev.filter((c) => c.id !== id))
            setDeleteConfirm(null)
            toast({
                title: t("toasts.success"),
                description: t('collection.toasts.collectionDeleted'),
                variant: "success",
            })

        } catch (error) {
            toast({
                title: t("toasts.error"),
                description: error instanceof Error ? error.message : t("toasts.unknownError"),
                variant: "destructive",
            })
            setCreateError(null)
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
            <Navbar/>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - User Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <Avatar className="w-24 h-24 mx-auto mb-4">
                                        <AvatarImage src={user?.avatar ?? "/placeholder.svg"}/>
                                        <AvatarFallback className="text-2xl">
                                            {user?.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <h2 className="text-xl font-bold text-foreground mb-2">{user?.name}</h2>
                                    {/*<p className="text-muted-foreground">@{user.name}</p>*/}
                                </div>

                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{collections.length}</div>
                                        <div className="text-xs text-muted-foreground">{t('collection.collections')}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            {collections.reduce((sum, c) => sum + c.machineCount, 0)}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{t('collection.totalMachines')}</div>
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
                                    <h3 className="text-2xl font-bold text-foreground">{t('collection.myCollections')}</h3>
                                    <p className="text-muted-foreground">{t('collection.organizeMachinesInCollection')}</p>
                                </div>
                                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="gap-2">
                                            <Plus className="w-4 h-4"/>
                                            {t('collection.createEditDialog.newCollection')}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                {t('collection.createEditDialog.createANewCollection')}
                                            </DialogTitle>
                                            <DialogDescription>
                                                {t('collection.createEditDialog.organizeYourMachinesInCollection')}
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="collection-name">
                                                    {t('collection.createEditDialog.collectionNameLabel')}
                                                    *</Label>
                                                {createError && (
                                                    <p className="text-sm text-destructive">{createError}</p>
                                                )}
                                                <Input
                                                    id="collection-name"
                                                    placeholder="Ex: Machines Williams, Collection Vintage..."
                                                    value={newCollection.name}
                                                    onChange={(e) => setNewCollection({
                                                        ...newCollection,
                                                        name: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="collection-description">
                                                    {t('collection.createEditDialog.descriptionLabel')}
                                                </Label>
                                                <Textarea
                                                    id="collection-description"
                                                    placeholder="Décrivez votre collection..."
                                                    value={newCollection.description}
                                                    onChange={(e) => setNewCollection({
                                                        ...newCollection,
                                                        description: e.target.value
                                                    })}
                                                    rows={3}
                                                />
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="edit-isPublic"
                                                    checked={newCollection.isPublic}
                                                    onChange={(e) => setNewCollection({
                                                        ...newCollection,
                                                        isPublic: e.target.checked
                                                    })}
                                                    className="h-4 w-4 rounded border-gray-300"
                                                />
                                                <Label htmlFor="edit-isPublic">
                                                    {t('collection.createEditDialog.setPublicLabel')}
                                                </Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                className="cursor"
                                                onClick={() => {
                                                    setIsCreateDialogOpen(false)
                                                    setNewCollection({name: "", description: "", isPublic: false})
                                                }}
                                                disabled={creating}
                                            >
                                                Annuler
                                            </Button>
                                            <Button className="cursor"
                                                    onClick={handleCreateCollection}
                                                    disabled={!newCollection.name.trim() || creating}>
                                                {creating ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2"/>
                                                        {t('collection.createEditDialog.creating')}
                                                    </>
                                                ) : (
                                                    "Créer"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {collections.length === 0 ? (
                                <></>
                                // <Card className="p-12 text-center">
                                //     <div className="text-muted-foreground">
                                //         <Folder className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50"/>
                                //         <p className="text-lg mb-2">Aucune collection trouvée</p>
                                //         <p className="text-sm mb-4">Créez votre première collection pour organiser vos
                                //             machines</p>
                                //         <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                                //             <Plus className="w-4 h-4"/>
                                //             Créer une collection
                                //         </Button>
                                //     </div>
                                // </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {collections.map((collection) => (
                                        <Card key={collection.id}
                                              className="group hover:shadow-lg transition-all duration-200">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            <Folder className="w-6 h-6 text-primary"/>
                                                        </div>
                                                        <div>
                                                            <CardTitle
                                                                className="text-lg group-hover:text-primary transition-colors">
                                                                {collection.name}
                                                            </CardTitle>
                                                            {collection.isDefault && (
                                                                <Badge variant="secondary" className="text-xs mt-1 mr-1">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                            {collection.isPublic && (
                                                                <Badge variant="default" className="text-xs mt-1">
                                                                    Public
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-3">
                                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                    {collection.description || "..."}
                                                </p>
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Settings className="w-4 h-4"/>
                                                        <span>
                                                            {t('collection.xMachines', {count: collection.machineCount}, collection.machineCount)}
                                                            </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-muted-foreground">
                                                        <Calendar className="w-4 h-4"/>
                                                        <span>{new Date(collection.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <div className="flex gap-2 w-full">
                                                    <Button asChild size="sm" className="flex-1">
                                                        <Link href={`/collection/${collection.id}`}>{t('collection.see')}</Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-2 bg-transparent cursor-pointer"
                                                        onClick={() => handleEditCollection(collection)}
                                                    >
                                                        <Edit className="w-4 h-4"/>
                                                    </Button>
                                                    {collection.isDefault ? <></> : (
                                                        <Dialog
                                                            open={deleteConfirm === collection.id}
                                                            onOpenChange={(open) => setDeleteConfirm(open ? collection.id : null)}
                                                        >
                                                            <DialogTrigger asChild>
                                                                <Button size="sm" variant="destructive" className={'cursor-pointer'}>
                                                                    <Trash2 className="w-4 h-4"/>
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>{t('collection.confirmDeleteDialog.deleteCollection')}</DialogTitle>
                                                                    <DialogDescription>
                                                                        {t('collection.confirmDeleteDialog.confirm',{name: collection.name})}
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
                                                                            onClick={() => handleDeleteCollection(collection.id)}>
                                                                        {t('collection.confirmDeleteDialog.remove')}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    )}
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('collection.createEditDialog.editCollection')}</DialogTitle>
                        <DialogDescription>{t('collection.createEditDialog.editCollectionDetails')}</DialogDescription>
                    </DialogHeader>
                    {editingCollection && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">{t('collection.createEditDialog.collectionNameLabel')}*</Label>
                                {editError && (
                                    <p className="text-sm text-destructive">{editError}</p>
                                )}
                                <Input
                                    id="edit-name"
                                    value={editingCollection.name}
                                    onChange={(e) => setEditingCollection({
                                        ...editingCollection,
                                        name: e.target.value
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">{t('collection.createEditDialog.descriptionLabel')}</Label>
                                <Textarea
                                    id="edit-description"
                                    value={editingCollection.description}
                                    onChange={(e) => setEditingCollection({
                                        ...editingCollection,
                                        description: e.target.value
                                    })}
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="edit-isPublic"
                                    checked={editingCollection.isPublic}
                                    onChange={(e) => setEditingCollection({
                                        ...editingCollection,
                                        isPublic: e.target.checked
                                    })}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="edit-isPublic">{t('collection.createEditDialog.setPublicLabel')}</Label>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button className="cursor-pointer"
                                variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            {t('collection.createEditDialog.cancel')}
                        </Button>
                        <Button
                            className="cursor-pointer"
                            onClick={handleSaveEdit}>{t('collection.createEditDialog.save')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Footer></Footer>
        </div>
    )
}
