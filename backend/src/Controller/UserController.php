<?php
namespace App\Controller;

use App\Dto\PrivateUserDto;
use App\Entity\User;
use App\Service\DtoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/api/user/me', methods: ['GET'])]
    public function refresh(DtoService $dtoService): Response
    {
        return $this->json(new PrivateUserDto($this->getUser()));
    }

    #[Route('/api/settings', methods: ['POST'])]
    public function settingsSave(Request $request, DtoService $dtoService, EntityManagerInterface $entityManager): Response
    {
        $requ = json_decode($request->getContent(), true);

        /** @var User $user */
        $user = $this->getUser();
        $user
            ->setSettings($requ['settings'])
            ->setEmail($requ['user']['email'])
            ->setDisplayName($requ['user']['username']);

        $entityManager->flush();

        return $this->json(new PrivateUserDto($user));
    }
}
