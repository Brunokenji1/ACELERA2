import "../../styles/categorias.css";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import Card from "../../components/Card";

export default function Categorias() {
  const navigate = useNavigate();

  const categorias = [
    {
      nome: "Matemática",
      descricao: "Questões envolvendo matemática e raciocínio lógico.",
      cor: "matematica",
      icon: "📐",
      tags: ["Álgebra", "Geometria", "Raciocínio"],
    },

    {
      nome: "Linguagens",
      descricao: "Questões de português, literatura e interpretação.",
      cor: "linguagens",
      icon: "📖",
      tags: ["Português", "Literatura", "Artes"],
    },

    {
      nome: "Ciências Humanas",
      descricao: "Questões de história, geografia e filosofia.",
      cor: "humanas",
      icon: "🌎",
      tags: ["História", "Geografia", "Filosofia"],
    },

    {
      nome: "Ciências da Natureza",
      descricao: "Questões de física, química e biologia.",
      cor: "natureza",
      icon: "🧪",
      tags: ["Física", "Química", "Biologia"],
    },

    {
      nome: "ENEM",
      descricao: "Questões gerais do ENEM com múltiplas áreas.",
      cor: "enem",
      icon: "📝",
      tags: ["Vestibular", "Provas", "Simulados"],
    },

  ];

  return (
    <div className="categorias-container">
      {/* HEADER */}
      <div className="categorias-header">
        <div>
          <h1>Categorias de Questões</h1>

          <p>Escolha uma categoria para começar a estudar</p>
        </div>

        <Button className="btn-filtro">Filtrar Matérias</Button>
      </div>

      {/* GRID */}
      <div className="categorias-grid">
        {categorias.map((categoria, index) => (
          <Card
            key={index}
            className="categoria-card"
            onClick={() =>
              navigate(`/questoes/${categoria.nome.toLowerCase()}`)
            }
          >
            {/* TOPO */}
            <div className={`card-top ${categoria.cor}`}>
              <div className="icon-box">{categoria.icon}</div>
            </div>

            {/* BODY */}
            <div className="card-body">
              <h2>{categoria.nome}</h2>

              <p>{categoria.descricao}</p>

              {/* TAGS */}
              <div className="tags">
                {categoria.tags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
