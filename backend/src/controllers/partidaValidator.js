const {body} = require('express-validator')

const criarPartidaValidator = [
    body('quantidade_questoes')
    .optional()
    .isInt({min: 1})
    .withMessage('Quantidade de questões deve ser um número inteiro positivo')
    .custom(value =>{
        if(value %2 == 0){
            throw new Error('Quantidade de questões deve ser ímpar')
        }
        return true
    }),
    body('dificuldade')
        .optional()
        .isIn(['facil','medio','dificil'])
        .withMessage('Dificuldade deve ser facil, medio ou difícil'),
    body('id_materia')
        .optional()
        .isInt()
        .withMessage('Matéria inválida')
        .toInt(),
]
module.exports = {criarPartidaValidator}

