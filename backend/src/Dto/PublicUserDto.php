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
    public int $numberOfMachine;
    public ?string $createdAt;
    public ?string $location;
    public int $responseRate;

    public function __construct(User $entity)
    {
        $this->id = $entity->getId();
        $this->name = $entity->getDisplayName();;
        $this->numberOfMachine = $entity->getPinballs()->count();
        $this->avatar = $entity->getAvatar();;
        $this->createdAt = $entity->getCreatedAt()->format('Y-m-d');
        $this->responseRate = 100;
        $this->location = 'Middle of NoWhere';
    }
}
