import "../styles/ranking.css";
import { useEffect, useState } from "react";
import { buscarRanking, buscarPerfil } from "../services/usuarioService";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        const rankingResposta = await buscarRanking();
        const perfilResposta = await buscarPerfil();

        setRanking(rankingResposta.ranking);
        setUsuario({
          posicao: perfilResposta.usuario.posicao_ranking,
          nome: perfilResposta.usuario.nome,
          pontos: perfilResposta.usuario.pontos_totais,
        });
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarDados();
  }, []);

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="ranking-container">
      {/* HEADER */}
      <div className="ranking-header">
        <h1>Ranking</h1>

        <p>Veja os melhores alunos da plataforma</p>
      </div>

      {/* LISTA */}
      <div className="ranking-lista">
        {ranking.map((user) => (
          <div
            key={user.posicao}
            className={`ranking-item ${
              user.posicao === 1
                ? "gold"
                : user.posicao === 2
                  ? "silver"
                  : user.posicao === 3
                    ? "bronze"
                    : ""
            }`}
          >
            <div className="ranking-left">
              <span className="ranking-posicao">#{user.posicao}</span>

              <span className="ranking-nome">{user.nome}</span>
            </div>

            <span className="ranking-pontos">{user.pontos_totais} pts</span>
          </div>
        ))}
      </div>

      {/* USUÁRIO */}
      <div className="ranking-user">
        <div className="ranking-left">
          <span className="ranking-posicao">#{usuario.posicao}</span>

          <span className="ranking-nome">{usuario.nome}</span>
        </div>

        <span className="ranking-pontos">{usuario.pontos} pts</span>
      </div>
    </div>
  );
}
