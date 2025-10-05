<?php

namespace App\Dto;

use App\Interface\DtoInterface;
use App\Entity\PinballCollection;
use App\Interface\DtoableInterface;

class PinballCollectionDto implements DtoInterface
{

    public ?int $id = null;

    public int $machineCount;

    public ?string $description;

    public ?string $name;

    public ?bool $isPublic;
    public ?bool $isDefault;
    public string $createdAt;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->name = $data['name'] ?? null;
        $this->description = $data['description'] ?? null;
        $this->isDefault = $data['isDefault'] ?? false;
        $this->isPublic = $data['isPublic'] ?? false;
        $this->machineCount = $data['machineCount'] ?? null;
        $this->createdAt = $data['createdAt'];
    }

    /**
     * @param PinballCollection $entity
     *
     * @return self
     */
    public static function fromEntity(DtoableInterface $entity): self
    {
        return new self([
            'id' => $entity->getId(),
            'name' => $entity->getName(),
            'description' => $entity->getDescription(),
            'isPublic' => $entity->isPublic(),
            'isDefault' => $entity->isDefault(),
            'machineCount' => $entity->getPinballs()?->count() ?? 0,
            'createdAt' => $entity->getCreatedAt()->format('Y-m-d'),
        ]);
    }

}
