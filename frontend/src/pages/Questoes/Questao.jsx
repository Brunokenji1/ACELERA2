import "../../styles/questao.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {buscarQuestao, responderQuestao as responderQuestaoAPI } from "../../services/questaoService";

export default function Questao() {
  const navigate = useNavigate();

  const [tentativas, setTentativas] = useState(3);

  const [bloqueado, setBloqueado] = useState(false);

  const [selecionada, setSelecionada] = useState(null);

  const { id } = useParams();

  const [questao, setQuestao] = useState(null);

  useEffect(() => {
    async function carregarQuestao() {
      try {
        const resposta = await buscarQuestao(id);

        console.log(resposta);

        setQuestao(resposta.questaoBuscada);

        console.log(resposta.questaoBuscada.enunciado);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarQuestao();
  }, [id]);

async function responder(alternativa) {
  if (bloqueado) return;

  try {
    const resposta = await responderQuestaoAPI(
      questao.id,
      alternativa.id
    );

    console.log(resposta);

    setSelecionada(alternativa.ordem);

    if (resposta.acertou) {
      setBloqueado(true);
      return;
    }

    const novasTentativas = tentativas - 1;
    setTentativas(novasTentativas);

    if (novasTentativas <= 0) {
      setBloqueado(true);
    }
  } catch (erro) {
    console.error(erro);
  }
}

  if (!questao) {
    return <p>Carregando questão...</p>;
  }

  const imagemMatch = questao.enunciado?.match(
    /https?:\/\/[^\s)]+\.(png|jpg|jpeg|gif|webp)/i,
  );

  const imagemUrl = imagemMatch ? imagemMatch[0] : null;

  const enunciadoLimpo = questao.enunciado
    ?.replace(/!\[.*?\]\(.*?\)/g, "")
    ?.replace(/\*\*/g, "")
    ?.replace(/#/g, "");

  const alternativaCorreta = questao.alternativas.find(
    (alt) => alt.correta,
  )?.ordem;

  return (
    <div className="questao-container">
      {/* BOTÃO VOLTAR */}
      <button className="btn-voltar-questao" onClick={() => navigate(-1)}>
        ←
      </button>

      {/* HEADER */}
      <div className="questao-header">
        {/* ESQUERDA */}
        <div className="questao-tags">
          <span className="tag-id">{String(questao.id).padStart(4, "0")}</span>

          <span className="tag-enem">ENEM {questao.ano}</span>

          <span className="tag-categoria">Matéria {questao.id_materia}</span>
        </div>

        {/* DIREITA */}
        <span className="pontos">3,00</span>
      </div>

      {/* QUESTÃO */}
      <div className="questao-box">
        <>
          {imagemUrl && (
            <img
              src={imagemUrl}
              alt="Imagem da questão"
              className="questao-imagem"
            />
          )}

          <p className="enunciado-texto">{enunciadoLimpo}</p>
        </>
      </div>

      {/* ALTERNATIVAS */}
      <div className="alternativas">
        {questao.alternativas.map((alt) => {
          let classe = "";

          // VERDE
          if (bloqueado && alt.ordem === alternativaCorreta) {
            classe = "correta";
          }

          // VERMELHO
          else if (
            selecionada === alt.ordem &&
            alt.ordem !== alternativaCorreta
          ) {
            classe = "errada";
          }

          return (
            <button
              key={alt.ordem}
              className={`alternativa ${classe}`}
              onClick={() => responder(alt)}
              disabled={bloqueado}
            >
              <span className="letra">{alt.ordem}</span>

              <span>{alt.texto}</span>
            </button>
          );
        })}
      </div>

      {/* TENTATIVAS */}
      <p className="tentativas">Tentativas restantes: {tentativas}</p>
    </div>
  );
}
