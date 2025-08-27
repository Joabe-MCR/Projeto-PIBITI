# Sistema de Dúvidas Anônimas - Projeto PIBITI

## ✅ Sistema Implementado com Sucesso!

O sistema de "Tirar Dúvida" foi completamente implementado e está funcionando. As novas funcionalidades incluem:

### 🎯 Funcionalidades Principais

1. **Tirar Dúvida** - Botão na seção "Perguntas Comuns" que permite envio anônimo de perguntas
2. **Perguntas Respondidas** - Seção que exibe dúvidas já respondidas pela equipe
3. **Notificação por Email** - Sistema envia emails automáticos para os pesquisadores
4. **Interface de Resposta** - Link único para cada pesquisador responder às dúvidas
5. **Gerenciamento CLI** - Ferramentas de linha de comando para gerenciar o sistema

## 🚀 Como Usar

### Para Usuários do Site:

1. Acesse o site principal
2. Vá para a seção "Dúvidas comuns" 
3. Clique em **"Tirar Dúvida"** 
4. Preencha:
   - Categoria da dúvida
   - Sua pergunta (máximo 500 caracteres)
5. Envie anonimamente
6. Para ver respostas, clique em **"Perguntas Respondidas"**

### Para Pesquisadores:

1. **Configurar emails** (primeira vez):
   ```bash
   python gerenciar_duvidas.py config
   ```

2. **Receber notificações**:
   - Emails automáticos com nova dúvida
   - Link único para responder
   
3. **Responder dúvidas**:
   - Clique no link recebido por email
   - OU use o painel de gerenciamento

## ⚙️ Configuração Inicial

### 1. Instalar Dependências

```bash
# Navegar para o diretório
cd "C:\Users\Joabe\Desktop\Projeto PIBITI"

# Configurar ambiente Python (já feito)
# Instalar Flask (já feito)
```

### 2. Configurar Emails dos Pesquisadores

```bash
cd Sistema_Analise
python gerenciar_duvidas.py config
```

Adicione os emails:
- pesquisador1@dominio.com
- pesquisador2@dominio.com

### 3. Iniciar o Sistema

```bash
# Terminal 1 - Iniciar servidor da API
cd Sistema_Analise
& "C:\Users\Joabe\Desktop\Projeto PIBITI\.venv\Scripts\python.exe" api_web.py

# Terminal 2 - Abrir o site (opcional)
# Abra file:///c:/Users/Joabe/Desktop/Projeto%20PIBITI/Site/index.html
```

## 📋 Comandos de Gerenciamento

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

### Responder via Linha de Comando

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

## 🧪 Testar o Sistema

### 1. Criar Dados de Exemplo

```bash
cd Sistema_Analise
python criar_duvidas_exemplo.py
```

### 2. Ver Dúvidas Criadas

```bash
python gerenciar_duvidas.py listar
```

### 3. Testar API

```bash
# Listar dúvidas respondidas
curl http://localhost:5000/api/duvidas/respondidas

# Enviar nova dúvida
curl -X POST http://localhost:5000/api/duvidas/enviar \
  -H "Content-Type: application/json" \
  -d '{"categoria":"estresse","duvida":"Como lidar com ansiedade?"}'
```

### 4. Testar Interface Web

1. Abra o site: `file:///c:/Users/Joabe/Desktop/Projeto%20PIBITI/Site/index.html`
2. Vá para "Dúvidas comuns"
3. Teste "Tirar Dúvida"
4. Teste "Perguntas Respondidas"

## 📁 Estrutura de Arquivos

```
Site/
├── index.html              # ✅ Atualizado com sistema de dúvidas
├── style.css               # ✅ Novos estilos adicionados  
├── script.js               # ✅ Funções JavaScript adicionadas
└── ...

Sistema_Analise/
├── api_web.py              # ✅ API principal com rotas de dúvidas
├── gerenciar_duvidas.py    # ✅ Script de gerenciamento CLI
├── config_duvidas.json     # ✅ Configurações do sistema
├── criar_duvidas_exemplo.py # ✅ Script para dados de teste
├── SISTEMA_DUVIDAS.md      # ✅ Documentação detalhada
├── duvidas/                # ✅ Pasta com arquivos de dúvidas
│   ├── ABC12345_duvida.json
│   └── ...
└── emails_enviados/        # ✅ Log de emails (modo teste)
    └── ...
```

## 🔧 URLs do Sistema

- **Site**: `file:///c:/Users/Joabe/Desktop/Projeto%20PIBITI/Site/index.html`
- **API**: `http://localhost:5000`
- **Dashboard**: `http://localhost:5000/dashboard`
- **Enviar Dúvida**: `POST http://localhost:5000/api/duvidas/enviar`
- **Listar Respondidas**: `GET http://localhost:5000/api/duvidas/respondidas`
- **Responder**: `http://localhost:5000/responder-duvida/{ID}/{TOKEN}`

## ✨ Recursos Implementados

### Frontend (Site):
- ✅ Botão "Tirar Dúvida" na seção perguntas
- ✅ Formulário elegante com validação
- ✅ Contador de caracteres
- ✅ Categorias predefinidas
- ✅ Mensagem de sucesso animada
- ✅ Botão "Perguntas Respondidas"
- ✅ Lista dinâmica de perguntas respondidas
- ✅ Design responsivo
- ✅ Animações e feedback visual

### Backend (API):
- ✅ Rota para receber dúvidas (`POST /api/duvidas/enviar`)
- ✅ Rota para listar respondidas (`GET /api/duvidas/respondidas`)
- ✅ Interface web para responder (`/responder-duvida/{id}/{token}`)
- ✅ Sistema de tokens únicos e seguros
- ✅ Geração automática de IDs
- ✅ Persistência em arquivos JSON
- ✅ Notificações por email (configurável)
- ✅ Validação de dados

### Sistema de Email:
- ✅ Geração automática de notificações
- ✅ Templates HTML elegantes
- ✅ Links únicos para resposta
- ✅ Configuração SMTP flexível
- ✅ Modo de teste (salva em arquivo)

### Gerenciamento:
- ✅ Script CLI completo
- ✅ Listagem e filtros
- ✅ Visualização detalhada
- ✅ Resposta via linha de comando
- ✅ Estatísticas e relatórios
- ✅ Configuração de emails
- ✅ Geração de dados de exemplo

## 🛡️ Segurança

- ✅ Perguntas completamente anônimas
- ✅ Tokens únicos para resposta
- ✅ Não coleta dados pessoais
- ✅ Validação de entrada
- ✅ Acesso restrito às respostas
- ✅ Links temporários seguros

## 📊 Status Atual

**✅ SISTEMA COMPLETAMENTE FUNCIONAL**

- ✅ Interface web implementada
- ✅ API backend funcional  
- ✅ Sistema de emails configurado
- ✅ Gerenciamento CLI operacional
- ✅ Dados de exemplo criados
- ✅ Documentação completa
- ✅ Testes realizados

## 🔄 Próximos Passos

1. **Configurar emails reais dos pesquisadores**:
   ```bash
   python gerenciar_duvidas.py config
   ```

2. **Configurar SMTP para envio automático** (opcional):
   - Editar `config_duvidas.json`
   - Adicionar credenciais do Gmail ou outro provedor

3. **Testar em produção**:
   - Enviar dúvida real através do site
   - Verificar recebimento de email
   - Testar resposta via link

4. **Personalizar conforme necessário**:
   - Ajustar categorias
   - Modificar templates de email
   - Customizar interface

## 📞 Suporte

Em caso de problemas:

1. Verificar se o servidor está rodando
2. Consultar logs no terminal
3. Usar `python gerenciar_duvidas.py stats` para diagnóstico
4. Consultar `SISTEMA_DUVIDAS.md` para documentação detalhada

---

**✅ Sistema implementado com sucesso por GitHub Copilot**
**📅 Data: 27/08/2025**
