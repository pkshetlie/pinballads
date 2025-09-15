"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useApi} from "@/lib/api";

export default function MachineCollectionPage() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const { get, post } = useApi();


    const handleCreate = async (formData: MachineFormData) => {
        try {
            const data = await post("/api/collection/create", formData);
            const machineId = data.id;

            if (formData.images && formData.images.length > 0) {
                const formDataImage = new FormData();
                formData.images.forEach((file) => formDataImage.append("images", file));
                await fetch(`/api/machines/${machineId}/images`, { method: "POST", body: formDataImage });
            }

            setModalOpen(true);
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
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
