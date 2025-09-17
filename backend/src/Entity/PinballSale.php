<?php

namespace App\Entity;

use App\Repository\PinballSaleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PinballSaleRepository::class)]
class PinballSale
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'pinballSales')]
    private ?Pinball $pinball = null;

    #[ORM\ManyToOne(inversedBy: 'pinballsSold')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $seller = null;

    #[ORM\ManyToOne(inversedBy: 'pinballsPurchased')]
    private ?User $buyer = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 20, scale: 2)]
    private ?string $startPrice = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 20, scale: 2, nullable: true)]
    private ?string $finalPrice = null;

    #[ORM\Column(length: 10)]
    private string $currency = '€';

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $sold_at = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getSeller(): ?User
    {
        return $this->seller;
    }

    public function setSeller(?User $seller): static
    {
        $this->seller = $seller;

        return $this;
    }

    public function getBuyer(): ?User
    {
        return $this->buyer;
    }

    public function setBuyer(?User $buyer): static
    {
        $this->buyer = $buyer;

        return $this;
    }

    public function getStartPrice(): ?string
    {
        return $this->startPrice;
    }

    public function setStartPrice(string $startPrice): static
    {
        $this->startPrice = $startPrice;

        return $this;
    }

    public function getFinalPrice(): ?string
    {
        return $this->finalPrice;
    }

    public function setFinalPrice(?string $finalPrice): static
    {
        $this->finalPrice = $finalPrice;

        return $this;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function setCurrency(string $currency): static
    {
        $this->currency = $currency;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getSoldAt(): ?\DateTimeImmutable
    {
        return $this->sold_at;
    }

    public function setSoldAt(?\DateTimeImmutable $sold_at): static
    {
        $this->sold_at = $sold_at;

        return $this;
    }
}
