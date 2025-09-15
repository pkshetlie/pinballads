<?php

namespace App\Service;

use App\Dto\PinballDto;
use App\Entity\Pinball;
use App\Repository\PinballSaleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;

class PinballService
{
    public function __construct()
    {

    }

    /**
     * @param array $pinballs
     *
     * @return array<PinballDto>
     */
    public function toDtos(array $pinballs): array
    {
        return array_map(fn($pinball) => PinballDto::fromEntity($pinball), $pinballs);
    }

    public function toDto(Pinball $pinball): PinballDto
    {
        return PinballDto::fromEntity($pinball);
    }

}
