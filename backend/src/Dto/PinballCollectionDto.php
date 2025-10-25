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

    public function __construct(PinballCollection $entity)
    {
        $this->id = $entity->getId();
        $this->name = $entity->getName();
        $this->description =$entity->getDescription();
        $this->isDefault = $entity->isPublic();
        $this->isPublic = $entity->isDefault();
        $this->machineCount = $entity->getPinballs()?->count() ?? 0;
        $this->createdAt = $entity->getCreatedAt()->format('Y-m-d');
    }
}
