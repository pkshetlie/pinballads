<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\PinballCollection;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\DtoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserController extends AbstractController
{
    #[Route('/api/user/me', methods: ['GET'])]
    public function refresh(DtoService $dtoService): Response
    {
        return $this->json($dtoService->toPrivateDto($this->getUser()));
    }
}
