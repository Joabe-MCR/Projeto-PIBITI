# Guia de Instalação e Uso - Sistema de Análise

## 🐍 Ambiente Virtual Python

Este projeto usa um ambiente virtual Python para gerenciar as dependências. Siga os passos abaixo:

### 1. Ativação do Ambiente Virtual (Windows PowerShell)

```powershell
# Navegue até a pasta do projeto
cd "c:\Users\Joabe\Desktop\Projeto PIBITI"

# Ative o ambiente virtual
.\.venv\Scripts\Activate.ps1
```

### 2. Verificar se o ambiente está ativo

Após ativar, você deve ver `(.venv)` no início da linha de comando.

### 3. Executar os scripts

Com o ambiente ativo, você pode executar os scripts normalmente:

```powershell
# Navegar para a pasta do sistema
cd Sistema_Analise

# Executar o processador
python processador_questionarios.py

# Ou executar o main
python main.py
```

### 4. Instalar dependências (se necessário)

```powershell
pip install -r requirements.txt
```

## 📦 Dependências Instaladas

- **pandas** (2.3.1) - Manipulação de dados
- **numpy** (2.3.2) - Operações numéricas  
- **jinja2** (3.1.6) - Templates para relatórios
- **openpyxl** (3.1.5) - Leitura/escrita de arquivos Excel
- **xlrd** (2.0.1) - Leitura de arquivos Excel antigos
- **matplotlib** (3.8.2) - Gráficos e visualizações
- **seaborn** (0.13.0) - Gráficos estatísticos
- **fpdf2** (2.7.6) - Geração de PDFs
- **reportlab** (4.0.7) - Relatórios avançados em PDF

## 🚀 Uso Rápido

1. Coloque seus arquivos Excel em `Sistema_Analise/dados_entrada/`
2. Execute: `python main.py`
3. Verifique os resultados em `Sistema_Analise/resultados/`

## 🔧 Solução de Problemas

### Problema: "ModuleNotFoundError"
**Solução:** Certifique-se de que o ambiente virtual está ativo.

### Problema: Ambiente virtual não ativa
**Solução:** Execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Problema: Bibliotecas não encontradas
**Solução:** Reinstale as dependências: `pip install -r requirements.txt`
