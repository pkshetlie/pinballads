"use client"

import { Search, MapPin, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from '@/lib/auth-context';
import Navbar from "@/components/Navbar";

// Mock data for featured pinball machines
const featuredMachines = [
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
  },
]



export default function HomePage() {
  const { t } = useLanguage()
  const { login, user, logout } = useAuth(); // Récupère le contexte utilisateur

  return (
    <div className="min-h-screen bg-background">
    <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">{t("heroTitle")}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">{t("heroSubtitle")}</p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder={t("searchPlaceholder")} className="pl-10 h-12 text-lg" />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input placeholder={t("locationPlaceholder")} className="pl-10 h-12 text-lg" />
              </div>
              <Button size="lg" className="h-12 px-8">
                <Search className="w-5 h-5 mr-2" />
                {t("searchButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Machines */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">{t("featuredMachines")}</h3>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMachines.map((machine) => (
              <Card key={machine.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                  <img
                    src={machine.image || "/placeholder.svg"}
                    alt={machine.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground text-lg leading-tight">{machine.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      {machine.rating}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {machine.manufacturer} • {machine.year}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {machine.condition}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    {machine.location}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-2xl font-bold text-primary">${machine.price.toLocaleString()}</span>
                    <Button size="sm">{t("viewDetails")}</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">{t("browseByEra")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src="/vintage-pinball-machines-1970s.jpg"
                  alt="Vintage Pinball Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-semibold text-foreground mb-2">Vintage (1970s-1980s)</h4>
                <p className="text-muted-foreground">Classic electromechanical and early solid-state machines</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src="/modern-pinball-machines-1990s.jpg"
                  alt="Modern Pinball Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-semibold text-foreground mb-2">Modern (1990s-2000s)</h4>
                <p className="text-muted-foreground">DMD era machines with advanced features and themes</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src="/contemporary-pinball-machines-2010s.jpg"
                  alt="Contemporary Pinball Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-semibold text-foreground mb-2">Contemporary (2010s+)</h4>
                <p className="text-muted-foreground">Latest technology with LCD displays and interactive features</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
              <p className="text-muted-foreground text-sm">
                The premier marketplace for pinball enthusiasts worldwide.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">Marketplace</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Browse Machines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sell Your Machine
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Price Guide
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-foreground mb-3">Community</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Forums
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Events
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 PinballMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
