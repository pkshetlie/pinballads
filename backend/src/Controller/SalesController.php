<?php

namespace App\Controller;

use App\Entity\Pinball;
use App\Entity\PinballSale;
use App\Repository\PinballRepository;
use App\Service\DtoService;
use App\Service\PinballDistanceService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use function Doctrine\ORM\QueryBuilder;

final class SalesController extends AbstractController
{
    #[Route('/api/public/sales', name: 'app_sales', methods: ['POST'])]
    public function index(
        Request $request,
        DtoService $dtoService,
        PinballRepository $pinballRepository,
        PinballDistanceService $pinballDistanceService,
    ): Response {
        $limit = $request->query->get('limit', 20);
        $page = $request->query->get('page', 1);
        $page = $page - 1;

        $requestData = json_decode($request->getContent(), false);

        $qb = $pinballRepository
            ->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.pinballSales', 'ps')
            ->where('ps.finalPrice IS NULL')
            ->andWhere('ps.startPrice IS NOT NULL');

        /** @todo add filters
         * {
         * opdbId?: string | null,
         * game?: GameDto | null,
         * location: {
         *      lon: string|null,
         *      lat: string|null
         * },
         * price: {
         *  min: number,
         *  max: number,
         * currency: string,
         * },
         * distance: number,
         * manufacturers: string[],
         * conditions: string[],
         * features: string[],
         * decades: string[],
         * }
         *
         * */

        if (!empty($requestData->location) && !empty($requestData->location->lon) && !empty($requestData->location->lat) && !empty($requestData->distance)) {
            $qb->andWhere('ST_DWithin(ps.geography, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :distance) = true')
                ->setParameter('lon', $requestData->location->lon)
                ->setParameter('lat', $requestData->location->lat)
                ->setParameter('distance', $requestData->distance*1000);
        }

        if (!empty($requestData->game) && !empty($requestData->game->opdb_id)) {
            $qb->andWhere('p.opdbId = :opdbid')
                ->setParameter('opdbid', $requestData->game->opdb_id);
        } else if(!empty($requestData->opdbId)){
            $qb->andWhere('p.opdbId = :opdbid')
                ->setParameter('opdbid', $requestData->opdbId);
        }

        if (!empty($requestData->price)) {
            $qb->andWhere('ps.startPrice BETWEEN :minPrice AND :maxPrice')
                ->andWhere('ps.currency = :currency')
                ->setParameter('minPrice', (int)$requestData->price->min)
                ->setParameter('maxPrice', (int)$requestData->price->max)
                ->setParameter('currency', $requestData->price->currency ?? 'EUR');
        }

        if (!empty($requestData->conditions)) {
            $qb->andWhere($qb->expr()->in('p.condition', $requestData->conditions));
        }

        if (!empty($requestData->features)) {
            foreach ($requestData->features as $k => $feature) {
                $qb->andWhere("JSON_GET_TEXT(p.features,:feature{$k}) = TRUE")
                    ->setParameter("feature{$k}", $feature);
            }
        }

        if (!empty($requestData->decades)) {
            $orX = $qb->expr()->orX();

            foreach ($requestData->decades as $decade) {
                $orX->add($qb->expr()->between('p.year', $decade, (int)$decade + 10));
            }

            if ($orX->count() > 0) {
                $qb->andWhere($orX);
            }
        }

        if (!empty($requestData->manufacturers)) {
            $qb->andWhere($qb->expr()->in('p.manufacturer', $requestData->manufacturers));
        }


        $total = (clone $qb)->select('COUNT(p.id)')->getQuery()->getSingleScalarResult();
        $pinballs = $qb->setMaxResults($limit)
            ->setFirstResult($page * $limit)->getQuery()->getResult();

        if ($pinballs && !empty($requestData->location) && !empty($requestData->location->lon) && !empty($requestData->location->lat) && !empty($requestData->distance)) {
            $pinballDistanceService->setDistances($pinballs, $requestData->location->lat, $requestData->location->lon);
        }

        return $this->json([
            'pinballs' => $dtoService->toDtos($pinballs),
            'count' => count($pinballs),
            'total' => $total,
            'pages' => ceil($total / $limit),
        ]);
    }

    #[Route('/api/public/sales/machine/{id}', name: 'app_sales_machine', methods: ['GET'])]
    public function searchOne(
        Pinball $pinball,
        DtoService $dtoService,
    ): Response {
        if ($pinball->getPinballSales()->filter(
                fn(PinballSale $ps) => $ps->getFinalPrice() === null && $ps->getStartPrice() !== null && $ps->getSoldAt(
                    ) == null
            )->count() === 0) {
            return $this->json([], Response::HTTP_NOT_FOUND);
        }

        return $this->json($dtoService->toDto($pinball));
    }

    #[Route('/api/public/featured', name: 'app_featured', methods: ['GET'])]
    public function featured(
        Request $request,
        DtoService $dtoService,
        PinballRepository $pinballRepository,
    ): Response {
        $limit = $request->query->get('limit', 4);
        $page = $request->query->get('page', 1);
        $page = $page - 1;

        $qb = $pinballRepository
            ->createQueryBuilder('p')
            ->select('p')
            ->leftJoin('p.pinballSales', 'ps')
            ->where('ps.finalPrice IS NULL')
            ->andWhere('ps.startPrice IS NOT NULL');

        $total = (clone $qb)->select('COUNT(p.id)')->getQuery()->getSingleScalarResult();

        $pinballs = $qb->setMaxResults($limit)
            ->setFirstResult($page * $limit)->getQuery()->getResult();

        // if (!empty($requestData->location) && !empty($requestData->location->lon) && !empty($requestData->location->lat) && !empty($requestData->distance)) {
        //     $pinballDistanceService->setDistances($pinballs, $requestData->location->lat, $requestData->location->lon);
        // }
        return $this->json([
            'pinballs' => $dtoService->toDtos($pinballs),
            'count' => count($pinballs),
            'total' => $total,
            'pages' => ceil($total / $limit),
        ]);
    }
}
