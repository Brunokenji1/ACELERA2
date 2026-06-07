import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import Perfil from "./pages/Perfil";

import Layout from "./components/Layout";

import Ranking from "./pages/Ranking";

//Questoes
import Categorias from "./pages/Questoes/Categorias";
import ListaQuestoes from "./pages/Questoes/ListaQuestoes";
import Questao from "./pages/Questoes/Questao";

//Resolucoes
import ListaResolucoes from "./pages/Resolucoes/ListaResolucoes";
import ResolucaoDetalhe from "./pages/Resolucoes/ResolucaoDetalhe";

//Partidas
import ListaPartidas from "./pages/Partidas/ListaPartidas";
import CriarPartida from "./pages/Partidas/CriarPartida";
import Partida from "./pages/Partidas/Partida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/partidas/criar" element={<CriarPartida />} />
        <Route path="/partidas/:id" element={<Partida />} />

        <Route element={<Layout />}>

          <Route path="/perfil" element={<Perfil />} />

          <Route path="/ranking" element={<Ranking />} />

          <Route path="/questoes" element={<Categorias />} />
          <Route path="/questoes/:categoria" element={<ListaQuestoes />} />
          <Route path="/questao/:id" element={<Questao />} />

          <Route path="/resolucoes" element={<ListaResolucoes />} />
          <Route path="/resolucoes/:id" element={<ResolucaoDetalhe />} />

          <Route path="/partidas" element={<ListaPartidas />} />
         
          

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
