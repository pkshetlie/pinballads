"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {ArrowLeft} from "lucide-react";

import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {PinballDto} from "@/components/object/pinballDto";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useLanguage} from "@/lib/language-context";
import {useAuth} from "@/lib/auth-context";
import {useToast} from "@/hooks/use-toast"

export default function EditMachinePage() {
    const params = useParams();
    const router = useRouter();
    const { apiGet, apiPost, apiPut } = useApi();
    const { t } = useLanguage();
    const [modalOpen, setModalOpen] = useState(false);
    const [pinball, setPinball] = useState<PinballDto>();
    const {token} = useAuth();
    const {toast} = useToast();

    const machineId = params.id;

    useEffect(() => {
        if (!token) return;
        if (!machineId) return;

        apiGet(`/api/machine/${machineId}`)
            .then(data => setPinball(data))
            .catch((err) => console.error("Erreur lors du chargement de la machine :", err));
    }, [machineId, token]);


    const handleUpdate = async (formData: MachineFormData) => {
        const formDataImage = new FormData();
        const images = formData.images;
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes

        // Check image sizes first
        for (const image of images || []) {
            if (image.file.size > maxSize) {
                toast({
                    title: t('toasts.error'),
                    description: `${t('collection.toasts.imageTooLarge')} "${image.title}" (${(image.file.size / (1024 * 1024)).toFixed(2)}MB), ${t('collection.toasts.imageTooLargeDescription')}.`,
                    variant: 'destructive',
                });
                return; // Stop the process if any image is too large
            }
        }

        // If all images are valid, proceed with appending them
        images?.forEach((image) => {
            formDataImage.append("images[]", image.file)
            formDataImage.append("titles[]", image.title)
            formDataImage.append("uids[]", image.uid)
        });
        try {
            await apiPut(`/api/machine/${machineId}`, formData).then(data => {

            });


        } catch (error) {
            toast({
                title: t('toasts.error'),
                description: error instanceof Error ? error.message : t('collection.toasts.machineUpdateError'),
                variant: 'destructive',
            });
        }
            try{
              
            await apiPost(`/api/machine/${machineId}/images`, formDataImage);
            toast({
                title: t('toasts.success'),
                description: t('collection.toasts.machineUpdated'),
                variant: "success",
            });

        } catch (error) {
            toast({
                title: t('toasts.error'),
                description: error instanceof Error ? error.message : t('collection.toasts.machineUpdateError'),
                variant: 'destructive',
            });
        }
    };

    if (!pinball) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {t('collection.loadingMachine')}
            </div>
        );
    }

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
                <h1 className="text-3xl font-bold mb-6">{t('collection.editMachine')}</h1>
                <MachineForm initialData={pinball} onSubmit={handleUpdate} buttonText={t('collection.updateMachine')}/>

                <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Machine mise à jour !</DialogTitle>
                            <DialogDescription>
                                La machine a été mise à jour avec succès.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={() => router.push("/collection/all")}>
                                OK
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
