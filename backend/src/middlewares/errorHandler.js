function errHandler(err, req, res, next){       //middleware de erro tem 4 parametros, so chama a primeira se algum outro middleware tiver um next(err), passando um erro
    console.log(err);
    return res.status(err.status || 500 ).json({erro: err.message || 'Erro interno'});
};
function notFound(req,res){
    return res.status(404).json({erro: `Rota não encontrada: ${req.method} ${req.originalUrl}`})    //method -> get, post, put, etc. //originalUrl -> caminho que foi acessado, isso ja é definido automatico com o req
};


module.exports = {errHandler, notFound}