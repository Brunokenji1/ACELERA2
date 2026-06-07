import API_URL from "./api";

export async function listarQuestoes() {
    const resposta = await fetch(`${API_URL}/questoes`);

    return await resposta.json();
}

export async function buscarQuestao(id) {
    const resposta = await fetch(`${API_URL}/questoes/${id}`);
    
    return await resposta.json();
}

export async function responderQuestao(idQuestao, idAlternativa) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(
    `${API_URL}/questoes/${idQuestao}/responder`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_alternativa: idAlternativa,
      }),
    }
  );

  return await resposta.json();
}