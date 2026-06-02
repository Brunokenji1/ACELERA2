import "../../styles/partidas/criarPartida.css";

import { useNavigate } from "react-router-dom";

export default function CriarPartida() {
  const navigate = useNavigate();

  function voltar() {
    const confirmar = window.confirm(
      "Deseja realmente sair da criação da partida?",
    );

    if (confirmar) {
      navigate("/partidas");
    }
  }

  return (
    <div className="criar-partida-page">
      {/* FAIXA ESQUERDA */}
      <div className="faixa-esquerda">
        <button className="btn-voltar-partida" onClick={voltar}>
          ←
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="conteudo-partida">
        {/* JOGADOR 1 */}
        <div className="jogador-card">
          <div className="nome-box">Jogador 1</div>
          <div className="avatar-placeholder">Foto Perfil</div>

          <p>Usuário Logado</p>
        </div>

        {/* CONFIGURAÇÕES */}
        <div className="configuracoes-card">
          <h2>Configurações</h2>

          <select>
            <option>Matemática</option>
            <option>Linguagens</option>
            <option>Ciências Humanas</option>
            <option>Ciências da Natureza</option>
            <option>ENEM</option>
          </select>

          <select>
            <option>Fácil</option>
            <option>Médio</option>
            <option>Difícil</option>
          </select>

          <select>
            <option>5 Questões</option>
            <option>10 Questões</option>
            <option>15 Questões</option>
            <option>20 Questões</option>
          </select>

          <select>
            <option>15 segundos</option>
            <option>30 segundos</option>
            <option>45 segundos</option>
            <option>60 segundos</option>
          </select>

          <button className="btn-iniciar">Iniciar Partida</button>
        </div>

        {/* JOGADOR 2 */}
        <div className="jogador-card">
          <h2>Jogador 2</h2>

          <div className="avatar-placeholder">Avatar</div>

          <div className="campo-label">Nome</div>

          <input type="text" placeholder="Digite o nome" />
        </div>
      </div>

      {/* FAIXA DIREITA */}
      <div className="faixa-direita"></div>
    </div>
  );
}
