"use client";

import { useState } from "react";
import {useParams, useRouter} from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useApi} from "@/lib/api";
import {useLanguage} from "@/lib/language-context";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {useToast} from "@/hooks/use-toast"
import {Footer} from "react-day-picker";

export default function MachineCollectionPage() {
    const router = useRouter();
    const [progressOpen, setProgressOpen] = useState(false);
    const [progress, setProgress] = useState<'data' | 'images' | 'success' | 'error'>('data');
    const { apiPost } = useApi();
    const { id } = useParams()
    const { t } = useLanguage()
    const { toast } = useToast()

    const handleCreate = async (formData: MachineFormData) => {
        try {
            if(!formData.opdbId){
                toast({
                    title: t('toasts.error'),
                    description: t('collection.toasts.chooseAMachineInList'),
                    variant: "destructive",
                });
                return;
            }
            setProgressOpen(true);
            setProgress('data');

            await apiPost(`/api/collection/${id}/machine`, formData).then((data) => {
                const machineId = data.id;
                const images = formData.images;

                if(images.length === 0) {
                    setTimeout(function () {
                        window.location.href = `/collection`;
                    }, 500)
                }
                

                const formDataImage = new FormData();

                images?.forEach((image) => {
                    formDataImage.append("images[]", image.file)
                    formDataImage.append("titles[]", image.title)
                    formDataImage.append("uids[]", image.uid)
                });

                setProgress('images');
                apiPost(`/api/machine/${machineId}/images`, formDataImage).then(() => {
                    setProgress('success');
                    setTimeout(function () {
                        window.location.href = `/collection`;
                    }, 500)
                });
            });


        } catch (error) {
            toast({
                title: t('toasts.error'),
                description: error instanceof Error ? error.message : t('collection.toasts.machineCreationError'),
                variant: "destructive",
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

                <Dialog open={progressOpen} onOpenChange={setProgressOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('collection.progress.title')}</DialogTitle>
                            <DialogDescription>
                                {progress === 'data' && t('collection.progress.savingData')}
                                {progress === 'images' && t('collection.progress.uploadingImages')}
                                {progress === 'success' && t('collection.progress.success')}
                                {progress === 'error' && t('collection.progress.error')}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </main>
            <Footer></Footer>
        </div>
    );
}
