import "../styles/perfil.css";
import { useEffect, useState } from "react";
import { buscarPerfil, atualizarPerfil } from "../services/usuarioService";
import { Pencil, Save } from "lucide-react";
import avatarPadrao from "../assets/avatar-padrao.svg";

const BIO_MAX = 300;

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", bio: "" });
  const [modalFotoAberto, setModalFotoAberto] = useState(false);
  
  useEffect(() => {
    async function carregarPerfil() {
      try {
        // console.log("TOKEN:", localStorage.getItem("token"));

        const resposta = await buscarPerfil();
        // console.log(resposta);

        setUsuario(resposta.usuario);
      } catch (erro) {
        console.error(erro);
        setErro("Não foi possivel carregar o perfil. ");
      }
    }

    carregarPerfil();
  }, []);

  // if (!usuario) {
  //   return <p>Carregando...</p>;
  // }

  function iniciarEdicao() {
    setForm({
      nome: usuario.nome ?? "",
      telefone: usuario.telefone ?? "",
      bio: usuario.bio ?? "",
    });
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
  }

  async function salvarEdicao() {
    if (!form.nome.trim()) {
      alert("O nome não pode ficar vazio.");
      return;
    }
    try {
      setSalvando(true);
      const resposta = await atualizarPerfil(form);
      setUsuario({...usuario, ...resposta.usuario });
      setEditando(false);
    } catch (e) {
      alert(e.message || "Erro ao salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  if (!usuario) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="perfil-container">
      {/* TOPO */}
      <div className="perfil-header">
        <h1>Meu Perfil</h1>

        {!editando ? (
          <button className="btn-editar-perfil" onClick={iniciarEdicao}>
            <Pencil size={16} />Editar Perfil</button>
        ) : (
          <div className="perfil-acoes">
            <button
              className="btn-cancelar-perfil"
              onClick={cancelarEdicao}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              className="btn-salvar-perfil"
              onClick={salvarEdicao}
              disabled={salvando}
            >
              <Save size={16} /> {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>

      <div className="perfil-content">
        {/* LADO ESQUERDO */}
        <div className="perfil-left">
          <div className="avatar-container">
            <img
              src={usuario.foto_url || avatarPadrao}
              alt="Foto de perfil"
              className="avatar-img"
              onError={(erro) => {
                erro.currentTarget.src = avatarPadrao;
              }}
            />
            <button
              className="btn-editar-foto"
              onClick={() => setModalFotoAberto(true)}
              title="Alterar foto de perfil"
            >
              <Pencil size={16} />
            </button>
          </div>

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

          <label htmlFor="nome">Nome do Usuário</label>
          <input 
            id="nome"
            value={editando ? form.nome : usuario.nome ?? ""} 
            readOnly={!editando}
            className={editando ? "" : "campo-bloqueado"} 
            onChange={(erro) => setForm({...form, nome: erro.target.value})}
          />

          <div className="row">
            <div>
              <label htmlFor="email">E-mail</label>
              <input 
                id="email"
                value={usuario.email ?? ""} 
                readOnly 
                className="campo-bloqueado"
                title="O e-mail não pode ser alterado"
              />
            </div>

            <div>
              <label htmlFor="telefone">Telefone</label>
              <input 
                id="telefone"
                value={editando ? form.telefone : usuario.telefone ?? ""} 
                readOnly={!editando} 
                className={editando ? "" : "campo-bloqueado"}
                onChange={(erro) => 
                  setForm({...form, telefone: erro.target.value})
                }
              />
            </div>
            
          </div>

          <label htmlFor="bio">Sobre mim</label>
          <textarea 
            id="bio"
            placeholder="Conte um pouco sobre você..."
            value={editando ? form.bio : usuario.bio ?? ""}
            readOnly={!editando}
            maxLength={BIO_MAX}
            className={editando ? "" : "campo-bloqueado"}
            onChange={(erro) => setForm({...form, bio: erro.target.value})}
          />
          {editando && (
            <p className="contador-bio">
              {form.bio.length}/{BIO_MAX}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
