import "../../styles/resolucoes/listaResolucoes.css";

import { useState } from "react";

export default function ListaResolucoes() {
  const [pesquisa, setPesquisa] = useState("");

  const resolucoes = [
    {
      id: "0002",

      titulo: "Espanhol",

      status: "acertou",
    },

    {
      id: "0026",

      titulo: "Média Aritmética",

      status: "errou",
    },

    {
      id: "0027",

      titulo: "Geometria Plana",

      status: "acertou",
    },
  ];

  const resolucoesFiltradas = resolucoes.filter((questao) =>
    questao.titulo.toLowerCase().includes(pesquisa.toLowerCase()),
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
          {resolucoesFiltradas.map((questao) => (
            <div key={questao.id} className="resolucao-card">
              {/* ESQUERDA */}
              <div className="resolucao-left">
                <span className="questaoRes-id">{questao.id}</span>

                <h2>{questao.titulo}</h2>
              </div>

              {/* STATUS */}
              <span className={`status ${questao.status}`}>
                {questao.status === "acertou" ? "Acertou" : "Errou"}
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
