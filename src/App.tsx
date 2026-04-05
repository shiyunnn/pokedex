import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import { VoteProvider } from './context/VoteContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import PokedexPage from './pages/PokedexPage';
import PokemonDetailPage from './pages/PokemonDetailPage';

function App() {
  return (
    <VoteProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/pokedex' element={<PokedexPage />} />
          <Route path='/pokedex/:id' element={<PokemonDetailPage />} />
          <Route path='/leaderboard' element={<LeaderboardPage />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </VoteProvider>
  );
}

export default App;
