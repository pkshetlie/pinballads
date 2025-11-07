import React, {useState} from "react";
import {DefaultFeatures, FeaturesType} from "@/components/object/Features";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useLanguage} from "@/lib/language-context";
import {Checkbox} from "@/components/ui/checkbox";

export default function FeaturesList({handleFeatureSelection, preselectedFeatures}: {handleFeatureSelection: (features: string[]) => void, preselectedFeatures: string[] | undefined}) {
    const [searchQuery, setSearchQuery] = useState(""); // Recherche globale
    const [showAllCategories, setShowAllCategories] = useState<string[]>([]); // Les catégories "afficher plus"
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const {t} = useLanguage();

    const features: FeaturesType = DefaultFeatures;

    // Gestion de la logique de recherche
    const filteredFeatures = Object.entries(features).reduce((acc, [category, features]) => {
        const matchingFeatures = Object.keys(features).filter((feature) =>
            feature.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (matchingFeatures.length > 0) {
            acc[category] = matchingFeatures;
        }
        return acc;
    }, {} as Record<string, string[]>);

    /**
     * Fonction pour limiter les résultats par catégorie (8 visibles par défaut).
     * Lorsque la catégorie est "développée", afficher tout.
     */
    const getDisplayedFeatures = (category: string, features: string[]) => {
        return showAllCategories.includes(category) ? features : features.slice(0, 8);
    };

    const toggleCategoryView = (category: string) => {
        setShowAllCategories((prev) =>
            prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
        );
    };

    return (
        <div className="space-y-4">
            {/* Barre de recherche */}
            <Input
                type="text"
                placeholder="Rechercher une fonctionnalité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
            />

            {/* Liste par catégories */}
            {Object.entries(filteredFeatures).map(([category, features]) => (
                <div key={category} className="space-y-2">
                    {/* Nom de la catégorie */}
                    <h4 className="font-medium text-lg text-foreground">
                        {t('sell.'+category)}
                    </h4>

                    {/* Liste des fonctionnalités */}
                    <div className="space-y-2">
                        {getDisplayedFeatures(category, features).map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`feature-${category}-${feature}`}
                                    checked={selectedFeatures.includes(feature)}
                                    onCheckedChange={(checked) => {
                                        const newSelectedFeatures = checked
                                            ? [...selectedFeatures, feature]
                                            : selectedFeatures.filter(f => f !== feature);
                                        setSelectedFeatures(newSelectedFeatures);
                                        handleFeatureSelection(newSelectedFeatures);
                                    }}
                                    className="cursor-pointer"
                                />
                                <label
                                    htmlFor={`feature-${category}-${feature}`}
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    {t('sell.'+feature)}
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Bouton "Afficher plus" ou "Afficher moins" par catégorie */}
                    {features.length > 8 && (
                        <Button
                            variant="outline"
                            onClick={() => toggleCategoryView(category)}
                            className="w-full"
                        >
                            {showAllCategories.includes(category) ? "Afficher moins" : "Afficher plus"}
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
}
