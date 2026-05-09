import "../../styles/listaQuestoes.css";

import { useParams, useNavigate } from "react-router-dom";

export default function ListaQuestoes() {
  const { categoria } = useParams();

  const navigate = useNavigate();

  const questoes = [
    {
      id: "0024",
      titulo: "Proporcionalidade e Equações do Primeiro Grau",
      dificuldade: "Médio",
      pontos: "4 pts",
      ano: "ENEM 2022",
    },

    {
      id: "0025",
      titulo: "Proporcionalidade",
      dificuldade: "Fácil",
      pontos: "2 pts",
      ano: "ENEM 2021",
    },

    {
      id: "0026",
      titulo: "Média Aritmética",
      dificuldade: "Médio",
      pontos: "4 pts",
      ano: "ENEM 2020",
    },

    {
      id: "0027",
      titulo: "Geometria Plana",
      dificuldade: "Difícil",
      pontos: "8 pts",
      ano: "ENEM 2019",
    },
  ];

  return (
    <div className="lista-container">
      {/* HEADER */}
      <div className="lista-header">
        <div className="header-left">
          <button className="btn-voltar-lista" onClick={() => navigate("/questoes")}>
            ←
          </button>

          <div>
            <h1>Questões - {categoria.replace(/-/g, " ")}</h1>

            <p>Escolha uma questão para responder</p>
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="questoes-lista">
        {questoes.map((questao) => (
          <div
            key={questao.id}
            className="questao-card"
            onClick={() => navigate(`/questao/${questao.id}`)}
          >
            {/* ESQUERDA */}
            <div className="questao-left">
              <span className="questao-id">{questao.id}</span>

              <h2>{questao.titulo}</h2>
            </div>

            {/* DIREITA */}
            <div className="questao-info">
              <span
                className={`${questao.dificuldade
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()}`}
              >
                {questao.dificuldade}
              </span>

              <span className="ano">{questao.ano}</span>

              <span className="pontos">{questao.pontos}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
