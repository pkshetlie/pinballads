"use client";

import { useState } from "react";
import {useParams, useRouter} from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useApi} from "@/lib/api";
import {toast} from "@/components/ui/use-toast";
import {useLanguage} from "@/lib/language-context";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useToast} from "@/hooks/use-toast"

export default function MachineCollectionPage() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const { apiGet, apiPost } = useApi();
    const { id } = useParams()
    const { t } = useLanguage()
    const { toast } = useToast()

    const handleCreate = async (formData: MachineFormData) => {
        try {
            const data = await apiPost(`/api/collection/${id}/machine`, formData).then((data) => {
                toast({
                    title: t('toasts.success'),
                    description: t('collection.toasts.machineCreated'),
                    variant: "success",
                });

                const machineId = data.id;
                if(formData.images.length === 0) {
                    setTimeout(function(){
                        toast({
                            title: t('toasts.success'),
                            description: t('collection.toasts.machineCreated'),
                            variant: "success",
                        });
                        window.location.href = `/collection/${id}`;
                    },5000)
                }
                const images = formData.images;

                const formDataImage = new FormData();
                images?.forEach((image) => {
                    formDataImage.append("images[]", image.file)
                    formDataImage.append("titles[]", image.title)
                    formDataImage.append("uids[]", image.uid)
                });
                apiPost(`/api/machine/${machineId}/images`, formDataImage).then(data => {
                    setTimeout(function(){
                        window.location.href = `/collection/${id}`;
                    },5000)
                });



            });


        } catch (error) {
            toast({
                title: t('toasts.error'),
                description: error instanceof Error ? error.message : t('collection.toasts.machineCreationError'),
                variant: "success",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    className="mb-4 cursor-pointer"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    {t('back')}
                </Button>
                <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter un flipper</h1>
                <p className="text-muted-foreground mb-8">Remplissez le formulaire pour ajouter votre machine à la collection.</p>

                <MachineForm onSubmit={handleCreate} buttonText={t('collection.addMachine')}/>

                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Flipper ajouté !</DialogTitle>
                            <DialogDescription>Votre flipper a été ajouté à la collection avec succès.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <button
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                                onClick={() => router.push("/collection/all")}
                            >
                                OK
                            </button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
