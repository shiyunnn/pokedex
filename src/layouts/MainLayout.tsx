import React, { useEffect, useState } from "react";

import { NavLink, Outlet, useLocation } from "react-router-dom";

const logoImage = "/logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/pokedex", label: "Pokedex" },
  { to: "/leaderboard", label: "Leaderboard" },
];

function MainLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  const renderNavLinks = () =>
    links.map((link) => (
      <NavLink
        key={link.to}
        className={({ isActive }) =>
          isActive
            ? "nes-btn is-warning is-active nav-btn"
            : "nes-btn is-primary nav-btn"
        }
        to={link.to}
        onClick={() => setIsNavOpen(false)}
      >
        {link.label}
      </NavLink>
    ));

  return (
    <div className="home-page">
      <header className="top-bar nes-container is-dark is-rounded with-title">
        <div className="top-bar-content">
          <p className="top-subtitle">
            <img src={logoImage} alt="Logo" height={70} />
          </p>
          <nav className="header-nav" aria-label="Main navigation">
            {renderNavLinks()}
          </nav>
          <button
            className="nes-btn is-primary nav-toggle"
            type="button"
            aria-expanded={isNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsNavOpen((open) => !open)}
          >
            <span className="nav-toggle-icon" aria-hidden="true" />
            <span className="nav-toggle-label">Menu</span>
          </button>
        </div>
      </header>

      <section className="content-area">
        <main className="content-shell nes-container is-rounded">
          <Outlet />
        </main>
      </section>

      <button
        className={`nav-backdrop${isNavOpen ? " is-open" : ""}`}
        type="button"
        aria-label="Close navigation menu"
        onClick={() => setIsNavOpen(false)}
      />

      <aside className={`mobile-nav-drawer${isNavOpen ? " is-open" : ""}`}>
        <section className="mobile-sidebar-nav nes-container is-dark is-rounded with-title">
          <p className="title">Navigation</p>
          <nav
            className="nav-list"
            aria-label="Main navigation"
            id="mobile-navigation"
          >
            {renderNavLinks()}
          </nav>
        </section>
      </aside>

      <footer className="footer nes-container is-dark is-rounded">
        <p>© Nintendo and The Pokemon Company.</p>
      </footer>
    </div>
  );
}

export default MainLayout;
