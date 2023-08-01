function load_solicitacoes() {    // É chamada pelo onload da tag body
    // Remove todas as linhas do corpo da tabela
    $("#solicitacoes").html(``);

    fetch("http://localhost:3303/admin", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    }).then(function(res) {
        res.json().then(function(retorno) {
            $("#solicitacoes").append(`<h4 class="text-center">${retorno.tipo} - ${retorno.mensagem}</h4>`);
            if (retorno.cards) {
                for (let i = 0; i < retorno.cards.length; i++) {
                    $("#solicitacoes").append(`<!-- CARD -->
                        <div class="card">
                            <div class="texto">
                                <p><b>Título: </b>${retorno.cards[i].titulo}</p>
                                <p><b>Endereço: </b>${retorno.cards[i].endereco}, ${retorno.cards[i].cidade} - ${retorno.cards[i].estado}</p>
                                <p><b>Tamanho: </b>${retorno.cards[i].tamanho}</p>
                            </div>
                            <div class="column text-center">
                                <p>Documento do local</p>
                                <a target="_blank" href="${retorno.cards[i].url_documento}" class="btn botao"><i class="bi bi-download"></i> Download</a>
                            </div>
                            <div class="column">
                                <h1 onclick="confirma(${retorno.cards[i].id})"><i class="bi bi-check-square"></i></h1>
                                <h1 onclick="deleta(${retorno.cards[i].id})"><i class="bi bi-x-square"></i></h1>
                            </div>
                        </div>`);
                }
            }
            
        });
        
    })
    
}

function confirma(id) {
    fetch("http://localhost:3303/admin_confirma", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
    }).then(function(res) {
        res.json().then(function(data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            
        });
        
    })
    load_solicitacoes()
}

function deleta(id) {
    fetch("http://localhost:3303/admin_deleta", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: id})
    }).then(function(res) {
        res.json().then(function(data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            
        });
        
    })
    load_solicitacoes()
}