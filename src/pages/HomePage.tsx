import React from 'react';

const bulbasaurImage = '/pokemon/home/1.gif';
const charmanderImage = '/pokemon/home/4.gif';
const squirtleImage = '/pokemon/home/7.gif';

function HomePage() {
  return (
    <section className="hero nes-container">
      <h1>Welcome!</h1>
      <p></p>
      <div className="starters">
        <img src={bulbasaurImage} alt="Bulbasaur" width={72} height={72} />
        <img src={charmanderImage} alt="Charmander" width={72} height={72} />
        <img src={squirtleImage} alt="Squirtle" width={72} height={72} />
      </div>
    </section>
  );
}

export default HomePage;
