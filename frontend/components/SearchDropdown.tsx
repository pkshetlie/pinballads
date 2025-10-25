import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useApi } from "@/lib/api";
import {GameDto} from "@/components/object/GameDto"; // Importation du hook personnalisé pour l'API

// Types de données des jeux


type SearchDropdownProps = {
    id: string;
    placeholder: string;
    className: string;
    query: string;
    setQuery: (query: string) => void;
    onGameSelect: (game: GameDto|null) => void;
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
    const [results, setResults] = useState<GameDto[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleKeyDown = () => {
        setShowDropdown(true);
    };

    const handleInputChange = (value: string) => {
        setQuery(value);
        setShowDropdown(true);
    };

    const handleSelectGame = (game: GameDto) => {
        onGameSelect(game);
        setShowDropdown(false);
    };

    useEffect(() => {
        if (query?.length < 3 || !showDropdown) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const data = await apiGet(`/api/public/search/game?query=${encodeURIComponent(query)}`);
                setResults(data || []);
            } catch(error) {

                setResults([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query, showDropdown]);

    return (
        <div className="relative">
            <div className="relative">
                <Input
                    id={id}
                    className={className}
                    placeholder={placeholder}
                    value={query ?? ''}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => handleInputChange(e.target.value)}
                    required
                />
                {query && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.delete('opdbId');
                            const relative = url.pathname + url.search + url.hash;
                            // replaceState évite d'ajouter une entrée dans l'historique du navigateur
                            window.history.replaceState({}, '', relative);

                            setQuery('');
                            setShowDropdown(false);
                            setResults([]);
                            onGameSelect(null);
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
            {showDropdown && results.length > 0 && (
                <ul
                    className="mt-2 border rounded-lg p-2 bg-card shadow"
                    style={{position: "absolute", zIndex: 200}}
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
