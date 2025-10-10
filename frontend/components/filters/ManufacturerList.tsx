import React, { useState } from "react";
import { Manufacturers } from "@/components/object/manufacturer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ManufacturerList() {
    const [searchQuery, setSearchQuery] = useState(""); // Pour la recherche
    const [showAll, setShowAll] = useState(false); // Contrôle l'état "Afficher plus"

    // Transformer l'objet `Manufacturers` en tableau pour filtrage.
    const manufacturerList = Object.values(Manufacturers);

    // Appliquer le filtre basé sur la recherche
    const filteredManufacturers = manufacturerList.filter((manufacturer) =>
        manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Contrôler combien d'éléments afficher (8 par défaut si `showAll` est false)
    const displayedManufacturers = showAll
        ? filteredManufacturers
        : filteredManufacturers.slice(0, 8);

    return (
        <div className="space-y-4">
            {/* Barre de recherche */}
            <Input
                type="text"
                placeholder="Rechercher un fabricant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
            />

            {/* Liste des fabricants */}
            <div className="space-y-2">
                {displayedManufacturers.map((manufacturer, index) => (
                    <div
                        key={`${manufacturer}-${index}`}
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="checkbox"
                            id={`manufacturer-${manufacturer}`}
                            className="cursor-pointer"
                        />
                        <label
                            htmlFor={`manufacturer-${manufacturer}`}
                            className="text-sm text-foreground cursor-pointer"
                        >
                            {manufacturer}
                        </label>
                    </div>
                ))}
            </div>

            {/* Bouton "Afficher plus" ou "Afficher moins" */}
            {filteredManufacturers.length > 8 && (
                <Button
                    variant="outline"
                    onClick={() => setShowAll((prev) => !prev)}
                    className="w-full"
                >
                    {showAll ? "Afficher moins" : "Afficher plus"}
                </Button>
            )}
        </div>
    );
}
