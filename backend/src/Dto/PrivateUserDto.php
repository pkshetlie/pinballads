<?php

namespace App\Dto;

use App\Entity\User;
use App\Interface\DtoInterface;

class PrivateUserDto implements DtoInterface
{
    public ?int $id = null;
    public ?string $name = null;
    public ?string $email = null;
    public ?string $avatar = null;
    public int $numberOfMachines;
    public string $language;
    public ?string $location;
    public int $responseRate;
    public ?string $createdAt;
    public int $reviewCount;
    public float $rating;
    public SettingsDto $settings;
    public bool $isVerified;
    public int $newMessages;

    public function __construct(User $entity)
    {
        $this->id = $entity->getId();
        $this->name = $entity->getDisplayName();;
        $this->numberOfMachines = $entity->getPinballs()->count();
        $this->avatar = $entity->getAvatar();;
        $this->createdAt = $entity->getCreatedAt()->format('Y-m-d');
        $this->language = $entity->getLanguage();
        $this->responseRate = 100;
        $this->email = $entity->getEmail();
        $this->location = 'Middle of NoWhere';
        $this->reviewCount = 0;
        $this->rating = 5;
        $this->isVerified = false;
        $this->newMessages = $entity->getMessagesAsRecipient()->filter(function ($message) { return $message->isRead() === false;})->count();
        $this->settings = new SettingsDto($entity);
    }
}
