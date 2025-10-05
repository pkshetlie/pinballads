<?php

namespace App\Controller;

use App\Dto\PinballCollectionDto;
use App\Entity\PinballCollection;
use App\Repository\PinballCollectionRepository;
use App\Service\DtoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

final class CollectionController extends AbstractController
{
    #[Route('/api/collections', name: 'api_collection_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        PinballCollectionRepository $pinballCollectionRepository,
        TranslatorInterface $translator,
    ): Response {
        $data = json_decode($request->getContent(), false);

        $exists = $pinballCollectionRepository->findOneBy(['name' => $data->name, 'owner' => $this->getUser()]);

        if ($exists) {
            return $this->json(['error' => $translator->trans('Collection with this name already exists')],
                Response::HTTP_CONFLICT);
        }

        $pinballCollection = new PinballCollection()
            ->setDescription($data->description)
            ->setName($data->name)
            ->setIsPublic($data->isPublic ?? false)
            ->setOwner($this->getUser());

        $exists = $pinballCollectionRepository->findOneBy(['isDefault' => true, 'owner' => $this->getUser()]);

        if (!$exists) {
            $pinballCollection->setIsDefault(true);
        }

        $entityManager->persist($pinballCollection);
        $entityManager->flush();

        return $this->json(PinballCollectionDto::fromEntity($pinballCollection));
    }

    #[Route('/api/collections', name: 'api_collection_list', methods: ['GET'])]
    public function list(
        PinballCollectionRepository $pinballCollectionRepository,
        DtoService $dtoService,
    ): Response {
        $collections = $pinballCollectionRepository->findBy(['owner' => $this->getUser()]);

        return $this->json($dtoService->toDtos($collections));
    }

    #[Route('/api/collections/{id}', name: 'api_collection_delete', methods: ['DELETE'])]
    public function delete(
        PinballCollection $pinballCollection,
        EntityManagerInterface $entityManager,
        TranslatorInterface $translator,
    ): Response {
        if ($pinballCollection->getOwner() !== $this->getUser()) {
            return $this->json(['error' => $translator->trans('You are not the owner of this collection')],
                Response::HTTP_FORBIDDEN);
        }

        if ($pinballCollection->isDefault()) {
            return $this->json(['error' => $translator->trans('You cannot delete default collection')],
                Response::HTTP_FORBIDDEN);
        }

        $entityManager->remove($pinballCollection);
        $entityManager->flush();

        return $this->json([]);
    }

    #[Route('/api/collections/{id}', name: 'api_collection_put', methods: ['PUT'])]
    public function put(
        Request $request,
        PinballCollection $pinballCollection,
        EntityManagerInterface $entityManager,
        PinballCollectionRepository $pinballCollectionRepository,
        TranslatorInterface $translator,
    ): Response {
        if ($pinballCollection->getOwner() !== $this->getUser()) {
            return $this->json(['error' => $translator->trans('You are not the owner of this collection')],
                Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), false);

        $exists = $pinballCollectionRepository->createQueryBuilder('c')
            ->where('c.name = :name')
            ->andWhere('c.owner = :user')
            ->andWhere('c.id != :collectionId')
            ->setParameter('name', $data->name)
            ->setParameter('user', $this->getUser())
            ->setParameter('collectionId', $pinballCollection->getId())->getQuery()->getOneOrNullResult();

        if ($exists) {
            return $this->json(['error' => $translator->trans('Collection with this name already exists')],
                Response::HTTP_CONFLICT);
        }

        $pinballCollection
            ->setDescription($data->description)
            ->setName($data->name)
            ->setIsPublic($data->isPublic ?? false)
            ->setOwner($this->getUser());

        $entityManager->persist($pinballCollection);
        $entityManager->flush();

        return $this->json(PinballCollectionDto::fromEntity($pinballCollection));
    }

    #[Route('/api/collection/{id}', name: 'api_collection_list_pinballs', methods: ['GET'])]
    public function listPinballs(PinballCollection $pinballCollection, DtoService $dtoService): Response
    {
        if($pinballCollection->getOwner() !== $this->getUser() && !$pinballCollection->isDefault()) {
            return $this->json(['error' => 'You are not the owner of this collection'],
                Response::HTTP_FORBIDDEN);
        }

        return $this->json($dtoService->toDtos($pinballCollection->getPinballs()->toArray()));
    }
}
