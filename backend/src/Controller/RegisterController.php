<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\PinballCollection;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

class RegisterController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/register', methods: ['POST'])]
    public function index(Request $request, UserRepository $userRepository, TranslatorInterface $translator): Response
    {
        // Récupérer le contenu JSON de la requête
        $content = json_decode($request->getContent(), true);
        // Vérifier si le contenu est valide
        if (!$content || !isset($content['email']) || !isset($content['password'])) {
            return $this->json([
                'error' => 'Email and password are required',
            ], Response::HTTP_BAD_REQUEST);
        }

        $translator->setLocale($content['locale'] ?? 'en');
        $existingUser = $userRepository->findOneBy(['email' => $content['email']]);

        if ($existingUser) {
            return $this->json([
                'error' => $translator->trans('user_already_exists'),
            ], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($content['email']);
        $user->setDisplayName($content['username']);
        $user->setLanguage($content['locale'] ?? 'en');

        $hashedPassword = password_hash($content['password'], PASSWORD_BCRYPT);
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();
        // Traiter les données reçues ici
        $defaultPinballCollection = new PinballCollection()
            ->setName($translator->trans('default_collection_name', ['%username%' => $content['username']]))
            ->setIsDefault(true)
            ->setDescription($translator->trans('default_collection_description'))
            ->setOwner($user);
        $this->entityManager->persist($defaultPinballCollection);
        $this->entityManager->flush();

        $content['password'] = '********';

        // Retourner une réponse JSON
        return $this->json([
            'message' => $translator->trans('user_created'),
            'data' => $content,
        ], Response::HTTP_CREATED);
    }
}
