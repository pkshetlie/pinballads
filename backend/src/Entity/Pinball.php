<?php

namespace App\Entity;

use App\Repository\PinballRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PinballRepository::class)]
class Pinball
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?string $opdbId = null;

    #[ORM\Column(options: ['jsonb' => true] )]
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

    public function __construct()
    {
        $this->pinballOwners = new ArrayCollection();
        $this->pinballSales = new ArrayCollection();
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
}
