const { Router } = require('express');      //Router cria grupos de rotas 
const authRoutes = require('./auth.routes');
const router = Router();

router.get('/',( req, res)=>{       //pelo '/' nao possuir nada na frente, ele é equivalente a '/api'
    res.json({ mensagem: 'funcionando'});
});
router.use('/auth', authRoutes)     //aqui vai usar '/api/auth/cadastro'; '/api/auth/login'


module.exports = router;
