"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {PinballDto} from "@/components/Object/pinball";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useLanguage} from "@/lib/language-context";
import {useAuth} from "@/lib/auth-context";

export default function EditMachinePage() {
    const params = useParams();
    const router = useRouter();
    const { get, post } = useApi();
    const { t } = useLanguage();
    const [machineData, setMachineData] = useState<PinballDto | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [pinball, setPinball] = useState<PinballDto>();
    const {token} = useAuth();

    const machineId = params.id;

    useEffect(() => {
        if (!token) return;
        if (!machineId) return;

        get(`/api/collection/${machineId}`)
            .then(data => setPinball(data))
            .catch((err) => console.error("Erreur lors du chargement de la machine :", err));
    }, [machineId, token]);

    const handleUpdate = async (formData: MachineFormData) => {
        try {
            await post(`/api/collection/${machineId}/update`, formData);

            if (formData.images && formData.images.length > 0) {
                const formDataImage = new FormData();
                formData.images.forEach((file) => formDataImage.append("images[]", file));
                await fetch(`/api/machines/${machineId}/images`, { method: "POST", body: formDataImage });
            }

            setModalOpen(true);
        } catch (error) {
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
                <h1 className="text-3xl font-bold mb-6">{t('collection.editMachine')}</h1>
                <MachineForm initialData={pinball} onSubmit={handleUpdate} />

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
