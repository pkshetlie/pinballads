"use client"
import {ChevronDown, ChevronUp, Filter, Grid, List, MapPin, Search, Star, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {PinballDto} from "@/components/object/pinballDto";
import {PinballImageCarousel} from "@/components/PinballImageCarousel";
import {Manufacturers} from "@/components/object/manufacturer";
import {currencies} from "@/components/object/currencies";
import Link from "next/link";
import {useLanguage} from "@/lib/language-context";

interface PinballCardProps {
    machine: PinballDto // Added language prop
}

export function PinballCardToSell({machine}: PinballCardProps) {
  const {t} = useLanguage();

    return <Card noPadding={true} key={machine.id}
          className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
            <PinballImageCarousel machine={machine}></PinballImageCarousel>
            <div className="absolute top-3 right-3">
                <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {machine.condition}
                </Badge>
            </div>
        </div>
        <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-foreground text-lg leading-tight line-clamp-2">
                    {machine.name}
                </h4>
                <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                    <Star className="w-4 h-4 fill-accent text-accent"/>
                    {machine.rating ?? 5}
                </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
                {Manufacturers[machine.manufacturer]} • {machine.year}
            </p>
            <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-4">
                <User className="w-4 h-4"/>
                <div>{machine.currentOwner?.username}</div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <MapPin className="w-4 h-4"/>
                {machine.location?.city} {machine.distance && (<>- {machine.distance ?? 0} km away</>)}
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <div className="flex items-center justify-between w-full">
                                            <span
                                                className="text-xl font-bold text-primary">{currencies[machine.currency as keyof typeof currencies]}{machine.price.toLocaleString()}</span>
                <Link href={`/listings/detail?id=${machine.id}`}>

                    <Button size="sm" className={'cursor-pointer'} variant="outline">
                        {t("listings.viewDetails")}
                    </Button>
                </Link>
            </div>
        </CardFooter>
    </Card>


}
