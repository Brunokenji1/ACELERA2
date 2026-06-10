import "../../styles/partidas/criarPartida.css";
import { useEffect } from "react";
import { useState } from "react";
import { buscarPerfil } from "../../services/usuarioService";
import { criarPartida } from "../../services/partidaService";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 

export default function CriarPartida() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);

  const [materia, setMateria] = useState(1);

  const [dificuldade, setDificuldade] =
    useState("facil");

  const [quantidadeQuestoes, setQuantidadeQuestoes] =
    useState(5);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const resposta = await buscarPerfil();

        console.log(resposta);

        setUsuario(resposta.usuario);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarPerfil();
  }, []);

  async function iniciarPartida() {
  try {
    const resposta = await criarPartida({
      id_materia: materia,
      dificuldade,
      quantidade_questoes: quantidadeQuestoes,
    });

    //console.log(resposta);
    navigate(`/partidas/${resposta.partida.id}`);

    alert("Partida criada com sucesso!");
  } catch (erro) {
    console.error(erro);

    alert(erro.message);
  }
}

  function voltar() {
    const confirmar = window.confirm(
      "Deseja realmente sair da criação da partida?",
    );

    if (confirmar) {
      navigate("/partidas");
    }
  }

  return (
    <div className="criar-partida-page">
      {/* FAIXA ESQUERDA */}
      <div className="faixa-esquerda">
        <button className="btn-voltar-partida" onClick={voltar}>
          <ArrowLeft size={25} />
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="conteudo-partida">
        {/* JOGADOR 1 */}
        <div className="jogador-card">
          <h2>Jogador 1</h2>

          <div className="avatar-placeholder">Foto Perfil</div>

          <p className="nome-jogador">{usuario?.nome || "Carregando..."}</p>
        </div>

  

        {/* CONFIGURAÇÕES */}
        <div className="configuracoes-card">
          <h2>Configurações</h2>

          <div className="campo-config">
            <label>Selecionar matéria</label>
            <select 
              value={materia}
              onChange={(e) => 
                setMateria(Number(e.target.value))}
            >
              <option value={1}>Matemática e suas Tecnologias</option>
              <option value={2}>Linguagens, Códigos e suas Tecnologias</option>
              <option value={3}>Ciências Humanas e suas Tecnologias</option>
              <option value={7}>Ciências da Natureza e suas Tecnologias</option>
              <option value={0}>Todas</option>
            </select>
          </div>

          <div className="campo-config">
            <label>Selecionar dificuldade</label>
            <select 
              value={dificuldade}
              onChange={(e) => 
                setDificuldade(e.target.value)}
            >
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <div className="campo-config">
            <label>Quantidade de questões</label>
            <select 
              value={quantidadeQuestoes}
              onChange={(e) => 
                setQuantidadeQuestoes(Number(e.target.value))}
            >
              <option value={5}>5 Questões</option>
              <option value={7}>7 Questões</option>
              <option value={11}>11 Questões</option>
              <option value={13}>13 Questões</option>
            </select>
          </div>

          <button className="btn-iniciar" onClick={iniciarPartida}>
            Iniciar Partida
          </button>
        </div>

        {/* JOGADOR 2 */}
        <div className="jogador-card">
          <h2>Jogador 2</h2>

          <div className="avatar-placeholder">Avatar</div>

          <p className="nome-jogador">Convidado</p>
        </div>
      </div>

      {/* FAIXA DIREITA */}
      <div className="faixa-direita"></div>
    </div>
  );
}
