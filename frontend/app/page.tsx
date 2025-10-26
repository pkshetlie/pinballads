"use client"

import { Search, MapPin, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from '@/lib/auth-context';
import Navbar from "@/components/Navbar";
import {useEffect, useState} from "react";
import {useApi} from "@/lib/api";
import SearchDropdown from "@/components/SearchDropdown";
import Footer from "@/components/Footer";
import {PinballDto} from "@/components/object/PinballDto";
import {toast} from "@/components/ui/use-toast";
import {PinballCardToSell} from "@/components/PinballCardToSell";
import {GameDto} from "@/components/object/GameDto";

export default function HomePage() {
  const { t } = useLanguage()
  const { login, user, logout } = useAuth(); // Récupère le contexte utilisateur
  const [query, setQuery] = useState("");
  const [opdbId, setOpdbId] = useState( "");
  const [manufacturer, setManufacturer] = useState("");
  const [year, setYear] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Contrôle de l'ouverture du menu.
  const [results, setResults] = useState<any[]>([]); // Pour autocomplete si nécessaire
  const [featuredMachines, setFeaturedMachines] = useState<PinballDto[]|[]>([]); // Pour autocomplete si nécessaire
  const {apiGet} = useApi();
  const {token} = useAuth();
  const [description, setDescription] = useState("");

  useEffect(() => {
    if(featuredMachines.length === 0){
      fetchFeatured();
    }
    if (query.length < 3 || !showDropdown) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      // Exemple d'appel API pour chercher des jeux correspondants
      apiGet(`/api/public/search/game?query=${encodeURIComponent(query)}`)
          .then((data) => setResults(data))
          .catch(() => setResults([]));
    }, 400);

    return () => clearTimeout(timer);
  }, [query, showDropdown]);

  const fetchFeatured = async () => {
    try {
      const result = await apiGet(`/api/public/featured`)

      if (result) {
        setFeaturedMachines(result.pinballs)
      } else {
        throw new Error(result.error || "Failed to fetch collection")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: `${t('collection.cantLoadMachines')}`,
        variant: "destructive",
      })
    }
  }

  const searchPinball = () => {
    window.location.href = `/listings/?opdbid=${opdbId}`;
  }

  const handleSelectGame = (game: GameDto|null) => {
    if(null === game){
      setQuery(null);
      setOpdbId(null);
      setManufacturer(null);
      setYear(null);
      setDescription(null);
      return;
    }

    setQuery(game.name);
    setOpdbId(game.opdb_id);
    setManufacturer(game.manufacturer?.full_name?.toLowerCase() || "");
    setYear(game.manufacture_date ? new Date(game.manufacture_date).getFullYear().toString() : "");
    setDescription(game.description || "");
  };
  return (
    <div className="min-h-screen bg-background">
    <Navbar/>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">{t("home.heroTitle")}</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">{t("home.heroSubtitle")}</p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <SearchDropdown
                    id="title"
                    placeholder={t("collection.searchForGame")}
                    className={'pl-10 h-12 text-lg"'}
                    query={query}
                    setQuery={setQuery}
                    onGameSelect={handleSelectGame}
                ></SearchDropdown>
              </div>
              <Button size="lg" className="h-12 px-8 cursor-pointer" onClick={(e)=>searchPinball()}>
                <Search className="w-5 h-5 mr-2" />
                {t("home.searchButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Machines */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">{t("home.featuredMachines")}</h3>
            <Button
                onClick={() => {window.location.href = '/listings'}}
                variant="outline"
                    className="gap-2 bg-transparent cursor-pointer">
              <Filter className="w-4 h-4" />
              {t('viewAll')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMachines.map((machine) => (
              <PinballCardToSell machine={machine} key={machine.id} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-foreground text-center mb-12">{t("home.browseByEra")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {window.location.href = '/listings/?years=1970,1980'}} noPadding={true}>
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src="/images/vintage.jpg"
                  alt="Vintage Pinball Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center" onClick={() => {window.location.href = '/listings/?years=1970,1980'}}>
                <h4 className="text-xl font-semibold text-foreground mb-2">{t('home.vintage')} (1970-1980)</h4>
                <p className="text-muted-foreground">{t('home.vintageText')}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {window.location.href = '/listings/?years=1990,2000'}} noPadding={true}>
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src="/images/modern.jpg"
                  alt="Modern Pinball Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-semibold text-foreground mb-2">{t('home.modern')} (1990-2000)</h4>
                <p className="text-muted-foreground">{t('home.modernText')}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {window.location.href = '/listings/?years=2010,2020'}} noPadding={true}>
              <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                <img
                  src="/images/contemporary.jpg"
                  alt="Contemporary Pinball Machines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6 text-center" >
                <h4 className="text-xl font-semibold text-foreground mb-2">{t('home.contemporary')} (2010+)</h4>
                <p className="text-muted-foreground">{t('home.contemporaryText')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer></Footer>
    </div>
  )
}
