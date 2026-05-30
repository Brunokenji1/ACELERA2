require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { sequelize } = require('../config/database')
const Materias = require('../models/Materias')
const Fontes = require('../models/Fontes')
const TipoNivel = require('../models/TipoNivel')
const Questoes = require('../models/Questoes')
const Alternativas = require('../models/Alternativas')

const LIMITE_POR_MATERIA = 20
const ANOS = [2022, 2021, 2020]

const mapeamentoDisciplinas = {
    'linguagens': 'Portugues',
    'matematica': 'Matematica',
    'ciencias-humanas': 'Historia',
    'ciencias-natureza': 'Biologia',
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function importar() {
    await sequelize.authenticate()
    console.log('Conectado ao banco.')

    const [tipoNivel] = await TipoNivel.findOrCreate({
        where: { nome: 'Nacional' }
    })

    const dadosParaJson = []
    let totalGeral = 0

    for (const [disciplina, nomeMateria] of Object.entries(mapeamentoDisciplinas)) {
        console.log(`\nImportando ${nomeMateria}...`)

        const materia = await Materias.findOne({ where: { nome: nomeMateria } })
        if (!materia) {
            console.log(`Matéria ${nomeMateria} não encontrada no banco, pulando.`)
            continue
        }

        let questoesImportadas = 0

        for (const ano of ANOS) {
            if (questoesImportadas >= LIMITE_POR_MATERIA) break

            const [fonte] = await Fontes.findOrCreate({
                where: { nome: `ENEM ${ano}` },
                defaults: { id_tipo_nivel: tipoNivel.id }
            })

            let offset = 0

            while (questoesImportadas < LIMITE_POR_MATERIA) {
                try {
                    const url = `https://api.enem.dev/v1/exams/${ano}/questions?limit=10&offset=${offset}&discipline=${disciplina}`
                    const resposta = await axios.get(url)
                    const { questions, metadata } = resposta.data

                    if (!questions || questions.length === 0) break

                    for (const q of questions) {
                        if (questoesImportadas >= LIMITE_POR_MATERIA) break
                        if (q.language && q.language !== 'portugues') continue

                        const jaExiste = await Questoes.findOne({
                            where: { id_fonte: fonte.id, enunciado: q.context || q.title }
                        })
                        if (jaExiste) continue

                        const novaQuestao = await Questoes.create({
                            id_fonte: fonte.id,
                            id_materia: materia.id,
                            enunciado: q.context || q.title,
                            dificuldade: 'medio',
                            ano: q.year,
                        })

                        const alternativasSalvas = []
                        for (const alt of q.alternatives) {
                            const novaAlt = await Alternativas.create({
                                id_questao: novaQuestao.id,
                                ordem: alt.letter,
                                texto: alt.text || alt.letter,
                                correta: alt.isCorrect,
                                explicacao: 'A ser preenchido'
                            })
                            alternativasSalvas.push({
                                id: novaAlt.id,
                                ordem: alt.letter,
                                texto: alt.text || alt.letter,
                                correta: alt.isCorrect,
                                explicacao: 'A ser preenchido'
                            })
                        }

                        // salva no array para o JSON
                        dadosParaJson.push({
                            id: novaQuestao.id,
                            materia: nomeMateria,
                            ano: q.year,
                            enunciado: q.context || q.title,
                            dificuldade: 'medio',
                            alternativas: alternativasSalvas
                        })

                        questoesImportadas++
                    }

                    offset += 10
                    await esperar(1000)

                    if (!metadata.hasMore) break

                } catch (err) {
                    if (err.response && err.response.status === 429) {
                        console.log('Rate limit atingido, aguardando 5 segundos...')
                        await esperar(5000)
                    } else {
                        console.log(`Erro ao buscar ${nomeMateria} ${ano}:`, err.message)
                        break
                    }
                }
            }

            console.log(`${nomeMateria} ${ano}: ${questoesImportadas} questões importadas até agora`)
        }

        totalGeral += questoesImportadas
    }

    // salva o JSON na raiz do backend
    const jsonPath = path.join(__dirname, '../../questoes_seed.json')
    fs.writeFileSync(jsonPath, JSON.stringify(dadosParaJson, null, 2), 'utf-8')

    console.log(`\nTotal importado: ${totalGeral} questões`)
    console.log(`JSON salvo em: ${jsonPath}`)
    process.exit(0)
}

importar().catch(err => {
    console.error('Erro na importação:', err.message)
    process.exit(1)
})