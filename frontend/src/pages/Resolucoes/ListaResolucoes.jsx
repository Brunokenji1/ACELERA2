import "../../styles/resolucoes/listaResolucoes.css";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { listarResolucoes } from "../../services/resolucaoService";

export default function ListaResolucoes() {
  const navigate = useNavigate();

  const [pesquisa, setPesquisa] = useState("");
  const [resolucoes, setResolucoes] = useState([]);
  

  useEffect(() => {
    async function carregarResolucoes() {
      try {
        const resposta = await listarResolucoes();
        console.log(resposta);
        setResolucoes(resposta.resolucoes);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarResolucoes();
  }, []);

  const resolucoesFiltradas = resolucoes.filter((resolucao) =>
    resolucao.questao.titulo.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <div className="resolucoes-container">
      {/* HEADER */}
      <div className="resolucoes-header">
        <div>
          <h1>Resoluções</h1>

          <p>Questões que você já respondeu</p>
        </div>

        {/* PESQUISA */}
        <input
          type="text"
          placeholder="Pesquisar questão"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
          className="input-pesquisa"
        />
      </div>

      {/* LISTA */}
      {resolucoesFiltradas.length > 0 ? (
        <div className="resolucoes-lista">
          {resolucoesFiltradas.map((resolucao) => (
            <div
              key={resolucao.id_tentativa}
              className="resolucao-card"
              onClick={() => navigate(`/resolucoes/${resolucao.id_tentativa}`)}
            >
              {/* ESQUERDA */}
              <div className="resolucao-left">
                <span className="questaoRes-id">{resolucao.questao.id}</span>

                <h2>{resolucao.questao.titulo}</h2>
              </div>

              {/* STATUS */}
              <span
                className={`status ${resolucao.acertou ? "acertou" : "errou"}`}
              >
                {resolucao.acertou ? "Acertou" : "Errou"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="resolucoes-vazio">
          <h2>Nenhuma resolução encontrada</h2>
        </div>
      )}
    </div>
  );
}
