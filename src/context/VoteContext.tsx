import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { getPokemonSpriteUrl } from '../lib/pokemonSprites';
import { hasSupabaseConfig, supabase, votesTable } from '../lib/supabase';
import type { VotePokemon } from '../types';
import { useAuth } from './AuthContext';

type VoteEntry = {
  id: number;
  name: string;
  sprite: string;
  up: number;
};

type VoteResult = {
  error?: string;
};

type VoteContextValue = {
  votes: VoteEntry[];
  getVote: (id: number) => { up: number };
  upvote: (pokemon: VotePokemon) => Promise<VoteResult>;
  isLoading: boolean;
  error: string;
};

type VoteRow = {
  voted_pokemon: number;
};

type PokemonListResponse = {
  results: Array<{ name: string }>;
};

const VoteContext = createContext<VoteContextValue | null>(null);

const formatFallbackPokemonName = (pokemonId: number) => `Pokemon #${String(pokemonId).padStart(3, '0')}`;

function VoteProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [votesById, setVotesById] = useState<Record<number, VoteEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadVotes() {
      if (!supabase || !hasSupabaseConfig) {
        if (active) {
          setVotesById({});
          setError('Supabase is not configured yet.');
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const [voteResponse, pokemonResponse] = await Promise.all([
          supabase.from(votesTable).select('voted_pokemon'),
          fetch('https://pokeapi.co/api/v2/pokemon?limit=151'),
        ]);

        if (voteResponse.error) {
          throw new Error(voteResponse.error.message);
        }

        if (!pokemonResponse.ok) {
          throw new Error('Could not load Pokemon names for the leaderboard.');
        }

        const pokemonData = (await pokemonResponse.json()) as PokemonListResponse;
        const namesById = pokemonData.results.reduce<Record<number, string>>((acc, pokemon, index) => {
          acc[index + 1] = pokemon.name;
          return acc;
        }, {});

        const aggregated = ((voteResponse.data as VoteRow[]) ?? []).reduce<Record<number, VoteEntry>>((acc, vote) => {
          const pokemonId = vote.voted_pokemon;
          const current = acc[pokemonId];
          const name = namesById[pokemonId] ?? formatFallbackPokemonName(pokemonId);

          acc[pokemonId] = current
            ? { ...current, up: current.up + 1 }
            : {
                id: pokemonId,
                name,
                sprite: getPokemonSpriteUrl(pokemonId),
                up: 1,
              };

          return acc;
        }, {});

        if (active) {
          setVotesById(aggregated);
        }
      } catch (error) {
        if (active) {
          setVotesById({});
          setError(error instanceof Error ? error.message : 'Could not load votes.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadVotes();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<VoteContextValue>(() => {
    const votes = Object.values(votesById);

    const getVote = (id: number) => {
      const entry = votesById[id];
      return entry ? { up: entry.up } : { up: 0 };
    };

    const upvote = async (pokemon: VotePokemon): Promise<VoteResult> => {
      if (!currentUser) {
        return { error: 'Login is required before voting.' };
      }

      if (!supabase || !hasSupabaseConfig) {
        return { error: 'Supabase is not configured yet.' };
      }

      const { error: insertError } = await supabase.from(votesTable).insert({
        user_id: currentUser.id,
        voted_pokemon: pokemon.id,
      });

      if (insertError) {
        return { error: insertError.message };
      }

      setVotesById((prev) => {
        const current = prev[pokemon.id];
        return {
          ...prev,
          [pokemon.id]: current
            ? { ...current, up: current.up + 1 }
            : {
                id: pokemon.id,
                name: pokemon.name || formatFallbackPokemonName(pokemon.id),
                sprite: pokemon.sprite || getPokemonSpriteUrl(pokemon.id),
                up: 1,
              },
        };
      });

      return {};
    };

    return { votes, getVote, upvote, isLoading, error };
  }, [currentUser, error, isLoading, votesById]);

  return <VoteContext.Provider value={value}>{children}</VoteContext.Provider>;
}

const useVotes = () => {
  const ctx = useContext(VoteContext);
  if (!ctx) {
    throw new Error('useVotes must be used inside VoteProvider.');
  }
  return ctx;
};

export { VoteProvider, useVotes, type VoteEntry };
