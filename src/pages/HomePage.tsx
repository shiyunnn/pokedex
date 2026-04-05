/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import { useNavigate } from 'react-router-dom';

const bulbasaurImage = '/pokemon/home/1.gif';
const charmanderImage = '/pokemon/home/4.gif';
const squirtleImage = '/pokemon/home/7.gif';

function HomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pokedex/`);
  };

  return (
    <section className="hero nes-container">
      <h1>Welcome!</h1>
      <p>Vote for your favorite Pokemon and see how they rank on the leaderboard.</p>
      <div className="starters">
        <img src={bulbasaurImage} alt="Bulbasaur" width={72} height={72} onClick={handleClick} />
        <img src={charmanderImage} alt="Charmander" width={72} height={72} onClick={handleClick} />
        <img src={squirtleImage} alt="Squirtle" width={72} height={72} onClick={handleClick} />
      </div>
    </section>
  );
}

export default HomePage;
