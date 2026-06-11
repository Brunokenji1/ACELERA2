import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
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
  LogOut,
} from "lucide-react";
import Categorias from "../pages/Questoes/Categorias";

export default function Layout() {
  const [open, setOpen] = useState(true);

  const [ajudaAberta, setAjudaAberta] = useState(false);

  const location = useLocation();

  const navigate = useNavigate();

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

    "/questoes/categoria": {
      titulo: "Lista de questões",

      descricao:
        "Nesta tela são exibidas as questões disponíveis para estudo. Utilize as categorias para navegar e clique sobre uma questão para visualizar seu conteúdo e responder.",
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

  const textoAtual = (() => {
    if (
      location.pathname === "/questoes" ||
      location.pathname.startsWith("/questoes/") ||
      location.pathname.startsWith("/questao/")
    ) {
      return {
        titulo: "Questões",
        descricao:
          "Nesta área você pode explorar questões de diversas matérias, responder atividades e acompanhar seu desempenho. Cada questão possui até três tentativas. Após responder, você poderá consultar a resolução completa para revisar o conteúdo e compreender a alternativa correta.",
      };
    }

    if (
      location.pathname === "/resolucoes" ||
      location.pathname.startsWith("/resolucoes/")
    ) {
      return {
        titulo: "Resoluções",
        descricao:
          "Nesta área você encontra o histórico das questões respondidas, com indicação de acertos e erros. Também é possível visualizar a alternativa correta e a explicação detalhada de cada questão para auxiliar nos estudos.",
      };
    }

    if (
      location.pathname === "/partidas" ||
      location.pathname.startsWith("/partida")
    ) {
      return {
        titulo: "Partidas",
        descricao:
          "O modo partida permite disputar desafios entre jogadores. Aguarde a leitura da questão, utilize o buzz para responder e acumule pontos ao acertar. Ao final, é exibido o resultado da disputa.",
      };
    }

    return textosAjuda[location.pathname];
  })();

  return (
    <div className={`layout ${open ? "open" : "closed"}`}>
      {/* HEADER */}
      <header className="header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          <Menu size={24} />
        </button>

        <div className="logo-container-layout">
          <img
            src="/logo192.png"
            alt="Logo StudyFlow"
            className="logo-header"
          />

          <h1 className="logo">
            STUDY<span>flow</span>
          </h1>
        </div>

        <button
          className="user logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
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
        titulo={textoAtual?.titulo}
        descricao={textoAtual?.descricao}
      />
    </div>
  );
}
