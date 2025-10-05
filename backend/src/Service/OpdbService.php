<?php

namespace App\Service;

use App\Dto\Opdb\ManufacturerDto;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Filesystem\Filesystem;
use App\Dto\Opdb\GameDto;

class OpdbService
{
    private $opdbUrl = 'https://opdb.org/api/export/?api_token=';
    private const LOCAL_FILE_PATH = __DIR__.'/../../var/opdb-data.json';

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly Filesystem $filesystem
    ) {
    }

    public function fetchAndSaveOpdbData(): array
    {
        $response = $this->httpClient->request('GET', $this->opdbUrl.$_ENV['OPDB_API_TOKEN']);
        $content = $response->getContent();

        $this->filesystem->dumpFile(self::LOCAL_FILE_PATH, $content);

        return json_decode($content, true);
    }

    public function getLocalOpdbData(): array
    {
        if (!$this->filesystem->exists(self::LOCAL_FILE_PATH)) {
            return $this->fetchAndSaveOpdbData();
        }

        return json_decode(file_get_contents(self::LOCAL_FILE_PATH), true);
    }

    public function searchMachineGroups(string $searchTerm): array
    {
        $data = $this->getLocalOpdbData();
        $machines = array_map(function($machine) {
            return [
                'opdbId' => $machine['opdb_id'],
                'isMachine' => $machine['is_machine'] ?? false,
                'isAlias' => $machine['is_alias'] ?? false,
                'name' => $machine['name'],
                'commonName' => $machine['common_name'] ?? null,
                'shortname' => $machine['shortname'] ?? null,
                'physicalMachine' => $machine['physical_machine'] ?? null,
                'ipdbId' => $machine['ipdb_id'] ?? null,
                'manufactureDate' => $machine['manufacture_date'] ?? null,
                'manufacturer' => $machine['manufacturer'] ?? null,
                'type' => $machine['type'] ?? null,
                'display' => $machine['display'] ?? null,
                'playerCount' => $machine['player_count'] ?? null,
                'features' => $machine['features'] ?? [],
                'keywords' => $machine['keywords'] ?? [],
                'description' => $machine['description'] ?? null,
                'createdAt' => $machine['created_at'],
                'updatedAt' => $machine['updated_at'],
                'images' => $machine['images'] ?? [],
            ];
        }, $data);

        $filteredMachines = array_filter($data, function ($machine) use ($searchTerm) {
            $name = strtolower($machine['name']);
            $shortname = strtolower($machine['shortname'] ?? '');
            $isAlias = strtolower($machine['isAlias'] ?? false);
            $manufacturer = strtolower($machine['manufacturer']['name'] ?? '');
            $manufacturerFullName = strtolower($machine['manufacturer']['full_name'] ?? '');
            $search = strtolower($searchTerm);

            return !str_contains($name, 'premium/le') && (similar_text($name, $search, $percentName) > 0 && $percentName > 80
                || (strlen($shortname) > 0 && similar_text(
                        $shortname,
                        $search,
                        $percentShort
                    ) > 0 && $percentShort > 60)
                || str_contains($name, $search)
                || (strlen($shortname) > 0 && str_contains($shortname, $search))
                || (strlen($manufacturerFullName) > 0 && str_contains($manufacturerFullName, $search))
                || (strlen($manufacturer) > 0 && str_contains($manufacturer, $search)));
        });

        $machineDtos = array_map(function ($machine) {
            $gameDto = new GameDto();
            $gameDto->opdbId = $machine['opdb_id'];
            $gameDto->isMachine = $machine['is_machine'] ?? false;
            $gameDto->name = $machine['name'];
            $gameDto->commonName = $machine['common_name'] ?? null;
            $gameDto->shortname = $machine['shortname'] ?? null;
            $gameDto->physicalMachine = $machine['physical_machine'] ?? 0;
            $gameDto->ipdbId = $machine['ipdb_id'] ?? null;
            $gameDto->manufactureDate = $machine['manufacture_date'] ?? null;
            $gameDto->type = $machine['type'] ?? null;
            $gameDto->display = $machine['display'] ?? null;
            $gameDto->playerCount = $machine['player_count'] ?? null;
            $gameDto->features = $machine['features'] ?? [];
            $gameDto->keywords = $machine['keywords'] ?? [];
            $gameDto->description = $machine['description'] ?? null;
            $gameDto->createdAt = $machine['created_at'];
            $gameDto->updatedAt = $machine['updated_at'];
            $gameDto->images = $machine['images'] ?? [];

            if (isset($machine['manufacturer'])) {
                $manufacturerDto = new ManufacturerDto();
                $manufacturerDto->name = $machine['manufacturer']['name'] ?? null;
                $manufacturerDto->fullName = $machine['manufacturer']['full_name'] ?? null;
                $gameDto->manufacturer = $manufacturerDto;
            }

            return $gameDto;
        }, $filteredMachines);

        return $machineDtos;
    }
}
