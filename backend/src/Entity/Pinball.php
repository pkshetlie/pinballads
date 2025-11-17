<?php

namespace App\Entity;

use App\Interface\DtoableInterface;
use App\Repository\PinballRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;

#[ORM\Entity(repositoryClass: PinballRepository::class)]
class Pinball implements DtoableInterface
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?string $opdbId = null;

    #[ORM\Column(type:'jsonb')]
    private array $features = [];

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 20)]
    private ?string $condition = null;

    #[ORM\Column(nullable: true)]
    private ?array $images = null;

    /**
     * @var Collection<int, PinballOwner>
     */
    #[ORM\OneToMany(targetEntity: PinballOwner::class, mappedBy: 'pinball', cascade: ['persist', 'remove'])]
    private Collection $pinballOwners;

    #[ORM\Column(nullable: true)]
    private ?int $year = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $manufacturer = null;

    #[ORM\ManyToOne(inversedBy: 'pinballs')]
    private ?User $currentOwner = null;

    /**
     * @var Collection<int, PinballSale>
     */
    #[ORM\OneToMany(targetEntity: PinballSale::class, mappedBy: 'pinball')]
    private Collection $pinballSales;

    /**
     * @var Collection<int, PinballCollection>
     */
    #[ORM\ManyToMany(targetEntity: PinballCollection::class, mappedBy: 'pinballs')]
    private Collection $pinballCollections;

    private ?float $distance = null;

    /**
     * @var Collection<int, Conversation>
     */
    #[ORM\OneToMany(targetEntity: Conversation::class, mappedBy: 'pinball', orphanRemoval: true)]
    private Collection $conversations;

    /**
     * @var Collection<int, MaintenanceLog>
     */
    #[ORM\OneToMany(targetEntity: MaintenanceLog::class, mappedBy: 'pinball', orphanRemoval: true)]
    private Collection $maintenanceLogs;

    public function __construct()
    {
        $this->pinballOwners = new ArrayCollection();
        $this->pinballSales = new ArrayCollection();
        $this->pinballCollections = new ArrayCollection();
        $this->conversations = new ArrayCollection();
        $this->maintenanceLogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getOpdbId(): ?string
    {
        return $this->opdbId;
    }

    public function setOpdbId(?string $opdbId): static
    {
        $this->opdbId = $opdbId;

        return $this;
    }

    public function getFeatures(): array
    {
        return $this->features;
    }

    public function setFeatures(array $features): static
    {
        $this->features = $features;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
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

    public function getImages(): ?array
    {
        return $this->images ?? [];
    }

    public function setImages(?array $images): static
    {
        $this->images = $images;

        return $this;
    }

    /**
     * @return Collection<int, PinballOwner>
     */
    public function getPinballOwners(): Collection
    {
        return $this->pinballOwners;
    }

    public function addPinballOwner(PinballOwner $pinballOwner): static
    {
        if (!$this->pinballOwners->contains($pinballOwner)) {
            $this->pinballOwners->add($pinballOwner);
            $pinballOwner->setPinball($this);
        }

        return $this;
    }

    public function removePinballOwner(PinballOwner $pinballOwner): static
    {
        if ($this->pinballOwners->removeElement($pinballOwner)) {
            // set the owning side to null (unless already changed)
            if ($pinballOwner->getPinball() === $this) {
                $pinballOwner->setPinball(null);
            }
        }

        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): static
    {
        $this->year = $year;

        return $this;
    }

    public function getManufacturer(): ?string
    {
        return $this->manufacturer;
    }

    public function setManufacturer(?string $manufacturer): static
    {
        $this->manufacturer = $manufacturer;

        return $this;
    }

    public function getCurrentOwner(): ?User
    {
        return $this->currentOwner;
    }

    public function setCurrentOwner(?User $currentOwner): static
    {
        $this->currentOwner = $currentOwner;

        return $this;
    }

    /**
     * @return Collection<int, PinballSale>
     */
    public function getPinballSales(): Collection
    {
        return $this->pinballSales;
    }

    public function addPinballSale(PinballSale $pinballSale): static
    {
        if (!$this->pinballSales->contains($pinballSale)) {
            $this->pinballSales->add($pinballSale);
            $pinballSale->setPinball($this);
        }

        return $this;
    }

    public function removePinballSale(PinballSale $pinballSale): static
    {
        if ($this->pinballSales->removeElement($pinballSale)) {
            // set the owning side to null (unless already changed)
            if ($pinballSale->getPinball() === $this) {
                $pinballSale->setPinball(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PinballCollection>
     */
    public function getPinballCollections(): Collection
    {
        return $this->pinballCollections;
    }

    public function addPinballCollection(PinballCollection $pinballCollection): static
    {
        if (!$this->pinballCollections->contains($pinballCollection)) {
            $this->pinballCollections->add($pinballCollection);
            $pinballCollection->addPinball($this);
        }

        return $this;
    }

    public function removePinballCollection(PinballCollection $pinballCollection): static
    {
        if ($this->pinballCollections->removeElement($pinballCollection)) {
            $pinballCollection->removePinball($this);
        }

        return $this;
    }

    public function getDistance(): ?float
    {
        return $this->distance;
    }

    public function setDistance(?float $distance): static
    {
        $this->distance = $distance;

        return $this;
    }

    public function getPinballCurrentSales(): false|PinballSale
    {
        return $this->getPinballSales()->filter(function(PinballSale $sale) {
            return $sale->getSeller() === $sale->getPinball()->getCurrentOwner()
                && $sale->getFinalPrice() === null;
        })->first() ?? false;
    }

    /**
     * @return Collection<int, Conversation>
     */
    public function getConversations(): Collection
    {
        return $this->conversations;
    }

    public function addConversation(Conversation $conversation): static
    {
        if (!$this->conversations->contains($conversation)) {
            $this->conversations->add($conversation);
            $conversation->setPinball($this);
        }

        return $this;
    }

    public function removeConversation(Conversation $conversation): static
    {
        if ($this->conversations->removeElement($conversation)) {
            // set the owning side to null (unless already changed)
            if ($conversation->getPinball() === $this) {
                $conversation->setPinball(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, MaintenanceLog>
     */
    public function getMaintenanceLogs(): Collection
    {
        return $this->maintenanceLogs;
    }

    public function addMaintenanceLog(MaintenanceLog $maintenanceLog): static
    {
        if (!$this->maintenanceLogs->contains($maintenanceLog)) {
            $this->maintenanceLogs->add($maintenanceLog);
            $maintenanceLog->setPinball($this);
        }

        return $this;
    }

    public function removeMaintenanceLog(MaintenanceLog $maintenanceLog): static
    {
        if ($this->maintenanceLogs->removeElement($maintenanceLog)) {
            // set the owning side to null (unless already changed)
            if ($maintenanceLog->getPinball() === $this) {
                $maintenanceLog->setPinball(null);
            }
        }

        return $this;
    }
}
