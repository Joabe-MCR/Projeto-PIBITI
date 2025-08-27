# Sistema de Dúvidas Anônimas - Projeto PIBITI

## Visão Geral

O Sistema de Dúvidas permite que usuários enviem perguntas anonimamente através do site, que são então enviadas por email aos pesquisadores. Os pesquisadores podem responder através de um link único, e as respostas ficam disponíveis publicamente na seção "Perguntas Respondidas".

## Funcionalidades

### Para Usuários (Site)
- **Tirar Dúvida**: Formulário para enviar perguntas anonimamente
- **Perguntas Respondidas**: Visualização de dúvidas já respondidas pela equipe

### Para Pesquisadores
- **Notificação por Email**: Recebem email com cada nova dúvida
- **Link Único**: Cada dúvida tem um link seguro para resposta
- **Interface Web**: Página dedicada para responder cada dúvida
- **Gerenciamento CLI**: Script para gerenciar dúvidas via linha de comando

## Configuração Inicial

### 1. Configurar Emails dos Pesquisadores

Edite o arquivo `config_duvidas.json`:

```json
{
  "sistema_duvidas": {
    "emails_pesquisadores": [
      "seu.email@dominio.com",
      "outro.pesquisador@dominio.com"
    ]
  }
}
```

Ou use o script de gerenciamento:

```bash
python gerenciar_duvidas.py config
```

### 2. Configurar SMTP (Opcional)

Para envio automático de emails, configure as credenciais SMTP no arquivo `config_duvidas.json`:

```json
{
  "sistema_duvidas": {
    "smtp": {
      "servidor": "smtp.gmail.com",
      "porta": 587,
      "usuario": "seu_email@gmail.com",
      "senha": "sua_senha_app",
      "ativo": true
    }
  }
}
```

**Importante**: Para Gmail, use uma "Senha de App" ao invés da senha normal.

### 3. Iniciar o Servidor

```bash
cd Sistema_Analise
python api_web.py
```

O servidor iniciará na porta 5000.

## Como Funciona

### 1. Usuário Envia Dúvida

1. No site, o usuário clica em "Tirar Dúvida"
2. Preenche categoria e pergunta (máximo 500 caracteres)
3. Envia anonimamente

### 2. Notificação aos Pesquisadores

1. Sistema gera ID único para a dúvida
2. Salva dúvida em arquivo JSON
3. Envia email aos pesquisadores com:
   - Conteúdo da dúvida
   - Link único para resposta
   - Categoria e data

### 3. Pesquisador Responde

1. Clica no link recebido no email
2. Acessa interface web segura
3. Escreve resposta
4. Submete resposta

### 4. Resposta Fica Disponível

1. Sistema marca dúvida como "respondida"
2. Resposta aparece na seção "Perguntas Respondidas"
3. Outros usuários podem ver a pergunta e resposta

## Estrutura de Arquivos

```
Sistema_Analise/
├── api_web.py                 # API principal com rotas do sistema
├── config_duvidas.json        # Configurações do sistema
├── gerenciar_duvidas.py       # Script de gerenciamento CLI
├── duvidas/                   # Pasta com dúvidas recebidas
│   ├── ABC12345_duvida.json   # Arquivo de dúvida individual
│   └── ...
└── emails_enviados/           # Logs de emails (modo teste)
    ├── ABC12345_notificacao.html
    └── ...
```

## Gerenciamento via CLI

O script `gerenciar_duvidas.py` oferece interface de linha de comando:

### Listar Dúvidas

```bash
# Todas as dúvidas
python gerenciar_duvidas.py listar

# Apenas pendentes
python gerenciar_duvidas.py listar --status pendente

# Apenas respondidas
python gerenciar_duvidas.py listar --status respondida
```

### Ver Detalhes de uma Dúvida

```bash
python gerenciar_duvidas.py ver --id ABC12345
```

### Responder via CLI

```bash
python gerenciar_duvidas.py responder --id ABC12345
```

### Gerar Link de Resposta

```bash
python gerenciar_duvidas.py link --id ABC12345
```

### Ver Estatísticas

```bash
python gerenciar_duvidas.py stats
```

### Configurar Emails

```bash
python gerenciar_duvidas.py config
```

## URLs do Sistema

- **Site Principal**: `http://localhost:5000/` (redireciona para dashboard)
- **API Enviar Dúvida**: `POST http://localhost:5000/api/duvidas/enviar`
- **API Listar Respondidas**: `GET http://localhost:5000/api/duvidas/respondidas`
- **Responder Dúvida**: `http://localhost:5000/responder-duvida/{ID}/{TOKEN}`

## Formato dos Dados

### Dúvida (JSON)

```json
{
  "id": "ABC12345",
  "categoria": "estresse",
  "duvida": "Como posso lidar melhor com o estresse no trabalho?",
  "data_envio": "2024-08-27T14:30:00.000Z",
  "status": "pendente",
  "resposta": null,
  "data_resposta": null,
  "respondida_por": null
}
```

### Dúvida Respondida (JSON)

```json
{
  "id": "ABC12345",
  "categoria": "estresse",
  "duvida": "Como posso lidar melhor com o estresse no trabalho?",
  "data_envio": "2024-08-27T14:30:00.000Z",
  "status": "respondida",
  "resposta": "Algumas estratégias eficazes incluem...",
  "data_resposta": "2024-08-27T16:45:00.000Z",
  "respondida_por": "Dr. João Silva"
}
```

## Categorias Disponíveis

- `estresse`: Sobre estresse
- `menacme`: Sobre ciclo menstrual
- `questionarios`: Sobre os questionários
- `pesquisa`: Sobre a pesquisa
- `outros`: Outros assuntos

## Segurança

### Tokens de Resposta

Cada dúvida recebe um token único gerado a partir de:
- ID da dúvida
- Data de envio
- Chave secreta do sistema

### Anonimato

- Não são coletados dados pessoais dos usuários
- Não há logs de IP ou identificação
- Perguntas são completamente anônimas

### Acesso Restrito

- Apenas quem tem o link de resposta pode responder
- Tokens são únicos e não reutilizáveis
- Interface de resposta é isolada do site principal

## Troubleshooting

### Emails Não São Enviados

1. Verifique configurações SMTP em `config_duvidas.json`
2. Confirme que `"ativo": true` no SMTP
3. Para Gmail, use senha de aplicativo
4. Verifique logs do servidor

### Dúvida Não Aparece nas Respondidas

1. Confirme que status é "respondida"
2. Verifique se arquivo JSON está bem formado
3. Teste API: `GET /api/duvidas/respondidas`

### Link de Resposta Não Funciona

1. Verifique se dúvida existe no diretório
2. Confirme se token está correto
3. Teste gerar novo link via CLI

### Formulário Não Envia

1. Verifique se API está rodando na porta 5000
2. Confirme CORS configurado no servidor
3. Verifique console do navegador para erros JavaScript

## Personalização

### Modificar Limite de Caracteres

Edite `config_duvidas.json`:

```json
{
  "sistema_duvidas": {
    "configuracoes": {
      "limite_caracteres": 1000
    }
  }
}
```

### Adicionar Novas Categorias

1. Adicione no HTML (select do formulário)
2. Adicione no JavaScript (função formatarCategoria)
3. Adicione no Python (função render_interface_resposta)

### Personalizar Emails

Modifique a função `enviar_email_notificacao()` em `api_web.py`.

## Integração com Outros Sistemas

### API Endpoints

O sistema expõe APIs REST que podem ser integradas:

```javascript
// Enviar dúvida
fetch('/api/duvidas/enviar', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    categoria: 'estresse',
    duvida: 'Minha pergunta aqui'
  })
})

// Listar respondidas
fetch('/api/duvidas/respondidas')
  .then(r => r.json())
  .then(duvidas => console.log(duvidas))
```

### Webhooks (Futuro)

Possível extensão para notificar outros sistemas quando:
- Nova dúvida é recebida
- Dúvida é respondida
- Estatísticas são atualizadas

## Manutenção

### Backup

Faça backup regular das pastas:
- `duvidas/` - Todas as dúvidas e respostas
- `config_duvidas.json` - Configurações

### Limpeza

Para remover dúvidas antigas:

```bash
# Manual: apague arquivos antigos da pasta duvidas/
# Ou implemente script de limpeza automática
```

### Logs

O sistema registra:
- Emails enviados (pasta `emails_enviados/`)
- Erros no console do servidor
- Acessos aos links de resposta

## Suporte

Para problemas ou dúvidas sobre o sistema:

1. Verifique logs do servidor
2. Use o script CLI para diagnóstico
3. Teste APIs manualmente
4. Consulte esta documentação

---

**Desenvolvido para o Projeto PIBITI - Sistema de Análise de Questionários**
