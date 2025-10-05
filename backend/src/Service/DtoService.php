<?php

namespace App\Service;

use App\Dto\PinballCollectionDto;
use App\Dto\PinballDto;
use App\DtoInterface;
use App\Entity\Pinball;
use App\Entity\PinballCollection;
use App\Interface\DtoableInterface;

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
    public function toDtos(array $array): array
    {
        if (!count($array)) {
            return [];
        }

        $firstObject = $array[0];

        return match ($firstObject::class) {
            Pinball::class => array_map(fn($object) => PinballDto::fromEntity($object), $array),
            PinballCollection::class => array_map(fn($object) => PinballCollectionDto::fromEntity($object), $array),
        };
    }

    public function toDto(DtoableInterface $entity): PinballDto
    {
        return match ($entity::class) {
            Pinball::class => PinballDto::fromEntity($entity),
            PinballCollection::class => PinballCollectionDto::fromEntity($entity),
        };
    }
}
