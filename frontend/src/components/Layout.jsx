import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import AjudaModal from "./AjudaModal";
import "../styles/layout.css";
import {
  User,
  Trophy,
  BookOpen,
  FileText,
  Gamepad2,
  CircleHelp,
  Menu,
} from "lucide-react";

export default function Layout() {
  const [open, setOpen] = useState(true);

  const [ajudaAberta, setAjudaAberta] = useState(false);

  const location = useLocation();

  const textosAjuda = {
    "/perfil": {
      titulo: "Perfil",

      descricao:
        "Nesta tela você pode visualizar suas informações pessoais, acompanhar seu desempenho na plataforma e monitorar sua evolução ao longo do tempo. Aqui também serão exibidas suas estatísticas, pontuação total e progresso nas atividades.",
    },

    "/ranking": {
      titulo: "Ranking",

      descricao:
        "O ranking mostra os jogadores com maior pontuação da plataforma. Resolva questões e acumule pontos para subir posições. Seu posicionamento atual também aparece destacado no final da lista.",
    },

    "/questoes": {
      titulo: "Questões",

      descricao:
        "Nesta área você pode escolher categorias e responder questões de diferentes matérias e níveis de dificuldade. Cada questão possui até três tentativas. Ao acertar, você ganha pontos que ajudam no seu desempenho geral e no ranking.",
    },

    "/resolucoes": {
      titulo: "Resoluções",

      descricao:
        "Aqui você poderá visualizar resoluções e explicações detalhadas das questões respondidas. Esta área ajuda na revisão de conteúdo e no entendimento dos erros e acertos realizados durante os exercícios.",
    },

    "/partidas": {
      titulo: "Partida",

      descricao:
        "O modo partida permite competir com outros jogadores em desafios de perguntas e respostas. Durante as partidas você poderá testar seus conhecimentos em tempo real e conquistar mais pontos na plataforma.",
    },
  };

  return (
    <div className={`layout ${open ? "open" : "closed"}`}>
      {/* HEADER */}
      <header className="header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          <Menu size={24} />
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
            <User clasName="icon" size={24} />
            {open && <span>Perfil</span>}
          </Link>

          <Link to="/ranking" className="item">
              <Trophy className="icon" size={20} />
            {open && <span>Ranking</span>}
          </Link>

          <Link to="/questoes" className="item">
            <BookOpen className="icon" size={20} />
            {open && <span>Questões</span>}
          </Link>

          <Link to="/resolucoes" className="item">
            <FileText className="icon" size={20} />
            {open && <span>Resoluções</span>}
          </Link>

          <Link to="/partidas" className="item">
            <Gamepad2 className="icon" size={20} />
            {open && <span>Partida</span>}
          </Link>

          <button
            className="item ajuda-btn"
            onClick={() => setAjudaAberta(true)}
          >
            <CircleHelp className="icon" size={20} />

            {open && <span>Ajuda</span>}
          </button>
        </nav>
      </aside>

      {/* CONTEÚDO */}
      <main className="content">
        <Outlet />
      </main>

      <AjudaModal
        aberto={ajudaAberta}
        fechar={() => setAjudaAberta(false)}
        titulo={textosAjuda[location.pathname]?.titulo}
        descricao={textosAjuda[location.pathname]?.descricao}
      />
    </div>
  );
}
