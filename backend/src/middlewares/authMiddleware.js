// esse é o "segurança na porta da entrada", ele vai verificar se a requisição possui um token de autenticação jwt valida

const jwt = require('jsonwebtoken');    //biblioteca que sabe ler e verificar os tokens jwt

function autenticar(req,res,next){      //padrao do express ter 3 parametros, next -> permite continuar
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')){   // se NÃO começar com Bearer, é pra barrar, o mesmo caso seja 'false'
        return res.status(401).json({erro: 'Token não fornecido'})  //codigo de erro: 401
    };
    const token = authHeader.split(' ')[1];     

    jwt.verify(token, process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({ erro: 'Token invalido'});
        };
        req.usuarioId = payload.id;     //req.variavelQueEuCrio = variavelexistente
        next();
    });
}

module.exports = autenticar;
