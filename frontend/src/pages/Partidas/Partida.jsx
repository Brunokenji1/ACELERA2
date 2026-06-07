import "../../styles/partidas/partida.css";

export default function Partida() {
  return (
    <div className="partida-page">

      <div className="faixa-esquerda"></div>

      <div className="partida-container">

        {/* Jogador 1 */}
        <div className="jogador-coluna">
          <h2>Jogador 1</h2>

          <div className="avatar-box">
            Avatar
          </div>

          <p className="nome-jogador">
            Luiz Felipe
          </p>

          <div className="pontos-box">
            <span>Pontos</span>
            <h3>0</h3>
          </div>

          <div className="timer-jogador">
            5s
          </div>
        </div>

        {/* Centro */}
        <div className="centro-coluna">

          <div className="topo-partida">

            <div className="pontos-questao">
              3 pts
            </div>

            <div className="timer-principal">
              01:30
            </div>

            <div className="rodada-info">
              1/5
            </div>

          </div>

          <div className="enunciado-box">
            <h3>Enunciado da Questão</h3>

            <p>
              Aqui aparecerá o texto da questão.
            </p>
          </div>

          <div className="alternativas-box">

            <button>◯ Alternativa A</button>

            <button>□ Alternativa B</button>

            <button>△ Alternativa C</button>

            <button>✕ Alternativa D</button>

            <button>◇ Alternativa E</button>

          </div>

        </div>

        {/* Jogador 2 */}
        <div className="jogador-coluna">
          <h2>Jogador 2</h2>

          <div className="avatar-box">
            Avatar
          </div>

          <p className="nome-jogador">
            Convidado
          </p>

          <div className="pontos-box">
            <span>Pontos</span>
            <h3>0</h3>
          </div>

          <div className="timer-jogador">
            5s
          </div>
        </div>

      </div>

      <div className="faixa-direita"></div>

    </div>
  );
}