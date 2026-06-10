import "../../styles/listaQuestoes.css";
import { useState, useEffect } from "react";
import { listarQuestoes } from "../../services/questaoService";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
export default function ListaQuestoes() {
  const { categoria } = useParams();

  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState([]);

  useEffect(() => {
    async function carregarQuestoes() {
      try {
        const resposta = await listarQuestoes();

        console.log(resposta);

        const todas = resposta.todasQuestoes;

        if (categoria === "matematica") {
          setQuestoes(todas.filter((q) => q.id_materia === 1));

        } else if (categoria === "linguagens") {
          setQuestoes(todas.filter((q) => [2, 10, 11].includes(q.id_materia)));

        } else if (categoria === "ciencias-humanas") {
          setQuestoes(
            todas.filter((q) => [3, 4, 8, 9].includes(q.id_materia)),
          );

        } else if (categoria === "ciencias-da-natureza") {
          setQuestoes(todas.filter((q) => [5, 6, 7].includes(q.id_materia)));

        } else {
          setQuestoes(todas);
          
        }
      } catch (error) {
        console.error(error);
      }
    }

    carregarQuestoes();
  }, []);

  if (!questoes.length) {
    return <p>Carregando questões...</p>;
  }

  return (
    <div className="lista-container">
      {/* HEADER */}
      <div className="lista-header">
        <div className="header-left">
          <button
            className="btn-voltar-lista"
            onClick={() => navigate("/questoes")}
          >
            <ArrowLeft size={25} /> 
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

              <h2>{questao.enunciado.substring(0, 80)}...</h2>
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

              <span className="ano">ENEM {questao.ano}</span>

              <span className="pontos">1 pt</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
