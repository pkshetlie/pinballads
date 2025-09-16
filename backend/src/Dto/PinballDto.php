<?php

namespace App\Dto;

use App\Entity\Pinball;
use App\Entity\PinballOwner;
use App\Entity\PinballSale;

class PinballDto
{
    public ?int $id = null;
    public ?string $name = null;
    public ?string $opdbId = null;
    public array $features = [];
    public ?string $description = null;
    public ?string $condition = null;
    public ?array $images = null;
    public ?int $year = null;
    public ?string $manufacturer = null;
    public ?int $currentOwnerId = null;
    public ?array $currentOwner; // { id, username, email } ou null
    public bool $isForSale = false;
    public float $price = 0;
    public string $devise = '€';
    public ?\DateTimeImmutable $owningDate;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->name = $data['name'] ?? null;
        $this->opdbId = $data['opdbId'] ?? null;
        $this->features = $data['features'] ?? [];
        $this->description = $data['description'] ?? null;
        $this->condition = $data['condition'] ?? null;
        $this->images = $data['images'] ?? null;
        $this->year = $data['year'] ?? null;
        $this->manufacturer = $data['manufacturer'] ?? null;
        $this->currentOwnerId = $data['currentOwnerId'] ?? null;
        $this->currentOwner = $data['currentOwner'] ?? null;
        $this->isForSale = $data['isForSale'];
        $this->price = $data['price'];
        $this->owningDate = $data['owningDate'] ?? null;
    }

    public static function fromEntity(Pinball $pinball): self
    {
        $sales = $pinball->getPinballSales()->filter(function (PinballSale $sale) {
            return $sale->getSeller() === $sale->getPinball()->getCurrentOwner() && $sale->getSoldAt() === null;
        });

        $sale = $sales->first();
        $owner = $pinball->getPinballOwners()->filter(function (PinballOwner $po) {
            return $po->getEndAt() === null;
        })->first();

        return new self([
            'id' => $pinball->getId(),
            'name' => $pinball->getName(),
            'opdbId' => $pinball->getOpdbId(),
            'features' => $pinball->getFeatures(),
            'description' => $pinball->getDescription(),
            'condition' => $pinball->getCondition(),
            'images' => $pinball->getImages(),
            'isForSale' => $sales->count() > 0,
            'price' => $sale ? $sales->first()->getStartPrice() : 0,
            'devise' => $sale ? $sales->first()?->getDevise() : "€",
            'year' => $pinball->getYear(),
            'manufacturer' => $pinball->getManufacturer(),
            'currentOwnerId' => $pinball->getCurrentOwner()?->getId(),
            'owningDate' => $owner ?  $owner->getStartAt() : null,
            'currentOwner' => [
                'id' => $pinball->getCurrentOwner()?->getId(),
                'email' => $pinball->getCurrentOwner()?->getEmail(),
            ],
        ]);
    }
}
