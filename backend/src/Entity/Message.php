<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $text = null;

    #[ORM\Column(nullable: true)]
    private ?int $offer = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    private ?User $sender = null;

    #[ORM\ManyToOne(inversedBy: 'messagesAsRecipient')]
    private ?User $recipient = null;

    #[ORM\Column(nullable: true)]
    private ?bool $isScam = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $scamReason = null;

    #[ORM\Column(nullable: true)]
    private ?int $score = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getOffer(): ?int
    {
        return $this->offer;
    }

    public function setOffer(?int $offer): static
    {
        $this->offer = $offer;

        return $this;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;

        return $this;
    }

    public function getRecipient(): ?User
    {
        return $this->recipient;
    }

    public function setRecipient(?User $recipient): static
    {
        $this->recipient = $recipient;

        return $this;
    }

    public function isScam(): ?bool
    {
        return $this->isScam;
    }

    public function setIsScam(?bool $isScam): static
    {
        $this->isScam = $isScam;

        return $this;
    }

    public function getScamReason(): ?string
    {
        return $this->scamReason;
    }

    public function setScamReason(string $scamReason): static
    {
        $this->scamReason = $scamReason;

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(?int $score): static
    {
        $this->score = $score;

        return $this;
    }
}
