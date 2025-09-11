<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RegisterController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/register', methods: ['POST'])]
    public function index(Request $request, UserRepository $userRepository): Response
    {
        // Récupérer le contenu JSON de la requête
        $content = json_decode($request->getContent(), true);

        // Vérifier si le contenu est valide
        if (!$content || !isset($content['email']) || !isset($content['password'])) {
            return $this->json([
                'error' => 'Email and password are required',
            ], Response::HTTP_BAD_REQUEST);
        }

        $existingUser = $userRepository->findOneBy(['email' => $content['email']]);

        if ($existingUser) {
            return $this->json([
                'error' => 'User already exists',
            ], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($content['email']);
        $user->setUsername($content['username']);

        $hashedPassword = password_hash($content['password'], PASSWORD_BCRYPT);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();
        // Traiter les données reçues ici

        $content['password'] = '********';

        // Retourner une réponse JSON
        return $this->json([
            'message' => 'Inscription réussie',
            'data' => $content
        ], Response::HTTP_CREATED);
    }
}
