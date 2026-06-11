import "../../styles/resolucoes/resolucaoDetalhe.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { buscarResolucao } from "../../services/resolucaoService";
import { ArrowLeft } from "lucide-react";

export default function ResolucaoDetalhe() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [resolucao, setResolucao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const imagemMatch = resolucao?.questao?.enunciado?.match(
    /https?:\/\/[^\s)]+\.(png|jpg|jpeg|gif|webp)/i,
  );
  const imagemUrl = imagemMatch ? imagemMatch[0] : null;

  const textoFormatado = resolucao?.questao?.enunciado
    ?.replace(/!\[\]\(.*?\)/g, "")
    ?.replace(/\*\*/g, "")
    ?.replace(/#/g, "")
    ?.trim();

  useEffect(() => {
    async function carregarResolucao() {
      try {
        const resposta = await buscarResolucao(id);

        console.log(resposta);

        setResolucao(resposta.resolucao);
      } catch (erro) {
        console.error(erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarResolucao();
  }, [id]);

  if (carregando) {
    return <h2>Carregando resolução...</h2>;
  }

  if (!resolucao) {
    return <h2>Resolução não encontrada.</h2>;
  }

  const nomeMateria = () => {
    const idMateria = resolucao?.questao?.id_materia;

    if (idMateria === 1) {
      return "Matemática e suas Tecnologias";
    }

    if ([2, 10, 11].includes(idMateria)) {
      return "Linguagens e suas Tecnologias";
    }

    if ([3, 4, 8, 9].includes(idMateria)) {
      return "Ciências Humanas e suas Tecnologias";
    }

    if ([5, 6, 7].includes(idMateria)) {
      return "Ciências da Natureza e suas Tecnologias";
    }

    return "ENEM";
  };

  return (
    <div className="resolucao-container">
      {/* TOPO */}
      <div className="resolucao-topo">
        <button className="resolucao-btn-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={25} />
        </button>

        <div className="resolucao-tags">
          <span className="resolucao-id">{resolucao.questao.id}</span>

          <span className="resolucao-materia">{nomeMateria()}</span>

          <span className="resolucao-prova">
            {resolucao.acertou ? "Acertou" : "Errou"}
          </span>
        </div>
      </div>

      {/* QUESTÃO */}
      <div className="resolucao-box">
        <h2>Questão</h2>

        {imagemUrl && (
          <img src={imagemUrl} alt="Questão" className="resolucao-imagem" />
        )}
        <p>{textoFormatado}</p>
      </div>

      {/* ALTERNATIVAS */}
      <div className="resolucao-alternativas">
        {resolucao.questao.alternativas.map((alt) => {
          let classe = "";

          // CORRETA
          if (alt.ordem === resolucao.alternativa_correta.ordem) {
            classe = "resolucao-correta";
          }

          // ERRADA DO USUÁRIO
          else if (
            alt.ordem === resolucao.alternativa_escolhida.ordem &&
            !resolucao.acertou
          ) {
            classe = "resolucao-errada";
          }

          return (
            <div key={alt.ordem} className={`resolucao-alternativa ${classe}`}>
              <span className="resolucao-letra">{alt.ordem}</span>

              <span>{alt.texto}</span>
            </div>
          );
        })}
      </div>

      {/* RESOLUÇÃO */}
      <div className="resolucao-explicacao-box">
        <h2>Resolução</h2>

        <p>{resolucao.alternativa_correta.explicacao}</p>
      </div>
    </div>
  );
}
