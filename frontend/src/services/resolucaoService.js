import API_URL from "./api";

export async function listarResolucoes() {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/resolucoes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao buscar resoluções");
  }

  return resultado;
}

export async function buscarResolucao(id) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/resolucoes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Erro ao buscar resolução");
  }

  return resultado;
}