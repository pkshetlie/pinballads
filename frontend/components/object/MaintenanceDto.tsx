export enum MaintenanceType{
    cleaning = "cleaning",
    repair = "repair",
    replacement = "replacement",
    upgrade = "upgrade",
    inspection = "inspection"
}

export interface MaintenanceEntry {
    id: string|null
    type: MaintenanceType
    date: string
    description: string
    cost?: number
    notes?: string
    parts?: string[]
    // technician?: string
}

export interface MaintenanceLogDto {
    entries: MaintenanceEntry[]
    lastServiceDate?: string
    totalMaintenanceCost?: number
}

export interface CreateMaintenanceEntryDto {
    date: string
    type: MaintenanceType
    description: string
    cost?: number
    notes?: string
    parts?: string[]
}
