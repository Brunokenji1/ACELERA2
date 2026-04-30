import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/layout.css";

export default function Layout() {
  const [open, setOpen] = useState(true);

  return (
    <div className={`layout ${open ? "open" : "closed"}`}>

      {/* HEADER */}
      <header className="header">
        <button onClick={() => setOpen(!open)} className="menu-btn">
          ☰
        </button>

        <h1 className="logo">STUDY <span>flow</span></h1>
        <div className="user">Aluno</div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <ul>
          <li><Link to="/perfil"> {open && "Perfil"}</Link></li>
          <li><Link to="/ranking"> {open && "Ranking"}</Link></li>
          <li><Link to="/questoes"> {open && "Questões"}</Link></li>
          <li><Link to="/ajuda"> {open && "Ajuda"}</Link></li>
        </ul>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">
        <Outlet />
      </main>

    </div>
  );
}