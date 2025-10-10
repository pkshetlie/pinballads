<?php

namespace App\Controller;

use App\Repository\PinballRepository;
use App\Repository\PinballSaleRepository;
use App\Service\DtoService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SalesController extends AbstractController
{
    #[Route('/api/sales', name: 'app_sales', methods: ['GET'])]
    public function index(
        Request $request,
        DtoService $dtoService,
        PinballRepository $pinballRepository,
    ): Response {
        $limit = $request->query->get('limit', 20);
        $page = $request->query->get('page', 1);
        $page = $page - 1;

        $qb = $pinballRepository
            ->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.pinballSales', 'ps')
            ->where('ps.finalPrice IS NULL');

        /** @todo add filters */


        $total = (clone $qb)->select('COUNT(p.id)')->getQuery()->getSingleScalarResult();

        $pinballs = $qb->setMaxResults($limit)
            ->setFirstResult($page * $limit)->getQuery()->getResult();


        return $this->json([
            'pinballs' => $dtoService->toDtos($pinballs),
            'count' => count($pinballs),
            'total' => $total,
            'pages' => ceil($total / $limit),
        ]);
    }
}
