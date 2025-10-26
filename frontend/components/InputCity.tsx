import {Input} from "@/components/ui/input";
import {Loader2, MapPin} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useLanguage} from "@/lib/language-context";
import {useEffect, useState} from "react";
import {LocationResult} from "@/components/object/LocationResult";
import {useToast} from "@/hooks/use-toast";
import {QueryLocationResult} from "@/components/object/QueryLocationType";
import {key} from "@firebase/firestore/dist/firestore/test/util/helpers";

interface InputCityProps {
    onSelected?: (location: QueryLocationResult|null) => void
    presetLocation?: QueryLocationResult|null
}

export default function InputCity({onSelected, presetLocation}: InputCityProps) {
    const {t} = useLanguage();
    const [locationQuery, setLocationQuery] = useState("")
    const [locationResults, setLocationResults] = useState<LocationResult[]>([])
    const [selectedLocation, setSelectedLocation] = useState<QueryLocationResult | null>(null)
    const [searchingLocation, setSearchingLocation] = useState(false)
    const {toast} = useToast()

    const searchLocation = async (query: string) => {
        if (query.length < 3) {
            setLocationResults([])
            return
        }

        try {
            setSearchingLocation(true)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
                {
                    headers: {
                        "User-Agent": "CrazyPinball/1.0",
                    },
                },
            )
            const data = await response.json()
            const filteredData = data.filter((location: LocationResult) =>
                location.addresstype == "city" ||
                location.addresstype == "village" ||
                location.addresstype == "town" ||
                location.addresstype == "hamlet" ||
                location.addresstype == "suburb" ||
                location.addresstype == "neighbourhood" ||
                location.addresstype == "subdivision" ||
                location.addresstype == "locality" ||
                location.addresstype == "city_block" ||
                location.addresstype == "municipality"
            )

            setLocationResults(filteredData)
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible de rechercher la localisation. Veuillez réessayer.",
                variant: "destructive",
            })
        } finally {
            setSearchingLocation(false)
        }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            if (locationQuery) {
                searchLocation(locationQuery)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [locationQuery])

    useEffect(() => {
        if(!selectedLocation && presetLocation !== null)
            setSelectedLocation(presetLocation??null);
            setLocationQuery(presetLocation?.city ?? '');

    }, [presetLocation]);
    useEffect(() => {
        if(onSelected === undefined) return;
        onSelected(selectedLocation)

    }, [selectedLocation]);

    return (<>
        <div className="relative">
            <Input
                id="location-search-cmpt"
                type="text"
                required={true}
                placeholder={t('collection.searchCity')}
                value={locationQuery ?? presetLocation?.city}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="pr-10"
            />
            {searchingLocation && (
                <Loader2
                    className="w-4 h-4 animate-spin absolute right-3 top-3 text-muted-foreground"/>
            )}
        </div>
        {locationResults.length > 0 && !selectedLocation && (
            <div
                className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {locationResults.map((result, index) => {
                        if ((result.address.city || result.name)) {
                            return <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    const city = (result.address.city || result.name) + (result.address?.postcode ? ' (' + result.address?.postcode + ')' : '')
                                    setSelectedLocation({
                                        city,
                                        display_name: result.display_name,
                                        lat: Number.parseFloat(result.lat),
                                        lon: Number.parseFloat(result.lon),
                                    })
                                    setLocationQuery(city)
                                    setLocationResults([])
                                    console.log(result)
                                    onSelected?.(selectedLocation)
                                }}
                                className="w-full text-left p-3 hover:bg-muted transition-colors text-sm cursor-pointer"
                            >
                                <div className="font-medium">
                                    {result.address.city || result.name} {result.address?.postcode && (
                                    <span>({result.address?.postcode})</span>)}
                                </div>
                                <div
                                    className="text-xs text-muted-foreground truncate">
                                    {result.address?.county || result.address?.state_district || result.address?.state}, {result?.address.country}
                                </div>
                            </button>
                        }
                        return <div key={index}></div>;
                    }
                )}
            </div>
        )}
        {selectedLocation && (
            <div
                className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <MapPin
                    className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                    <div
                        className="font-medium text-sm">{selectedLocation.city}</div>
                    <div
                        className="text-xs text-muted-foreground">
                        Lat: {selectedLocation.lat?.toFixed(6)},
                        Lon:{" "}
                        {selectedLocation.lon?.toFixed(6)}
                    </div>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setSelectedLocation(null)
                        setLocationQuery("")
                    }}
                    className="h-auto p-1 cursor-pointer"
                >
                    ×
                </Button>
            </div>
        )}
    </>);

}
