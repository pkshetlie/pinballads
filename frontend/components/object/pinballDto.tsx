import {additionalOptionsType} from "@/components/PinballMachineForm";

export type PinballDto = {
    devise: string;
    price: number;
    views: number | null;
    isForSale: boolean;
    id: number;
    name: string;
    opdbId: string | null;
    features: additionalOptionsType;
    description: string | null;
    condition: string;
    images: { title: string, url: string, uid: string }[];
    year: string | null;
    manufacturer: string | null;
    working: boolean;
    originalParts: boolean;
    manual: boolean;
    keys: boolean;
    coinDoor: boolean;
    homeUse: boolean;
    owningDate?: string | null;
    currency: string;
    currentOwner?: {
        id: number;
        username: string;
        email?: string;
    } | null;
    location?: {
        city: string;
        lat: number;
        lon: number;
        country: string;
    }| null;
};
