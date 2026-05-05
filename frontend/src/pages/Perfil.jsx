import "../styles/perfil.css";

export default function Perfil() {
  return (
    <div className="perfil-container">

      {/* TOPO */}
      <div className="perfil-header">
        <h1>Meu Perfil</h1>
        <button className="btn-editar">✏️ Editar Perfil</button>
      </div>

      <div className="perfil-content">

        {/* LADO ESQUERDO */}
        <div className="perfil-left">

          <div className="avatar"></div>

          <div className="perfil-card ranking">
            <p>Ranking</p>
            <h2>1º</h2>
            <span>🏆</span>
          </div>

          <div className="perfil-card pontos">
            <p>Pontuação</p>
            <h2>980,00 pts</h2>
            <span>⭐</span>
          </div>

        </div>

        {/* LADO DIREITO */}
        <div className="perfil-right">

          <h2>Informações Pessoais</h2>

          <label>Nome do Usuário</label>
          <input value="LF" />

          <div className="row">
            <div>
              <label>E-mail</label>
              <input value="lfgarcez@gmail.com" />
            </div>

            <div>
              <label>Telefone</label>
              <input value="(12) 99154-5412" />
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