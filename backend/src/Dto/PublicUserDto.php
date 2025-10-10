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

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->name = $data['name'] ?? null;
        $this->numberOfMachine = $data['numberOfMachine'];
        $this->avatar = $data['avatar'] ?? null;
        $this->createdAt = $data['createdAt']->format('Y-m-d') ?? null;
        $this->responseRate = $data['responseRate'] ?? 0;
        $this->location = $data['location'] ?? null;
    }

    /**
     * @param User $entity
     *
     * @return self
     */
    public static function fromEntity(DtoableInterface $entity): self
    {
        return new self([
            'id' => $entity->getId(),
            'name' => $entity->getDisplayName(),
            'createdAt' => $entity->getCreatedAt(),
            'numberOfMachine' => $entity->getPinballs()->count(),
            'avatar' => $entity->getAvatar(),
            'location' => 'Middle of NoWhere',
            'responseRate' => 100,
        ]);
    }
}
