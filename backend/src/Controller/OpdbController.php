<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Opdb\GameDto;
use App\Repository\UserRepository;
use App\Service\OpdbService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\VarDumper\VarDumper;
use Symfony\Contracts\Translation\TranslatorInterface;

class OpdbController extends AbstractController
{
    #[Route('/test', methods: ['GET'])]
    public function test(Request $request, OpdbService $opdbService, TranslatorInterface $translator): JsonResponse
    {
        VarDumper::dump($translator->trans('Collection with this name already exists'));

        $translator->setLocale('en');

        VarDumper::dump($translator->trans('Collection with this name already exists'));

die;
    }


    #[Route('/api/public/search/game', methods: ['GET'])]
    public function index(Request $request, OpdbService $opdbService): JsonResponse
    {
        $machines = $opdbService->searchMachineGroups($request->query->get('query'));
        return $this->json(array_values($machines));
    }

    #[Route('/test/public/search', methods: ['GET'])]
    public function test2(Request $request, OpdbService $opdbService): JsonResponse
    {
        $machines = $opdbService->searchMachineGroups($request->query->get('query'));
        return $this->json(array_values($machines));
    }
}
