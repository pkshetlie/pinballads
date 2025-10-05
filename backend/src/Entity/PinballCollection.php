<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Interface\DtoableInterface;
use App\Repository\PinballCollectionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;

#[ORM\Entity(repositoryClass: PinballCollectionRepository::class)]
#[ApiResource]
class PinballCollection implements DtoableInterface
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, Pinball>
     */
    #[ORM\ManyToMany(targetEntity: Pinball::class, inversedBy: 'pinballCollections')]
    private Collection $pinballs;

    #[ORM\ManyToOne(inversedBy: 'pinballCollections')]
    private ?User $owner = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?bool $isPublic = false;

    #[ORM\Column]
    private ?bool $isDefault = false;

    public function __construct()
    {
        $this->pinballs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Pinball>
     */
    public function getPinballs(): Collection
    {
        return $this->pinballs;
    }

    public function addPinball(Pinball $pinball): static
    {
        if (!$this->pinballs->contains($pinball)) {
            $this->pinballs->add($pinball);
        }

        return $this;
    }

    public function removePinball(Pinball $pinball): static
    {
        $this->pinballs->removeElement($pinball);

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function isPublic(): ?bool
    {
        return $this->isPublic;
    }

    public function setIsPublic(bool $isPublic): static
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    public function isDefault(): ?bool
    {
        return $this->isDefault;
    }

    public function setIsDefault(bool $isDefault): static
    {
        $this->isDefault = $isDefault;

        return $this;
    }
}
