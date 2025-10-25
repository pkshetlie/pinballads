import {SettingsDto} from "@/components/object/SettingsDto";

export type PublicUserDto = {
    id: number;
    name: string;
    avatar: string;
    numberOfMachines: number;
    city: string;
    location: string;
    responseRate: number;
    reviewCount: number;
    rating: number;
    verified: boolean;
    isVerified: boolean;
    createdAt?: string;
    settings: SettingsDto
}
