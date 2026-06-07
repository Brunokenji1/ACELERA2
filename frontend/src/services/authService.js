import API_URL from "./api";

export async function cadastrar(dados) {
  const resposta = await fetch(`${API_URL}/auth/cadastro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const dadosResposta = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dadosResposta.erro ||
      "Erro ao cadastrar"
    );
  }

  return dadosResposta;
}

export async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      dados.erro ||
      dados.message ||
      "Erro ao fazer login"
    );
  }

  return dados;
}