import {featuresType} from "@/components/object/features";
import {PublicUserDto} from "@/components/object/PublicUserDto";

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
    features: featuresType;
    description: string | null;
    condition: string;
    images: { title: string, url: string, uid: string }[];
    year: string;
    manufacturer: string;
    owningDate: string;
    currency: any;
    currentOwner?: PublicUserDto | null;
    location: {
        city: string;
        lat: number;
        lon: number;
        country: string;
    } | null;
};
