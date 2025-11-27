<?php

namespace App\Entity;

use App\Repository\PinballSaleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Jsor\Doctrine\PostGIS\Types\PostGISType;

#[ORM\Entity(repositoryClass: PinballSaleRepository::class)]
class PinballSale
{
    use TimestampableEntity;

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

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $sold_at = null;

    #[ORM\Column(type: 'text')]
    private string $city;

    #[ORM\Column(length: 20)]
    private ?string $condition = null;

    #[ORM\Column(
        type: PostGISType::GEOGRAPHY,
        options: ['geometry_type' => 'POINT', 'srid' => 4326],
    )]
    private string $geography;

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

    public function getCurrencySign(): string
    {
        return match($this->currency){
            'EUR' => '€',
            'USD' => '$',
            'GBP' => '£'
        };
    }

    public function setCurrency(string $currency): static
    {
        $this->currency = $currency;

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

    public function getCity(): string
    {
        return $this->city;
    }

    public function setCity(string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getGeography(): string
    {
        return $this->geography;
    }

    public function setGeography(string $geography): static
    {
        $this->geography = $geography;

        return $this;
    }

    public function setGeographyWithPoints(string $long, string $lat): static
    {
        $this->geography = 'SRID=4326;POINT('.$long.' '.$lat.')';
        return $this;
    }

    public function getLocation(): array
    {
        return [
            'city' => $this->city,
            'lat' => $this->getLatitude(),
            'lon' => $this->getLongitude(),
        ];
    }

    public function getLatitude(): ?float
    {
        if (preg_match('/POINT\(([-\d.]+) ([-\d.]+)\)/', $this->geography, $matches)) {
            return (float) $matches[2]; // La latitude est en second
        }

        return null;
    }

    public function getLongitude(): ?float
    {
        if (preg_match('/POINT\(([-\d.]+) ([-\d.]+)\)/', $this->geography, $matches)) {
            return (float) $matches[1]; // La longitude est en premier
        }

        return null;
    }

    public function getCondition(): ?string
    {
        return $this->condition;
    }

    public function setCondition(string $condition): static
    {
        $this->condition = $condition;

        return $this;
    }
}
