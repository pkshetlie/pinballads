<?php

namespace App\Dto;

use App\Entity\MaintenanceLog;

class MaintenanceLogDto
{
    public ?int $id = null;
    public ?string $type = null;
    public ?string $date = null;
    public ?string $description = null;
    public ?string $cost = null;
    public ?string $notes = null;
    public ?array $parts = [];
    // public ?int $technician = null;

    /**
     * @param MaintenanceLog $maintenanceLog
     */
    public function __construct(MaintenanceLog $maintenanceLog)
    {
        $this->id = $maintenanceLog->getId();
        $this->type = $maintenanceLog->getType()->value;
        $this->date = $maintenanceLog->getDoneAt()?->format('Y-m-d');
        $this->description = $maintenanceLog->getDescription();
        $this->cost = $maintenanceLog->getCost();
        $this->notes = $maintenanceLog->getNotes();
        $this->parts = array_map(function($r) {return trim($r);}, explode(',', $maintenanceLog->getParts()));
    }
}
