<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ChangePasswordFormType;
use App\Form\ResetPasswordRequestFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\ResetPassword\Controller\ResetPasswordControllerTrait;
use SymfonyCasts\Bundle\ResetPassword\Exception\ResetPasswordExceptionInterface;
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

class ResetPasswordController extends AbstractController
{
    use ResetPasswordControllerTrait;

    public function __construct(
        private ResetPasswordHelperInterface $resetPasswordHelper,
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Display & process form to request a password reset.
     */
    #[Route('/api/public/reset-password', name: 'app_forgot_password_request', methods: ['POST'])]
    public function request(Request $request, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        $req = json_decode($request->getContent());


        return $this->processSendingPasswordReset($req->identifier, $mailer, $translator);
    }


    /**
     * Validates and process the reset URL that the user clicked in their email.
     */
    #[Route('/api/public/reset/{token}', name: 'app_reset_password')]
    public function reset(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        TranslatorInterface $translator,
        ?string $token = null
    ): Response {
        if (null === $token) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }

        try {
            /** @var User $user */
            $user = $this->resetPasswordHelper->validateTokenAndFetchUser($token);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json([], Response::HTTP_UNAUTHORIZED);
        }

        $post = json_decode($request->getContent());


        // A password reset token should be used only once, remove it.
        $this->resetPasswordHelper->removeResetRequest($token);

        /** @var string $plainPassword */
        $plainPassword = $post->password;
        // Encode(hash) the plain password, and set it.
        $user->setPassword($passwordHasher->hashPassword($user, $plainPassword));
        $this->entityManager->flush();

        return $this->json([], Response::HTTP_ACCEPTED);
    }

    private function processSendingPasswordReset(string $identifier, MailerInterface $mailer, TranslatorInterface $translator): Response
    {
        $user = $this->entityManager->getRepository(User::class)
            ->createQueryBuilder('u')
            ->where('u.email = :identifier')
            ->orWhere('u.displayName = :identifier')
            ->setParameter('identifier', $identifier)
           ->getQuery()->getOneOrNullResult();

        if (!$user) {
            return $this->json([], Response::HTTP_ACCEPTED);
        }

        try {
            $resetToken = $this->resetPasswordHelper->generateResetToken($user);
        } catch (ResetPasswordExceptionInterface $e) {
            return $this->json([], Response::HTTP_ACCEPTED);
        }

        $email = new TemplatedEmail()
            ->from(new Address('contact@crazy-pinball.com', 'Crazy-Pinball'))
            ->to((string) $user->getEmail())
            ->subject('Your password reset request')
            ->html($this->renderView('reset_password/email.html.twig', [
                'title' => 'Your password reset request',
                'resetToken' => $resetToken,
            ]))
        ;

        $mailer->send($email);

        $this->setTokenObjectInSession($resetToken);
        return $this->json([], Response::HTTP_ACCEPTED);
    }
}
