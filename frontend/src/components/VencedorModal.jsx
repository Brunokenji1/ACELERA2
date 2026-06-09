import "../styles/vencedorModal.css";

export default function VencedorModal({
  aberto,
  vencedor,
  empate,
  pontosJogador1,
  pontosJogador2,
  fechar,
  novaPartida,
}) {
  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box vencedor-modal">
        <button className="fechar-modal" onClick={fechar}>
          ✕
        </button>

        <h2>{empate ? "🤝 Empate!" : `🏆 Parabéns!`}</h2>

        <p className="mensagem-vencedor">
          {empate
            ? "Os dois jogadores terminaram com a mesma pontuação."
            : `Jogador ${vencedor} venceu a partida!`}
        </p>

        <div className="placar-final">
          <div className="placar-jogador">
            <span>Jogador 1</span>
            <strong>{pontosJogador1} pts</strong>
          </div>

          <div className="placar-jogador">
            <span>Jogador 2</span>
            <strong>{pontosJogador2} pts</strong>
          </div>
        </div>

        <div className="acoes-vencedor">
          <button className="btn-nova-partida" onClick={novaPartida}>
            Nova Partida
          </button>
        </div>
        
      </div>
    </div>
  );
}
