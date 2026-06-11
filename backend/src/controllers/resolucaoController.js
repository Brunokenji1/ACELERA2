const { json } = require("sequelize");
const { Tentativas, Alternativas, Questoes } = require("../models");

async function listarResolucoes(req, res) {
  try {
    const id_usuario = req.usuarioId;

    //busca todas as tentativas do usuário:
    const tentativas = await Tentativas.findAll({
      where: { id_usuario, modo: "solo" },
      ordem: [["respondido_em", "DESC"]],
      include: [
        {
          model: Alternativas,
          include: [
            {
              model: Questoes,
              as: "questao", //alias para questo (models/ index.js)
              include: [{ model: Alternativas, as: "alternativas" }],
            },
          ],
        },
      ],
    });

    // mantém apenas a última tentativa por questão
    const ultimasPorQuestao = new Map()
    for (const t of tentativas) {
      const idQuestao = t.Alternativa?.questao?.id
      if (!idQuestao) continue
      const atual = ultimasPorQuestao.get(idQuestao)
      if (!atual || t.id > atual.id) {
        ultimasPorQuestao.set(idQuestao, t)
      }
    }

    //monta a resposta com questão, alternativa escolhida e a correta
    const resolucoes = [...ultimasPorQuestao.values()].map((t) => {
      const alternativaEscolhida = t.Alternativa;
      //debug console.log('alternativaEscolhida:', JSON.stringify(alternativaEscolhida, null, 2))
      const questao = alternativaEscolhida.questao; //sequelize tira o 'es' no model Questoes, ficando só Questo, mas com o alias que defini da pra usar 'questoes' aqui
      //debug console.log('questao:', JSON.stringify(questao,null,2))
      const alternativaCorreta = questao.alternativas.find((a) => a.correta);

      return {
        id_tentativa: t.id,
        acertou: t.acertou,
        respondido_em: t.respondido_em,
        questao: {
          id: questao.id,
          titulo: questao.titulo,
          enunciado: questao.enunciado,
        },
        alternativa_escolhida: {
          ordem: alternativaEscolhida.ordem,
          texto: alternativaEscolhida.texto,
        },
        alternativa_correta: {
          ordem: alternativaCorreta.ordem,
          texto: alternativaCorreta.texto,
          explicacao: alternativaCorreta.explicacao,
        },
      };
    });

    return res.status(200).json({ resolucoes });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

async function buscarResolucao(req, res) {
  try {
    const id_usuario = req.usuarioId;
    const { id } = req.params;

    const tentativa = await Tentativas.findOne({
      where: {
        id,
        id_usuario,
        modo: "solo",
      },
      include: [
        {
          model: Alternativas,
          include: [
            {
              model: Questoes,
              as: "questao",
              include: [
                {
                  model: Alternativas,
                  as: "alternativas",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!tentativa) {
      return res.status(404).json({
        erro: "Resolução não encontrada",
      });
    }

    const alternativaEscolhida = tentativa.Alternativa;
    const questao = alternativaEscolhida.questao;
    const alternativaCorreta = questao.alternativas.find((a) => a.correta);

    return res.status(200).json({
      resolucao: {
        id_tentativa: tentativa.id,
        acertou: tentativa.acertou,
        respondido_em: tentativa.respondido_em,
        questao: {
          id: questao.id,
          titulo: questao.titulo,
          enunciado: questao.enunciado,
          alternativas: questao.alternativas.map((a) => ({
            ordem: a.ordem,
            texto: a.texto,
          })),
        },
        alternativa_escolhida: {
          ordem: alternativaEscolhida.ordem,
          texto: alternativaEscolhida.texto,
        },
        alternativa_correta: {
          ordem: alternativaCorreta.ordem,
          texto: alternativaCorreta.texto,
          explicacao: alternativaCorreta.explicacao,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      erro: err.message,
    });
  }
}

module.exports = { listarResolucoes, buscarResolucao };
