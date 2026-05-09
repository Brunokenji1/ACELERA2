import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import Perfil from "./pages/Perfil";

import Layout from "./components/Layout";

import Resolucoes from "./pages/Resolucoes";

import Partida from "./pages/Partida";

import Ranking from "./pages/Ranking";

//Questoes 
import Categorias from "./pages/Questoes/Categorias";
import ListaQuestoes from "./pages/Questoes/ListaQuestoes";
import Questao from "./pages/Questoes/Questao";


import Ajuda from "./pages/Ajuda";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

         <Route element={<Layout />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/questoes" element={<Categorias />} />
          <Route path="/questoes/:categoria" element={<ListaQuestoes />} />
          <Route path="/questao/:id" element={<Questao />} />
          <Route path="/resolucoes" element={<Resolucoes />} />
          <Route path="/partida" element={<Partida />} />
          <Route path="/ajuda" element={<Ajuda />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;