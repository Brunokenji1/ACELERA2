import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

         <Route element={<Layout />}>
          <Route path="/perfil" element={<Perfil />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;