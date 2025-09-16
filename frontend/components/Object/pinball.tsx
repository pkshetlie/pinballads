export type PinballDto = {
    devise: string;
    price: number;
    views: number | null;
    isForSale: boolean;
    id: number;
    name: string;
    opdbId: string | null;
    features: string[];
    description: string | null;
    condition: string;
    images: { title: string; url: string }[];
    year: string | null;
    manufacturer: string | null;

    working: boolean;
    originalParts: boolean;
    manual: boolean;
    keys: boolean;
    coinDoor: boolean;
    homeUse: boolean;
    startDate?: string | null;

    currentOwner?: {
        id: number;
        username: string;
        email?: string;
    } | null;
};
