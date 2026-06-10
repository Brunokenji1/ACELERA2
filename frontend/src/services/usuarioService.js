import API_URL from "./api";

export async function buscarPerfil() {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/usuarios/perfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await resposta.json();
}

export async function buscarRanking() {
  const resposta = await fetch(`${API_URL}/usuarios/ranking`);

  return await resposta.json();
}

export async function atualizarPerfil(dados) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${API_URL}/usuarios/perfil`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });

  const json = await resposta.json();

  if (!resposta.ok) {
    throw new Error(json.erro || "Erro ao atualizar o perfil");
  }

  return json;
}