<?php

namespace App\Controller;

use App\Entity\Pinball;
use App\Entity\PinballCollection;
use App\Entity\PinballOwner;
use App\Service\DtoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

final class MachineController extends AbstractController
{
    #[Route('/api/collection/{id}/machine', name: 'api_collection_machine_create', methods: ['POST'])]
    public function createMachine(
        PinballCollection $pinballCollection,
        Request $request,
        EntityManagerInterface $entityManager,
        TranslatorInterface $translator,
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

        if ($pinballCollection->getOwner() !== $this->getUser()) {
            return $this->json(['error' => $translator->trans('You are not the owner of this collection')],
                Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), false);


        $pinball = new Pinball()
            ->setOpdbId($data->opdbId)
            ->setDescription($data->description)
            ->setName($data->name)
            ->setCondition($data->condition)
            ->setYear($data->year)
            ->setFeatures((array)$data->features)
            ->setCurrentOwner($this->getUser())
            ->setManufacturer($data->manufacturer);

        $pinballCollection->addPinball($pinball);

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

    #[Route('/api/machine/{id}', name: 'api_collection_machine_update', methods: ['PUT'])]
    public function update(
        Pinball $pinball,
        Request $request,
        EntityManagerInterface $entityManager,
        DtoService $pinballService,
    ): Response {
        $data = json_decode($request->getContent(), false);

        $pinball
            ->setOpdbId($data->opdbId)
            ->setDescription($data->description)
            ->setName($data->name)
            ->setCondition($data->condition)
            ->setYear($data->year)
            ->setFeatures((array)$data->features)
            ->setCurrentOwner($this->getUser())
            ->setManufacturer($data->manufacturer);

        $pinballOwner = $pinball->getPinballOwners()->filter(function(PinballOwner $po) {
            if ($po->getOwner() === $this->getUser()) {
                if ($po->getEndAt() === null) {
                    return true;
                }
            }

            return false;
        })->first();

        $date = \DateTimeImmutable::createFromFormat(
            'Y-m-d',
            empty($data->startDate) ? date('Y-m-d') : $data->startDate
        )?->setTime(0, 0, 0);

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

    #[Route('/api/machine/{id}', name: 'api_collection_machine_get_one', methods: ['GET'])]
    public function getOne(
        Pinball $pinball,
        DtoService $pinballService,
    ): Response {
        return $this->json($pinballService->toDto($pinball));
    }

    #[Route('/api/machine/{id}/images', name: 'api_collection_machine_image', methods: ['POST'])]
    public function addImage(
        Request $request,
        Pinball $pinball,
        DtoService $pinballService,
        TranslatorInterface $translator,
        EntityManagerInterface $entityManager,
    ): Response {

        if ($pinball->getCurrentOwner() !== $this->getUser()) {
            return $this->json(['error' => $translator->trans('You are not the owner of this machine')],
                Response::HTTP_FORBIDDEN);
        }

        $uploadedFiles = $request->files->all('images');
        $titles = $request->request->all('titles');
        $uids = $request->request->all('uids');

        if (empty($titles)) {
            return $this->json(['error' => $translator->trans('No files uploaded')], 400);
        }

        $uploadedFilePaths = [];

        /** @var UploadedFile $file */
        foreach ($titles as $key => $title) {
            $file = $uploadedFiles[$key] ?? null;
            if ($file instanceof UploadedFile && $uids[$key] == 'none') {
                // Valider le fichier si nécessaire (type, taille, etc.)
                if (!$file->isValid()) {
                    return $this->json(
                        ['error' => $translator->trans('Invalid file upload').':'.$file->getErrorMessage()],
                        400
                    );
                }

                // Définir un chemin de sauvegarde (par ex. un dossier "uploads")
                $uploadDir = $this->getParameter('pinball_images_directory'); // Défini dans `services.yaml` ou `.env`
                $newFilename = uniqid('upload_', true).'.webp';

                // Charger l'image d'origine
                $image = imagecreatefromstring(file_get_contents($file->getRealPath()));

                // Récupérer les dimensions de l'image
                $width = imagesx($image);
                $height = imagesy($image);

                // Redimensionner si nécessaire (max 2000x2000)
                if ($width > 2000 || $height > 2000) {
                    $ratio = min(2000 / $width, 2000 / $height);
                    $newWidth = $width * $ratio;
                    $newHeight = $height * $ratio;
                    $resized = imagecreatetruecolor($newWidth, $newHeight);
                    imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    $image = $resized;
                }

                // // Ajouter le filigrane
                // $black = imagecolorallocatealpha($image, 0, 0, 0, 100);
                // $fontSize = min($width, $height) * 0.05;
                // $angle = -45;
                // imagettftext(
                //     $image,
                //     $fontSize,
                //     $angle,
                //     $width / 4,
                //     $height / 2,
                //     $black,
                //     __DIR__.'/../../public/fonts/Sweet Toffee.ttf',
                //     'Crazy-pinball.com'
                // );

                // Sauvegarder en WebP
                imagewebp($image, $uploadDir.'/'.$newFilename, 80);

                imagedestroy($image);
                // Ajouter le chemin du fichier sauvegardé à la liste
                $uploadedFilePaths[] = [
                    'url' => '/uploads/pinballs/'.$newFilename,
                    'title' => $titles[$key] ?? "Picture ".$key,
                    'uid' => uniqid(),
                    'created_at' => new \DateTimeImmutable(),
                ];
            } else {
                foreach ($pinball->getImages() as $image) {
                    if ($image['uid'] == $uids[$key]) {
                        $image['title'] = $titles[$key] ?? "Picture ".$key;
                        $uploadedFilePaths[] = $image;
                    }
                }
            }
        }
        //[{"url":"\/uploads\/pinballs\/upload_68e2d22d35bf11.54831852.webp","title":"Pinball","uid":"68e2d22d576c2","created_at":{"date":"2025-10-05 20:16:45.358105","timezone_type":3,"timezone":"UTC"}},{"url":"\/uploads\/pinballs\/upload_68e2d22d577005.78958778.webp","title":"Rhokapa","uid":"68e2d22d681ba","created_at":{"date":"2025-10-05 20:16:45.426438","timezone_type":3,"timezone":"UTC"}},{"url":"\/uploads\/pinballs\/upload_68e2d22d681f10.60067721.webp","title":"Skull","uid":"68e2d22d9c57b","created_at":{"date":"2025-10-05 20:16:45.640392","timezone_type":3,"timezone":"UTC"}}]
        $fileSystem = new Filesystem();
        // Remove old images
        foreach ($pinball->getImages() as $oldImage) {
            if (isset($oldImage['url']) && $fileSystem->exists($oldImage['url']) && in_array($oldImage['uid'], $uids)) {
                $fileSystem->remove($oldImage['url']);
            }
        }

        $pinball->setImages($uploadedFilePaths);
        $entityManager->flush();

        // Réponse JSON avec le statut et les chemins des fichiers uploadés
        return $this->json([
            'status' => 'success',
            'files' => $uploadedFilePaths,
        ]);

    }

    #[Route('/api/machine/{id}', name: 'api_collection_machine_delete', methods: ['DELETE'])]
    public function delete(
        Pinball $pinball,
        EntityManagerInterface $entityManager,
        TranslatorInterface $translator,
    ): Response {
        if ($pinball->getCurrentOwner() !== $this->getUser()) {
            return $this->json(['error' => $translator->trans('You are not the owner of this machine')],
                Response::HTTP_FORBIDDEN);
        }

        $uploadDir = $this->getParameter('pinball_images_directory'); // Défini dans `services.yaml` ou `.env`
        $fileSystem = new Filesystem();

        foreach ($pinball->getImages() as $image) {
            if (isset($image['url'])) {
                $file = $uploadDir.'/'.str_replace('/uploads/pinballs/', '', $image['url']);
                if ($fileSystem->exists($file)) {
                    $fileSystem->remove($file);
                }
            }
        }

        $entityManager->remove($pinball);
        $entityManager->flush();

        return $this->json([]);
    }

}
