//controle de autentificação, depois da informação vir do frontend, ser validada pelos middlewares, e ver se ta de acordo com o que foi proposto pelo banco de dados

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuarios = require('../models/Usuarios');
const {validationResult} = require('express-validator');


async function cadastro (req,res) {    //todo controlador recebe req,res como parametro
    try{
        const erros = validationResult(req)
        if(!erros.isEmpty()){
            return res.status(400).json({erros: erros.array() })
        }
        const {nome, email, senha, data_nascimento, cpf, telefone} = req.body;     //extraindo as variaveis do usuario que chegam do frontend para poder manipular
        const jaExiste = await Usuarios.findOne({where: {email}})   //verifica se ja existe o email cadastrado
    
        if(jaExiste){
            return res.status(409).json({erro: 'Email já cadastrado'});
        };
        const senha_hash= await bcrypt.hash(senha, 10);

        const novoUsuario = await Usuarios.create({     //criação do novo usuario (com a senha criptografada)
            nome,
            email,
            senha_hash,
            data_nascimento,
            cpf,
            telefone
        });
        
        //criação do token vem dps do usuario pq ele precisa do id (que é criado quando um novo usuario é criado (SERIAL no model))
        const token = jwt.sign(         // criando o token do novo usuario (tipo um crachá, pra n ficar fazendo login toda hora)
            { id: novoUsuario.id , email: novoUsuario.email },  //mantem essas informações no header
            process.env.JWT_SECRET,                     // ordem da criptografia
            {expiresIn: '7d'}                           // tempo pra expirar 
        );
        return res.status(201).json({
            message: 'Cadastro realizado com sucesso', token,
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email
            }
        });

    }
    catch(err){
        return res.status(500).json({err: 'Erro interno'})
    }
};
async function login(req,res) {                     //função para fazer o login
    try{
        const erros = validationResult(req)
        if(!erros.isEmpty()){
            return res.status(400).json({erros: erros.array() })
        }
        const {email,senha} = req.body;                 //extraindo somente os dados necessarios
        const usuarioExistente = await Usuarios.findOne({where: {email}})   //vendo se existe email
        
        if(!usuarioExistente){
            return res.status(409).json({erro: 'Login inválido'});
        }
        const senhaCerta = await bcrypt.compare(senha, usuarioExistente.senha_hash);              //comparando se a senha bate com a senha salva no BD
        if(!senhaCerta){
            return res.status(401).json({erro: 'Senha inválida'});
        }
        const token = jwt.sign(
            {
                id: usuarioExistente.id, email: usuarioExistente.email,},
                process.env.JWT_SECRET,
                {expiresIn: '7d'},
        )
        return res.status(200).json({
            message: 'Login realizado com sucesso',
             token,
             usuario: {
                id: usuarioExistente.id,
                nome: usuarioExistente.nome,
                email: usuarioExistente.email
             }
        });
    }
    catch(err){
        return res.status(401).json({erro: 'Conta não encontrada'})
    }
}
async function verificarIdentidade(req,res) {
    try{
        const {email, cpf} = req.body
        if(!email || !cpf){
            return res.status(400).json({erro: 'Email e CPF são obrigatórios'})
        }
        const usuario = await Usuarios.findOne({
            where: {email, cpf}
        })
        if (!usuario){
            return res.status(404).json({erro: 'Dados não conferem'})
        }
        const cpfNormalizado = cpf.replace(/[.\-\s]/g, '')

        const usuarioEncontrado = await Usuarios.findOne({where: {email, cpf: cpfNormalizado}})
        return res.status(200).json({
            mensagem: 'Identidade verificada',
            id_usuario: usuarioEncontrado.id,
        })
    }
    catch(err){
        return res.status(500).json({erro: 'Erro interno'})
    }
}

async function redefinirSenha(req,res) {
        try{
            const {id_usuario, nova_senha} = req.body
            if(!id_usuario || !nova_senha){
                return res.status(400).json({erro: 'Dados incompletos'})
            }
            if(nova_senha.length < 6){
                return res.status(400).json({erro: 'Senha muito curta'})
            }
            const usuario = await Usuarios.findOne({where: {id: id_usuario}})
            if(!usuario){
                return res.status(404).json({erro: 'Usuário não encontrado'})
            }

            const senha_hash = await bcrypt.hash(nova_senha,10)
            await usuario.update({senha_hash})

            return res.status(200).json({mensagem: 'Senha redefinida com sucesso'})

        }
        catch(err){
            return res.status(500).json({erro: 'Erro interno'})
        }
}

module.exports = {cadastro, login, verificarIdentidade,redefinirSenha}