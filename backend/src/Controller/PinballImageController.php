<?php

namespace App\Controller;

use App\Entity\Pinball;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

#[Route('/api/machines/{id}/images', name: 'api_machines_images', methods: ['POST'])]
class PinballImageController extends AbstractController
{
    #[Route('', name: 'upload_images', methods: ['POST'])]
    public function uploadImages(Request $request, Pinball $pinball, EntityManagerInterface $em): JsonResponse
    {
        $uploadedFiles = $request->files->get('images'); // "images[]" côté React
        if (!$uploadedFiles) {
            return $this->json(['error' => 'No files uploaded'], Response::HTTP_BAD_REQUEST);
        }

        $filesystem = new Filesystem();
        $imagePaths = [];

        foreach ($uploadedFiles as $file) {
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $safeName = preg_replace('/[^a-zA-Z0-9_-]/', '', $originalName);
            $newFilename = $safeName.'-'.uniqid().'.'.$file->guessExtension();

            try {
                $file->move($this->getParameter('pinball_images_directory'), $newFilename);
                $imagePaths[] = [
                    'title' => $originalName,
                    'url' => '/uploads/pinballs/'.$newFilename,
                ];
            } catch (FileException $e) {
                return $this->json(['error' => 'Failed to upload file'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        $pinball->setImages(array_merge($pinball->getImages() ?? [], $imagePaths));
        $em->flush();

        return $this->json([
            'success' => true,
            'images' => $imagePaths,
        ]);
    }
}
