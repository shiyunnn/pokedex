import React, { useEffect, useMemo, useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import { getPokemonArtworkUrl, getPokemonFallbackSpriteUrl } from '../lib/pokemonSprites';

type PokemonApiResponse = {
  id: number;
  name: string;
  species: {
    url: string;
  };
  sprites: {
    other?: {
      home?: {
        front_default: string | null;
      };
      ['official-artwork']?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
    };
  }>;
};

type PokemonSpeciesResponse = {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
  }>;
};

type PokemonDetail = {
  id: number;
  name: string;
  artwork: string;
  description: string;
  types: string[];
};

const formatFlavorText = (value: string) =>
  value
    .replace(/[\f\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function PokemonDetailPage() {
  const { id } = useParams();
  const pokemonId = useMemo(() => Number(id), [id]);
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPokemonDetail() {
      if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
        setError('Invalid Pokemon id.');
        setDetail(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!pokemonRes.ok) {
          throw new Error('Could not load Pokemon details.');
        }

        const pokemonData = (await pokemonRes.json()) as PokemonApiResponse;

        const speciesRes = await fetch(pokemonData.species.url);
        if (!speciesRes.ok) {
          throw new Error('Could not load Pokemon details.');
        }

        const speciesData = (await speciesRes.json()) as PokemonSpeciesResponse;
        const englishFlavor = speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en');

        const artwork = getPokemonArtworkUrl(pokemonData.id) ?? getPokemonFallbackSpriteUrl(pokemonData.id);

        if (active) {
          setDetail({
            id: pokemonData.id,
            name: pokemonData.name,
            artwork,
            description: englishFlavor
              ? formatFlavorText(englishFlavor.flavor_text)
              : 'No Pokedex description available yet.',
            types: pokemonData.types.sort((a, b) => a.slot - b.slot).map((entry) => entry.type.name),
          });
        }
      } catch (err) {
        if (active) {
          setDetail(null);
          setError(err instanceof Error ? err.message : 'Could not load Pokemon details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPokemonDetail();

    return () => {
      active = false;
    };
  }, [pokemonId]);

  return (
    <section className="pokemon-detail-page">
      <Link className="nes-btn is-primary detail-back-btn" to="/pokedex">
        Back to Pokedex
      </Link>

      <div className="pokemon-detail-shell">
        {loading && <p>Loading Pokemon details...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && detail && (
          <article className="pokemon-detail-panel">
            <div className="pokemon-detail-art">
              <img src={detail.artwork} alt={detail.name} loading="lazy" />
            </div>

            <div className="pokemon-detail-copy">
              <h1>
                #{String(detail.id).padStart(3, '0')} {detail.name}
              </h1>

              <p className="pokemon-detail-description">{detail.description}</p>

              <div className="pokemon-type-section">
                <h2>Type:</h2>
                <div className="pokemon-type-list">
                  {detail.types.map((type) => (
                    <span key={type} className={`pokemon-type-badge type-${type}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default PokemonDetailPage;
