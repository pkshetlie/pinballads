<?php

namespace App\Controller;

use App\Entity\Pinball;
use App\Entity\PinballOwner;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
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

        if ($data->original_parts) {
            $features[] = 'original_parts';
        }

        if ($data->coin_door) {
            $features[] = 'coin_door';
        }

        if ($data->home_use) {
            $features[] = 'home_use';
        }

        if ($data->manual) {
            $features[] = 'manual';
        }

        if ($data->keys) {
            $features[] = 'keys';
        }

        if ($data->working) {
            $features[] = 'working';
        }

        $features[] = ['other' => $data->features];

        $pinball = new Pinball()
            ->setOpdbId($data->opdbId)
            ->setDescription($data->description)
            ->setTitle($data->name)
            ->setCondition($data->condition)
            ->setYear($data->year)
            ->setFeatures($features)
            ->setManufacturer($data->manufacturer);

        $pinball->addPinballOwner(
            new PinballOwner()
                ->setOwner($this->getUser())
                ->setPinball($pinball)
                ->setStartAt(
                    \DateTimeImmutable::createFromFormat('Y-m-d', $data->startDate ?? 'now')
                )
        );

        $entityManager->persist($pinball);
        $entityManager->flush();

        return $this->json(['id'=>$pinball->getId()]);
    }
}
