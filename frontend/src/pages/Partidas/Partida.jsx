import "../../styles/partidas/partida.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  buscarPartida,
  iniciarPartida,
  registrarBuzz,
  responderQuestao,
} from "../../services/partidaService";

export default function Partida() {
  const { id } = useParams();
  const [partida, setPartida] = useState(null);
  const [questaoAtual, setQuestaoAtual] = useState(null);

  const simbolos = ["◯", "□", "△", "✕", "◇"];

  const [tempoPreparacao, setTempoPreparacao] = useState(10);
  const [partidaIniciada, setPartidaIniciada] = useState(false);

  const [buzzLiberado, setBuzzLiberado] = useState(false);

  const [jogadorDaVez, setJogadorDaVez] = useState(null);
  const [tempoResposta, setTempoResposta] = useState(5);

  const [respostaSelecionada, setRespostaSelecionada] = useState(null);

  const [pontosJogador1, setPontosJogador1] = useState(0);
  const [pontosJogador2, setPontosJogador2] = useState(0);

  const [segundaChance, setSegundaChance] = useState(false);

  const [rodadaAtual, setRodadaAtual] = useState(null);

  const [partidaFinalizada, setPartidaFinalizada] = useState(false);

  useEffect(() => {
    atualizarPartida();
  }, [id]);

  async function iniciar() {
    try {
      const resposta = await iniciarPartida(id);

      console.log(resposta);
      // Teste para acessar as alternativas da questão
      console.log(
        resposta.rodada_atual.RodadaDeQuestoes[0].Questo.alternativas[0],
      );

      console.log("RODADA COMPLETA", resposta.rodada_atual);

      setQuestaoAtual(resposta.rodada_atual.RodadaDeQuestoes[0].Questo);

      setRodadaAtual(resposta.rodada_atual);

      console.log("Partida iniciada!");

      setPartidaIniciada(true);
      setTempoPreparacao(10);
    } catch (erro) {
      console.error(erro);
    }
  }

  async function apertarBuzz(jogador) {
    if (!buzzLiberado) return;

    if (jogadorDaVez) return;

    console.log({
      partida: id,
      rodada: rodadaAtual.id,
      jogador,
    });

    try {
      const resultado = await registrarBuzz(id, {
        botao_numero: jogador,
        id_rodada: rodadaAtual.id,
      });

      console.log(resultado);

      setJogadorDaVez(jogador);

      setTempoResposta(5);

      setSegundaChance(false);

      console.log(`Jogador ${jogador} ganhou a vez`);
    } catch (erro) {
      console.error(erro);
    }
  }

  useEffect(() => {
    if (!jogadorDaVez) return;

    if (tempoResposta <= 0) {
      console.log("Tempo esgotado");

      setJogadorDaVez(null);

      return;
    }

    const intervalo = setInterval(() => {
      setTempoResposta((tempo) => tempo - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tempoResposta, jogadorDaVez]);

  useEffect(() => {
    if (!partidaIniciada) return;

    if (tempoPreparacao <= 0) {
      setBuzzLiberado(true);
      return;
    }

    const intervalo = setInterval(() => {
      setTempoPreparacao((tempo) => tempo - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tempoPreparacao, partidaIniciada]);

  const minutos = String(Math.floor(tempoPreparacao / 60)).padStart(2, "0");
  const segundos = String(tempoPreparacao % 60).padStart(2, "0");

  const imagemMatch = questaoAtual?.enunciado?.match(/!\[\]\((.*?)\)/);
  const imagemUrl = imagemMatch?.[1];
  const textoFormatado = questaoAtual?.enunciado
    ?.replace(/!\[\]\(.*?\)/g, "")
    ?.replace(/\*\*/g, "")
    ?.replace(/Disponível em:/g, "Disponível em:")
    ?.trim();

  async function atualizarPartida() {
        try {
          const resposta = await buscarPartida(id);

          setPartida(resposta.partida);

          const jogador1 = resposta.partida.UsuarioPartidas?.find(
            (j) => j.botao_numero === 1,
          );

          const jogador2 = resposta.partida.UsuarioPartidas?.find(
            (j) => j.botao_numero === 2,
          );

          setPontosJogador1(jogador1?.pontos_partida || 0);
          setPontosJogador2(jogador2?.pontos_partida || 0);
        } catch (erro) {
          console.error(erro);
        }
      }

  async function responder(alternativa) {
    if (!jogadorDaVez) return;

    try {
      const resultado = await responderQuestao(id, {
        botao_numero: jogadorDaVez,
        alternativa: alternativa.ordem,
        id_rodada: rodadaAtual.id,
      });

      console.log(resultado);

      await atualizarPartida();

      if (resultado.outra_chance) {
        console.log("Nova chance: aguardando novo buzz");

        setJogadorDaVez(null);

        setTempoResposta(5);

        setBuzzLiberado(true);

        return;
      }

      if (resultado.proxima_rodada) {
        console.log("próxima rodada:", resultado.proxima_rodada);
        console.log("PROXIMA RODADA COMPLETA", resultado.proxima_rodada);

        console.log("RDQ", resultado.proxima_rodada.RodadaDeQuestoes);
        setRodadaAtual(resultado.proxima_rodada);

        setQuestaoAtual(resultado.proxima_rodada.RodadaDeQuestoes[0].Questo);

        setBuzzLiberado(false);

        setJogadorDaVez(null);

        setTempoPreparacao(10);

        setPartidaIniciada(true);

        setRespostaSelecionada(null);

        setSegundaChance(false);
      } else {
        setPartidaFinalizada(true);
      }
    } catch (erro) {
      console.error(erro);
    }
  }

  if (partidaFinalizada) {
    return (
      <div className="partida-finalizada">
        <h1>Partida Encerrada!</h1>

        <p>Jogador 1: {pontosJogador1} pontos</p>

        <p>Jogador 2: {pontosJogador2} pontos</p>
      </div>
    );
  }

  return (
    <div className="partida-page">
      <div className="faixa-esquerda"></div>

      <div className="partida-container">
        {/* Jogador 1 */}
        <div className="jogador-coluna">
          <h2>Jogador 1</h2>

          <div className="avatar-box">Avatar</div>

          <p className="nome-jogador">Luiz Felipe</p>

          <div className="pontos-box">
            <span>Pontos</span>
            <h3>{pontosJogador1}</h3>
          </div>

          {jogadorDaVez === 1 ? (
            <div className="timer-jogador">{tempoResposta}s</div>
          ) : (
            <div className="timer-jogador timer-vazio">--</div>
          )}
        </div>

        {/* Centro */}
        <div className="centro-coluna">
          <div className="topo-partida">
            <div className="pontos-questao">1 pts</div>

            <div className="timer-principal">
              {minutos}:{segundos}
            </div>

            {buzzLiberado ? (
              <div className="status-buzz liberado">BUZZ LIBERADO</div>
            ) : (
              <div className="status-buzz bloqueado">AGUARDANDO LEITURA</div>
            )}

            {/* btn teste buzz */}
            <div className="teste-buzz">
              <button onClick={() => apertarBuzz(1)}>Buzz Jogador 1</button>

              <button onClick={() => apertarBuzz(2)}>Buzz Jogador 2</button>
            </div>

            <div className="rodada-info">
              {rodadaAtual?.ordem || 1}/{partida?.quantidade_questoes || 5}
            </div>
          </div>

          <div className="enunciado-box">
            <h3>Questão</h3>
            {imagemUrl && (
              <img
                src={imagemUrl}
                alt="Imagem da questão"
                className="imagem-questao"
              />
            )}

            <p>{textoFormatado}</p>
          </div>

          <button className="btn-iniciar-rodada" onClick={iniciar}>
            Iniciar Rodada
          </button>

          <div className="alternativas-box">
            {questaoAtual?.alternativas?.map((alternativa, index) => (
              <div
                key={alternativa.id}
                className={`alternativa-box ${
                  respostaSelecionada === alternativa.id
                    ? "alternativa-selecionada"
                    : ""
                }`}
                onClick={() => responder(alternativa)}
              >
                {simbolos[index]} {alternativa.texto}
              </div>
            ))}
          </div>
        </div>

        {/* Jogador 2 */}
        <div className="jogador-coluna">
          <h2>Jogador 2</h2>

          <div className="avatar-box">Avatar</div>

          <p className="nome-jogador">Convidado</p>

          <div className="pontos-box">
            <span>Pontos</span>
            <h3>{pontosJogador2}</h3>
          </div>

          {jogadorDaVez === 2 ? (
            <div className="timer-jogador">{tempoResposta}s</div>
          ) : (
            <div className="timer-jogador timer-vazio">--</div>
          )}
        </div>
      </div>

      <div className="faixa-direita"></div>
    </div>
  );
}
