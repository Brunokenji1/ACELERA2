import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/layout.css";

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <div className={`layout ${open ? "open" : "closed"}`}>
      {/* HEADER */}
      <header className="header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <h1 className="logo">
          STUDY<span>flow</span>
        </h1>

        <div className="user">Aluno</div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <nav>
          <Link to="/perfil" className="item">
            <span className="icon">👤</span>
            {open && <span>Perfil</span>}
          </Link>

          <Link to="/ranking" className="item">
            <span className="icon">🏆</span>
            {open && <span>Ranking</span>}
          </Link>

          <Link to="/questoes" className="item">
            <span className="icon">📚</span>
            {open && <span>Questões</span>}
          </Link>

          <Link to="/resolucoes" className="item">
            <span className="icon">📄</span>
            {open && <span>Resoluções</span>}
          </Link>

          <Link to="/partida" className="item">
            <span className="icon">🎮</span>
            {open && <span>Partida</span>}
          </Link>

          <Link to="/ajuda" className="item">
            <span className="icon">❓</span>
            {open && <span>Ajuda</span>}
          </Link>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
