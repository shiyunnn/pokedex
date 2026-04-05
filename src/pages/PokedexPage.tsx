import React, { useEffect, useState, type SyntheticEvent } from 'react';

import PokemonCard from '../components/PokemonCard';
import { useVotes } from '../context/VoteContext';
import { getPokemonFallbackSpriteUrl, getPokemonSpriteUrl } from '../lib/pokemonSprites';
import type { Pokemon } from '../types';

function PokedexPage() {
  const [query, setQuery] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { upvote } = useVotes();

  useEffect(() => {
    let active = true;

    async function loadPokemon() {
      try {
        setLoading(true);
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!res.ok) {
          throw new Error('Could not load Pokemon list.');
        }

        const data = (await res.json()) as { results: Array<{ name: string }> };
        const mapped = data.results.map((item, idx) => {
          const id = idx + 1;
          return {
            id,
            name: item.name,
            sprite: getPokemonSpriteUrl(id),
            fallbackSprite: getPokemonFallbackSpriteUrl(id),
          };
        });

        if (active) {
          setPokemon(mapped);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Could not load Pokemon list.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPokemon();

    return () => {
      active = false;
    };
  }, []);

  const search = query.trim().toLowerCase();
  const filtered = search ? pokemon.filter((item) => item.name.includes(search)) : pokemon;
  console.log(filtered);

  const handleSpriteError = (e: SyntheticEvent<HTMLImageElement>, fallback: string) => {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === '1') {
      img.style.opacity = '0.4';
      return;
    }

    img.dataset.fallbackApplied = '1';
    img.src = fallback;
  };

  return (
    <section className="pokedex nes-container">
      <h1>Pokedex</h1>
      <div className="search-bar">
        <input
          id="pokemon-search"
          className="nes-input"
          placeholder="Search name"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <p>Loading Pokemon...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && (
        <>
          <p className="result-count">{filtered.length} result(s)</p>
          <div className="pokemon-grid">
            {filtered.map((item) => (
              <PokemonCard key={item.id} item={item} onUpvote={upvote} onSpriteError={handleSpriteError} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default PokedexPage;
