import React, { useMemo, useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

type AuthLocationState = {
  from?: string;
  message?: string;
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading, hasConfig } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const locationState = (location.state as AuthLocationState | null) ?? null;
  const nextPath = useMemo(() => locationState?.from || '/pokedex', [locationState?.from]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const result = await signIn(username, password);

    if (result.error) {
      setError('Login failed. Please try again.');
      return;
    }

    navigate(nextPath, { replace: true });
  };

  return (
    <section className="auth-page nes-container">
      <div className="auth-panel">
        <div className="auth-copy">
          <h1>Login to vote</h1>
          <p>{locationState?.message || 'Sign in to vote for your favorite Pokemon.'}</p>
          {!hasConfig && (
            <p className="error-text">
              Supabase is not configured yet. Add `VITE_SUPABASE_URL` and your Supabase publishable key.
            </p>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="login-username">
            <span>Username</span>
            <input
              id="login-username"
              className="nes-input"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

          <label className="auth-field" htmlFor="login-password">
            <span>Password</span>
            <div className="password-input-shell">
              <input
                id="login-password"
                className="nes-input password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-toggle-btn"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M1.5 12s3.8-6 10.5-6 10.5 6 10.5 6-3.8 6-10.5 6S1.5 12 1.5 12Zm10.5 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {showPassword && (
                    <path d="M4 20 20 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            </div>
          </label>

          <p className={`error-text auth-error-slot${error ? ' is-visible' : ''}`}>{error || '\u00A0'}</p>

          <button className="nes-btn is-primary auth-submit-btn" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch-copy">
          Need an account?{' '}
          <Link className="auth-inline-link" to="/signup" state={locationState}>
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
