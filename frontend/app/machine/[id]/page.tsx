"use client"

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {ArrowLeft, Shield} from "lucide-react";

import {useApi} from "@/lib/api";
import Navbar from "@/components/Navbar";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {PinballDto} from "@/components/object/PinballDto";
import MachineForm, {MachineFormData} from "@/components/PinballMachineForm";
import {useLanguage} from "@/lib/language-context";
import {useAuth} from "@/lib/auth-context";
import {useToast} from "@/hooks/use-toast"
import imageCompression from "browser-image-compression";
import Footer from "@/components/Footer";
import {MaintenanceLogForm} from "@/components/MaintenanceLogForm";
import {MaintenanceEntry} from "@/components/object/MaintenanceDto";

export default function EditMachinePage() {
    const params = useParams();
    const router = useRouter();
    const { apiGet, apiPost, apiPut } = useApi();
    const { t } = useLanguage();
    const [pinball, setPinball] = useState<PinballDto>();
    const {token} = useAuth();
    const {toast} = useToast();
    const [entries, setEntries] = useState<MaintenanceEntry[]>([]);
    const [progressOpen, setProgressOpen] = useState(false);
    const [progress, setProgress] = useState<'data' | 'images' | 'success' | 'error'>('data');
    const machineId = params.id;

    useEffect(() => {
        if (!token) return;
        if (!machineId) return;

        apiGet(`/api/machine/${machineId}`)
            .then(data => setPinball(data))
            .catch((err) => console.error("Erreur lors du chargement de la machine :", err));
    }, [machineId, token]);

    useEffect(() => {
        setEntries(pinball?.maintenanceLogs || []);
    }, [pinball]);


    const handleUpdate = async (formData: MachineFormData) => {
        const formDataImage = new FormData();
        const images = formData.images;
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes

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
        formData.maintenanceLogs = entries || [];

        // If all images are valid, proceed with appending the
        try {
            await apiPut(`/api/machine/${machineId}`, formData).then(data => {

            });
            try{

                setProgress('images');

                for (const image of images || []) {
                    let file = image.file;
                    if (file.size > maxSize) {
                        // Paramètres de compression
                        const options = {
                            maxSizeMB: 2, // force <2 Mo
                            maxWidthOrHeight: 1920, // redimensionne si besoin
                            useWebWorker: true,
                        };

                        file = await imageCompression(file, options);

                        toast({
                            title: t('collection.toasts.imageCompressedTitle'),
                            description: t('collection.toasts.resizeBeforeSending', {title:image.title}),
                            variant: 'success',
                        });
                    }

                    formDataImage.append("images[]", file);
                    formDataImage.append("titles[]", image.title);
                    formDataImage.append("uids[]", image.uid);
                }


                await apiPost(`/api/machine/${machineId}/images`, formDataImage).then(data => {
                    setProgress('success');
                    // window.location.;
                });
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

    const handleAddMaintenanceEntry = async (entry: MaintenanceEntry) => {
        try {
            pinball.maintenanceLogs = [...pinball.maintenanceLogs, entry];
            setPinball(pinball);
            setEntries(pinball.maintenanceLogs);

        } catch (error) {
            toast({
                title: t("Error"),
                description: "Impossible d'enregistrer l'entrée d'entretien.",
                variant: "destructive",
            })
        }
    }

    const handleDeleteMaintenanceEntry = (formEntry: MaintenanceEntry) => {

        pinball.maintenanceLogs = pinball.maintenanceLogs.filter((entry) => entry !== formEntry);
        setPinball(pinball);
        setEntries(pinball.maintenanceLogs);

    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar/>

            <div className="container mx-auto"> {/* Ajout du container pour les marges */}
                <div className="flex flex-col lg:flex-row"> {/* Flex column par défaut, row sur grand écran */}
                    {/* Partie gauche */}
                    <div className="w-full lg:w-2/3 px-4 py-8"> {/* Full width par défaut, 2/3 sur grand écran */}
                        <Button
                            variant="ghost"
                            className="mb-4 cursor-pointer"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2"/>
                            {t('back')}
                        </Button>
                        <h1 className="text-3xl font-bold mb-6">{t('collection.editMachine')}</h1>
                        <MachineForm initialData={pinball} onSubmit={handleUpdate}
                                     buttonText={t('collection.updateMachine')}/>

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
                    </div>

                    {/* Partie droite */}
                    <div className="w-full lg:w-1/3 px-4 py-8"> {/* Full width par défaut, 1/3 sur grand écran */}
                        <div className="border-t lg:border-t-0 pt-4 mt-4 lg:mt-0">
                            <h3 className="font-semibold text-lg mb-4">{t('maintenance.maintenanceLog')}</h3>
                            <MaintenanceLogForm
                                machine={pinball}
                                entries={entries || []}
                                onAddEntry={(entry) => handleAddMaintenanceEntry(entry)}
                                onDeleteEntry={handleDeleteMaintenanceEntry}
                            />
                        </div>
                    </div>
                </div>
            </div>
        
            <Footer></Footer>
        </div>
    );
}
