const { Partidas, Questoes, Alternativas, Rodadas, RodadaDeQuestoes, UsuarioPartida, Usuarios, Tentativas } = require('../models')

// sorteia questões para a partida
async function sortearQuestoes(partida) {
    const filtro = {}
    if (partida.id_materia) filtro.id_materia = partida.id_materia
    if (partida.dificuldade) filtro.dificuldade = partida.dificuldade
    if (partida.id_fonte) filtro.id_fonte = partida.id_fonte

    const questoes = await Questoes.findAll({ where: filtro })
    const embaralhadas = questoes.sort(() => Math.random() - 0.5)
    return embaralhadas.slice(0, partida.quantidade_questoes)
}

// inicia a partida criando todas as rodadas
async function iniciarPartida(id_partida) {
    const partida = await Partidas.findOne({ where: { id: id_partida } })

    const jogadores = await UsuarioPartida.findAll({ where: { id_partida } })
    if (jogadores.length < 2) {
        return { erro: 'A partida precisa de 2 jogadores' }
    }

    const jogador1 = jogadores.find(j => j.botao_numero === 1)
    const jogador2 = jogadores.find(j => j.botao_numero === 2)

    const questoes = await sortearQuestoes(partida)
    if (questoes.length < partida.quantidade_questoes) {
        return { erro: 'Questões insuficientes no banco para os filtros selecionados' }
    }

    const rodadas = []
    for (let i = 0; i < questoes.length; i++) {
        const rodada = await Rodadas.create({
            id_partida,
            ordem: i + 1,
            status: i === 0 ? 'em_andamento' : 'aguardando',
            iniciado_em: i === 0 ? new Date() : null,
        })

        await RodadaDeQuestoes.create({
            id_rodada: rodada.id,
            id_questao: questoes[i].id,
            ordem: i + 1,
            id_participante_1: jogador1.id_usuario,
            id_participante_2: jogador2.id_usuario,
            status: 'aguardando_buzz',
            iniciado_em: i === 0 ? new Date() : null,
        })

        rodadas.push(rodada)
    }

    await partida.update({ status: 'em_andamento', iniciada_em: new Date() })
    return { partida, rodadas }
}

// busca a rodada atual com a questão e alternativas
async function buscarRodadaAtual(id_partida) {
    const rodada = await Rodadas.findOne({
        where: { id_partida, status: 'em_andamento' },
        include: [{
            model: RodadaDeQuestoes,
            include: [{
                model: Questoes,
                include: [{ model: Alternativas, as: 'alternativas' }]
            }]
        }]
    })
    return rodada
}

// registra o buzz de um jogador
async function registrarBuzz(id_partida, id_usuario, tempo_buzz_ms) {
    const rodada = await Rodadas.findOne({
        where: { id_partida, status: 'em_andamento' },
        include: [{ model: RodadaDeQuestoes }]
    })

    if (!rodada) return { erro: 'Nenhuma rodada em andamento' }

    const rdq = rodada.RodadaDeQuestoes[0]
    if (!rdq || rdq.status !== 'aguardando_buzz') {
        return { erro: 'Buzz não permitido agora' }
    }

    const tentativasExistentes = await Tentativas.count({ where: { id_rodada: rodada.id } })
    if (tentativasExistentes >= 2) {
        return { erro: 'Rodada já teve 2 tentativas' }
    }

    await rdq.update({ status: 'aguardando_resposta' })

    return {
        sucesso: true,
        ordem_tentativa: tentativasExistentes + 1,
        id_rodada: rodada.id,
    }
}

// processa a resposta de um jogador
async function processarResposta(id_rodada, id_usuario, id_alternativa, tempo_resposta_ms, tempo_buzz_ms) {
    const rodada = await Rodadas.findOne({
        where: { id: id_rodada },
        include: [{ model: RodadaDeQuestoes }]
    })

    if (!rodada || rodada.status !== 'em_andamento') {
        return { erro: 'Rodada não está em andamento' }
    }

    const rdq = rodada.RodadaDeQuestoes[0]
    if (rdq.status !== 'aguardando_resposta') {
        return { erro: 'Não é possível responder agora' }
    }

    const alternativa = await Alternativas.findOne({ where: { id: id_alternativa } })
    const acertou = alternativa.correta

    const tentativasExistentes = await Tentativas.count({ where: { id_rodada } })
    const ordem_tentativa = tentativasExistentes + 1

    await Tentativas.create({
        id_alternativa,
        id_usuario,
        id_rodada,
        modo: 'multiplayer',
        acertou,
        pontos_ganhos: acertou ? 1 : 0,
        tempo_resposta_ms,
        tempo_buzz_ms,
        ordem_tentativa,
    })

    if (acertou) {
        await UsuarioPartida.increment('pontos_partida', {
            by: 1,
            where: { id_partida: rodada.id_partida, id_usuario }
        })

        await rdq.update({ status: 'finalizada', finalizada_em: new Date() })
        await rodada.update({ status: 'finalizada', finalizada_em: new Date() })

        const proxima = await avancarRodada(rodada.id_partida)
        return { acertou: true, proxima_rodada: proxima }
    }

    // errou — recontamos após criar a tentativa
    const totalTentativas = await Tentativas.count({ where: { id_rodada } })

    if (totalTentativas >= 2) {
        await rdq.update({ status: 'finalizada', finalizada_em: new Date() })
        await rodada.update({ status: 'finalizada', finalizada_em: new Date() })

        const proxima = await avancarRodada(rodada.id_partida)
        return { acertou: false, proxima_rodada: proxima }
    }

    await rdq.update({ status: 'aguardando_buzz' })
    return { acertou: false, outra_chance: true }
}
// avança para a próxima rodada
async function avancarRodada(id_partida) {
    const proxima = await Rodadas.findOne({
        where: { id_partida, status: 'aguardando' },
        order: [['ordem', 'ASC']],
        include: [{
            model: RodadaDeQuestoes,
            include: [{ model: Questoes, include: [{ model: Alternativas, as: 'alternativas' }] }]
        }]
    })

    if (!proxima) {
        await encerrarPartida(id_partida)
        return null
    }

    await proxima.update({ status: 'em_andamento', iniciado_em: new Date() })
    await proxima.RodadaDeQuestoes[0].update({ status: 'aguardando_buzz', iniciado_em: new Date() })
    return proxima
}

// encerra a partida — sem incrementar ranking (modo multiplayer não conta pontos globais)
async function encerrarPartida(id_partida) {
    const jogadores = await UsuarioPartida.findAll({
        where: { id_partida },
        order: [['pontos_partida', 'DESC']]
    })

    const primeiro = jogadores[0]
    const segundo = jogadores[1]

    if (primeiro.pontos_partida === segundo.pontos_partida) {
        return { empate: true, id_partida }
    }

    await primeiro.update({ ganhou: true })

    await Partidas.update(
        { status: 'finalizada', finalizada_em: new Date() },
        { where: { id: id_partida } }
    )

    return {
        vencedor: primeiro.id_usuario,
        perdedor: segundo.id_usuario,
        pontos: {
            [primeiro.id_usuario]: primeiro.pontos_partida,
            [segundo.id_usuario]: segundo.pontos_partida
        }
    }
}

module.exports = {
    iniciarPartida,
    buscarRodadaAtual,
    registrarBuzz,
    processarResposta,
    avancarRodada,
    encerrarPartida,
}