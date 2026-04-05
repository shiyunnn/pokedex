import { Navigate, Route, Routes } from 'react-router-dom';

import './App.css';
import { AuthProvider } from './context/AuthContext';
import { VoteProvider } from './context/VoteContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import PokedexPage from './pages/PokedexPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <AuthProvider>
      <VoteProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/pokedex' element={<PokedexPage />} />
            <Route path='/pokedex/:id' element={<PokemonDetailPage />} />
            <Route path='/leaderboard' element={<LeaderboardPage />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </VoteProvider>
    </AuthProvider>
  );
}

export default App;
