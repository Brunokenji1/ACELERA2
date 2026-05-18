//aqui é uma verificação se as informações seguem os padroes propostos, se tem qtd de caracteres certa, essas coisas
const {body} = require('express-validator');

// estrutra das validações: variavel = [body('email').isEmail().withMessage('email invalido').nseioque(resposta)]

const cadastroValidator = [ 
    body('email').isEmail().notEmpty().withMessage('Email inválido'),
    body('senha').isLength({min: 6}).withMessage('Senha muito curta'),
    body('nome').notEmpty().withMessage('Nome obrigatório'),
    body('cpf').notEmpty().withMessage('CPF obrigatório').isLength({min:11, max:14}).withMessage('CPF inválido'),
    body('telefone').notEmpty().withMessage('Telefone obrigatório').isLength({min:10, max:20}).withMessage('Telefone inválido'),
]

const loginValidator = [
    body('email').isEmail().notEmpty().withMessage('Email inválido'),
    body('senha').notEmpty().isLength({min: 6}).withMessage('Senha deve haver no  minimo 6 caracteres'),
]

module.exports = { cadastroValidator, loginValidator}