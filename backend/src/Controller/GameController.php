<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Opdb\GameDto;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class GameController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/search/game', methods: ['GET'])]
    public function index(Request $request, UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        if (!$this->isGranted('ROLE_USER')) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }

        $apiKey = $_ENV['OPDB_API_KEY']; // tu peux mettre ça dans ton .env
        $url = sprintf('https://opdb.org/api/search?api_token=%s&q=%s', $apiKey, $request->query->get('query'));

        $client = HttpClient::create();
        $response = $client->request('GET', $url);

        if ($response->getStatusCode() !== 200) {
            return new JsonResponse(['error' => 'OPDB API error'], Response::HTTP_BAD_GATEWAY);
        }

        $json = $response->getContent();

        $games = $serializer->deserialize($json, GameDto::class . '[]', 'json');

        return $this->json($games);
    }
}
