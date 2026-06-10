require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { sequelize } = require('../config/database')
const Questoes = require('../models/Questoes')
const Alternativas = require('../models/Alternativas')
const Fontes = require('../models/Fontes')
const TipoNivel = require('../models/TipoNivel')
const Materias = require('../models/Materias')

async function importarDoJson() {
    await sequelize.authenticate()
    console.log('Conectado ao banco.')

    const jsonPath = path.join(__dirname, '../../questoes_seed.json')
    const questoes = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

    const [tipoNivel] = await TipoNivel.findOrCreate({
        where: { nome: 'Nacional' }
    })

    let total = 0

    for (const q of questoes) {
        
    console.log("Matéria do JSON:", q.materia)

    const materia = await Materias.findOne({
      where: { nome: q.materia }
    })

    console.log("Encontrada no banco:", materia?.nome)
        if (!materia) continue


        const [fonte] = await Fontes.findOrCreate({
            where: { nome: `ENEM ${q.ano}` },
            defaults: { id_tipo_nivel: tipoNivel.id }
        })

        const novaQuestao = await Questoes.create({
            id_fonte: fonte.id,
            id_materia: materia.id,
            titulo: q.titulo || null,
            enunciado: q.enunciado,
            dificuldade: q.dificuldade,
            ano: q.ano,
        })

        for (const alt of q.alternativas) {
            await Alternativas.create({
                id_questao: novaQuestao.id,
                ordem: alt.ordem,
                texto: alt.texto,
                correta: alt.correta,
                explicacao: alt.explicacao,
            })
        }

        total++
    }

    console.log(`\nTotal importado: ${total} questões`)
    process.exit(0)
}

importarDoJson().catch(err => {
    console.error('Erro:', err.message)
    process.exit(1)
})