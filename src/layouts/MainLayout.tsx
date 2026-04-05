import React, { useEffect, useRef, useState } from 'react';

import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const logoImage = '/logo.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/pokedex', label: 'Pokedex' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

function MainLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, isAuthenticated, signOut } = useAuth();
  const desktopAccountMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileAccountMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsNavOpen(false);
    setIsAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideDesktopMenu = desktopAccountMenuRef.current?.contains(target);
      const clickedInsideMobileMenu = mobileAccountMenuRef.current?.contains(target);

      if (!clickedInsideDesktopMenu && !clickedInsideMobileMenu) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isAccountMenuOpen]);

  const renderNavLinks = (className = 'nav-btn nav-btn-compact header-link') =>
    links.map((link) => (
      <NavLink
        key={link.to}
        className={({ isActive }) => (isActive ? `${className} is-active` : className)}
        to={link.to}
        onClick={() => setIsNavOpen(false)}
      >
        {link.label}
      </NavLink>
    ));

  const renderAuthControls = (isMobile = false) => {
    const actionClassName = isMobile
      ? 'mobile-dropdown-link mobile-auth-link'
      : 'nav-btn nav-btn-compact header-link auth-btn';

    if (!isAuthenticated) {
      if (isMobile) {
        return (
          <NavLink className={actionClassName} to="/login" onClick={() => setIsNavOpen(false)}>
            Login
          </NavLink>
        );
      }

      return (
        <div className="auth-panel-inline">
          <NavLink className={actionClassName} to="/login" onClick={() => setIsNavOpen(false)}>
            Login
          </NavLink>
        </div>
      );
    }

    if (isMobile) {
      return (
        <div ref={mobileAccountMenuRef} className="mobile-auth-panel">
          <div className="mobile-dropdown-link mobile-auth-link mobile-auth-user">
            {currentUser?.name || currentUser?.username}
          </div>
          <button
            className="account-dropdown-item mobile-dropdown-link mobile-dropdown-action"
            type="button"
            onClick={() => {
              signOut();
              setIsAccountMenuOpen(false);
              setIsNavOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div ref={desktopAccountMenuRef} className="auth-panel-inline account-menu-shell">
        <button
          className="nav-btn nav-btn-compact header-link auth-btn account-trigger"
          type="button"
          aria-haspopup="menu"
          aria-expanded={isAccountMenuOpen}
          onClick={() => setIsAccountMenuOpen((open) => !open)}
        >
          <span>{currentUser?.name || currentUser?.username}</span>
          <span className={`account-caret`} aria-hidden="true">
            ▾
          </span>
        </button>
        <div className={`account-dropdown${isAccountMenuOpen ? ' is-open' : ''}`} role="menu">
          <button
            className="account-dropdown-item"
            type="button"
            role="menuitem"
            onClick={() => {
              signOut();
              setIsAccountMenuOpen(false);
              setIsNavOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="home-page">
      <header className="top-bar nes-container is-dark is-rounded with-title" style={{ margin: 0 }}>
        <div className="top-bar-content">
          <p className="top-subtitle">
            <Link to="/" onClick={() => setIsNavOpen(false)}>
              <img src={logoImage} alt="Logo" height={70} />
            </Link>
          </p>
          <div className="header-actions">
            <nav className="header-nav" aria-label="Main navigation">
              {renderNavLinks()}
            </nav>
            {renderAuthControls()}
          </div>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={isNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsNavOpen((open) => !open)}
          >
            <span className="nav-toggle-icon" aria-hidden="true" />
            <span className="nav-toggle-label">Menu</span>
          </button>
        </div>

        <aside className={`mobile-nav-drawer${isNavOpen ? ' is-open' : ''}`}>
          <section className="mobile-sidebar-nav">
            <nav className="nav-list" aria-label="Main navigation" id="mobile-navigation">
              {renderNavLinks('mobile-dropdown-link')}
            </nav>
            <div className="mobile-auth-shell">{renderAuthControls(true)}</div>
          </section>
        </aside>
      </header>

      <section className="content-area">
        <main className="content-shell nes-container is-rounded">
          <Outlet />
        </main>
      </section>

      <button
        className={`nav-backdrop${isNavOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsNavOpen(false)}
      />

      <footer className="footer nes-container is-dark is-rounded">
        <p>© Nintendo and The Pokemon Company.</p>
      </footer>
    </div>
  );
}

export default MainLayout;
