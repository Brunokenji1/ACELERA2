import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/cadastro.css";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    nomeUsuario: "",
    email: "",
    telefone: "",
    cpf: "",
    senha: "",
    confirmaSenha: "",
  });

  const [erros, setErros] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Adicionar lógica de validação e cadastro
    console.log("Cadastro:", formData);
  };

  return (
    <div className="background">
      <div className="cadastro-card">
        {/* ESQUERDA (LOGO BRANCA) */}
        <div className="left cadastro-left">
          <h1 className="logo-title">
            <span className="study">STUDY</span>
            <span className="flow">flow</span>
          </h1>
        </div>

        {/* DIREITA (FORM AZUL) */}
        <div className="right cadastro-right">
          <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>

            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
            />

            <input
              type="text"
              name="nomeUsuario"
              placeholder="Nome de usuário"
              value={formData.nomeUsuario}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="row">
              <input
                type="text"
                name="telefone"
                placeholder="Telefone"
                value={formData.telefone}
                onChange={handleChange}
              />

              <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={formData.cpf}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
              />

              <input
                type="password"
                name="confirmaSenha"
                placeholder="Confirmar senha"
                value={formData.confirmaSenha}
                onChange={handleChange}
              />
            </div>

            <button type="submit">Cadastrar</button>

            <p className="register cadatro-link">
              Já possui uma conta? <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
