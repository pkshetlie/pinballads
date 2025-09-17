import {Features} from "@/components/object/features";

export type PinballDto = {
    id: number;
    name: string;
    opdbId: string | null;
    features: Features;
    description: string | null;
    condition: string;
    images: { title: string; url: string }[];
    year: number;
    manufacturer: string | null;
    currentOwnerId: number;
    currentOwner: {
        id: number;
        email: string;
    };
    isForSale: boolean;
    price: number;
    currency: string;
    owningDate: string;
};
