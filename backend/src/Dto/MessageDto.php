<?php

namespace App\Dto;

use App\Entity\Message;
use App\Interface\DtoInterface;

class MessageDto implements DtoInterface
{
    public ?int $id;
    public string $content;
    public ?int $offerAmount;
    public string $createdAt;
    public string $updatedAt;
    public string $isRead;
    public PublicUserDto $sender;


    public function __construct(Message $entity)
    {
        $this->id = $entity->getId();
        $this->content = $entity->getText();
        $this->offerAmount = $entity->getOffer();
        $this->createdAt = $entity->getCreatedAt()->format('Y-m-d H:i:s');
        $this->updatedAt = $entity->getUpdatedAt()->format('Y-m-d H:i:s');
        $this->isRead = $entity->isRead();
        $this->sender = new PublicUserDto($entity->getSender());
    }
}
