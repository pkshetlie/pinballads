<?php

namespace App\Service;

use App\Dto\PinballCollectionDto;
use App\Dto\PinballDto;
use App\Dto\PublicUserDto;
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
            User::class => array_map(fn($object) => PublicUserDto::fromEntity($object), $array),
            Pinball::class => array_map(fn($object) => PinballDto::fromEntity($object), $array),
            PinballCollection::class => array_map(fn($object) => PinballCollectionDto::fromEntity($object), $array),
        };
    }

    public function toDto(DtoableInterface $entity): DtoInterface
    {
        return match ($entity::class) {
            User::class => PublicUserDto::fromEntity($entity),
            Pinball::class => PinballDto::fromEntity($entity),
            PinballCollection::class => PinballCollectionDto::fromEntity($entity),
        };
    }
}
