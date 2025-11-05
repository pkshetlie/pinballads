<?php

namespace App\Entity;

use App\Dto\SettingsDto;
use App\Interface\DtoableInterface;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Timestampable\Traits\TimestampableEntity;
use Jsor\Doctrine\PostGIS\Types\PostGISType;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface, DtoableInterface
{
    use TimestampableEntity;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 5)]
    private ?string $language = 'fr';

    /**
     * @var Collection<int, PinballOwner>
     */
    #[ORM\OneToMany(targetEntity: PinballOwner::class, mappedBy: 'owner')]
    private Collection $pinballOwners;

    #[ORM\Column(length: 255)]
    private ?string $displayName = null;

    /**
     * @var Collection<int, Pinball>
     */
    #[ORM\OneToMany(targetEntity: Pinball::class, mappedBy: 'currentOwner')]
    private Collection $pinballs;

    /**
     * @var Collection<int, PinballSale>
     */
    #[ORM\OneToMany(targetEntity: PinballSale::class, mappedBy: 'seller', orphanRemoval: true)]
    private Collection $pinballsSold;

    /**
     * @var Collection<int, PinballSale>
     */
    #[ORM\OneToMany(targetEntity: PinballSale::class, mappedBy: 'buyer')]
    private Collection $pinballsPurchased;

    /**
     * @var Collection<int, PinballCollection>
     */
    #[ORM\OneToMany(targetEntity: PinballCollection::class, mappedBy: 'owner')]
    private Collection $pinballCollections;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $avatar = null;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'sender')]
    private Collection $messagesAsSender;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'recipient')]
    private Collection $messagesAsRecipient;

    #[ORM\Column(nullable: true)]
    private ?bool $isVerified = false;

    #[ORM\Column(
        type: PostGISType::GEOGRAPHY,
        nullable: true,
        options: ['geometry_type' => 'POINT', 'srid' => 4326],
    )]
    private ?string $geography = null;

    #[ORM\Column(type: 'jsonb', nullable: true)]
    private ?array $settings = [];

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $city = null;

    /**
     * @var Collection<int, Conversation>
     */
    #[ORM\OneToMany(targetEntity: Conversation::class, mappedBy: 'user1')]
    private Collection $conversationsAsSender;

    /**
     * @var Collection<int, Conversation>
     */
    #[ORM\OneToMany(targetEntity: Conversation::class, mappedBy: 'User2', orphanRemoval: true)]
    private Collection $conversationsAsReceiver;

    public function __construct()
    {
        $this->pinballOwners = new ArrayCollection();
        $this->pinballs = new ArrayCollection();
        $this->pinballsSold = new ArrayCollection();
        $this->pinballsPurchased = new ArrayCollection();
        $this->pinballCollections = new ArrayCollection();
        $this->messagesAsSender = new ArrayCollection();
        $this->messagesAsRecipient = new ArrayCollection();
        $this->conversationsAsSender = new ArrayCollection();
        $this->conversationsAsReceiver = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0".self::class."\0password"] = hash('crc32c', $this->password);

        return $data;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    public function getLanguage(): ?string
    {
        return $this->language;
    }

    public function setLanguage(string $language): static
    {
        $this->language = $language;

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
            $pinballOwner->setOwner($this);
        }

        return $this;
    }

    public function removePinballOwner(PinballOwner $pinballOwner): static
    {
        if ($this->pinballOwners->removeElement($pinballOwner)) {
            // set the owning side to null (unless already changed)
            if ($pinballOwner->getOwner() === $this) {
                $pinballOwner->setOwner(null);
            }
        }

        return $this;
    }

    public function getDisplayName(): ?string
    {
        return $this->displayName;
    }

    public function setDisplayName(string $displayName): static
    {
        $this->displayName = $displayName;

        return $this;
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
            $pinball->setCurrentOwner($this);
        }

        return $this;
    }

    public function removePinball(Pinball $pinball): static
    {
        if ($this->pinballs->removeElement($pinball)) {
            // set the owning side to null (unless already changed)
            if ($pinball->getCurrentOwner() === $this) {
                $pinball->setCurrentOwner(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PinballSale>
     */
    public function getPinballsSold(): Collection
    {
        return $this->pinballsSold;
    }

    public function addPinballSold(PinballSale $pinballSale): static
    {
        if (!$this->pinballsSold->contains($pinballSale)) {
            $this->pinballsSold->add($pinballSale);
            $pinballSale->setSeller($this);
        }

        return $this;
    }

    public function removePinballSale(PinballSale $pinballSale): static
    {
        if ($this->pinballsSold->removeElement($pinballSale)) {
            // set the owning side to null (unless already changed)
            if ($pinballSale->getSeller() === $this) {
                $pinballSale->setSeller(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PinballSale>
     */
    public function getPinballsPurchased(): Collection
    {
        return $this->pinballsPurchased;
    }

    public function addPinballsPurchased(PinballSale $pinballsPurchased): static
    {
        if (!$this->pinballsPurchased->contains($pinballsPurchased)) {
            $this->pinballsPurchased->add($pinballsPurchased);
            $pinballsPurchased->setBuyer($this);
        }

        return $this;
    }

    public function removePinballsPurchased(PinballSale $pinballsPurchased): static
    {
        if ($this->pinballsPurchased->removeElement($pinballsPurchased)) {
            // set the owning side to null (unless already changed)
            if ($pinballsPurchased->getBuyer() === $this) {
                $pinballsPurchased->setBuyer(null);
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
            $pinballCollection->setOwner($this);
        }

        return $this;
    }

    public function removePinballCollection(PinballCollection $pinballCollection): static
    {
        if ($this->pinballCollections->removeElement($pinballCollection)) {
            // set the owning side to null (unless already changed)
            if ($pinballCollection->getOwner() === $this) {
                $pinballCollection->setOwner(null);
            }
        }

        return $this;
    }

    public function getAvatar(): ?string
    {
        return $this->avatar;
    }

    public function setAvatar(?string $avatar): static
    {
        $this->avatar = $avatar;

        return $this;
    }

    public function setId(int $int): static
    {
        $this->id = $int;
        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessagesAsSender(): Collection
    {
        return $this->messagesAsSender;
    }

    public function addMessageAsSender(Message $message): static
    {
        if (!$this->messagesAsSender->contains($message)) {
            $this->messagesAsSender->add($message);
            $message->setSender($this);
        }

        return $this;
    }

    public function removeMessageAsSender(Message $message): static
    {
        if ($this->messagesAsSender->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getSender() === $this) {
                $message->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessagesAsRecipient(): Collection
    {
        return $this->messagesAsRecipient;
    }

    public function addMessagesAsRecipient(Message $messagesAsRecipient): static
    {
        if (!$this->messagesAsRecipient->contains($messagesAsRecipient)) {
            $this->messagesAsRecipient->add($messagesAsRecipient);
            $messagesAsRecipient->setRecipient($this);
        }

        return $this;
    }

    public function removeMessagesAsRecipient(Message $messagesAsRecipient): static
    {
        if ($this->messagesAsRecipient->removeElement($messagesAsRecipient)) {
            // set the owning side to null (unless already changed)
            if ($messagesAsRecipient->getRecipient() === $this) {
                $messagesAsRecipient->setRecipient(null);
            }
        }

        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getGeography()
    {
        return $this->geography;
    }

    public function setGeography($geography): static
    {
        $this->geography = $geography;

        return $this;
    }

    public function getSettings(): ?array
    {
        return $this->settings;
    }

    public function getSettingsDto(): SettingsDto
    {
        return new SettingsDto($this);
    }

    public function setSettings(?array $settings): static
    {
        $this->settings = $settings;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }
}
