require('dotenv').config()
const axios = require('axios')
const {sequelize} = require('../config/database')
const Materias = require('../models/Materias')
const Fontes = require('../models/Fontes')
const TipoNivel = require('../models/TipoNivel')
const Questoes = require('../models/Questoes')
const Alternativas = require('../models/Alternativas')

function esperar(ms){       //isso aqui é pra n sobrecarregar a API na hora de fazer request
    return new Promise(resolve => setTimeout(resolve,ms))
}
 //mapeando as disciplinas da API pro nome das matérias no banco
 const mapeamentoDisciplinas = {
    'linguagens': 'Portugues',
    'matematica': 'Matematica',
    'ciencias-humanas': 'Historia',
    'ciencias-natureza': 'Biologia',
 }
//anos que importei:
const ANOS = [2020,2021,2022]
const LIMITE_POR_ANO = 50  //qtd de questoes importadas pra cada ano 

async function importar(){
    await sequelize.authenticate()
    console.log('Conectado ao banco.')

    //garantindo que sempre vai haver uma fonte e um tipo_nivel 
    const [tipoNivel] = await TipoNivel.findOrCreate({
        where: {nome: 'Nacional'},
    })

    for(const ano of ANOS){
        console.log(`\nImportando ENEM ${ano}...`)
        
        const [fonte] = await Fontes.findOrCreate({
            where: {nome: `ENEM ${ano}`},
            defaults: {id_tipo_nivel: tipoNivel.id}
        })
        
        let offset = 0      //como a api limita 10 requisições, isso vai contornar o problema, pegando todas as questoes, mas de 10 em 10.
        let totalImportados = 0
        
        while(true){
            const url = `https://api.enem.dev/v1/exams/${ano}/questions?limit=10&offset=${offset}`
            const resposta = await axios.get(url)
            const {questions, metadata} = resposta.data
            
            if(!questions || questions.length === 0) break

            for(const q of questions){
                //pula questão de idioma estrangeiro
                if(q.language && q.language !== 'portugues') continue
 
                //encontra materia correspondente
                const nomeMateria = mapeamentoDisciplinas[q.discipline]
                if(!nomeMateria) continue
                
                const materia = await Materias.findOne({
                    where: {nome: nomeMateria}
                })
                console.log(`Matéria buscada: "${nomeMateria}" -> encontrou: ${materia ? 'sim': 'nao'}`) /////////////////////////////////////////////////////
                if(!materia) continue
                
                //verifica se a questao existe
                const jaExiste = await Questoes.findOne({
                    where: {
                        id_fonte: fonte.id,
                        enunciado: q.context || q.title
                    }
                })
                if(jaExiste) continue
                
                //criação da questão
                const novaQuestao = await Questoes.create({
                    id_fonte: fonte.id,
                    id_materia: materia.id,
                    enunciado: q.context || q.title,
                    dificuldade: 'medio',       //POR ENQUANTO vai continuar assim, pq a API n tem isso determinado, depois resolve
                    ano: q.year,
                })

                //cria as alternativas
                for(const alt of q.alternatives) {
                    await Alternativas.create({
                        id_questao: novaQuestao.id,
                        ordem: alt.letter,
                        texto: alt.text || alt.letter,
                        correta: alt.isCorrect,
                        explicacao: 'ver gabarito oficial ENEM' //POR ENQUANTO vai continuar assim, pq a API n tem isso determinado, depois resolve
                    })
                }
                totalImportados++
            }
            offset += 10
            await esperar(1000)
            if(offset >= LIMITE_POR_ANO || !metadata.hasMore) break
        }
        console.log(`ENEM ${ano}: ${totalImportados} questões importadas.`)
    }  
    console.log('\nImportação concluída.')
    process.exit(0)
}
importar().catch(err =>{
    console.error('Erro na importação: ', err.message)
    process.exit(1)
})