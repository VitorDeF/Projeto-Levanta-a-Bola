// SESSÃO
function sessao() {
    let sessao = sessionStorage.getItem('usuario')
    let usuario = {}
    if (sessao) {
        usuario = JSON.parse(sessao)
        if (usuario.tipo == 1) {
            fetch("http://localhost:3303/id_espaco", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: usuario.id })
            }).then(function (res) {
                res.json().then(function (data) {
                    if (data.excessao) {
                        window.alert(data.excessao + "\n" + data.mensagem)
                    } else {
                        console.log(`${data.tipo} - ${data.mensagem}`)
                    }

                    if (data.espaco && data.espaco.id_espaco != null) {
                        sessionStorage.setItem('espaco', JSON.stringify(data.espaco))
                        window.location.assign("perfil.html")
                    } else {
                        sessionStorage.setItem('espaco', JSON.stringify(data.espaco))
                        window.location.assign("cadastro_de_espaco.html")
                    }

                });

            })
        } else {
            window.location.assign("feed.html")
        }
    }
}

// Função de restringir usuário proprietario
function restringeUserProprietario() { // Rodar no onload
    const usu_tipo = sessionStorage.getItem('usuario')
    if (!usu_tipo) {
        window.alert("Logue para continuar.");
        window.location.assign("index.html")
    }
    else if (JSON.parse(usu_tipo).tipo == 0) {
        window.alert("Acesso negado.");
        window.location.assign("feed.html")
    }
}

// Função de restringir usuário logado
function restringeUserLogado() {
    const usuLogado_tipo = sessionStorage.getItem('usuario')
    if (!usuLogado_tipo) {
        window.alert("Logue para continuar.");
        window.location.assign("index.html")
    }
}



// LOGIN
// Requisição para o back-end e retorno de alertas
function login() {
    const usu_email = document.getElementById("email").value
    const usu_senha = document.getElementById("password").value

    if (usu_email === "" || usu_senha === "") {
        return window.alert("Preencha todos o dados")
    }

    fetch("http://localhost:3303/logar", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usu_email, senha: usu_senha })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.usuario) {
                sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
                sessao()
            }

        });
    })
}



//CADASTRO DE USUÁRIO
//Requisição para o back-end e retorno de alertas
async function cadastro() {
    const usu_email = document.getElementById("c_email").value
    const usu_senha = document.getElementById("c_password").value
    const usu_nome = document.getElementById("c_nome").value

    let tipo
    if (document.getElementById('tipo').checked) {
        tipo = 0
    } else {
        tipo = 1
    }

    if (usu_email === "" || usu_senha === "" || usu_nome === "") {
        return window.alert("Preencha todos o dados")
    }

    fetch("http://localhost:3303/cadastro", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usu_email, senha: usu_senha, nome: usu_nome, tipo: tipo })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.usuario) {
                sessionStorage.setItem('usuario', JSON.stringify(data.usuario))
                sessao()
            }
        });

    })
}



// CADASTRO DO ESPAÇO ESPORTIVO
// Popular dropdown de 'Estado' com os itens retornados da query de estados no banco de dados
function pesquisarEstados() {   // Rodando no onload

    const dropdown = document.getElementById("select-estado")
    $("#select-estado").html(``)
    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch("http://localhost:3303/cadastro-espaco-pesquisar-estados", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        $("#select-estado").append(`<option value="null">Selecione um estado</option>`)
        res.json().then(function (data) {
            // Insere cada estado (data[].estado) em uma opção do dropdown
            for (let i = 0; i < data.length; i++) {
                $("#select-estado").append('<option value="' + data[i].id + '">' + data[i].estado + '</option>');
            }
        })
    })
}

// Checar opção selecionada no dropdown 'Estado' e retornar para quem chamou
function checkEstado() {
    const dropdown = document.getElementById("select-estado")

    return (dropdown.value)
}

// Popular seção 'Modalidade' com checkboxes referentes aos itens retornados da query de modalidades do banco de dados
function pesquisarModalidades() {   // Rodando no onload
    const divModalidades = document.getElementById("select-modalidade")     // Selecionar no HTML a div em que estarão os checkboxes

    // Recebe a resposta enviada pela rota de pesquisa no banco de dados
    fetch("http://localhost:3303/cadastro-espaco-pesquisar-modalidades", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {

        res.json().then(function (data) {
            // Insere cada modalidade (data[].modalidade) em um checkbox

            for (let i = 0; i < data.length; i++) {
                $("#select-modalidade").append(
                    `<div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${data[i].id}">
                        <label class="form-check-label" for="flexCheckDefault">
                            ${data[i].modalidade}
                        </label>
                    </div>`
                )
            }

            /* Outra forma de fazer o loop acima: */

            // for (let i = 0; i < data.length; i++){

            //     let checkboxInput = document.createElement("input") // Cria um input
            //     checkboxInput.type = "checkbox";    // Define o tipo do input como checkbox
            //     checkboxInput.id = "checkbox" + i;   // Definir um id para cada checkbox, permitindo associar uma label a ela
            //     checkboxInput.class = "chk";    // A definição de uma classe permitirá o funcionamento do querySelectorAll
            //     divModalidades.appendChild(checkboxInput);

            //     let checkboxLabel = document.createElement("label");    // Cria uma label de checkbox
            //     checkboxLabel.setAttribute("for", i);   // Associa label ao checkbox de id i
            //     checkboxLabel.innerHTML = data[i].modalidade;
            //     divModalidades.appendChild(checkboxLabel);
            // }
        })
    })
}



// Verificar quais checkboxes estão preenchidos
function checkModalidades() {
    const checkboxes = document.getElementsByClassName("form-check-input");
    const selectedCheckboxes = Array.prototype.slice.call(checkboxes).filter(ch => ch.checked == true);

    const qtdSelecionada = selectedCheckboxes.length

    let modalidadesSelecionadas = [];

    for (let i = 0; i < qtdSelecionada; i++) {
        // Insere no array o valor que está no id="" de cada input, que também é o id_modalidade no banco de dados
        modalidadesSelecionadas.push(selectedCheckboxes[i]["attributes"]["id"]["value"])
        // modalidadesSelecionadas.push({id_modalidade: selectedCheckboxes[i]["attributes"]["id"]["value"]})         
    }

    // Retorna array com id de todas as modalidades selecionadas
    return modalidadesSelecionadas

}


// Cadastrar novo espaço ao submeter o form pelo botão
function cadastroEspaco() {
    const place_title = document.getElementById("place_title").value;
    const place_description = document.getElementById("place_description").value;
    const place_city = document.getElementById("place_city").value;
    const place_state = checkEstado();
    const place_adress = document.getElementById("place_adress").value;
    const place_docs = document.getElementById("place_docs").value;
    const place_size = document.getElementById("tamanho").value;
    const proprietario = sessionStorage.getItem("espaco");

    let id = null;
    if (proprietario) {
        id = JSON.parse(proprietario).id_proprietario
    }

    const place_sports = checkModalidades();

    fetch("http://localhost:3303/cadastro-espaco", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            titulo: place_title,
            descricao: place_description,
            cidade: place_city,
            estado: place_state,
            endereco: place_adress,
            documento: place_docs,
            tamanho: place_size,
            proprietario: id,
        })
    }).then(function (res) {
        res.json().then(function (data) {
            if (data.tipo) {
                window.alert(`${data.tipo} - ${data.mensagem}`)
            }
            if (data.espaco) {
                sessao()
                sessionStorage.setItem('modalidades', JSON.stringify(place_sports));
                // OBS: Por algum motivo o atribuirModalidades() não estava inserindo linhas na tabela 'espaco_has_modalidade' quando esta localizado nessa linha. Por esse motivo, foi realocado para o onload="" da página seguinte, 'perfil.html'
                window.location.assign("perfil.html");
            }
        });

    });
}

// Atribuir as modalidades retornadas em 'checkModalidades()' e armazenadas no sessionStorage ao espaço atual
function atribuirModalidades() {

    // Get the value of the 'espaco' key from session storage
    const espaco = JSON.parse(sessionStorage.getItem('espaco'));

    // Access the 'id_espaco' property of the 'espaco' object
    const id_do_espaco = espaco.id_espaco;

    // Get the key 'modalidades' from session storage
    const modalidades = JSON.parse(sessionStorage.getItem('modalidades'));

    if (!modalidades) {
        return 0;
    }

    fetch("http://localhost:3303/cadastro-espaco-atribuir-modalidades", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods': '*' },
        body: JSON.stringify({
            id_do_espaco: id_do_espaco,
            modalidades: modalidades,
        })
    })

    sessionStorage.removeItem('modalidades')
}




// GERENCIAMENTO DE DISPONIBILIDADE DE HORÁRIO
// Proprietário logado e com espaço na sessão?
function espaco_validar() {
    let espaco = sessionStorage.getItem('espaco');
    if (!espaco) {
        window.alert("Você precisa ter um espaço espoortivo cadastrado para acessar essa página")
        window.location.assign("cadastro_de_espaco.html")
    }
}

// Requisição para o back-end e retorno de alertas
function horario() {
    let teste = sessionStorage.getItem('espaco')
    let espaco = {}
    if (!teste) {
        window.alert("Você precisa ter um espaço esportivo cadastrado para realizar essa ação")
        window.location.assign("cadastro_de_espaco.html")
    } else {
        espaco = JSON.parse(teste)
    }
    const fun_DOM_in = document.getElementById("dom_in").innerText
    const fun_DOM_f = document.getElementById("dom_f").innerText
    const fun_SEG_in = document.getElementById("seg_in").innerText
    const fun_SEG_f = document.getElementById("seg_f").innerText
    const fun_TERC_in = document.getElementById("terc_in").innerText
    const fun_TERC_f = document.getElementById("terc_f").innerText
    const fun_QUAR_in = document.getElementById("quar_in").innerText
    const fun_QUAR_f = document.getElementById("quar_f").innerText
    const fun_QUI_in = document.getElementById("qui_in").innerText
    const fun_QUI_f = document.getElementById("qui_f").innerText
    const fun_SEX_in = document.getElementById("sex_in").innerText
    const fun_SEX_f = document.getElementById("sex_f").innerText
    const fun_SAB_in = document.getElementById("sab_in").innerText
    const fun_SAB_f = document.getElementById("sab_f").innerText

    fetch("http://localhost:3303/funcionamento", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            domingo_começo: fun_DOM_in, domingo_fim: fun_DOM_f,
            segunda_começo: fun_SEG_in, segunda_fim: fun_SEG_f,
            terça_começo: fun_TERC_in, terça_fim: fun_TERC_f,
            quarta_começo: fun_QUAR_in, quarta_fim: fun_QUAR_f,
            quinta_começo: fun_QUI_in, quinta_fim: fun_QUI_f,
            sexta_começo: fun_SEX_in, sexta_fim: fun_SEX_f,
            sabado_começo: fun_SAB_in, sabado_fim: fun_SAB_f,
            espaco: espaco.id_espaco //precisa da tela de "cadastro de espaço" funcional para dar certo
        })
    }).then(function (res) {

        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        });

    })
}

function chamar_info() {
    let espaco = JSON.parse(sessionStorage.getItem('espaco'))

    let id_espaco = espaco.id_espaco

    fetch("http://localhost:3303/obter_informacoes", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id_espaco
            // precisa da tela de "cadastro de espaço" funcional para dar certo
        })

    }).then(function (res) {
        res.json().then(function (espaco) {

            console.log(id_espaco)

            document.getElementById("lcl").innerText = espaco.local
            document.getElementById("est").innerText = espaco.estado
            document.getElementById("cid").innerText = espaco.cidade;

            console.log(espaco.local)
            console.log(espaco.estado)
            console.log(espaco.cidade)
        })

    })
}

function url_foto() {
    let teste = sessionStorage.getItem('espaco')
    let espaco = {}
    if (!teste) {
        window.alert("Você precisa ter um espaço esportivo cadastrado para realizar essa ação")
        window.location.assign("cadastro_de_espaco.html")
    } else {
        espaco = JSON.parse(teste)
    }
    const url_da_foto = document.getElementById("input-foto").value


    fetch("http://localhost:3303/add_foto", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            dado_foto: url_da_foto,
            espaco: espaco.id_espaco // precisa da tela de "cadastro de espaço" funcional para dar certo
        })
    }).then(function (res) {

        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        });

    })
}

function chamar_horario() {
    let espaco = JSON.parse(sessionStorage.getItem('espaco'))

    let id_espaco = espaco.id_espaco


    fetch("http://localhost:3303/obter_horarios", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id_espaco
            // precisa da tela de "cadastro de espaço" funcional para dar certo
        })

    }).then(function (res) {
        res.json().then(function (espaco) {

            document.getElementById("dom_in").innerText = espaco.domingo_começo
            document.getElementById("dom_f").innerText = espaco.domingo_fim
            document.getElementById("seg_in").innerText = espaco.segunda_começo
            document.getElementById("seg_f").innerText = espaco.segunda_fim
            document.getElementById("terc_in").innerText = espaco.terça_começo
            document.getElementById("terc_f").innerText = espaco.terça_fim
            document.getElementById("quar_in").innerText = espaco.quarta_começo
            document.getElementById("quar_f").innerText = espaco.quarta_fim
            document.getElementById("qui_in").innerText = espaco.quinta_começo
            document.getElementById("qui_f").innerText = espaco.quinta_fim
            document.getElementById("sex_in").innerText = espaco.sexta_começo
            document.getElementById("sex_f").innerText = espaco.sexta_fim
            document.getElementById("sab_in").innerText = espaco.sabado_começo
            document.getElementById("sab_f").innerText = espaco.sabado_fim;

        })

    })
}




// NOTIFICAÇÃO
function confirma(id1, id2, tipo) {
    console.log("Id: " + id1 + "; Id2: " + id2 + "; Tipo: " + tipo)
    fetch("http://localhost:3303/notificacao_confirma", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id1, id2: id2, tipo: tipo })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)

        });

    })
    notificacao()
}

function deleta(id1, id2, tipo) {
    console.log("Id: " + id1 + "; Id2: " + id2 + "; Tipo: " + tipo)
    fetch("http://localhost:3303/notificacao_deleta", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id1, id2: id2, tipo: tipo })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        });

    })
    notificacao()
}

// Requisição para o back-end e retorno de alertas
function notificacao() {
    const pessoa_notificada = JSON.parse(sessionStorage.getItem('usuario'))
    const proprietario = JSON.parse(sessionStorage.getItem('espaco'))
    let id = pessoa_notificada.id
    if (proprietario) {
        id = proprietario.id_proprietario
    }
    console.log(pessoa_notificada.tipo)
    fetch("http://localhost:3303/notificar", {
        method: 'POST',

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: pessoa_notificada.tipo, id: id })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
            if (data.valores) {
                $("#solicitacoes_notificacao").html(``)
                if (data.valores[0].data) {
                    let data_evento
                    for (let i = 0; i < data.valores.length; i++) {
                        data_evento = formataData(data.valores[i].data)
                        $("#solicitacoes_notificacao").append(
                            `<!-- CARD -->
                        <div class="card cardPerfil">
                            <div class="texto">
                                <p><b>Data: </b> ${data_evento[2]}/${data_evento[1]}/${data_evento[0]}</p>
                                <p><b>Horário: </b> ${data.valores[i].hora_inicio} - ${data.valores[i].hora_final}</p>
                                <p><b>ID do criador: </b> ${data.valores[i].usuario_id_criador}</p>
                            </div>
                            <div class="column">
                                <h1 class="botao" onclick="confirma(${data.valores[i].id}, null, 1)"><i class="bi bi-check-square"></i></h1>
                                <h1 class="botao" onclick="deleta(${data.valores[i].id}, null, 1)"><i class="bi bi-x-square"></i></h1>
                            </div>
                        </div>`
                        )
                    }
                } else {
                    for (let i = 0; i < data.valores.length; i++) {
                        $("#solicitacoes_notificacao").append(
                            `<!-- CARD -->
                            <div class="card cardPerfil">
                                <div class="texto">
                                    <p><b>ID do evento: </b> ${data.valores[i].evento_id}</p>
                                    <p><b>ID do usuario pendente: </b> ${data.valores[i].usuario_id}</p>
                                    <p><b>Situação: </b> ${data.valores[i].situacao}</p>
                                </div>
                                <div class="column">
                                    <h1 class="botao" onclick="confirma(${data.valores[i].evento_id}, ${data.valores[i].usuario_id}, 0)"><i class="bi bi-check-square"></i></h1>
                                    <h1 class="botao" onclick="deleta(${data.valores[i].evento_id}, ${data.valores[i].usuario_id}, 0)"><i class="bi bi-x-square"></i></h1>
                                </div>
                            </div>`
                        )
                    }
                }
            }
        })
    })
}


// Função que coloca o valor inserido no input no local correto do display
function horas(value) {
    let inicio_tempo = document.getElementById("temp_in").value
    let fim_tempo = document.getElementById("temp_f").value

    document.getElementById(`${value}_in`).innerText = (`${inicio_tempo}`);
    document.getElementById(`${value}_f`).innerText = (`${fim_tempo}`);
}

// Função que faz a atualização do display de horários
function alteraDisplay() {
    for (let i = 1; i <= 7; i++) {
        let input = document.getElementById(`vbtn-radio${i}`);
        if (input.checked) {
            horas(input.value);
            break
        }
    }
}

function prop_dados(value) {
    console.log(value);

    let local = document.getElementById("lcl").value
    let cpf = document.getElementById("CPF").value;

    document.getElementById(`lcl`).innerText = (`${local}`);
    document.getElementById(`CPF`).innerText = (`${cpf}`);

    console.log(value);
}

function alterar() {
    const local = document.getElementById("lcl").value
    const cpf = document.getElementById("CPF").value

    console.log();

    fetch("http://localhost:3303/alterar_meu_espaço", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            local: local,
            cpf: cpf
        })
    })
}

// Chamar fetch pelo botão "salvar"

// Alteração de dados
function altDados() {
    const usu_nome = document.getElementById("novoNome").value
    const usu_senha = document.getElementById("novaSenha").value
    const usu_img = document.getElementById("novaImg").value
    const usuario = JSON.parse(sessionStorage.getItem('usuario'));
    const id = usuario.id;
    const tipo = usuario.tipo;
    console.log(id)
    console.log(usu_nome)
    console.log(usu_senha)
    fetch("http://localhost:3303/altDados", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: usu_nome, senha: usu_senha, img: usu_img, id: id, tipo: tipo })

    })
}



// PÁGINA DE CRIAÇÃO DE EVENTO
// Insere as modalidades no select
function load_modalidade() {   // É chamada pelo onload da tag body
    // Remove todas as linhas do corpo da tabela
    $("#select_modalidade").html(``);

    fetch("http://localhost:3303/modalidade", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(function (res) {
        res.json().then(function (retorno) {
            $("#select_modalidade").append(`<option value="null">Selecione a modalidade</option>`);
            if (retorno.mensagem) {
                window.alert(`${retorno.tipo} - ${retorno.mensagem}`)
            }
            if (retorno.cards) {
                for (let i = 0; i < retorno.cards.length; i++) {
                    $("#select_modalidade").append(`
                    <option value="${retorno.cards[i].id}">${retorno.cards[i].modalidade}</option>`);
                }
            }

        });

    })

}

// Formata a data
function formataData(input) {
    let lixo = input.split("T")
    let data1 = lixo[0].split("-")
    return data1
}

// Formata a data para pegar o dia da semana
function dia_da_semana(input) {

    let data1 = input.split("-")
    ano = data1[0].substring(2) // get only two digits
    mes = data1[1]
    dia = data1[2]

    const data2 = new Date(mes + '-' + dia + '-' + ano)

    return data2.getDay();
}

// Mostra os espaços que cumprem com a pesquisa do usuário
function load_espacos() {   // É chamada pelo onload da tag body
    const data = document.getElementById("data").value
    const hora = document.getElementById("hora").value
    const modalidade = document.getElementById("select_modalidade").value
    const cidade = document.getElementById("cidade").value
    let dia_semana = ""

    if (hora && !data) {
        return window.alert("Insira a data para pesquisarmos o horário inserido")
    }
    if (data) {
        dia_semana = dia_da_semana(data)
        console.log("Dia da semana: " + dia_semana)
    }
    // Remove todas as linhas do corpo da tabela
    $("#lista_espacos").html(``);

    fetch("http://localhost:3303/espaco_pesquisa", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: data, semana: dia_semana, horario: hora, modalidade: modalidade, cidade: cidade })
    }).then(function (res) {
        res.json().then(function (retorno) {
            if (retorno.cards) {
                for (let i = 0; i < retorno.cards.length; i++) {
                    $("#lista_espacos").append(`<!-- CARD -->
                    <div class="card card_locais m-2">
                        <input id="op_${i}" class="opcao mt-2" type="radio" value="${retorno.cards[i].id}" name="espaco">
                        <div class="card-body">
                            <img src="${retorno.cards[i].foto}" alt="imagem do espaço">
                            <div class="container perfil ml-3">
                                <p><b>Nome do local: </b>${retorno.cards[i].titulo}</p>
                                <p><b>Endereço: </b>${retorno.cards[i].endereco}</p>
                                <p><b>Tamanho: </b>${retorno.cards[i].tamanho}</p>
                            </div>
                        </div>
                        <div class="card-footer">
                            <p><b>Descrição: </b>${retorno.cards[i].descricao}</p>
                        </div>
                    </div>`);
                }
            }

        });
    })
}

// Testa se os valores foram inseridos e prepara o local storage para a mudança de tela
function conf_selec_espaco() {
    let espaco;
    const quantidade = document.getElementsByClassName("opcao").length
    const modalidade = document.getElementById("select_modalidade").value
    let data = document.getElementById("data").value
    let hora = document.getElementById("hora").value
    if (modalidade == 'null') {
        return window.alert("Escolha uma modalidade antes de realizar essa ação")
    }
    if (hora && !data) {
        return window.alert("Escolha uma data antes de realizar essa ação")
    }
    for (let i = 0; i < quantidade; i++) {
        espaco = document.getElementById(`op_${i}`)
        if (espaco.checked) {
            window.location.assign("realizar_evento.html");
            let dados = { id: espaco.value, modalidade: modalidade, data: data, hora: hora }
            return sessionStorage.setItem('evento_dados_iniciais', JSON.stringify(dados))
        }
    }
    return window.alert("Escolha um espaço antes de realizar essa ação")
}



// PÁGINA DE REALIZAR EVENTO
// Coloca os dados que já foram inseridos nos inputs corretos
function load_criacao_evento() {
    if (!sessionStorage.getItem('evento_dados_iniciais')) {
        window.alert("Você deve escolher local e modalidade antes de usar esse recurso")
        return window.location.assign("criação_de_evento.html")
    }
    const id = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).id
    const modalidade = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).modalidade
    const data = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).data
    const hora = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).hora

    const inp_data = document.getElementById("data_in")
    const inp_hora = document.getElementById("hr_in")
    if (data != "") {
        inp_data.value = data
        inp_data.disabled = true
    }
    if (hora != "") {
        inp_hora.value = hora
        inp_hora.disabled = true
    }
}

// Inserir o novo evento no banco de dados
function novo_evento() {
    const id = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).id
    const modalidade = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).modalidade
    const data = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).data
    const hr_in = JSON.parse(sessionStorage.getItem('evento_dados_iniciais')).hora
    const criador = JSON.parse(sessionStorage.getItem('usuario')).id
    const hr_f = document.getElementById("hr_f").value
    const data_lim = document.getElementById("data_limite").value
    const max = document.getElementById("max").value
    const min = document.getElementById("min").value
    const descricao = document.getElementById("descricao").value

    fetch("http://localhost:3303/novo_evento", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            espaco_id: id,
            modalidade_id: modalidade,
            data: data,
            hora_inicio: hr_in,
            hora_final: hr_f,
            data_limite: data_lim,
            max_jogadores: max,
            min_jogadores: min,
            descricao: descricao,
            criador_id: criador
        })
    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        });
        window.location.assign("feed.html");
    })

    sessionStorage.removeItem('evento_dados_iniciais')
}

function conf_participar(evento) {
    const usuario_id = JSON.parse(sessionStorage.getItem("usuario")).id
    fetch("http://localhost:3303/participar", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento_id: evento, usuario_id: usuario_id })

    }).then(function (res) {
        res.json().then(function (data) {
            window.alert(`${data.tipo} - ${data.mensagem}`)
        })
    })
}

// Função de mostrar os eventos disponíveis (na página de participar de um evento)
function mostraEventos() {
    estado = document.getElementById("select-estado").value
    cidade = document.getElementById("inputCidade").value
    modalidade = document.getElementById("select_modalidade").value
    data = document.getElementById("inputData").value

    fetch("http://localhost:3303/acharEventos", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            estado: estado,
            cidade: cidade,
            modalidade: modalidade,
            data: data
        })

    }).then(function (res) {
        res.json().then(function (data) {
            $("#showEventos").html(``)
            if (data.valores) {
                for (let i = 0; i < data.valores.length; i++) {
                    Rdata = data.valores[i].data.split("T")
                    dataF = Rdata[0]
                    dataF2 = formataData(dataF)
                    $("#showEventos").append(`
                    <div>
                        <div class="texto">
                            
                            <p><b>Descrição: </b> ${data.valores[i].descricao}</p>
                            <p><b>Data: </b> ${dataF2[2]} - ${dataF2[1]} - ${dataF2[0]}</p>
                           
                        </div>
                        <div class="column">
                             <button onclick="conf_participar(${data.valores[i].evento})">Confirmar</button>
                        </div>
                    </div>`)

                }
            }
        })
    });
}


// INDICADORES DE DESEMPENHO
// Indicador de desempenho 1
function indDesempenho1() {

    fetch("http://localhost:3303/indDesempenho1", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data) {

                new Chart(document.getElementById("chart_ind1"), {
                    type: 'pie',
                    data: {
                        labels: ["Jogadores", "Proprietario"],
                        datasets: [{
                            label: "Population (millions)",
                            backgroundColor: ["#ffa500", "#bce954"],
                            data: [data.jogador, data.proprietario]
                        }]
                    }
                });
            }
        });
    })
}

// Indicador de desempenho 2
function indDesempenho2() {

    fetch("http://localhost:3303/indDesempenho2", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data) {
                const ctx = document.getElementById('chart_ind2');

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.arrayMeses,
                        datasets: [{
                            label: 'Qtd. de eventos',
                            data: data.arrayEventosMinJogadores,
                            borderWidth: 1,
                            backgroundColor: "#bce954"
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });
            }
        });
    })
}


// Indicador de desempenho 3
function indDesempenho3() {

    fetch("http://localhost:3303/indDesempenho3", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {

            if (data) {

                const ctx = document.getElementById('chart_ind3');

                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Futebol', 'Basquete', 'Volei', 'Tênis', 'Golfe', 'Futsal', 'Atletismo', 'Jogos de Salão', 'Handebol', 'Rugby', 'Beisebol', 'Natação'],
                        datasets: [{
                            label: 'Qtd. de eventos',
                            data: data.arrayQntd,
                            borderWidth: 1,
                            backgroundColor: '#ffa500'
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        }
                    }
                });
            }
        });
    })
}

// Indicador de desempenho 4
function indDesempenho4() {

    fetch("http://localhost:3303/indDesempenho4", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data) {

                document.getElementById("chart_ind4").innerHTML = `<p> Mês: ${data.mes}</p>
                <p> Qtd. de eventos aprovados: ${data.nEventos}</p>
                `;
            }
        });
    })
}

// Indicador de desempenho 5
function indDesempenho5() {

    fetch("http://localhost:3303/indDesempenho5", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }).then(function (res) {
        res.json().then(function (data) {
            if (data) {

                document.getElementById("chart_ind5").innerHTML = `<p> Mês: ${data.mes}</p>
                <p> Qtd. de eventos que alcançaram mínimo: ${data.nEventos}</p>
                `;
            }

        });
    })
}