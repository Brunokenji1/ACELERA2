import "../../styles/partidas/partida.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  buscarPartida,
  iniciarPartida,
  registrarBuzz,
  responderQuestao,
  pularRodada,
} from "../../services/partidaService";
import VencedorModal from "../../components/VencedorModal";

export default function Partida() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partida, setPartida] = useState(null);
  const [questaoAtual, setQuestaoAtual] = useState(null);
  // Simbolos para exibir nas alternativas
  const simbolos = ["◯", "□", "△", "✕", "◇"];

  // Estados para controle da partida
  const [tempoPreparacao, setTempoPreparacao] = useState(10);
  const [partidaIniciada, setPartidaIniciada] = useState(false);

  // Controle do buzz
  const [buzzLiberado, setBuzzLiberado] = useState(false);

  // Controle do jogador da vez e tempo de resposta
  const [jogadorDaVez, setJogadorDaVez] = useState(null);
  const [tempoResposta, setTempoResposta] = useState(5);

  //
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);

  const [pontosJogador1, setPontosJogador1] = useState(0);
  const [pontosJogador2, setPontosJogador2] = useState(0);

  const [segundaChance, setSegundaChance] = useState(false);
  const primeiraVezUsada = useRef(false);
  const timeoutRef = useRef(null);
  const countdownRef = useRef(null);

  const [rodadaAtual, setRodadaAtual] = useState(null);

  const [partidaFinalizada, setPartidaFinalizada] = useState(false);

  // Estados para controle do modal de vencedor
  const [vencedor, setVencedor] = useState(null);
  const [empate, setEmpate] = useState(false);

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

      primeiraVezUsada.current = false;
      setJogadorDaVez(jogador);
      setTempoResposta(5);
      setSegundaChance(false);

      console.log(`Jogador ${jogador} ganhou a vez`);
    } catch (erro) {
      console.error(erro);
    }
  }

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(countdownRef.current);

    if (!jogadorDaVez) {
      setTempoResposta(5);
      return;
    }

    setTempoResposta(5);

    countdownRef.current = setInterval(() => {
      setTempoResposta((t) => Math.max(0, t - 1));
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(countdownRef.current);

      if (!primeiraVezUsada.current) {
        const outroNumero = jogadorDaVez === 1 ? 2 : 1;
        primeiraVezUsada.current = true;
        setJogadorDaVez(outroNumero);
      } else {
        primeiraVezUsada.current = false;
        setJogadorDaVez(null);
        pularRodada(id)
          .then((resultado) => {
            if (resultado.proxima_rodada) {
              setRodadaAtual(resultado.proxima_rodada);
              setQuestaoAtual(resultado.proxima_rodada.RodadaDeQuestoes[0].Questo);
              setBuzzLiberado(false);
              setTempoPreparacao(10);
              setPartidaIniciada(true);
              setRespostaSelecionada(null);
              setSegundaChance(false);
            } else {
              atualizarPartida().then((placar) => {
                if (!placar) { setPartidaFinalizada(true); return; }
                if (placar.pontos1 > placar.pontos2) setVencedor(1);
                else if (placar.pontos2 > placar.pontos1) setVencedor(2);
                else setEmpate(true);
                setPartidaFinalizada(true);
              });
            }
          })
          .catch(console.error);
      }
    }, 5000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(countdownRef.current);
    };
  }, [jogadorDaVez]);

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

  //formatação do timer principal
  const minutos = String(Math.floor(tempoPreparacao / 60)).padStart(2, "0");
  const segundos = String(tempoPreparacao % 60).padStart(2, "0");

  // Extração da URL da imagem do enunciado e formatação do texto do enunciado
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

      const pontos1 = jogador1?.pontos_partida || 0;
      const pontos2 = jogador2?.pontos_partida || 0;

      setPontosJogador1(jogador1?.pontos_partida || 0);
      setPontosJogador2(jogador2?.pontos_partida || 0);

      return {
        pontos1,
        pontos2,
      };
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

      if (resultado.vez_jogador) {
        if (primeiraVezUsada.current) {
          // primeiro jogador já usou sua chance (errou ou não respondeu), segundo também errou → pula rodada
          primeiraVezUsada.current = false;
          setJogadorDaVez(null);
          pularRodada(id)
            .then((res) => {
              if (res.proxima_rodada) {
                setRodadaAtual(res.proxima_rodada);
                setQuestaoAtual(res.proxima_rodada.RodadaDeQuestoes[0].Questo);
                setBuzzLiberado(false);
                setTempoPreparacao(10);
                setPartidaIniciada(true);
                setRespostaSelecionada(null);
                setSegundaChance(false);
              } else {
                atualizarPartida().then((placar) => {
                  if (!placar) { setPartidaFinalizada(true); return; }
                  if (placar.pontos1 > placar.pontos2) setVencedor(1);
                  else if (placar.pontos2 > placar.pontos1) setVencedor(2);
                  else setEmpate(true);
                  setPartidaFinalizada(true);
                });
              }
            })
            .catch(console.error);
          return;
        }
        const outroNumero = jogadorDaVez === 1 ? 2 : 1;
        primeiraVezUsada.current = true;
        setJogadorDaVez(outroNumero);
        setTempoResposta(5);
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
        primeiraVezUsada.current = false;
      } else {
        setEmpate(false);
        setVencedor(null);

        const placar = await atualizarPartida();

        if (!placar) {
          setPartidaFinalizada(true);
          return;
        }

        if (placar.pontos1 > placar.pontos2) {
          setVencedor(1);
        } else if (placar.pontos2 > placar.pontos1) {
          setVencedor(2);
        } else {
          setEmpate(true);
        }

        setPartidaFinalizada(true);
      }
    } catch (erro) {
      console.error(erro);
    }
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

      <VencedorModal
        aberto={partidaFinalizada}
        vencedor={vencedor}
        empate={empate}
        pontosJogador1={pontosJogador1}
        pontosJogador2={pontosJogador2}
        fechar={() => navigate("/partidas")}
        novaPartida={() => {navigate("/partidas/criar")}}
      />
    </div>
  );
}
