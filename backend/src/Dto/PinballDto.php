<?php
namespace App\Dto;

    use App\Entity\Pinball;
    use App\Entity\PinballOwner;
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
    public ?string $collection = null;
    public PublicUserDto $currentOwner;
    public bool $isForSale = false;
    public float $price = 0;
    public array $priceHistory = [];
    public ?string $owningDate;
    public int $views = 0;
    public ?array $location = [];
    public ?string $distance = null;
    public ?string $currency = 'EUR';
    public ?int $rating = 5;

    public function __construct(Pinball $pinball)
    {
        $this->id = $pinball->getId();
        $this->name = $pinball->getName();
        $this->opdbId = $pinball->getOpdbId();
        $this->features = $pinball->getFeatures();
        $this->description = $pinball->getDescription();
        $this->condition = $pinball->getCondition();

        // Gestion des images
        $baseUrl = $_SERVER['HTTP_HOST'];
        $this->images = array_map(function(array $imagePath) use ($baseUrl) {
            return [
                'url' => "https://{$baseUrl}{$imagePath['url']}",
                'title' => $imagePath['title'] ?? '',
                'uid' => $imagePath['uid'] ?? uniqid(),
            ];
        }, $pinball->getImages());

        $this->year = $pinball->getYear();
        $this->manufacturer = $pinball->getManufacturer();

        // Gestion du propriétaire actuel
        $currentOwner = $pinball->getCurrentOwner();
        if ($currentOwner) {
            $this->currentOwner = new PublicUserDto($pinball->getCurrentOwner());
        }

        // Gestion des ventes
        $sales = $pinball->getPinballCurrentSales();

        $currentSale = !$sales ? null : $sales;
        $this->isForSale = !empty($sales);
        $this->price = $this->isForSale ? $sales->getStartPrice() : 0;
        $this->currency = $this->isForSale ? $sales->getCurrency() ?? '€' : '€';

        // Historique des prix
        $this->priceHistory = [];

        // Date de possession
        $currentOwnership = $pinball->getPinballOwners()->filter(function(PinballOwner $po) {
            return $po->getEndAt() === null;
        })->first();

        $this->owningDate = $currentOwnership ?
            $currentOwnership->getStartAt()?->format('Y-m-d') : null;

        // Localisation
        $this->location = $currentSale?->getLocation() ?? [];
        $this->distance = $pinball?->getDistance();
    }
}
