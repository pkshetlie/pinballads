import {PublicUserDto} from "@/components/object/PublicUserDto";
import {PinballDto} from "@/components/object/PinballDto";
import {MessageDto} from "@/components/object/MessageDto";

export type ConversationDto = {
    id: number,
    userA: PublicUserDto,
    userB: PublicUserDto,
    createdAt: string,
    lastMessageAt: string,
    messages: MessageDto[],
    pinball: PinballDto
};

