import {UploadedImageResult} from "@/components/object/UploadedImageResult";

export type GameDto = {
    opdb_id: string
    is_machine: boolean
    name: string
    common_name: string | null
    shortname: string | null
    physical_machine: number
    ipdb_id: number | null
    manufacture_date: string | null
    manufacturer: {
        manufacturer_id: number
        name: string
        full_name: string
        created_at: string
        updated_at: string
    } | null
    type: string | null
    display: string | null
    player_count: number | null
    features: string[]
    keywords: string[]
    description: string | null
    created_at: string
    updated_at: string
    images: UploadedImageResult[];
}
