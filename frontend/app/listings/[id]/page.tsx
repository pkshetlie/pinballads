import {
  ArrowLeft,
  Star,
  MapPin,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  Shield,
  Calendar,
  Gauge,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Link from "next/link"

// Mock data for a detailed pinball machine
const pinballMachine = {
  id: 1,
  title: "Medieval Madness",
  manufacturer: "Williams",
  year: 1997,
  price: 8500,
  location: "Los Angeles, CA",
  condition: "Excellent",
  rating: 4.8,
  reviewCount: 24,
  distance: "5 miles",
  description: `This Medieval Madness is in exceptional condition and has been lovingly maintained by a collector. The playfield is pristine with minimal wear, all original plastics are intact, and the cabinet artwork is vibrant. This machine features the classic medieval theme with castle destruction, catapult action, and the famous "Catapult Multiball."

The machine has been kept in a climate-controlled environment and played regularly but carefully. All mechanisms are working perfectly, including the castle gate, drawbridge, catapult, and trolls. The sound system has been upgraded with new speakers for crystal clear audio.

Recent maintenance includes new rubber rings, fresh wax on the playfield, and LED upgrades throughout. This is a must-have for any serious collector or someone looking to own one of the greatest pinball machines ever made.`,
  features: [
    "LED Playfield Lighting Upgrade",
    "New Rubber Rings (2024)",
    "Fresh Playfield Wax",
    "Upgraded Sound System",
    "All Original Plastics",
    "Climate Controlled Storage",
    "Regular Professional Maintenance",
  ],
  specifications: {
    players: "1-4",
    flippers: "2",
    ramps: "3",
    multiball: "Yes",
    manufacturer: "Williams",
    designer: "Brian Eddy",
    artist: "Greg Freres",
    sound: "Dan Forden",
  },
  images: [
    "/medieval-madness-pinball-machine.jpg",
    "/medieval-madness-playfield.jpg",
    "/medieval-madness-backglass.jpg",
    "/medieval-madness-cabinet-left.jpg",
    "/medieval-madness-cabinet-right.jpg",
    "/medieval-madness-details.jpg",
  ],
  seller: {
    name: "Mike Johnson",
    avatar: "/seller-avatar.jpg",
    rating: 4.9,
    reviewCount: 47,
    memberSince: "2019",
    location: "Los Angeles, CA",
    verified: true,
    responseTime: "Usually responds within 2 hours",
    totalSales: 23,
  },
}

export default function AdDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/listings">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Listings
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">P</span>
                </div>
                <h1 className="text-xl font-bold text-foreground">PinballMarket</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Sell
              </a>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">List Machine</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {pinballMachine.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] overflow-hidden rounded-lg">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${pinballMachine.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Machine Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">{pinballMachine.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>
                        {pinballMachine.manufacturer} • {pinballMachine.year}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span>{pinballMachine.rating}</span>
                        <span>({pinballMachine.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {pinballMachine.condition}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {pinballMachine.location}
                  </div>
                  <span>•</span>
                  <span>{pinballMachine.distance} away</span>
                </div>

                <div className="text-4xl font-bold text-primary mb-6">${pinballMachine.price.toLocaleString()}</div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Description</h3>
                <div className="prose prose-gray max-w-none">
                  {pinballMachine.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Features & Upgrades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pinballMachine.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Specifications</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Gauge className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">Players</div>
                        <div className="font-semibold">{pinballMachine.specifications.players}</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">Flippers</div>
                        <div className="font-semibold">{pinballMachine.specifications.flippers}</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">Ramps</div>
                        <div className="font-semibold">{pinballMachine.specifications.ramps}</div>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Star className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-sm text-muted-foreground">Multiball</div>
                        <div className="font-semibold">{pinballMachine.specifications.multiball}</div>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Designer:</span>
                        <span className="font-medium">{pinballMachine.specifications.designer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Artist:</span>
                        <span className="font-medium">{pinballMachine.specifications.artist}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sound:</span>
                        <span className="font-medium">{pinballMachine.specifications.sound}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="font-medium">{pinballMachine.specifications.manufacturer}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Seller Info and Contact */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Contact Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">${pinballMachine.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {pinballMachine.location} • {pinballMachine.distance} away
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full gap-2" size="lg">
                    <MessageCircle className="w-5 h-5" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">
                    <Phone className="w-5 h-5" />
                    Call Seller
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">
                    <Mail className="w-5 h-5" />
                    Email Seller
                  </Button>
                </div>

                <Separator />

                {/* Seller Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={pinballMachine.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {pinballMachine.seller.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{pinballMachine.seller.name}</h4>
                        {pinballMachine.seller.verified && <Shield className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span>{pinballMachine.seller.rating}</span>
                        <span>({pinballMachine.seller.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since:</span>
                      <span className="font-medium">{pinballMachine.seller.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total sales:</span>
                      <span className="font-medium">{pinballMachine.seller.totalSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response time:</span>
                      <span className="font-medium text-primary">Fast</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-center">{pinballMachine.seller.responseTime}</div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Meet in a public place for inspection</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Test all functions before purchase</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Use secure payment methods</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span>Verify seller identity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t py-12 mt-16">
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
