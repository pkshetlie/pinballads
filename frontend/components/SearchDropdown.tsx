import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useApi } from "@/lib/api"; // Importation du hook personnalisé pour l'API

// Types de données des jeux
export type Game = {
    opdb_id: string;
    name: string;
    manufacture_date?: string | null;
    manufacturer?: {
        full_name: string;
    } | null;
};

type SearchDropdownProps = {
    id: string;
    placeholder: string;
    className: string;
    query: string;
    setQuery: (query: string) => void;
    onGameSelect: (game: Game) => void;
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
                                                           id,
                                                           placeholder,
                                                           query,
    className,
                                                           setQuery,
                                                           onGameSelect,
                                                       }) => {
    const { apiGet } = useApi(); // Hook pour effectuer des requêtes API
    const [results, setResults] = useState<Game[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleKeyDown = () => {
        setShowDropdown(true);
    };

    const handleInputChange = (value: string) => {
        setQuery(value);
        setShowDropdown(true);
    };

    const handleSelectGame = (game: Game) => {
        onGameSelect(game);
        setShowDropdown(false);
    };

    useEffect(() => {
        if (query.length < 3 || !showDropdown) {
            setResults([]);
            return;
        }
        console.log("Recherche en cours...");

        const timer = setTimeout(async () => {
            console.log("Data call en cours...");

            try {
                const data = await apiGet(`/api/public/search/game?query=${encodeURIComponent(query)}`);
                setResults(data || []);
            } catch(error) {
                console.log("echec de la recherche...", error);

                setResults([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, showDropdown]);

    return (
        <div className="relative">
            <Input
                id={id}
                className={className}
                placeholder={placeholder}
                value={query}
                onKeyDown={handleKeyDown}
                onChange={(e) => handleInputChange(e.target.value)}
                required
            />
            {showDropdown && results.length > 0 && (
                <ul
                    className="mt-2 border rounded-lg p-2 bg-card shadow"
                    style={{ position: "absolute", zIndex: 200 }}
                >
                    {results.map((game) => (
                        <li
                            key={game.opdb_id}
                            className="p-1 hover:bg-card/80 cursor-pointer"
                            onClick={() => handleSelectGame(game)}
                        >
                            {game.name} ({game.manufacturer?.full_name || "Unknown"}{" "}
                            {game.manufacture_date || "Unknown"})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchDropdown;
