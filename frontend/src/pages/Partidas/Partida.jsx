import "../../styles/partidas/partida.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { buscarPerfil } from "../../services/usuarioService";
import avatarPadrao from "../../assets/avatar-padrao.svg";
import {
  buscarPartida,
  iniciarPartida,
  registrarBuzz,
  responderQuestao,
  pularRodada,
} from "../../services/partidaService";
import VencedorModal from "../../components/VencedorModal";
import { Circle, Square, Plus, Minus, X } from "lucide-react";

// ===================== UUIDs do firmware ESP32 =====================
const NUS_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const NUS_TX_CHAR = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

export default function Partida() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partida, setPartida] = useState(null);
  const [questaoAtual, setQuestaoAtual] = useState(null);

  const simbolos = [
    <Circle size={22} strokeWidth={2.5} />,
    <Square size={22} strokeWidth={2.5} />,
    <Plus size={22} strokeWidth={2.5} />,
    <Minus size={22} strokeWidth={2.5} />,
    <X size={22} strokeWidth={2.5} />,
  ];

  const [tempoPreparacao, setTempoPreparacao] = useState(10);
  const [partidaIniciada, setPartidaIniciada] = useState(false);
  const [buzzLiberado, setBuzzLiberado] = useState(false);
  const [jogadorDaVez, setJogadorDaVez] = useState(null);
  const [tempoResposta, setTempoResposta] = useState(5);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [statusResposta, setStatusResposta] = useState(null);
  const [pontosJogador1, setPontosJogador1] = useState(0);
  const [pontosJogador2, setPontosJogador2] = useState(0);
  const [segundaChance, setSegundaChance] = useState(false);
  const primeiraVezUsada = useRef(false);
  const timeoutRef = useRef(null);
  const countdownRef = useRef(null);
  const [rodadaAtual, setRodadaAtual] = useState(null);
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [vencedor, setVencedor] = useState(null);
  const [empate, setEmpate] = useState(false);

  // ---- Estado BLE ----
  const [bleStatus, setBleStatus] = useState("desconectado");

  // Refs para o callback BLE sempre ler os valores mais recentes
  const buzzLiberadoRef = useRef(buzzLiberado);
  const jogadorDaVezRef = useRef(jogadorDaVez);
  const rodadaAtualRef = useRef(rodadaAtual);
  const questaoAtualRef = useRef(questaoAtual);

  useEffect(() => {
    buzzLiberadoRef.current = buzzLiberado;
  }, [buzzLiberado]);
  useEffect(() => {
    jogadorDaVezRef.current = jogadorDaVez;
  }, [jogadorDaVez]);
  useEffect(() => {
    rodadaAtualRef.current = rodadaAtual;
  }, [rodadaAtual]);
  useEffect(() => {
    questaoAtualRef.current = questaoAtual;
  }, [questaoAtual]);

  useEffect(() => {
    atualizarPartida();
  }, [id]);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const resposta = await buscarPerfil();
        setUsuario(resposta.usuario);
      } catch (erro) {
        console.error(erro);
      }
    }
    carregarPerfil();
  }, []);

  async function iniciar() {
    try {
      const resposta = await iniciarPartida(id);
      console.log(resposta);
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
    if (!buzzLiberadoRef.current) return;
    if (jogadorDaVezRef.current) return;

    console.log({ partida: id, rodada: rodadaAtualRef.current?.id, jogador });

    try {
      const resultado = await registrarBuzz(id, {
        botao_numero: jogador,
        id_rodada: rodadaAtualRef.current?.id,
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
              setQuestaoAtual(
                resultado.proxima_rodada.RodadaDeQuestoes[0].Questo,
              );
              setBuzzLiberado(false);
              setTempoPreparacao(10);
              setPartidaIniciada(true);
              setRespostaSelecionada(null);
              setStatusResposta(null);
              setSegundaChance(false);
            } else {
              atualizarPartida().then((placar) => {
                if (!placar) {
                  setPartidaFinalizada(true);
                  return;
                }
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
      const pontos1 = jogador1?.pontos_partida || 0;
      const pontos2 = jogador2?.pontos_partida || 0;
      setPontosJogador1(pontos1);
      setPontosJogador2(pontos2);
      return { pontos1, pontos2 };
    } catch (erro) {
      console.error(erro);
    }
  }

  async function responder(alternativa) {
    if (!jogadorDaVezRef.current) return;

    try {
      const resultado = await responderQuestao(id, {
        botao_numero: jogadorDaVezRef.current,
        alternativa: alternativa.ordem,
        id_rodada: rodadaAtualRef.current?.id,
      });

      console.log(resultado);
      await atualizarPartida();
      setRespostaSelecionada(alternativa.id);

      if (resultado.acertou) {
        setStatusResposta("acertou");
      } else {
        setStatusResposta("errou");
      }

      if (resultado.vez_jogador) {
        if (primeiraVezUsada.current) {
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
                setStatusResposta(null);
                setSegundaChance(false);
              } else {
                atualizarPartida().then((placar) => {
                  if (!placar) {
                    setPartidaFinalizada(true);
                    return;
                  }
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
        const outroNumero = jogadorDaVezRef.current === 1 ? 2 : 1;
        primeiraVezUsada.current = true;
        setJogadorDaVez(outroNumero);
        setTempoResposta(5);
        return;
      }

      if (resultado.proxima_rodada) {
        console.log("próxima rodada:", resultado.proxima_rodada);
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
        if (placar.pontos1 > placar.pontos2) setVencedor(1);
        else if (placar.pontos2 > placar.pontos1) setVencedor(2);
        else setEmpate(true);
        setPartidaFinalizada(true);
      }
    } catch (erro) {
      console.error(erro);
    }
  }

  // ===================== INTEGRAÇÃO BLE =====================

  const onMensagemESP32 = useCallback((event) => {
    const msg = new TextDecoder().decode(event.target.value);
    console.log("ESP32 →", msg);

    if (msg === "J1" || msg === "J2") {
      apertarBuzz(msg === "J1" ? 1 : 2);
      return;
    }

    const letras = ["A", "B", "C", "D", "E"];
    const indice = letras.indexOf(msg);
    if (indice !== -1) {
      const alternativas = questaoAtualRef.current?.alternativas;
      if (!alternativas || !alternativas[indice]) return;
      responder(alternativas[indice]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function conectarBLE() {
    if (!navigator.bluetooth) {
      alert(
        "Web Bluetooth não suportado.\nUse o Chrome no desktop ou Android.",
      );
      return;
    }

    setBleStatus("conectando");

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "StudyFlow_certo" }],
        optionalServices: [NUS_SERVICE],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(NUS_SERVICE);
      const txChar = await service.getCharacteristic(NUS_TX_CHAR);

      await txChar.startNotifications();
      txChar.addEventListener("characteristicvaluechanged", onMensagemESP32);

      device.addEventListener("gattserverdisconnected", () => {
        setBleStatus("desconectado");
        console.log("ESP32 desconectado");
      });

      setBleStatus("conectado");
      console.log("ESP32 conectado!");
    } catch (erro) {
      setBleStatus("desconectado");
      if (erro.name !== "NotFoundError") {
        console.error("Erro BLE:", erro);
        alert("Erro ao conectar: " + erro.message);
      }
    }
  }

  // ===================== RENDER =====================

  return (
    <div className="partida-page">
      <div className="faixa-esquerda"></div>

      <div className="partida-container">
        {/* Jogador 1 */}
        <div className="jogador-coluna">
          <h2>Jogador 1</h2>
          <div className="avatar-box">
            <img
              src={usuario?.foto_url || avatarPadrao}
              alt="Foto do jogador"
              className="avatar-img-partida"
              onError={(e) => {
                e.currentTarget.src = avatarPadrao;
              }}
            />
          </div>
          <p className="nome-jogador">{usuario?.nome || "Carregando..."}</p>
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

            <div className="teste-buzz">
              {bleStatus !== "conectado" && (
                <>
                  <button onClick={() => apertarBuzz(1)}>Buzz Jogador 1</button>
                  <button onClick={() => apertarBuzz(2)}>Buzz Jogador 2</button>
                </>
              )}

              <button
                className={`btn-ble btn-ble-${bleStatus}`}
                onClick={conectarBLE}
                disabled={bleStatus === "conectando"}
              >
                {bleStatus === "desconectado" && "🔵 Conectar ESP32"}
                {bleStatus === "conectando" && "⏳ Conectando..."}
                {bleStatus === "conectado" && "🟢 ESP32 Conectado"}
              </button>
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

          {!partidaIniciada && (
            <button className="btn-iniciar-rodada" onClick={iniciar}>
              Iniciar Rodada
            </button>
          )}

          <div className="alternativas-box">
            {questaoAtual?.alternativas?.map((alternativa, index) => (
              <div
                key={alternativa.id}
                className={`alternativa-box alternativa-${index + 1}
                  ${respostaSelecionada === alternativa.id ? "alternativa-selecionada" : ""}
                  ${respostaSelecionada === alternativa.id && statusResposta === "acertou" ? "alternativa-acertou" : ""}
                  ${respostaSelecionada === alternativa.id && statusResposta === "errou" ? "alternativa-errou" : ""}
                `}
                onClick={() => responder(alternativa)}
              >
                <span className={`simbolo-alternativa simbolo-${index + 1}`}>
                  {simbolos[index]}
                </span>
                <span className="texto-alternativa">{alternativa.texto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jogador 2 */}
        <div className="jogador-coluna">
          <h2>Jogador 2</h2>
          <div className="avatar-box">
            <img
              src={avatarPadrao}
              alt="Avatar do convidado"
              className="avatar-img-partida"
            />
          </div>
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
        novaPartida={() => navigate("/partidas/criar")}
      />
    </div>
  );
}
