import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, senha);

  navigate("/perfil");
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
              placeholder="Usuário"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              onChange={(e) => setSenha(e.target.value)}
            />

            <a href="#" className="link">Esqueci minha senha</a>

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