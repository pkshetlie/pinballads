import {FeaturesType} from "@/components/object/Features";
import {PublicUserDto} from "@/components/object/PublicUserDto";
import {MaintenanceEntry} from "@/components/object/MaintenanceDto";
import {UploadedImageResult} from "@/components/object/UploadedImageResult";

export type PinballDto = {
    rating: number;
    distance: number;
    devise: string;
    price: number;
    views: number;
    isForSale: boolean;
    id: number;
    name: string;
    opdbId: string;
    features: FeaturesType;
    description: string | null;
    condition: string;
    images: UploadedImageResult[];
    year: string;
    manufacturer: string;
    owningDate: string;
    currency: any;
    currentOwner?: PublicUserDto | null;
    maintenanceLogs: MaintenanceEntry[];
    location: {
        city: string;
        lat: number;
        lon: number;
        country: string;
    } | null;
};
