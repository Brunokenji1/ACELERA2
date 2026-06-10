import "../../styles/partidas/listaPartidas.css";

import { useNavigate } from "react-router-dom";
import { Gamepad2, Globe } from "lucide-react";

export default function ListaPartidas() {
  const navigate = useNavigate();

  return (
    <div className="partidas-container">
      <div className="partidas-header">
        <h1>Partidas</h1>

        <p>
          Crie desafios locais utilizando o painel ESP32 ou acompanhe futuras
          modalidades online.
        </p>
      </div>

      <div className="partidas-cards">
        {/* PARTIDA LOCAL */}
        <div
          className="partida-card"
          onClick={() => navigate("/partidas/criar")}
        >
          <div className="partida-icon">
            <Gamepad2 size={42} />
          </div>

          <h2>Partida Local</h2>

          <p>Crie uma disputa 1v1 utilizando o painel físico ESP32.</p>
        </div>

        {/* PARTIDA ONLINE */}
        <div className="partida-card partida-online">
          <div className="partida-icon">
            <Globe size={42} />
          </div>

          <h2>Partida Online</h2>

          <p>Funcionalidade disponível em versões futuras.</p>
        </div>
      </div>
    </div>
  );
}