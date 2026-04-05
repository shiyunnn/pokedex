import React, { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, SyntheticEvent } from 'react';

import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';

import { getPokemonShowdownSpriteUrl } from '../lib/pokemonSprites';
import type { Pokemon } from '../types';

type PokemonCardProps = {
  item: Pokemon;
  query: string;
  onUpvote: (item: Pokemon) => void | Promise<void>;
  onSpriteError: (e: SyntheticEvent<HTMLImageElement>, fallbackSprite: string) => void;
  voteButtonLabel?: string;
};

function PokemonCard({ item, query, onUpvote, onSpriteError, voteButtonLabel }: PokemonCardProps) {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldPreloadShowdown, setShouldPreloadShowdown] = useState(false);
  const [showdownReady, setShowdownReady] = useState(false);
  const [showdownFailed, setShowdownFailed] = useState(false);
  const cardRef = useRef<HTMLElement | null>(null);
  const spinFrameRef = useRef<number | null>(null);
  const showdownSprite = getPokemonShowdownSpriteUrl(item.id);
  const showAnimatedSprite = isHovered && showdownReady && !showdownFailed;

  useEffect(() => {
    return () => {
      if (spinFrameRef.current !== null) {
        window.cancelAnimationFrame(spinFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsHovered(false);
    setShouldPreloadShowdown(false);
    setShowdownReady(false);
    setShowdownFailed(false);
  }, [showdownSprite]);

  useEffect(() => {
    if (shouldPreloadShowdown || showdownFailed) {
      return;
    }

    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldPreloadShowdown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldPreloadShowdown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [shouldPreloadShowdown, showdownFailed]);

  const handleSpin = () => {
    if (spinFrameRef.current !== null) {
      window.cancelAnimationFrame(spinFrameRef.current);
    }

    setIsSpinning(false);
    spinFrameRef.current = window.requestAnimationFrame(() => {
      setIsSpinning(true);
      spinFrameRef.current = null;
    });
  };

  const handleOpenDetail = () => {
    navigate(`/pokedex/${item.id}`);
  };

  const handleCardKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) {
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpenDetail();
    }
  };

  return (
    <article
      ref={cardRef}
      className="pokemon-card nes-container is-rounded"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
      role="link"
      tabIndex={0}
      onClick={handleOpenDetail}
      onKeyDown={handleCardKeyDown}
      onFocus={() => setShouldPreloadShowdown(true)}
      onMouseEnter={() => {
        setShouldPreloadShowdown(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Open details for ${item.name}`}
    >
      <div
        className={`pokemon-sprite-shell${isSpinning ? ' is-spinning' : ''}${showAnimatedSprite ? ' is-animated' : ''}`}
        onAnimationEnd={() => setIsSpinning(false)}
      >
        <img
          className="pokemon-sprite pokemon-sprite-base"
          src={item.sprite}
          alt={item.name}
          width={120}
          height={120}
          loading="lazy"
          onError={(e) => onSpriteError(e, item.fallbackSprite)}
        />
        {shouldPreloadShowdown && !showdownFailed && (
          <img
            className="pokemon-sprite pokemon-sprite-animated"
            src={showdownSprite}
            alt=""
            aria-hidden="true"
            width={120}
            height={120}
            loading="eager"
            onLoad={() => setShowdownReady(true)}
            onError={() => setShowdownFailed(true)}
          />
        )}
      </div>
      <h2>#{item.id}</h2>
      <p>
        <Highlighter
          autoEscape
          caseSensitive={false}
          highlightClassName="pokemon-name-highlight"
          searchWords={query ? [query] : []}
          textToHighlight={item.name}
        />
      </p>
      <div className="card-actions">
        <button
          className="nes-btn is-error card-action-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpvote(item);
          }}
          aria-label={voteButtonLabel || `Upvote ${item.name}`}
          title={voteButtonLabel || `Upvote ${item.name}`}
        >
          <span className="pixel-heart" aria-hidden="true" />
        </button>
        <button
          className="nes-btn is-primary card-action-btn move-btn"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleSpin();
          }}
          aria-label={`Spin ${item.name}`}
        >
          <svg
            className="rotate-icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M4 20h2v2H2v-4h2v2Zm16 1h-2v-2h2v2Zm-10-1H6v-2h4v2Zm-4-2H4v-4h2v4Zm8 0h-4v-2h4v2Zm-4-2H8v-2h2v2Zm6 0h-2v-4h2v4Zm6 0h-2v-2h2v2ZM8 14H6v-4h2v4Zm12 0h-2v-2h2v2Zm-6-2h-2v-2h2v2Zm-2-2H8V8h4v2Zm8-1h-4V7h4v2ZM5 8H3V6h2v2Zm17-1h-2V5h2v2ZM12 6h-2V4h2v2Zm-2-2H8V2h2v2Zm7 0h-2V2h2v2Z" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default PokemonCard;
