<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\UserRepository;
use App\Service\OpdbService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Transport\TransportInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

class OpdbController extends AbstractController
{

    #[Route('/test', methods: ['GET'])]
    public function test(
        Request $request,
        OpdbService $opdbService,
        TranslatorInterface $translator,
        TransportInterface $mailer,
        UserRepository $userRepository,
    ): Response {
        throw new \Exception('test');
        // $email = (new TemplatedEmail())
        //     ->from('contact@crazy-pinball.com')
        //     ->to('test-f85179@test.mailgenius.com')
        //     ->subject('Welcome mail')
        //     ->htmlTemplate('emails/welcome-email.html.twig')
        //     ->context([
        //         'TITLE' => 'Titre',
        //         'CONTENT' => 'Bonjour',
        //         'USER_NAME' => 'Rhokapa',
        //         'MACHINE_NAME' => 'DEADPOOL',
        //         'PRICE' => '8500€',
        //         'MACHINE_IMAGE' => '',
        //         'MANUFACTURER' => 'Stern',
        //         'CONDITION' => 'Nikel',
        //         'LOCATION' => 'France',
        //         'LISTING_URL' => 'https://crazy-pinball.com',
        //         'BASE_URL' => 'https://crazy-pinball.com',
        //         'YEAR' => '2025',
        //     ]);
        //
        //
        $user = $userRepository->find(2);


        $resetToken = $this->resetPasswordHelper->generateResetToken($user);

        // VarDumper::dump($mailer->send($email));die;
        return $this->render('reset_password/email.html.twig', [
            'title' => 'Your password reset request',
            'resetToken' => $resetToken,
        ]);

        return $this->json(['status' => 'Email sent']);
    }


    #[Route('/api/public/search/game/{opdbid}', methods: ['GET'])]
    public function index(string $opdbid, OpdbService $opdbService): JsonResponse
    {
        $machines = $opdbService->searchMachine($opdbid);

        return $this->json($machines);
    }

    #[Route('/api/public/search/game', methods: ['GET'])]
    public function test2(Request $request, OpdbService $opdbService): JsonResponse
    {
        $machines = $opdbService->searchMachineGroups($request->query->get('query'));

        return $this->json(array_values($machines));
    }
}
