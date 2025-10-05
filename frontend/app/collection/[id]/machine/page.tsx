"use client";

import { useState } from "react";
import {useParams, useRouter} from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useApi} from "@/lib/api";
import {toast} from "@/components/ui/use-toast";
import {useLanguage} from "@/lib/language-context";

export default function MachineCollectionPage() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const { apiGet, apiPost } = useApi();
    const { id } = useParams()
    const { t } = useLanguage()

    const handleCreate = async (formData: MachineFormData) => {
        try {
            const data = await apiPost(`/api/collection/${id}/machine`, formData);
            const machineId = data.id;
            await apiPost(`/api/machine/${machineId}/images`, formData);

        } catch (error) {
            console.error(error);
            toast({
                title: t('toasts.success'),
                description: t('collection.toasts.collectionCreated'),
                variant: "success",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-2">Ajouter un flipper</h1>
                <p className="text-muted-foreground mb-8">Remplissez le formulaire pour ajouter votre machine à la collection.</p>

                <MachineForm onSubmit={handleCreate} />

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
