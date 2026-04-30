import React from "react";
import "../styles/perfil.css";

export default function Perfil() {
  // depois isso vem do backend
  const usuario = {
    nome: "Luiz Felipe",
    nomeUsuario: "luiz123",
    email: "luiz@email.com",
    telefone: "(11) 99999-9999",
    cpf: "123.456.789-00",
  };

  return (
    <div className="perfil-container">

      <div className="perfil-card">

        {/* FOTO */}
        <div className="perfil-foto">
          <div className="avatar">LF</div>
        </div>

        {/* DADOS */}
        <div className="perfil-info">
          <h2>Meu Perfil</h2>

          <div className="info-item">
            <span>Nome:</span>
            <p>{usuario.nome}</p>
          </div>

          <div className="info-item">
            <span>Usuário:</span>
            <p>{usuario.nomeUsuario}</p>
          </div>

          <div className="info-item">
            <span>Email:</span>
            <p>{usuario.email}</p>
          </div>

          <div className="info-item">
            <span>Telefone:</span>
            <p>{usuario.telefone}</p>
          </div>

          <div className="info-item">
            <span>CPF:</span>
            <p>{usuario.cpf}</p>
          </div>

          <button className="btn-editar">Editar Perfil</button>
        </div>

      </div>

    </div>
  );
}