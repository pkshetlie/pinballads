export type LocationResult = {
    display_name: string
    lat: string
    lon: string
    postcode: string
    county: string
    name: string
    address: {
        state_district: any;
        city?: string
        town?: string
        village?: string
        country?: string,
        county?: string,
        state?: string,
        postcode?: string
    }
}
