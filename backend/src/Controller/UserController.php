<?php
namespace App\Controller;

use App\Dto\PrivateUserDto;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\DtoService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatableInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserController extends AbstractController
{
    #[Route('/api/user/me', methods: ['GET'])]
    public function refresh(DtoService $dtoService): Response
    {
        return $this->json(new PrivateUserDto($this->getUser()));
    }

    #[Route('/api/settings', methods: ['POST'])]
    public function settingsSave(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager, TranslatorInterface $translator): Response
    {
        $requ = json_decode($request->getContent(), true);

        $settings = $this->getUser()->getSettings();


        /** @var User $user */
        $user = $this->getUser();

        if ($requ['user']['email'] ?? null) {
            $emailUser = $userRepository->createQueryBuilder('u')
                ->where('u.id != :id')
                ->andWhere('u.email = :email')
                ->setParameter('id', $user->getId())
                ->setParameter('email', $requ['user']['email'])
                ->getQuery()->getOneOrNullResult();

            if ($emailUser) {
                return $this->json(['error' => $translator->trans('Email already exists')], Response::HTTP_BAD_REQUEST);
            }
        }

        $user->setEmail($requ['user']['email']);

        if ($user->getDisplayName() != $requ['user']['displayName'] && $requ['user']['displayName'] ?? null) {
            $lastChange = isset($settings['lastUsernameChange'])
                ? new \DateTimeImmutable($settings['lastUsernameChange'])
                : null;

            if ($lastChange === null) {
                $canChange = true;
            } else {
                $nextAllowed = $lastChange->modify('+30 days');
                $canChange = (new \DateTimeImmutable('now', new \DateTimeZone('UTC'))) >= $nextAllowed;
            }

            if ($canChange) {
                $user->setDisplayName($requ['user']['displayName']);
                $settings['lastUsernameChange'] = (new \DateTimeImmutable('now', new \DateTimeZone('UTC')))->format(DATE_ATOM);
            } else {
                return $this->json(['error' => $translator->trans('You can only change your username every 30 days')], Response::HTTP_BAD_REQUEST);
            }
        }

        $user->setSettings($settings);
        $entityManager->flush();

        return $this->json(new PrivateUserDto($user));
    }
}
