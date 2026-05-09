import "../../styles/questao.css";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Questao() {
  const navigate = useNavigate();

  const [tentativas, setTentativas] = useState(3);

  const [bloqueado, setBloqueado] = useState(false);

  const [selecionada, setSelecionada] = useState(null);

  const alternativaCorreta = "B";

  const alternativas = [
    {
      letra: "A",
      texto: "a ascensão social era improvável.",
    },

    {
      letra: "B",
      texto: "a mudança de nome era impensável.",
    },

    {
      letra: "C",
      texto: "a origem do indivíduo era irrelevante.",
    },

    {
      letra: "D",
      texto: "o trabalho feminino era inimaginável.",
    },

    {
      letra: "E",
      texto: "o comportamento parental era irresponsável.",
    },
  ];

  function responder(alternativa) {
    if (bloqueado) return;

    setSelecionada(alternativa);

    // ACERTO
    if (alternativa === alternativaCorreta) {
      setBloqueado(true);

      return;
    }

    // ERRO
    const novasTentativas = tentativas - 1;

    setTentativas(novasTentativas);

    // ACABARAM AS TENTATIVAS
    if (novasTentativas <= 0) {
      setBloqueado(true);
    }
  }

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
          <span className="tag-id">0005</span>

          <span className="tag-enem">ENEM 2023</span>

          <span className="categoria">Linguagens e suas Tecnologias</span>
        </div>

        {/* DIREITA */}
        <span className="pontos">3,00</span>
      </div>

      {/* QUESTÃO */}
      <div className="questao-box">
        <p>
          A crítica do livro de memórias de Michelle Obama aborda a história das
          relações humanas e destaca:  A crítica do livro de memórias de Michelle Obama aborda a história das
          relações humanas e destaca:  A crítica do livro de memórias de Michelle Obama aborda a história das
          relações humanas e destaca:  A crítica do livro de memórias de Michelle Obama aborda a história das
          relações humanas e destaca:  A crítica do livro de memórias de Michelle Obama aborda a história das
          relações humanas e destaca:  A crítica do livro de memórias de Michelle Obama aborda a história das
          relações humanas e destaca:
        </p>
      </div>

      {/* ALTERNATIVAS */}
      <div className="alternativas">
        {alternativas.map((alt) => {
          let classe = "";

          // VERDE
          if (bloqueado && alt.letra === alternativaCorreta) {
            classe = "correta";
          }

          // VERMELHO
          else if (
            selecionada === alt.letra &&
            alt.letra !== alternativaCorreta
          ) {
            classe = "errada";
          }

          return (
            <button
              key={alt.letra}
              className={`alternativa ${classe}`}
              onClick={() => responder(alt.letra)}
              disabled={bloqueado}
            >
              <span className="letra">{alt.letra}</span>

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
