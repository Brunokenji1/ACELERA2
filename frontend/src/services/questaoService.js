import API_URL from "./api";

export async function listarQuestoes() {
    const resposta = await fetch(`${API_URL}/questoes`);

    return await resposta.json();
}

export async function buscarQuestao(id) {
    const resposta = await fetch(`${API_URL}/questoes/${id}`);
    
    return await resposta.json();
}