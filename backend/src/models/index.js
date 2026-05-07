// aqui devo importar todos os models e definir a relação entre eles

//hasMany = "tem muitos" --> Partidas.hasMany(Rodadas, {foreignKey: 'id_partida'})
//belongsTo = "pertence a" --> Rodadas.belongsTo(Partidas, {foreignKey: 'id_partida'})
// se "A hasMany B", devo colocar tbm "B belongsTo A"

const Alternativas = require('./Alternativas');
const Fontes = require('./Fontes');
const Materias = require('./Materias');
const Partidas = require('./Partidas');
const Questoes = require('./Questoes');
const RodadaDeQuestoes = require('./RodadaDeQuestoes');
const Rodadas = require('./Rodadas');
const Tentativas = require('./Tentativas');
const TipoNivel = require('./TipoNivel');
const Usuarios = require('./Usuarios');
const UsuarioPartida= require('./UsuarioPartida');

// relações, de 2 em 2 (tem / está incluso)
TipoNivel.hasMany(Fontes,{
    foreignKey: 'id_tipo_nivel',
});
Fontes.belongsTo(TipoNivel,{
    foreignKey: 'id_tipo_nivel'
});


Fontes.hasMany(Questoes,{
    foreignKey: 'id_fonte'
});
Questoes.belongsTo(Fontes,{
    foreignKey: 'id_fonte'
});


Materias.hasMany(Questoes,{
    foreignKey: 'id_materia'
});
Questoes.belongsTo(Materias,{
    foreignKey: 'id_materia'
});