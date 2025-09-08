<?php

namespace App\Dto\Opdb;

use Symfony\Component\Serializer\Attribute\SerializedName;

class GameDto
{
    #[SerializedName('opdb_id')]
    public string $opdbId;

    #[SerializedName('is_machine')]
    public bool $isMachine;

    public string $name;

    #[SerializedName('common_name')]
    public ?string $commonName = null;

    public ?string $shortname = null;

    #[SerializedName('physical_machine')]
    public int $physicalMachine;

    #[SerializedName('ipdb_id')]
    public ?int $ipdbId = null;

    #[SerializedName('manufacture_date')]
    public ?string $manufactureDate = null;

    public ?ManufacturerDto $manufacturer = null;

    public ?string $type = null;
    public ?string $display = null;

    #[SerializedName('player_count')]
    public ?int $playerCount = null;

    /** @var string[] */
    public array $features = [];

    /** @var string[] */
    public array $keywords = [];

    public ?string $description = null;

    #[SerializedName('created_at')]
    public string $createdAt;

    #[SerializedName('updated_at')]
    public string $updatedAt;

    /** @var ImageDto[] */
    public array $images = [];
}

