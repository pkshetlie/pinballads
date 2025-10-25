<?php

namespace App\Service;

use App\Dto\PinballCollectionDto;
use App\Dto\PinballDto;
use App\Dto\PublicUserDto;
use App\Entity\Pinball;
use App\Entity\PinballCollection;
use App\Entity\User;
use App\Interface\DtoableInterface;
use App\Interface\DtoInterface;

class PinballDistanceService
{
    public function __construct()
    {

    }

    private function extractCoordinates(?string $geo): ?array
    {
        // Exemple de valeur : "SRID=4326;POINT(4.932676 47.5393136)"
        if (preg_match('/POINT\(([-0-9\.]+) ([-0-9\.]+)\)/', $geo, $matches)) {
            return [
                'lon' => (float) $matches[1],
                'lat' => (float) $matches[2],
            ];
        }

        return null;
    }

    public function setDistance(Pinball $pinball, float $lat2, float $lon2): void
    {
        $earthRadius = 6371000; // en mètres
        $coords = $this->extractCoordinates($pinball->getPinballCurrentSales()?->getGeography());

        if ($coords === null) {
            return;
        }

        $lat1 = $coords['lat'];
        $lon1 = $coords['lon'];
        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);

        $dLat = $lat2 - $lat1;
        $dLon = $lon2 - $lon1;

        $a = sin($dLat / 2) ** 2 +
            cos($lat1) * cos($lat2) * sin($dLon / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        $pinball->setDistance(round(($earthRadius * $c)/1000)); // distance en mètres
    }

    public function setDistances(array $pinballs, float $lat2, float $lon2): void
    {
        foreach ($pinballs as $pinball) {
            $this->setDistance($pinball, $lat2, $lon2);
        }
    }
}
