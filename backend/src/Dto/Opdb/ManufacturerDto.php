<?php

namespace App\Dto\Opdb;

use Symfony\Component\Serializer\Attribute\SerializedName;

class ManufacturerDto
{
    #[SerializedName('manufacturer_id')]
    public int $manufacturerId;

    public string $name;

    #[SerializedName('full_name')]
    public string $fullName;

    #[SerializedName('created_at')]
    public string $createdAt;

    #[SerializedName('updated_at')]
    public string $updatedAt;
}
