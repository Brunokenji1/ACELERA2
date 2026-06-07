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
    throw new Error(
      resultado.erro || "Erro ao criar partida"
    );
  }

  return resultado;
}