"use client"

import { Settings, Star, MapPin, Heart, Plus, Edit, Shield, Calendar, Eye, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/lib/language-context"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Mock user data
const user = {
  name: "Mike Johnson",
  username: "mikej_pinball",
  avatar: "/seller-avatar.jpg",
  location: "Los Angeles, CA",
  memberSince: "2019",
  verified: true,
  rating: 4.9,
  reviewCount: 47,
  totalSales: 23,
  totalPurchases: 15,
  bio: "Passionate pinball collector and enthusiast for over 20 years. I specialize in Williams and Bally machines from the 90s. Always looking for rare finds and happy to help fellow collectors.",
  stats: {
    machinesOwned: 12,
    wishlistItems: 8,
    totalViews: 2847,
    responseRate: 98,
  },
}

// Mock collection data
const collection = [
  {
    id: 1,
    title: "Medieval Madness",
    manufacturer: "Williams",
    year: 1997,
    image: "/medieval-madness-pinball-machine.jpg",
    condition: "Excellent",
    status: "For Sale",
    price: 8500,
    views: 234,
  },
  {
    id: 2,
    title: "Attack from Mars",
    manufacturer: "Bally",
    year: 1995,
    image: "/attack-from-mars-pinball-machine.jpg",
    condition: "Very Good",
    status: "Collection",
    price: null,
    views: 0,
  },
  {
    id: 3,
    title: "The Twilight Zone",
    manufacturer: "Bally",
    year: 1993,
    image: "/twilight-zone-pinball-machine.jpg",
    condition: "Good",
    status: "Collection",
    price: null,
    views: 0,
  },
  {
    id: 4,
    title: "Cirqus Voltaire",
    manufacturer: "Bally",
    year: 1997,
    image: "/cirqus-voltaire-pinball-machine.jpg",
    condition: "Excellent",
    status: "For Sale",
    price: 6200,
    views: 156,
  },
]

// Mock wishlist data
const wishlist = [
  {
    id: 1,
    title: "The Addams Family",
    manufacturer: "Bally",
    year: 1992,
    image: "/addams-family-pinball-machine.jpg",
    averagePrice: 7500,
    availability: "3 available",
  },
  {
    id: 2,
    title: "Indiana Jones",
    manufacturer: "Williams",
    year: 1993,
    image: "/indiana-jones-pinball-machine.jpg",
    averagePrice: 5800,
    availability: "1 available",
  },
  {
    id: 3,
    title: "Star Trek: The Next Generation",
    manufacturer: "Williams",
    year: 1993,
    image: "/star-trek-next-generation-pinball-machine.jpg",
    averagePrice: 6200,
    availability: "2 available",
  },
  {
    id: 4,
    title: "Theatre of Magic",
    manufacturer: "Bally",
    year: 1995,
    image: "/theatre-of-magic-pinball-machine.jpg",
    averagePrice: 4800,
    availability: "5 available",
  },
]

export default function ProfilePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
     <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                    {user.verified && <Shield className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium">{user.rating}</span>
                    <span className="text-muted-foreground">
                      ({user.reviewCount} {t("profile.reviews")})
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("profile.memberSince")} {user.memberSince}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.machinesOwned}</div>
                    <div className="text-xs text-muted-foreground">{t("profile.machines")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.wishlistItems}</div>
                    <div className="text-xs text-muted-foreground">{t("profile.wishlist")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.totalSales}</div>
                    <div className="text-xs text-muted-foreground">{t("profile.sales")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.stats.responseRate}%</div>
                    <div className="text-xs text-muted-foreground">{t("profile.response")}</div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{user.bio}</p>

                <div className="space-y-2">
                  <Button className="w-full gap-2">
                    <Edit className="w-4 h-4" />
                    {t("profile.editProfile")}
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Settings className="w-4 h-4" />
                    {t("profile.settings")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="collection" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="collection">{t("profile.myCollection")}</TabsTrigger>
                  <TabsTrigger value="wishlist">{t("profile.wishlist")}</TabsTrigger>
                </TabsList>
              </div>

              {/* Collection Tab */}
              <TabsContent value="collection" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{t("profile.myCollection")}</h3>
                    <p className="text-muted-foreground">
                      {collection.length} {t("profile.machinesInCollection")}
                    </p>
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t("profile.addMachine")}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {collection.map((machine) => (
                    <Card key={machine.id} className="group hover:shadow-lg transition-all duration-200">
                      <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                          <img
                            src={machine.image || "/images/placeholder.png"}
                            alt={machine.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="absolute top-3 left-3">
                          <Badge variant={machine.status === "For Sale" ? "default" : "secondary"} className="text-xs">
                            {machine.status}
                          </Badge>
                        </div>
                        {machine.status === "For Sale" && (
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center gap-1 bg-background/90 rounded-full px-2 py-1 text-xs">
                              <Eye className="w-3 h-3" />
                              {machine.views}
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {machine.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {machine.manufacturer} • {machine.year}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {machine.condition}
                            </Badge>
                            {machine.price && (
                              <span className="font-bold text-primary">${machine.price.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{t("profile.wishlist")}</h3>
                    <p className="text-muted-foreground">
                      {wishlist.length} {t("profile.machinesOnWishlist")}
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    {t("profile.addToWishlist")}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {wishlist.map((machine) => (
                    <Card key={machine.id} className="group hover:shadow-lg transition-all duration-200">
                      <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                          <img
                            src={machine.image || "/images/placeholder.png"}
                            alt={machine.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="absolute top-3 right-3">
                          <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {machine.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {machine.manufacturer} • {machine.year}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Avg. Price</span>
                            <span className="font-bold text-primary">${machine.averagePrice.toLocaleString()}</span>
                          </div>
                          <div className="text-xs text-primary">{machine.availability}</div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="flex-1">
                            Find Matches
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  )
}
