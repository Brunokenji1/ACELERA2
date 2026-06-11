import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cadastro.css";
import { cadastrar } from "../services/authService";

export default function Cadastro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nascimento: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmaSenha) {
      alert("As senhas não coincidem");
      return;
    }

    if (
      !formData.nome.trim() ||
      !formData.email.trim() ||
      !formData.telefone.trim() ||
      !formData.cpf.trim() ||
      !formData.data_nascimento ||
      !formData.senha.trim() ||
      !formData.confirmaSenha.trim()
    ) {
      alert("Preencha todos os campos");
      return;
    }

    if (formData.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!formData.nome.trim()) {
      alert("Informe seu nome completo");
      return;
    }

    if (!formData.email.trim()) {
      alert("Informe seu e-mail");
      return;
    }

    if (!formData.email.includes("@")) {
      alert("Digite um e-mail válido");
      return;
    }

    if (!formData.telefone.trim()) {
      alert("Informe seu telefone");
      return;
    }

    if (!formData.cpf.trim()) {
      alert("Informe seu CPF");
      return;
    }

    if (formData.cpf.length < 11) {
      alert("CPF inválido");
      return;
    }

    if (!formData.data_nascimento) {
      alert("Informe sua data de nascimento");
      return;
    }

    if (!formData.senha.trim()) {
      alert("Informe uma senha");
      return;
    }

    if (!formData.confirmaSenha.trim()) {
      alert("Confirme sua senha");
      return;
    }

    try {
      const resposta = await cadastrar({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        data_nascimento: formData.data_nascimento,
        senha: formData.senha,
      });

      //localStorage.setItem("token", resposta.token);

      alert("Cadastro realizado com sucesso! Faça login para continuar.");

      navigate("/"); //vai para login
    } catch (erro) {
      console.error(erro);
      alert(erro.message);
    }
  };

  return (
    <div className="background">
      <div className="cadastro-card">
        {/* ESQUERDA (LOGO BRANCA) */}
        <div className="left cadastro-left">
          <div className="logo-container">
            <img
              src="/logo192.png"
              alt="Logo StudyFlow"
              className="logo-principal"
            />

            <h1 className="logo-title">
              <span className="study-cadastro">STUDY</span>
              <span className="flow">flow</span>
            </h1>
          </div>
        </div>

        {/* DIREITA (FORM AZUL) */}
        <div className="right cadastro-right">
          <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>

            <input
              type="text"
              name="nome"
              placeholder="Nome de usuário"
              value={formData.nome}
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

            <input
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
              onChange={handleChange}
            />

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
