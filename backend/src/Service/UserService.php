<?php

namespace App\Service;

use App\Dto\PinballCollectionDto;
use App\Dto\PinballDto;
use App\Dto\PrivateUserDto;
use App\Dto\PublicUserDto;
use App\Entity\Pinball;
use App\Entity\PinballCollection;
use App\Entity\User;
use App\Interface\DtoableInterface;
use App\Interface\DtoInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserService
{
    public function __construct()
    {
    }

    /**
     * @return array<User>
     */
    public function sortPair(User $u1, User $u2): array
    {
        if ($u1->getId() < $u2->getId()) {
            return [$u1, $u2];
        }

        return [$u2, $u1];
    }
}
