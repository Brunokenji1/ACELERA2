import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      alert("Preencha email e senha");
      return;
    }

    try {
      const resposta = await login(email, senha);

      console.log(resposta);

      console.log("TOKEN RECEBIDO:", resposta.token);

      localStorage.setItem("token", resposta.token);

      alert("Login realizado com sucesso!");

      navigate("/perfil");
    } catch (erro) {
        console.error(erro);
        alert(erro.message);
    }
  };

  return (
    <div className="background">
      <div className="login-card">
        {/* ESQUERDA (LOGO) */}
        <div className="login-left">
          <h1 className="logo-title">
            <span className="study">STUDY</span>
            <span className="flow">flow</span>
          </h1>
        </div>

        {/* DIREITA (LOGIN) */}
        <div className="login-right">
          <form onSubmit={handleLogin}>
            <h2>Login</h2>

            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setSenha(e.target.value)}
            />

            <a href="#" className="link">
              Esqueci minha senha
            </a>

            <button type="submit">Entrar</button>

            <p className="register">
              <Link to="/cadastro">Não possui uma conta? Cadastre-se</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
