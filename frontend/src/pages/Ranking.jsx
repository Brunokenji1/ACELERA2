import "../styles/ranking.css";

export default function Ranking() {
  const ranking = [
  { posicao: 1, nome: "João", pontos: 1250 },

  { posicao: 2, nome: "Maria", pontos: 1180 },

  { posicao: 3, nome: "Pedro", pontos: 1100 },

  { posicao: 4, nome: "Lucas", pontos: 980 },

  { posicao: 5, nome: "Ana", pontos: 940 },

  { posicao: 6, nome: "Carla", pontos: 910 },

  { posicao: 7, nome: "Felipe", pontos: 870 },

  { posicao: 8, nome: "Juliana", pontos: 850 },

  { posicao: 9, nome: "Bruno", pontos: 820 },

  { posicao: 10, nome: "Larissa", pontos: 790 },

  { posicao: 11, nome: "Gustavo", pontos: 760 },

  { posicao: 12, nome: "Amanda", pontos: 730 },

  { posicao: 13, nome: "Rafael", pontos: 700 },

  { posicao: 14, nome: "Camila", pontos: 680 },

  { posicao: 15, nome: "Thiago", pontos: 650 },

  { posicao: 16, nome: "Fernanda", pontos: 620 },

  { posicao: 17, nome: "Matheus", pontos: 600 },

  { posicao: 18, nome: "Bianca", pontos: 580 },

  { posicao: 19, nome: "Eduardo", pontos: 550 },

  { posicao: 20, nome: "Beatriz", pontos: 520 },
  ];

  const usuario = {
    posicao: 58,

    nome: "Você",

    pontos: 220,
  };

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

            <span className="ranking-pontos">{user.pontos} pts</span>
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
};
