<?php

namespace App\Entity;

use App\Repository\MaintenanceLogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use \App\Enum\MaintenanceType;

#[ORM\Entity(repositoryClass: MaintenanceLogRepository::class)]
class MaintenanceLog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $doneAt = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 15, scale: 2, nullable: true)]
    private ?int $cost = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $parts = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $technician = null;

    #[ORM\Column(enumType: MaintenanceType::class)]
    private ?MaintenanceType $type = null;

    #[ORM\ManyToOne(inversedBy: 'maintenanceLogs')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Pinball $pinball = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDoneAt(): ?\DateTimeImmutable
    {
        return $this->doneAt;
    }

    public function setDoneAt(\DateTimeImmutable $doneAt): static
    {
        $this->doneAt = $doneAt;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCost(): ?int
    {
        return $this->cost;
    }

    public function setCost(?int $cost): static
    {
        $this->cost = $cost;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getParts(): ?string
    {
        return $this->parts;
    }

    public function setParts(?string $parts): static
    {
        $this->parts = $parts;

        return $this;
    }

    public function getTechnician(): ?string
    {
        return $this->technician;
    }

    public function setTechnician(?string $technician): static
    {
        $this->technician = $technician;

        return $this;
    }

    public function getType(): ?MaintenanceType
    {
        return $this->type;
    }

    public function setType(MaintenanceType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getPinball(): ?Pinball
    {
        return $this->pinball;
    }

    public function setPinball(?Pinball $pinball): static
    {
        $this->pinball = $pinball;

        return $this;
    }
}
