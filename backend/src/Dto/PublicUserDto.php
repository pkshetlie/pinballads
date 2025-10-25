<?php

namespace App\Dto;

use App\Entity\User;
use App\Interface\DtoableInterface;
use App\Interface\DtoInterface;

class PublicUserDto implements DtoInterface
{
    public ?int $id = null;
    public ?string $name = null;
    public ?string $avatar = null;
    public int $numberOfMachines;
    public ?string $location;
    public int $responseRate;
    public ?string $createdAt;
    public int $reviewCount;
    public float $rating;
    public bool $isVerified;

    public function __construct(User $entity)
    {
        $this->id = $entity->getId();
        $this->name = $entity->getDisplayName();;
        $this->numberOfMachines = $entity->getPinballs()->count();
        $this->avatar = $entity->getAvatar();;
        $this->createdAt = $entity->getCreatedAt()->format('Y-m-d');
        $this->responseRate = 100;
        $this->location = 'Middle of NoWhere';
        $this->reviewCount = 0;
        $this->rating = 5;
        $this->isVerified = false;
    }
}
