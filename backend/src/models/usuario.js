class Usuario{
    constructor({id, nome, idade, email, criacaoConta}){
        this.id =  id,
        this.nome = nome,
        this.idade = idade,
        this.email = email,
        this.criacaoConta = criacaoConta
    //senha so fica exposta no banco de dados, tenho q ver como faço isso ai
    }

    static validar({nome, idade, email, senha }){
        const erros = []

        if(!nome || nome.trim().length < 2){
            erros.push('O nome deve ter mais que 2 caracteres.')
        }

    const idadeConvertida = Number(idade)  //na requisição HTTP, essa bomba vem em string, to convertendo para numero dnv
        if(!idade || isNaN(idadeConvertida) || idadeConvertida<1 || idadeConvertida>100){
            erros.push('A idade deve estar entre 1 e 100 anos.')
        }
    }
}