<?php

namespace App\Security;

use App\Entity\User;
use App\Service\DtoService;
use Lexik\Bundle\JWTAuthenticationBundle\Security\Http\Authentication\AuthenticationSuccessHandler;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;

class CustomLoginSuccessHandler extends AuthenticationSuccessHandler
{
    /**
     * Override the handleAuthenticationSuccess to include user data
     */
    public function handleAuthenticationSuccess(UserInterface $user, $jwt = null): Response
    {
        // Appelle la méthode parent pour obtenir la réponse par défaut
        $response = parent::handleAuthenticationSuccess($user, $jwt);
        /** @var User $user */
        // Ajoute les données utilisateur dans la réponse (par exemple : email et nom)
        $dtoService = new DtoService();
        $userData = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getDisplayName(),
            'avatar' => '',
            'numberOfMachine' => $user->getPinballs()->count(),
            'createdAt' => $user->getCreatedAt()->format('Y-m-d'),
            // 'name' => $user->getName(), // Assurez-vous que cette méthode existe dans l'entité User
        ];

        // Ajouter les données utilisateur à la réponse JSON
        $data = json_decode($response->getContent(), true);
        $data['user'] = $dtoService->toDto($user);

        // Met à jour le contenu de la réponse
        $response->setContent(json_encode($data));

        return $response;
    }
}
