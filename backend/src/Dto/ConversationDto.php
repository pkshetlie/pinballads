<?php

namespace App\Dto;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Interface\DtoInterface;

class ConversationDto implements DtoInterface
{
    public int $id;
    public PublicUserDto $userA;
    public PublicUserDto $userB;
    public string $createdAt;
    public string $lastMessageAt;
    public PinballDto $pinball;
    public array $messages = [];

    public function __construct(Conversation $entity)
    {
        $this->id = $entity->getId();
       $this->userA = new PublicUserDto($entity->getUserA());
       $this->userB = new PublicUserDto($entity->getUserB());
       $this->createdAt = $entity->getCreatedAt()->format('Y-m-d H:i:s');
       $this->lastMessageAt = $entity->getLastMessageAt()->format('Y-m-d H:i:s');
       $this->pinball = new PinballDto($entity->getPinball());
        $messages = $entity->getMessages()->toArray();
        usort($messages, function($a, $b) {
            return $a->getCreatedAt() <=> $b->getCreatedAt();
        });
        foreach ($messages as $message) {
            $this->messages[] = new MessageDto($message);
        }
    }
}
