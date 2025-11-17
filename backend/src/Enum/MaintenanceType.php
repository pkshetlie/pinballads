<?php

namespace App\Enum;

enum MaintenanceType: string
{
    case CLEANING = "cleaning";
    case REPAIR = "repair";
    case REPLACEMENT = "replacement";
    case UPGRADE = "upgrade";
    case INSPECTION = "inspection";
}
