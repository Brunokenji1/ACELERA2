import "../styles/perfil.css";
import { useEffect, useState } from "react";
import { buscarPerfil } from "../services/usuarioService";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarPerfil() {
      try {
        console.log("TOKEN:", localStorage.getItem("token"));

        const resposta = await buscarPerfil();
        console.log(resposta);

        setUsuario(resposta.usuario);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarPerfil();
  }, []);

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="perfil-container">
      {/* TOPO */}
      <div className="perfil-header">
        <h1>Meu Perfil</h1>
        <button className="btn-editar-perfil">✏️ Editar Perfil</button>
      </div>

      <div className="perfil-content">
        {/* LADO ESQUERDO */}
        <div className="perfil-left">
          <div className="avatar"></div>

          <div className="perfil-card ranking">
            <p>Ranking</p>
            <h2>{usuario.posicao_ranking}º</h2>
            <span>🏆</span>
          </div>

          <div className="perfil-card pontos-perfil">
            <p>Pontuação</p>
            <h2>{usuario.pontos_totais} pts</h2>
            <span>⭐</span>
          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="perfil-right">
          <h2>Informações Pessoais</h2>

          <label>Nome do Usuário</label>
          <input value={usuario.nome} readOnly />

          <div className="row">
            <div>
              <label>E-mail</label>
              <input value={usuario.email} readOnly />
            </div>

            <div>
              <label>Telefone</label>
              <input value={usuario.telefone} readOnly />
            </div>
          </div>

          <label>Senha</label>
          <input type="password" value="12345678" />

          <label>Sobre mim</label>
          <textarea placeholder="Conte um pouco sobre você..."></textarea>
        </div>
      </div>
    </div>
  );
}
