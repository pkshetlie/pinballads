<?php

namespace App\Dto;

use App\Entity\Pinball;
use App\Entity\PinballCollection;
use App\Entity\PinballOwner;
use App\Entity\PinballSale;
use App\Interface\DtoableInterface;
use App\Interface\DtoInterface;

class PinballDto implements DtoInterface
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
    public ?string $collection = null;
    public ?array $currentOwner; // { id, username, email } ou null
    public bool $isForSale = false;
    public float $price = 0;
    public string $currency = '€';
    public ?string $owningDate;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->name = $data['name'] ?? null;
        $this->opdbId = $data['opdbId'] ?? null;
        $this->features = $data['features'] ?? [];
        $this->description = $data['description'] ?? null;
        $this->condition = $data['condition'] ?? null;
        $baseUrl = $_SERVER['HTTP_HOST']; // Récupération de l'URL de la requête
        $images = array_map(function (array $imagePath) use ($baseUrl) {
            return [
                'url'=>"https://{$baseUrl}{$imagePath['url']}",
                'title'=> $imagePath['title'] ?? '',
                'uid' => $imagePath['uid'] ?? uniqid(),
                ];
        }, $data['images']);
        $this->images = $images;

        $this->year = $data['year'] ?? null;
        $this->manufacturer = $data['manufacturer'] ?? null;
        $this->currentOwnerId = $data['currentOwnerId'] ?? null;
        $this->currentOwner = $data['currentOwner'] ?? null;
        $this->isForSale = $data['isForSale'];
        $this->price = $data['price'];
        $this->currency = $data['currency'];
        $this->owningDate = $data['owningDate']?->format('Y-m-d') ?? null;
    }

    /**
     * @param Pinball $entity
     *
     * @return self
     */
    public static function fromEntity(DtoableInterface $entity): self
    {
        $sales = $entity->getPinballSales()->filter(function (PinballSale $sale) {
            return $sale->getSeller() === $sale->getPinball()->getCurrentOwner() && $sale->getSoldAt() === null;
        });

        $sale = $sales->first();
        $owner = $entity->getPinballOwners()->filter(function (PinballOwner $po) {
            return $po->getEndAt() === null;
        })->first();

        return new self([
            'id' => $entity->getId(),
            'name' => $entity->getName(),
            'opdbId' => $entity->getOpdbId(),
            'features' => $entity->getFeatures(),
            'description' => $entity->getDescription(),
            'condition' => $entity->getCondition(),
            'images' => $entity->getImages(),
            'isForSale' => $sales->count() > 0,
            'price' => $sale ? $sales->first()->getStartPrice() : 0,
            'currency' => $sale ? $sales->first()?->getCurrency() : "€",
            'year' => $entity->getYear(),
            'manufacturer' => $entity->getManufacturer(),
            'currentOwnerId' => $entity->getCurrentOwner()?->getId(),
            'owningDate' => $owner ?  $owner->getStartAt() : null,
            'currentOwner' => [
                'id' => $entity->getCurrentOwner()?->getId(),
                'email' => $entity->getCurrentOwner()?->getEmail(),
            ],
        ]);
    }
}
