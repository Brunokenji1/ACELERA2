import "../../styles/resolucoes/resolucaoDetalhe.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 

export default function ResolucaoDetalhe() {
  const navigate = useNavigate();

  const questao = {
    id: "0026",

    materia: "Matemática e suas Tecnologias",

    prova: "ENEM 2022",

    pergunta:
      "Ao calcular a média de suas notas em 4 provas, um estudante dividiu, por engano, a soma das notas por 5.",

    imagem: "",

    correta: "B",

    respostaUsuario: "A",

    resolucao:
      "A média correta deveria ser calculada dividindo a soma das notas por 4. Como foi dividida por 5, o valor encontrado ficou menor.",

    alternativas: [
      {
        letra: "A",
        texto: "4",
      },

      {
        letra: "B",
        texto: "5",
      },

      {
        letra: "C",
        texto: "6",
      },

      {
        letra: "D",
        texto: "19",
      },

      {
        letra: "E",
        texto: "21",
      },
    ],
  };

  return (
    <div className="resolucao-container">
      {/* TOPO */}
      <div className="resolucao-topo">
        <button className="resolucao-btn-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={25} /> 
        </button>

        <div className="resolucao-tags">
          <span className="resolucao-id">{questao.id}</span>

          <span className="resolucao-materia">{questao.materia}</span>

          <span className="resolucao-prova">{questao.prova}</span>
        </div>
      </div>

      {/* QUESTÃO */}
      <div className="resolucao-box">
        <h2>Questão</h2>

        <p>{questao.pergunta}</p>

        {questao.imagem && (
          <img
            src={questao.imagem}
            alt="Questão"
            className="resolucao-imagem"
          />
        )}
      </div>

      {/* ALTERNATIVAS */}
      <div className="resolucao-alternativas">
        {questao.alternativas.map((alt) => {
          let classe = "";

          // CORRETA
          if (alt.letra === questao.correta) {
            classe = "resolucao-correta";
          }

          // ERRADA DO USUÁRIO
          else if (alt.letra === questao.respostaUsuario) {
            classe = "resolucao-errada";
          }

          return (
            <div key={alt.letra} className={`resolucao-alternativa ${classe}`}>
              <span className="resolucao-letra">{alt.letra}</span>

              <span>{alt.texto}</span>
            </div>
          );
        })}
      </div>

      {/* RESOLUÇÃO */}
      <div className="resolucao-explicacao-box">
        <h2>Resolução</h2>

        <p>{questao.resolucao}</p>
      </div>
    </div>
  );
}
