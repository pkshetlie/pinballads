"use client"

import { Search, MapPin, Star, Filter, Grid, List, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"
import { useState } from "react"
import Navbar from "@/app/components/Navbar";

// Mock data for pinball machine listings
const pinballMachines = [
  {
    id: 1,
    title: "Medieval Madness",
    manufacturer: "Williams",
    year: 1997,
    price: 8500,
    location: "Los Angeles, CA",
    image: "/medieval-madness-pinball-machine.jpg",
    rating: 4.8,
    condition: "Excellent",
    distance: "5 miles",
  },
  {
    id: 2,
    title: "Attack from Mars",
    manufacturer: "Bally",
    year: 1995,
    price: 7200,
    location: "Chicago, IL",
    image: "/attack-from-mars-pinball-machine.jpg",
    rating: 4.7,
    condition: "Very Good",
    distance: "12 miles",
  },
  {
    id: 3,
    title: "The Twilight Zone",
    manufacturer: "Bally",
    year: 1993,
    price: 6800,
    location: "New York, NY",
    image: "/twilight-zone-pinball-machine.jpg",
    rating: 4.9,
    condition: "Excellent",
    distance: "8 miles",
  },
  {
    id: 4,
    title: "Cirqus Voltaire",
    manufacturer: "Bally",
    year: 1997,
    price: 5500,
    location: "Austin, TX",
    image: "/cirqus-voltaire-pinball-machine.jpg",
    rating: 4.6,
    condition: "Good",
    distance: "15 miles",
  },
  {
    id: 5,
    title: "The Addams Family",
    manufacturer: "Bally",
    year: 1992,
    price: 6200,
    location: "Seattle, WA",
    image: "/addams-family-pinball-machine.jpg",
    rating: 4.8,
    condition: "Very Good",
    distance: "22 miles",
  },
  {
    id: 6,
    title: "Indiana Jones",
    manufacturer: "Williams",
    year: 1993,
    price: 5800,
    location: "Denver, CO",
    image: "/indiana-jones-pinball-machine.jpg",
    rating: 4.5,
    condition: "Good",
    distance: "18 miles",
  },
  {
    id: 7,
    title: "Star Trek: The Next Generation",
    manufacturer: "Williams",
    year: 1993,
    price: 5200,
    location: "Phoenix, AZ",
    image: "/star-trek-next-generation-pinball-machine.jpg",
    rating: 4.4,
    condition: "Good",
    distance: "25 miles",
  },
  {
    id: 8,
    title: "Theatre of Magic",
    manufacturer: "Bally",
    year: 1995,
    price: 4800,
    location: "Portland, OR",
    image: "/theatre-of-magic-pinball-machine.jpg",
    rating: 4.6,
    condition: "Fair",
    distance: "30 miles",
  },
  {
    id: 9,
    title: "Scared Stiff",
    manufacturer: "Bally",
    year: 1996,
    price: 5600,
    location: "Miami, FL",
    image: "/scared-stiff-pinball-machine.jpg",
    rating: 4.7,
    condition: "Very Good",
    distance: "35 miles",
  },
  {
    id: 10,
    title: "White Water",
    manufacturer: "Williams",
    year: 1993,
    price: 4200,
    location: "Boston, MA",
    image: "/white-water-pinball-machine.jpg",
    rating: 4.3,
    condition: "Good",
    distance: "40 miles",
  },
  {
    id: 11,
    title: "Creature from the Black Lagoon",
    manufacturer: "Bally",
    year: 1992,
    price: 4900,
    location: "San Francisco, CA",
    image: "/creature-from-black-lagoon-pinball-machine.jpg",
    rating: 4.5,
    condition: "Good",
    distance: "45 miles",
  },
  {
    id: 12,
    title: "Fish Tales",
    manufacturer: "Williams",
    year: 1992,
    price: 3800,
    location: "Atlanta, GA",
    image: "/fish-tales-pinball-machine.jpg",
    rating: 4.2,
    condition: "Fair",
    distance: "50 miles",
  },
]

function FilterSidebar({ className = "" }: { className?: string }) {
  const { t } = useLanguage()
  const [priceRange, setPriceRange] = useState([1000, 15000])
  const [distanceRange, setDistanceRange] = useState([50])
  const [manufacturerOpen, setManufacturerOpen] = useState(true)
  const [yearOpen, setYearOpen] = useState(true)
  const [conditionOpen, setConditionOpen] = useState(true)

  const manufacturers = [
    { name: "Williams", count: 45 },
    { name: "Bally", count: 38 },
    { name: "Stern", count: 32 },
    { name: "Gottlieb", count: 28 },
    { name: "Data East", count: 15 },
    { name: "Sega", count: 12 },
  ]

  const conditions = [
    { name: "Excellent", count: 23 },
    { name: "Very Good", count: 34 },
    { name: "Good", count: 28 },
    { name: "Fair", count: 15 },
    { name: "Poor", count: 8 },
  ]

  const decades = [
    { name: "2020s", count: 8 },
    { name: "2010s", count: 15 },
    { name: "2000s", count: 22 },
    { name: "1990s", count: 45 },
    { name: "1980s", count: 28 },
    { name: "1970s", count: 12 },
  ]

  return (
    <div className={`bg-card border-r h-full ${className}`}>
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-foreground">{t("listings.filters")}</h3>
        <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground hover:text-foreground">
          {t("listings.clearAll")}
        </Button>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Price Range Filter */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">{t("listings.priceRange")}</h4>
          <div className="space-y-3">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={20000}
              min={500}
              step={100}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Min" value={priceRange[0]} className="h-8 text-sm" readOnly />
              <Input placeholder="Max" value={priceRange[1]} className="h-8 text-sm" readOnly />
            </div>
          </div>
        </div>

        {/* Distance Filter */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">{t("listings.distance")}</h4>
          <div className="space-y-3">
            <Slider
              value={distanceRange}
              onValueChange={setDistanceRange}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              {t("listings.within")} {distanceRange[0]} {t("listings.miles")}
            </div>
          </div>
        </div>

        {/* Manufacturer Filter */}
        <Collapsible open={manufacturerOpen} onOpenChange={setManufacturerOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h4 className="font-medium text-foreground">{t("listings.manufacturer")}</h4>
            {manufacturerOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {manufacturers.map((manufacturer) => (
              <div key={manufacturer.name} className="flex items-center space-x-2">
                <Checkbox id={`manufacturer-${manufacturer.name}`} />
                <Label
                  htmlFor={`manufacturer-${manufacturer.name}`}
                  className="text-sm text-foreground cursor-pointer flex-1"
                >
                  {manufacturer.name}
                </Label>
                <span className="text-xs text-muted-foreground">({manufacturer.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Year/Decade Filter */}
        <Collapsible open={yearOpen} onOpenChange={setYearOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h4 className="font-medium text-foreground">{t("listings.era")}</h4>
            {yearOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {decades.map((decade) => (
              <div key={decade.name} className="flex items-center space-x-2">
                <Checkbox id={`decade-${decade.name}`} />
                <Label htmlFor={`decade-${decade.name}`} className="text-sm text-foreground cursor-pointer flex-1">
                  {decade.name}
                </Label>
                <span className="text-xs text-muted-foreground">({decade.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Condition Filter */}
        <Collapsible open={conditionOpen} onOpenChange={setConditionOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h4 className="font-medium text-foreground">{t("listings.condition")}</h4>
            {conditionOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {conditions.map((condition) => (
              <div key={condition.name} className="flex items-center space-x-2">
                <Checkbox id={`condition-${condition.name}`} />
                <Label
                  htmlFor={`condition-${condition.name}`}
                  className="text-sm text-foreground cursor-pointer flex-1"
                >
                  {condition.name}
                </Label>
                <span className="text-xs text-muted-foreground">({condition.count})</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Features Filter */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">{t("listings.features")}</h4>
          <div className="space-y-3">
            {["LED Upgrade", "Sound Upgrade", "Topper", "Shaker Motor", "Custom Mods"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox id={`feature-${feature}`} />
                <Label htmlFor={`feature-${feature}`} className="text-sm text-foreground cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  const { t } = useLanguage()
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      {/* Search and Filter Bar */}
      <section className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Inputs */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder={t("listings.searchPlaceholder")} className="pl-10 h-11" defaultValue="" />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder={t("listings.locationPlaceholder")} className="pl-10 h-11" defaultValue="" />
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <Select defaultValue="relevance">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={t("listings.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">{t("listings.relevance")}</SelectItem>
                  <SelectItem value="price-low">{t("listings.priceLowHigh")}</SelectItem>
                  <SelectItem value="price-high">{t("listings.priceHighLow")}</SelectItem>
                  <SelectItem value="year-new">{t("listings.yearNewest")}</SelectItem>
                  <SelectItem value="year-old">{t("listings.yearOldest")}</SelectItem>
                  <SelectItem value="distance">{t("listings.distance")}</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="sm" className="rounded-r-none">
                  <Grid className="w-4 h-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" size="sm" className="rounded-l-none">
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent lg:hidden">
                    <Filter className="w-4 h-4" />
                    {t("listings.filters")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle>{t("listings.filters")}</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar />
                </SheetContent>
              </Sheet>

              <Button variant="outline" className="gap-2 bg-transparent hidden lg:flex">
                <Filter className="w-4 h-4" />
                {t("listings.filters")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 min-h-screen">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Results Header */}
          <section className="container mx-auto px-4 py-6 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{t("listings.pinballMachines")}</h2>
                <p className="text-muted-foreground">
                  {pinballMachines.length} {t("listings.machinesFound")}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {t("listings.showing")} 1-{pinballMachines.length} {t("listings.of")} {pinballMachines.length}{" "}
                {t("listings.results")}
              </div>
            </div>
          </section>

          {/* Listings Grid */}
          <section className="container mx-auto px-4 pb-12 lg:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {pinballMachines.map((machine) => (
                <Card key={machine.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                    <img
                      src={machine.image || "/placeholder.svg"}
                      alt={machine.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/90 text-foreground">
                        {machine.condition}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-foreground text-lg leading-tight line-clamp-2">
                        {machine.title}
                      </h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground ml-2">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        {machine.rating}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {machine.manufacturer} • {machine.year}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      {machine.location}
                    </div>
                    <div className="text-xs text-muted-foreground">{machine.distance} away</div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xl font-bold text-primary">${machine.price.toLocaleString()}</span>
                      <Button size="sm" variant="outline">
                        {t("listings.viewDetails")}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Pagination */}
          <section className="container mx-auto px-4 pb-12 lg:px-6">
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" disabled>
                {t("listings.previous")}
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <span className="text-muted-foreground px-2">...</span>
              <Button variant="outline" size="sm">
                10
              </Button>
              <Button variant="outline">{t("listings.next")}</Button>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-foreground">PinballMarket</span>
              </div>
              <p className="text-muted-foreground text-sm">{t("footer.premierMarketplace")}</p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">{t("footer.marketplace")}</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.browseMachines")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.sellYourMachine")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.priceGuide")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">{t("footer.support")}</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.helpCenter")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.safetyTips")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.contactUs")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">{t("footer.community")}</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.forums")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.events")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    {t("footer.newsletter")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PinballMarket. {t("footer.allRightsReserved")}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
