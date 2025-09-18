<?php

namespace App\Controller;

use App\Dto\PinballDto;
use App\Entity\Pinball;
use App\Entity\PinballOwner;
use App\Repository\PinballRepository;
use App\Service\PinballService;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class CollectionController extends AbstractController
{
    #[Route('/api/collection/create', name: 'api_collection_create', methods: ['POST'])]
    public function index(
        Request $request,
        EntityManagerInterface $entityManager
    ): Response {
        /**
         * name: query,
         * condition,
         * opdbId,
         * manufacturer,
         * year,
         * description,
         * features,
         */

        $data = json_decode($request->getContent(), false);

        $features = [];

        if ($data->original_parts ?? null) {
            $features['original_parts'] = true;
        } else {
            $features['original_parts'] = false;
        }

        if ($data->coin_door ?? null) {
            $features['coin_door'] = true;
        } else {
            $features['coin_door'] = false;
        }

        if ($data->home_use ?? null) {
            $features['home_use'] = true;
        } else {
            $features['home_use'] = false;
        }

        if ($data->manual ?? null) {
            $features['manual'] = true;
        } else {
            $features['manual'] = false;
        }

        if ($data->keys ?? null) {
            $features['keys'] = true;
        } else {
            $features['keys'] = false;
        }

        if ($data->working ?? null) {
            $features['working'] = true;
        } else {
            $features['working'] = false;
        }

        $features['other'] = [];

        $pinball = new Pinball()
            ->setOpdbId($data->opdbId)
            ->setDescription($data->description)
            ->setName($data->name)
            ->setCondition($data->condition)
            ->setYear($data->year)
            ->setFeatures($features)
            ->setCurrentOwner($this->getUser())
            ->setManufacturer($data->manufacturer);

        $pinball->addPinballOwner(
            new PinballOwner()
                ->setOwner($this->getUser())
                ->setPinball($pinball)
                ->setStartAt(
                    \DateTimeImmutable::createFromFormat('Y-m-d', $data->startDate ?? date('Y-m-d'))?->setTime(0, 0, 0)
                )
        );

        $entityManager->persist($pinball);
        $entityManager->flush();

        return $this->json(['id' => $pinball->getId()]);
    }

    #[Route('/api/collection/{id}/update', name: 'api_collection_update', methods: ['POST'])]
    public function update(
        Pinball $pinball,
        Request $request,
        EntityManagerInterface $entityManager,
        PinballService $pinballService,
    ): Response {
        $data = json_decode($request->getContent(), false);

        $features = [];

        if ($data->original_parts ?? null) {
            $features['original_parts'] = true;
        } else {
            $features['original_parts'] = false;
        }

        if ($data->coin_door ?? null) {
            $features['coin_door'] = true;
        } else {
            $features['coin_door'] = false;
        }

        if ($data->home_use ?? null) {
            $features['home_use'] = true;
        } else {
            $features['home_use'] = false;
        }

        if ($data->manual ?? null) {
            $features['manual'] = true;
        } else {
            $features['manual'] = false;
        }

        if ($data->keys ?? null) {
            $features['keys'] = true;
        } else {
            $features['keys'] = false;
        }

        if ($data->working ?? null) {
            $features['working'] = true;
        } else {
            $features['working'] = false;
        }

        $features['other'] = [];

        $pinball
            ->setOpdbId($data->opdbId)
            ->setDescription($data->description)
            ->setName($data->name)
            ->setCondition($data->condition)
            ->setYear($data->year)
            ->setFeatures($features)
            ->setCurrentOwner($this->getUser())
            ->setManufacturer($data->manufacturer);

        $pinballOwner = $pinball->getPinballOwners()->filter(function (PinballOwner $po) {
            if ($po->getOwner() === $this->getUser()) {
                if ($po->getEndAt() === null) {
                    return true;
                }
            }

            return false;
        })->first();

        $date = \DateTimeImmutable::createFromFormat('Y-m-d', empty($data->startDate) ? date('Y-m-d') : $data->startDate)?->setTime(0, 0, 0);

        if ($pinballOwner && $pinballOwner->getStartAt() != $date) {
            $pinballOwner->setStartAt($date);
        }

        if (!$pinballOwner) {
            $pinball->addPinballOwner(
                new PinballOwner()
                    ->setOwner($this->getUser())
                    ->setPinball($pinball)
                    ->setStartAt($date)
            );
        }

        $entityManager->persist($pinball);
        $entityManager->flush();

        return $this->json($pinballService->toDto($pinball));
    }
    #[Route('/api/collection/all', name: 'api_collection_all', methods: ['GET'])]
    public function getAll(
        PinballRepository $pinballRepository,
        PinballService $pinballService,
    ): Response {
        $pinballs = $pinballRepository->findBy(['currentOwner' => $this->getUser()]);

        return $this->json($pinballService->toDtos($pinballs));
    }

    #[Route('/api/collection/{id}', name: 'api_collection_get_one', methods: ['GET'])]
    public function getOne(
        Pinball $pinball,
        PinballService $pinballService,
    ): Response {
        return $this->json($pinballService->toDto($pinball));
    }
}
