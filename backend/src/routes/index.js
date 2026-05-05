const { Router } = require('express');      //Router cria grupos de rotas 
const router = Router();

router.get('/',( req, res)=>{
    res.json({ mensagem: 'funcionando'});
});

module.exports = router;
