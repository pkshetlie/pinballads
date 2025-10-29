<?php

namespace App\Service;

use App\Dto\ConversationDto;
use App\Dto\MessageDto;
use App\Dto\PinballCollectionDto;
use App\Dto\PinballDto;
use App\Dto\PrivateUserDto;
use App\Dto\PublicUserDto;
use App\Entity\Conversation;
use App\Entity\Message;
use App\Entity\Pinball;
use App\Entity\PinballCollection;
use App\Entity\User;
use App\Interface\DtoableInterface;
use App\Interface\DtoInterface;

class DtoService
{
    public function __construct()
    {

    }

    /**
     * @param array<DtoableInterface> $array
     *
     * @return array<DtoInterface>
     */
    public function toDtos(?array $array): array
    {
        if (!$array || !count($array)) {
            return [];
        }

        $firstObject = $array[0];

        return match ($firstObject::class) {
            User::class => array_map(fn(User $object) => new PublicUserDto($object), $array),
            Pinball::class => array_map(fn(Pinball $object) => new PinballDto($object), $array),
            Conversation::class => array_map(fn(Conversation $object) => new ConversationDto($object), $array),
            Message::class => array_map(fn(Message $object) => new MessageDto($object), $array),
            PinballCollection::class => array_map(fn(PinballCollection $object) => new PinballCollectionDto($object), $array),
        };
    }

    public function toDto(DtoableInterface $entity): DtoInterface
    {
        return match ($entity::class) {
            User::class => new PublicUserDto($entity),
            Pinball::class => new PinballDto($entity),
            PinballCollection::class => new PinballCollectionDto($entity),
        };
    }

    public function toPrivateDto(DtoableInterface $entity)
    {
        return match ($entity::class) {
            User::class => new PrivateUserDto($entity),
           default => $this->toDto($entity),
        };
    }
}
