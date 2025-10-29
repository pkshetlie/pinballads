import {PublicUserDto} from "@/components/object/PublicUserDto";

export type MessageDto = {
    content: string,
    createdAt: string,
    id: number,
    isRead: boolean,
    offerAmount: number | null
    sender: PublicUserDto
    updatedAt: string
};

