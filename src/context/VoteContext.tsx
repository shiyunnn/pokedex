import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { VotePokemon } from '../types';

type VoteEntry = {
  id: number;
  name: string;
  sprite: string;
  up: number;
  down: number;
};

type VoteContextValue = {
  votes: VoteEntry[];
  getVote: (id: number) => { up: number; down: number };
  upvote: (pokemon: VotePokemon) => void;
  downvote: (pokemon: VotePokemon) => void;
};

const STORAGE_KEY = 'pokemon-votes-v1';

const VoteContext = createContext<VoteContextValue | null>(null);

function VoteProvider({ children }: { children: ReactNode }) {
  const [votesById, setVotesById] = useState<Record<number, VoteEntry>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    try {
      const parsed = JSON.parse(saved) as Record<number, VoteEntry>;
      return parsed ?? {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votesById));
  }, [votesById]);

  const value = useMemo<VoteContextValue>(() => {
    const votes = Object.values(votesById);

    const getVote = (id: number) => {
      const entry = votesById[id];
      return entry ? { up: entry.up, down: entry.down } : { up: 0, down: 0 };
    };

    const upvote = (pokemon: VotePokemon) => {
      setVotesById((prev) => {
        const current = prev[pokemon.id] ?? { ...pokemon, up: 0, down: 0 };
        return {
          ...prev,
          [pokemon.id]: { ...current, up: current.up + 1 },
        };
      });
    };

    const downvote = (pokemon: VotePokemon) => {
      setVotesById((prev) => {
        const current = prev[pokemon.id] ?? { ...pokemon, up: 0, down: 0 };
        return {
          ...prev,
          [pokemon.id]: { ...current, down: current.down + 1 },
        };
      });
    };

    return { votes, getVote, upvote, downvote };
  }, [votesById]);

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
