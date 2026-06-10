import API_URL from "./api";

export async function criarPartida(dados) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/partidas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao criar partida");
  }

  return resultado;
}

export async function buscarPartida(id) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/partidas/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao buscar partida");
  }

  return resultado;
}

export async function iniciarPartida(id) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/partidas/${id}/iniciar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao iniciar partida");
  }

  return resultado;
}

export async function registrarBuzz(idPartida, dados) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/partidas/${idPartida}/buzz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro);
  }

  return resultado;
}

export async function responderQuestao(idPartida, dados) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/partidas/${idPartida}/responder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao responder questão");
  }

  return resultado;
}

export async function pularRodada(id) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/partidas/${id}/pular-rodada`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao pular rodada");
  }

  return resultado;
}
