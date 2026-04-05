import React, { useMemo, type KeyboardEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { useVotes } from '../context/VoteContext';

function LeaderboardPage() {
  const navigate = useNavigate();
  const { votes } = useVotes();

  const ranked = useMemo(() => {
    return [...votes].sort((a, b) => {
      if (a.up !== b.up) return b.up - a.up;
      return a.id - b.id;
    });
  }, [votes]);

  const handleItemKeyDown = (e: KeyboardEvent<HTMLElement>, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/pokedex/${id}`);
    }
  };

  return (
    <section className="leaderboard nes-container">
      <h1>Leaderboard</h1>
      {!ranked.length && <p>No votes yet. Vote on Pokemon in the Pokedex tab first.</p>}
      {!!ranked.length && (
        <div className="leaderboard-list">
          {ranked.map((entry, idx) => (
            <article
              key={entry.id}
              className="leaderboard-item nes-container is-rounded"
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/pokedex/${entry.id}`)}
              onKeyDown={(e) => handleItemKeyDown(e, entry.id)}
              aria-label={`Open details for ${entry.name}`}
            >
              <div className="leaderboard-rank">#{idx + 1}</div>
              <img src={entry.sprite} alt={entry.name} width={56} height={56} loading="lazy" />
              <div className="leaderboard-meta">
                <h2>{entry.name}</h2>
              </div>
              <div className="leaderboard-score">Upvotes: {entry.up}</div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LeaderboardPage;
