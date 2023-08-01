/* CONFIGURAÇÃO DO SERVIDOR */

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configura a conexão com o banco de dados
const connection = mysql.createConnection({

  host: "localhost",
  user: "root",
  password: "admin",
  database: "levanta_a_bola",
});


// Inicializa a conexão com o banco de dados
connection.connect();

// testar a conexão
// connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
//   // Operação simples para testar o funcionamento
//   if (err) throw err;

//   console.log("The solution is: ", rows[0].solution);
// });

app.use(
  cors({
    origin: "*",
  })
);

// ------------------------------------------------------------------------------------------------ //

/* ROTAS */

// Colocar id do espaço na sessão
app.post('/id_espaco', function (req, res) {
  connection.query(`select e.id as id_espaco, p.id as id_proprietario
  from espaco_esportivo e right join proprietario p
  on e.proprietario_id = p.id
  where p.usuario_id = ${req.body.id};`, (err, rows, fields) => { // Operação simples para testar o funcionamento
    if (err) {

      return res.json({
        tipo: "Erro",
        mensagem: err
      })
    }

    if (rows[0] == null) {

      return res.json({
        tipo: "Ação interrompida",
        mensagem: "Espaço não encontrado"
      })
    } else {

      if (rows.length > 1) {
        return res.json({
          tipo: "Id retornado com sucesso",
          excessao: "Foi encontrado mais de um local cadastrado!",
          mensagem: `ID do seu local: ${rows[0].id_espaco}`,
          espaco: {
            id_proprietario: rows[0].id_proprietario,
            id_espaco: rows[0].id_espaco
          }
        })
      }

      return res.json({
        tipo: "Id retornado com sucesso",
        mensagem: `ID do seu local: ${rows[0].id_espaco}`,
        espaco: {
          id_proprietario: rows[0].id_proprietario,
          id_espaco: rows[0].id_espaco
        }
      })
    }

  })

});

// LOGIN
app.post("/logar", function (req, res) {
  connection.query(
    `SELECT * FROM usuario WHERE email = "${req.body.email}" AND senha = "${req.body.senha}"`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Usuário não encontrado",
          mensagem: "Verifique os valores inseridos",
        });
      } else {
        return res.json({
          tipo: "Login realizado com sucesso",
          mensagem: `Bem vindo de volta, ${rows[0].nome}`,
          usuario: {
            id: rows[0].id,
            tipo: rows[0].tipo,
          },
        });
      }
    }
  );
});

// CADASTRO DE USUÁRIO
app.post("/cadastro", function (req, res) {
  connection.query(
    `INSERT INTO usuario VALUES(NULL, "${req.body.email}", "${req.body.nome}", "${req.body.senha}", ${req.body.tipo}, DEFAULT, NULL)`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      connection.query(
        `SELECT * FROM usuario WHERE email = "${req.body.email}" AND senha = "${req.body.senha}"`,
        (err, rows, fields) => {

          if (req.body.tipo == 1) {
            connection.query(
              `INSERT INTO proprietario VALUES(NULL, ${rows[0].id})`,
              (err) => {
                // Operação simples para testar o funcionamento
                if (err) {
                  return res.json({
                    tipo: "Erro",
                    mensagem: err,
                  });
                }

              }
            )
          }

          if (err) {
            return res.json({
              tipo: "Erro",
              mensagem: err,
            });
          }

          return res.json({
            tipo: "Cadastro realizado com sucesso",
            mensagem: `Bem vindo ao nosso site, ${rows[0].nome}`,
            usuario: {
              id: rows[0].id,
              tipo: rows[0].tipo,
            },
          });
        }
      );
    }
  );
});


// CADASTRO DO ESPAÇO ESPORTIVO
// Pesquisar no banco de dados todas as modalidades existentes para exibir na tela
app.get('/cadastro-espaco-pesquisar-modalidades', function (req, res) {
  var arrayModalidades = [];

  connection.query('SELECT * FROM modalidade', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayModalidades.push({
          modalidade: rows[i].nome,
          id: rows[i].id
        });
      }
    }
    // console.log(arrayModalidades)
    res.send(JSON.stringify(arrayModalidades));
  })
});

// Pesquisar no banco de dados todos os estados existentes para popular dropdown
app.get('/cadastro-espaco-pesquisar-estados', function (req, res) {
  var arrayEstados = [];

  connection.query('SELECT * FROM estado', (err, rows, fields) => {
    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err,
      });
    }
    else {
      for (let i = 0; i < rows.length; i++) {
        arrayEstados.push({
          estado: rows[i].nome,
          id: rows[i].id
        });
      }
    }
    res.send(JSON.stringify(arrayEstados));
  })
});

// Cadastrar novo espaço ao submeter o form pelo botão
app.post("/cadastro-espaco", function (req, res) {


  connection.query(
    `INSERT INTO espaco_esportivo VALUES (NULL, "${req.body.documento}", 0 , "${req.body.titulo}", "${req.body.cidade}", "${req.body.endereco}", "${req.body.tamanho}", default, "${req.body.descricao}", null, ${req.body.estado}, ${req.body.proprietario})`,

    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
      return res.json({
        tipo: "Espaço cadastrado com sucesso!",
        mensagem: `Aguarde a confirmação do admin.`,
        espaco: 1,
      });
    },
  );
});


// Atribuir modalidades selecionadas ao espaço atual
app.post("/cadastro-espaco-atribuir-modalidades", async function (req, res) {
  const modalidadesRecebidas = req.body.modalidades;
  const resultados = [];


  if (!modalidadesRecebidas) {
    console.log("ERRO")
    return 0;
  }

  for (let i = 0; i < modalidadesRecebidas.length; i++) {
    try {
      // Executar query e aguardar sua conclusão
      await connection.query(
        `INSERT INTO espaco_esportivo_has_modalidade VALUES (NULL, ${req.body.id_do_espaco}, ${modalidadesRecebidas[i]})`
      ).execute();

      // Inserir mensagem de sucesso no array 'resultados'
      resultados.push({
        tipo: "Sucesso",
        mensagem: "Modalidades atribuidas com sucesso"
      });
    } catch (err) {
      // Inserir mensagem de erro no array 'resultados'
      resultados.push({
        tipo: "Erro",
        mensagem: err,
      });
    }
  }

  // Enviar o array 'resultados' como resposta ao client
  res.send(resultados);
});


// GERENCIAMENTO DE DISPONIBILIDADE DE HORÁRIOS
app.post("/funcionamento", function (req, res) {

  connection.query(
    `replace funcionamento set 
  dom_hr_in = '${req.body.domingo_começo}', dom_hr_f = '${req.body.domingo_fim}', 
  seg_hr_in = '${req.body.segunda_começo}' , seg_hr_f = '${req.body.segunda_fim}',
  ter_hr_in = '${req.body.terça_começo}', ter_hr_f = '${req.body.terça_fim}', 
  qua_hr_in = '${req.body.quarta_começo}', qua_hr_f = '${req.body.quarta_fim}', 
  qui_hr_in = '${req.body.quinta_começo}', qui_hr_f = '${req.body.quinta_fim}', 
  sex_hr_in = '${req.body.sexta_começo}', sex_hr_f = '${req.body.sexta_fim}', 
  sab_hr_in = '${req.body.sabado_começo}', sab_hr_f = '${req.body.sabado_fim}', 
  espaco_esportivo_id = ${req.body.espaco};`,

    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.json({
          tipo: "Sucesso!",
          mensagem: `Atualização dos dados realizada`,
        });
      }
    }
  );
});


// PERFIL
app.post('/obter_horarios', function (req, res) {

  connection.query(`select* 
  from funcionamento 
  where espaco_esportivo_id = ${req.body.id};`, (err, rows, fields) => {

    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err
      })
    }

    if (rows[0] == null) {

      return res.json({
        mensagem: "Espaço não encontrado"
      })

    } else {

      return res.json({

        //id: rows[0].espaco_esportivo_id,     

        domingo_começo: rows[0].dom_hr_in, domingo_fim: rows[0].dom_hr_f,
        segunda_começo: rows[0].seg_hr_in, segunda_fim: rows[0].seg_hr_f,
        terça_começo: rows[0].ter_hr_in, terça_fim: rows[0].ter_hr_f,
        quarta_começo: rows[0].qua_hr_in, quarta_fim: rows[0].qua_hr_f,
        quinta_começo: rows[0].qui_hr_in, quinta_fim: rows[0].qui_hr_f,
        sexta_começo: rows[0].sex_hr_in, sexta_fim: rows[0].sex_hr_f,
        sabado_começo: rows[0].sab_hr_in, sabado_fim: rows[0].sab_hr_f,

      })

    }

  })

});

app.post('/obter_informacoes', function (req, res) {

  connection.query(`select endereco, estado.nome as estado, cidade
  from espaco_esportivo join estado on espaco_esportivo.estado_id = estado.id
  where espaco_esportivo.id = ${req.body.id};`, (err, rows, fields) => {

    if (err) {
      return res.json({
        tipo: "Erro",
        mensagem: err
      })
    }

    if (rows[0] == null) {

      return res.json({
        mensagem: "Espaço não encontrado"
      })

    } else {

      return res.json({

        local: rows[0].endereco,
        estado: rows[0].estado,
        cidade: rows[0].cidade,

      })

    }

  })

});

app.post("/add_foto", function (req, res) {
  console.log(req.body.dado_foto)
  connection.query(
    `update espaco_esportivo set
    espaco_esportivo.url_foto = '${req.body.dado_foto}' 
    where espaco_esportivo.id = ${req.body.espaco};`,

    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.json({
          tipo: "Sucesso!",
          mensagem: `Atualização dos dados realizada`,
        });
      }
    }
  );
});

// Atualização de dados do usuário
app.post("/altDados", function (req, res) {
  // para colocar foto depois , usuario.foto ${req.body.img}
  connection.query(
    `update usuario set usuario.nome = "${req.body.nome}",usuario.senha = "${req.body.senha}" where usuario.id = ${req.body.id};`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
    }
  );
});

// Notificacao
app.post("/notificar", function (req, res) {
  console.log("ID: " + req.body.id + "; TIPO: " + req.body.tipo);
  // Proprietário
  if (req.body.tipo == 1) {
    var array_objetos = [];
    connection.query(
      "select `data`, hora_inicio, hora_final, usuario_id_criador, situacao, id from evento where espaco_esportivo_id in (select id from espaco_esportivo where proprietario_id = " + req.body.id + ") and situacao = 0",
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        }

        if (rows[0] == null) {
          return res.json({
            tipo: "Sem notificações",
            mensagem: "Sem notificações pendentes",
          });
        } else {
          for (let i = 0; i < rows.length; i++) {
            array_objetos.push({
              data: rows[i].data,
              hora_inicio: rows[i].hora_inicio,
              hora_final: rows[i].hora_final,
              usuario_id_criador: rows[i].usuario_id_criador,
              id: rows[i].id,
            });
          }
          return res.json({
            tipo: "Notificações pendentes",
            mensagem: `Pendências`,
            valores: array_objetos,
          });
        }
      }
    );
  }
  // Jogador
  else {
    var array_objetos = [];
    connection.query(
      `select evento_id, usuario_id, situacao
    from evento_has_usuario ehu where evento_id in (select id from evento where usuario_id_criador = "${req.body.id}") and situacao = 0`,
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        }

        if (rows[0] == null) {
          return res.json({
            tipo: "Sem notificações",
            mensagem: "Sem notificações pendentes",
          });
        } else {
          for (let i = 0; i < rows.length; i++) {
            array_objetos.push({
              evento_id: rows[i].evento_id,
              usuario_id: rows[i].usuario_id,
              situacao: rows[i].situacao,
            });
          }

          return res.json({
            tipo: "Notificações pendentes",
            mensagem: `Pendências`,
            valores: array_objetos,
          });
        }
      }
    );
  }
});

// Confirmar um evento/participação (mudar a situação para 1)
app.post("/notificacao_confirma", function (req, res) {
  if (req.body.tipo == 1) {
    connection.query(
      `update evento set situacao = 1 where id = ${req.body.id};`,
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        } else {
          return res.json({
            tipo: "Sucesso!",
            mensagem: `O evento foi confirmado`,
          });
        }
      }
    );

  } else {
    connection.query(
      `update evento_has_usuario set situacao = 1 where evento_id = ${req.body.id} and usuario_id = ${req.body.id2};`,
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        } else {
          return res.json({
            tipo: "Sucesso!",
            mensagem: `O participante foi confirmado`,
          });
        }
      }
    );
  }
});

// Deletar um evento/participante
app.post("/notificacao_deleta", function (req, res) {
  if (req.body.tipo == 1) {
    connection.query(
      `update evento set situacao = -1 where id = ${req.body.id};`,
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        } else {
          return res.json({
            tipo: "Sucesso!",
            mensagem: `O evento foi deletado`,
          });
        }
      }
    );
  } else {
    connection.query(
      `update evento_has_usuario set situacao = -1 where evento_id = ${req.body.id} and usuario_id = ${req.body.id2};`,
      (err, rows, fields) => {
        // Operação simples para testar o funcionamento
        if (err) {
          return res.json({
            tipo: "Erro",
            mensagem: err,
          });
        } else {
          return res.json({
            tipo: "Sucesso!",
            mensagem: `A solicitação do participante foi deletada`,
          });
        }
      }
    );
  }

});

// TELA DE ADMIN
// Mostrar as solicitações
app.post("/admin", function (req, res) {
  var array_objetos = [];
  connection.query(
    `select e.id, titulo, endereco, cidade, estado.nome as estado, tamanho, url_documento
    from espaco_esportivo e join estado
    on e.estado_id = estado.id and e.situacao = 0;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Nada encontrado",
          mensagem: "Você está em dia com suas solicitações",
        });
      } else {
        for (let i = 0; i < rows.length; i++) {
          array_objetos.push({
            id: rows[i].id,
            titulo: rows[i].titulo,
            endereco: rows[i].endereco,
            cidade: rows[i].cidade,
            estado: rows[i].estado,
            tamanho: rows[i].tamanho,
            url_documento: rows[i].url_documento,
          });
        }

        return res.json({
          tipo: "Notificações encontradas",
          mensagem: `Aqui estão suas pendências`,
          cards: array_objetos,
        });
      }
    }
  );
});

// Confirmar um espaço (mudar a situação para 1)
app.post("/admin_confirma", function (req, res) {
  connection.query(
    `update espaco_esportivo set situacao = 1, dt_aprovado = now() where id = ${req.body.id};`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.json({
          tipo: "Sucesso!",
          mensagem: `O espaço foi confirmado`,
        });
      }
    }
  );
});

// Deletar um espaço
app.post("/admin_deleta", function (req, res) {
  connection.query(
    `update espaco_esportivo set situacao = -1, dt_aprovado = now() where id = ${req.body.id};`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.json({
          tipo: "Sucesso!",
          mensagem: `O espaço foi deletado`,
        });
      }
    }
  );
});


// TELA DE CRIAÇÃO DE EVENTO
// Preencher as opções do select de modalidade
app.post("/modalidade", function (req, res) {
  var array_objetos = [];
  connection.query(
    `select * from modalidade;`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Nada encontrado",
          mensagem: "Não temos nenhuma modalidade cadastrada no sistema",
        });
      } else {
        for (let i = 0; i < rows.length; i++) {
          array_objetos.push({
            id: rows[i].id,
            modalidade: rows[i].nome,
          });
        }

        return res.json({
          cards: array_objetos,
        });
      }
    }
  );
});

// Preencher a section com os cards dos espaços encontrados
app.post("/espaco_pesquisa", function (req, res) {
  console.log("Body: " + JSON.stringify(req.body))
  let sql_modalidade = sql_cidade = sql_semana_hora = sql_semana = sql_disponivel = ""
  if (req.body.modalidade && req.body.modalidade != 'null') {
    sql_modalidade = ` and e.id in (select e.id from espaco_esportivo e join espaco_esportivo_has_modalidade m on e.id = m.espaco_esportivo_id where m.modalidade_id = ${req.body.modalidade})`
  }

  if (req.body.cidade) {
    sql_cidade = ` and e.cidade like "%${req.body.cidade}%"`
  }

  if ((req.body.semana || req.body.semana == 0) && req.body.horario) {
    switch (req.body.semana) {
      case 0:
        sql_semana_hora = ` and (f.dom_hr_in <= "${req.body.horario}" and f.dom_hr_f >= "${req.body.horario}")`
        break
      case 1:
        sql_semana_hora = ` and (f.seg_hr_in <= "${req.body.horario}" and f.seg_hr_f >= "${req.body.horario}")`
        break
      case 2:
        sql_semana_hora = ` and (f.ter_hr_in <= "${req.body.horario}" and f.ter_hr_f >= "${req.body.horario}")`
        break
      case 3:
        sql_semana_hora = ` and (f.qua_hr_in <= "${req.body.horario}" and f.qua_hr_f >= "${req.body.horario}")`
        break
      case 4:
        sql_semana_hora = ` and (f.qui_hr_in <= "${req.body.horario}" and f.qui_hr_f >= "${req.body.horario}")`
        break
      case 5:
        sql_semana_hora = ` and (f.sex_hr_in <= "${req.body.horario}" and f.sex_hr_f >= "${req.body.horario}")`
        break
      case 6:
        sql_semana_hora = ` and (f.sab_hr_in <= "${req.body.horario}" and f.sab_hr_f >= "${req.body.horario}")`
        break
    }
  }

  if (req.body.semana || req.body.semana == 0) {
    switch (req.body.semana) {
      case 0:
        sql_semana = ` and (f.dom_hr_in >= "00:00" and f.dom_hr_f <= "23:59")`
        break
      case 1:
        sql_semana = ` and (f.seg_hr_in >= "00:00" and f.seg_hr_f <= "23:59")`
        break
      case 2:
        sql_semana = ` and (f.ter_hr_in >= "00:00" and f.ter_hr_f <= "23:59")`
        break
      case 3:
        sql_semana = ` and (f.qua_hr_in >= "00:00" and f.qua_hr_f <= "23:59")`
        break
      case 4:
        sql_semana = ` and (f.qui_hr_in >= "00:00" and f.qui_hr_f <= "23:59")`
        break
      case 5:
        sql_semana = ` and (f.sex_hr_in >= "00:00" and f.sex_hr_f <= "23:59")`
        break
      case 6:
        sql_semana = ` and (f.sab_hr_in >= "00:00" and f.sab_hr_f <= "23:59")`
        break
    }
  }

  if (req.body.data && req.body.horario) {
    sql_disponivel = ` and e.id not in(select evento.espaco_esportivo_id from evento where hora_inicio = "${req.body.horario}" and data = "${req.body.data}")`
  }
  
  var array_objetos = [];

  console.log(`select distinct e.*
  from espaco_esportivo e left join funcionamento f
  on e.id = f.espaco_esportivo_id
  where e.situacao = 1 
  ${sql_modalidade}
  ${sql_cidade}
  ${sql_semana_hora}
  ${sql_semana}
  ${sql_disponivel}
  ;`)

  connection.query(
    `select distinct e.*
  from espaco_esportivo e left join funcionamento f
  on e.id = f.espaco_esportivo_id
  where e.situacao = 1 
  ${sql_modalidade}
  ${sql_cidade}
  ${sql_semana_hora}
  ${sql_semana}
  ${sql_disponivel}
  ;`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Nada encontrado",
          mensagem: "Não temos nenhuma modalidade cadastrada no sistema",
        });
      } else {
        for (let i = 0; i < rows.length; i++) {
          array_objetos.push({
            id: rows[i].id,
            foto: rows[i].url_foto,
            titulo: rows[i].titulo,
            endereco: rows[i].endereco,
            tamanho: rows[i].tamanho,
            descricao: rows[i].descricao,
          });
        }

        return res.json({
          cards: array_objetos,
        });
      }
    }
  );
});


// CRIAÇÃO DE EVENTO
// Inserir o novo evento no banco de dados
app.post("/novo_evento", function (req, res) {
  connection.query(
    `INSERT INTO evento VALUES 
    (null, "${req.body.data}", "${req.body.hora_inicio}", "${req.body.hora_final}", "${req.body.descricao}", 0, ${req.body.max_jogadores}, ${req.body.min_jogadores}, "${req.body.data_limite}", ${req.body.modalidade_id}, ${req.body.espaco_id}, ${req.body.criador_id});`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {

        return res.json({
          tipo: "Evento cadastrado",
          mensagem: "Aguarde a confirmação de seu evento pelo proprietário do local",
        });
      }
    }
  );
});

// Participar de um evento
// Procurar modalidade no banco de dados
app.post("/acharModalidade", function (req, res) {
  connection.query(
    `select * 
    from modalidade
    where nome like "${req.body.modalidade}";`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }
    }
  );
});

// Procurar eventos no banco de dados 
app.post("/acharEventos", function (req, res) {
  let sql_modalidade = sql_estado = sql_data = sql_cidade = ""
  if (req.body.modalidade && req.body.modalidade != 'null') {
    sql_modalidade = ` and evento.modalidade_id = ${req.body.modalidade}`
  }
  if (req.body.estado && req.body.estado != "null") {
    sql_estado = ` and e.estado_id = ${req.body.estado}`
  }
  if (req.body.data) {
    sql_data = ` and evento.data like "${req.body.data}"`
  }
  if (req.body.cidade) {
    sql_cidade = ` and e.cidade like "%${req.body.cidade}%"`
  }
  var array_objetos = [];
  console.log(`select distinct evento.*
  from espaco_esportivo e join espaco_esportivo_has_modalidade m join estado join evento
  on e.id = m.espaco_esportivo_id and e.estado_id = estado.id and evento.espaco_esportivo_id = e.id
  where evento.situacao = 1
  ${sql_modalidade}
  ${sql_estado}
  ${sql_data}
  ${sql_cidade};`)

  connection.query(
    `select distinct evento.*
      from espaco_esportivo e join espaco_esportivo_has_modalidade m join estado join evento
      on e.id = m.espaco_esportivo_id and e.estado_id = estado.id and evento.espaco_esportivo_id = e.id
      where e.situacao = 1
      ${sql_modalidade}
      ${sql_estado}
      ${sql_data}
      ${sql_cidade};`,
    (err, rows, fields) => {
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      }

      if (rows[0] == null) {
        return res.json({
          tipo: "Nada encontrado",
          mensagem: "Não temos nenhuma modalidade cadastrada no sistema",
        });
      } else {
        for (let i = 0; i < rows.length; i++) {
          array_objetos.push({
            data: rows[i].data,
            descricao: rows[i].descricao,
            evento: rows[i].id,
          });
        }

        return res.json({
          valores: array_objetos,
        });
      }
    }
  );
});

// Inserir solicitação de participação na tabela evento_has_usuario
app.post("/participar", function (req, res) {
  connection.query(
    `INSERT INTO evento_has_usuario VALUES(null, ${req.body.evento_id}, ${req.body.usuario_id}, 0);`,
    (err, rows, fields) => {

      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        })
      } else {
        return res.json({
          tipo: "Soliciatação de participação enviada",
          mensagem: "Aguarde a confirmação do criador do evento",
        });
      }

    }
  )

})


// Indicador de desempenho 1
app.get("/indDesempenho1", function (req, res) {
  connection.query(
    `select count(proprietario.id) as usuarios_proprietarios, (count(usuario.id) - (select count(proprietario.id))) as usuarios_jogadores
    from usuario left join proprietario on usuario.id = proprietario.usuario_id;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.send(JSON.stringify({
          proprietario: rows[0].usuarios_proprietarios,
          jogador: rows[0].usuarios_jogadores,
        }));
      }
    }
  );
});

// Indicador de desempenho 2
app.get("/indDesempenho2", function (req, res) {

  const arrayMeses = [];
  const arrayEventosMinJogadores = [];


  connection.query(
    `SELECT mes, count(mes) as quantidade_de_eventos
    FROM (
    SELECT month(evento.data) as mes, evento_id, min_jogadores, count(evento_id) AS total_usu, max_jogadores
    FROM evento_has_usuario
    INNER JOIN evento ON evento_has_usuario.evento_id = evento.id
    INNER JOIN usuario ON evento_has_usuario.usuario_id = usuario.id
    where evento_has_usuario.situacao = 1
    GROUP BY evento_id
    having min_jogadores < total_usu
    order by data) as sel_de_dentro
    group by mes;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {

        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {

        for (let j = 0; j < rows.length; j++) {

          arrayEventosMinJogadores.push(rows[j].quantidade_de_eventos);
          arrayMeses.push(rows[j].mes)
        }

        return res.json({
          arrayEventosMinJogadores,
          arrayMeses
        })
      }
    }
  );
});


// Indicador de desempenho 3
app.get("/indDesempenho3", function (req, res) {
  var arrayQntd = [];
  connection.query(
    `select nome, count(evento.id) as quantidade_de_evento_por_modalidade
    from evento right join modalidade on evento.modalidade_id = modalidade.id
    group by modalidade.id
    order by quantidade_de_evento_por_modalidade desc;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {

        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        for (let i = 0; i < rows.length; i++) {
          arrayQntd.push(rows[i].quantidade_de_evento_por_modalidade)
        }

        return res.json({
          arrayQntd
        })
      }
    }
  );
});

// Indicador de desempenho 4
app.get("/indDesempenho4", function (req, res) {
  connection.query(
    `select month(data) as mes, count(id) as num_de_eventos
    from evento
    where evento.situacao = 1
    group by mes;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.send(JSON.stringify({
          mes: rows[0].mes,
          nEventos: rows[0].num_de_eventos,
        }));
      }
    }
  );
});

// Indicador de desempenho 5
app.get("/indDesempenho5", function (req, res) {
  connection.query(
    `SELECT mes, count(mes) as quantidade_de_eventos
    FROM (
    SELECT month(evento.data) as mes, evento_id, min_jogadores, count(evento_id) AS total_usu, max_jogadores
    FROM evento_has_usuario
    INNER JOIN evento ON evento_has_usuario.evento_id = evento.id
    INNER JOIN usuario ON evento_has_usuario.usuario_id = usuario.id
    where evento_has_usuario.situacao = 1
    GROUP BY evento_id
    having min_jogadores < total_usu
    order by data) as sel_de_dentro
    group by mes;`,
    (err, rows, fields) => {
      // Operação simples para testar o funcionamento
      if (err) {
        return res.json({
          tipo: "Erro",
          mensagem: err,
        });
      } else {
        return res.send(JSON.stringify({
          mes: rows[0].mes,
          nEventos: rows[0].quantidade_de_eventos,
        }));
      }
    }
  );
});


// ------------------------------------------------------------------------------------------------ //

/* INICIAR SERVIDOR NODE*/

app.listen(3303, () => {
  console.log("Servidor inicializado!");
});

// Finaliza a conexão
//connection.end()
