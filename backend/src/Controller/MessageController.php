<?php

namespace App\Controller;

use App\Dto\ConversationDto;
use App\Entity\Conversation;
use App\Entity\Message;
use App\Entity\Pinball;
use App\Repository\ConversationRepository;
use App\Repository\PinballRepository;
use App\Service\DtoService;
use App\Service\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Translation\Translator;
use Symfony\Contracts\Translation\TranslatorInterface;

final class MessageController extends AbstractController
{
    #[Route('/api/messages/send', name: 'app_message_send', methods: ['POST'])]
    public function send(
        Request $request,
        PinballRepository $pinballRepository,
        ConversationRepository $conversationRepository,
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        TranslatorInterface $translator,
        UserService $userService,
    ): Response {
        $req = json_decode($request->getContent());

        if (!empty($req->pinballId)) {
            /** @var Pinball $pinball */
            $pinball = $pinballRepository->find($req->pinballId);

            if (!$pinball) {
                return $this->json(['error' => 'Pinball not found'], Response::HTTP_NOT_FOUND);
            }

            $sales = $pinball->getPinballCurrentSales();

            if (!$sales) {
                return $this->json(['error' => 'Pinball not found'], Response::HTTP_NOT_FOUND);
            }
        }

        
        
        if (!empty($req->message)) {
            $message = new Message()
                ->setText($req->message)
                ->setSender($this->getUser())
                ->setRecipient($pinball->getCurrentOwner());
            $subject = 'New message from {username}';
            $template = 'emails/'.$translator->getLocale().'/message/notification.html.twig';

            if (!empty($req->offerAmount)) {
                $message->setOffer($req->offerAmount);
                $subject = 'New message with offer from {username}';
                $template = 'emails/'.$translator->getLocale().'/message/offer.html.twig';
            }

            [$userA, $userB] = $userService->sortPair($this->getUser(), $pinball->getCurrentOwner());

            $conversation = $conversationRepository->findOneBy([
                'userA' => $userA,
                'userB' => $userB,
                'pinball' => $pinball,
            ]);

            if (!$conversation) {
                $conversation = new Conversation()
                    ->setUserA($userA)
                    ->setUserB($userB)
                    ->setPinball($pinball)
                    ->setLastMessageAt(new \DateTimeImmutable());
                $entityManager->persist($conversation);
            }

            $message->setConversation($conversation);
            $conversation->addMessage($message);

            $entityManager->persist($message);
            $entityManager->flush();

            $email = new TemplatedEmail()
                ->from(new Address('contact@crazy-pinball.com', 'Crazy-Pinball'))
                ->to($pinball->getCurrentOwner()->getEmail())
                ->bcc('roriklokisson@gmail.com')
                ->subject($translator->trans($subject, ['{username}' => $this->getUser()->getDisplayName()]))
                ->htmlTemplate($template)
                ->context([
                    'subject' => $subject,
                    'seller_name' => $pinball->getCurrentOwner()->getDisplayName(),
                    'buyer_name' => $this->getUser()->getDisplayName(),
                    'message' => $message->getText(),
                    'offer' => $message->getOffer(),
                    'pinball' => $pinball,
                    'currency' => $sales->getCurrencySign(),
                    'price' => $sales->getStartPrice(),
                ]);

            $mailer->send($email);
        } else {
            return $this->json(['error' => 'Message is empty'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json([], Response::HTTP_ACCEPTED);
    }

    #[Route('/api/conversations', name: 'app_message', methods: ['GET'])]
    public function get(ConversationRepository $conversationRepository, DtoService $dtoService): Response
    {
        $qb = $conversationRepository->createQueryBuilder('c')
            ->select('c');

        $result = $qb
            ->where(
                $qb->expr()->orX(
                    'c.userA = :owner',
                    'c.userB = :owner'
                )
            )
            ->setParameter('owner', $this->getUser())
            ->orderBy('c.lastMessageAt', 'DESC')
            ->getQuery()->getResult();

        return $this->json($dtoService->toDtos($result));
    }

    #[Route('/api/conversations/{id}/response', name: 'app_message_response', methods: ['POST'])]
    public function response(
        Conversation $conversation,
        Request $request,
        EntityManagerInterface $entityManager,
        TranslatorInterface $translator,
        MailerInterface $mailer,
    ): Response {
        if ($conversation->getUserA() !== $this->getUser() && $conversation->getUserB() !== $this->getUser()) {
            return $this->json(['error' => 'You are not the owner of this conversation'], Response::HTTP_FORBIDDEN);
        }

        $req = json_decode($request->getContent());

        if (!empty($req->message)) {
            $message = new Message()
                ->setIsRead(false)
                ->setText($req->message)
                ->setSender($this->getUser())
                ->setRecipient(
                    $conversation->getUserA() === $this->getUser() ? $conversation->getUserB() : $conversation->getUserA()
                );

            $conversation->addMessage($message);
            $entityManager->persist($message);
            $entityManager->flush();

            $subject = 'New response from {username}';
            $template = 'emails/'.$message->getRecipient()->getLanguage().'/message/response.html.twig';
            $pinball = $conversation->getPinball();
            $sales = $pinball->getPinballCurrentSales();

            $email = new TemplatedEmail()
                ->from(new Address('contact@crazy-pinball.com', 'Crazy-Pinball'))
                ->to($message->getRecipient()->getEmail())
                ->bcc('roriklokisson@gmail.com')
                ->subject($translator->trans($subject, ['{username}' => $this->getUser()->getDisplayName()],  locale: $message->getRecipient()->getLanguage()))
                ->htmlTemplate($template)
                ->context([
                    'subject' => $subject,
                    'recipient_name' => $message->getRecipient()->getDisplayName(),
                    'sender_name' => $message->getSender()->getDisplayName(),
                    'message' => $message->getText(),
                    'offer' => $message->getOffer(),
                    'pinball' => $pinball,
                    'currency' => $sales->getCurrencySign(),
                    'price' => $sales->getStartPrice(),
                ]);
            $mailer->send($email);
        }

        return $this->json(new ConversationDto($conversation), Response::HTTP_OK);
    }

    #[Route('/api/conversations/{id}', name: 'app_message_patch', methods: ['PATCH'])]
    public function read(Conversation $conversation, Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($conversation->getUserA() !== $this->getUser() && $conversation->getUserB() !== $this->getUser()) {
            return $this->json(['error' => 'You are not the owner of this conversation'], Response::HTTP_FORBIDDEN);
        }

        $req = json_decode($request->getContent());

        if (!empty($req->read)) {
            foreach ($conversation->getMessages() as $message) {
                if ($message->getRecipient() === $this->getUser()) {
                    $message->setIsRead(true);
                }
            }

            $entityManager->flush();
        }

        return $this->json(new ConversationDto($conversation), Response::HTTP_OK);
    }


    #[Route('/api/messages/score', name: 'app_message_score', methods: ['POST'])]
    public function score(): Response
    {
        return $this->render('message/index.html.twig', [
            'controller_name' => 'MessageController',
        ]);
    }
}
