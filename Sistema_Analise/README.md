# 🔬 Sistema de Análise de Questionários - Projeto Stress e Menacme

Este sistema foi desenvolvido para processar automaticamente os dados coletados através dos Google Forms sobre estresse e sintomas da menopausa, gerando diagnósticos personalizados para cada participante.

## 📋 Características Principais

- ✅ **Processamento Automático**: Lê planilhas Excel exportadas do Google Forms
- 📊 **Análise de Estresse**: Calcula níveis de estresse baseado em escalas validadas
- 🌸 **Análise de Menacme**: Identifica fase da menopausa e sintomas relacionados
- 🎯 **Diagnósticos Personalizados**: Gera relatórios individuais com recomendações específicas
- 📈 **Relatórios Estatísticos**: Exporta dados processados em formatos Excel e JSON
- 🔗 **Análise Integrada**: Combina resultados de estresse e menacme para insights mais completos

## 🚀 Como Usar

### 1. Preparação do Ambiente

```bash
# Instalar dependências
pip install -r requirements.txt
```

### 2. Preparar os Dados

1. Exporte as respostas dos Google Forms como Excel (.xlsx)
2. Coloque os arquivos na pasta `dados_entrada/` com os nomes:
   - `questionario_estresse.xlsx` - Para o questionário de estresse
   - `questionario_menacme.xlsx` - Para o questionário de menacme

### 3. Executar o Sistema

```bash
python main.py
```

## 📁 Estrutura do Projeto

```
Sistema_Analise/
├── main.py                     # Script principal
├── processador_questionarios.py # Processamento dos dados
├── gerador_diagnosticos.py     # Geração de diagnósticos
├── config.json                 # Configurações do sistema
├── requirements.txt            # Dependências Python
├── README.md                   # Este arquivo
├── dados_entrada/              # Planilhas Excel do Google Forms
├── resultados/                 # Dados processados (Excel/JSON)
└── diagnosticos/               # Relatórios individuais gerados
```

## 📊 Formato dos Dados de Entrada

### Questionário de Estresse
- **Coluna A**: Timestamp
- **Coluna B**: Email do participante
- **Colunas C em diante**: Respostas das perguntas

**Escala esperada:**
- Nunca (0 pontos)
- Quase nunca (1 ponto)
- Às vezes (2 pontos)
- Quase sempre (3 pontos)
- Sempre (4 pontos)

### Questionário de Menacme
- **Coluna A**: Timestamp
- **Coluna B**: Email do participante
- **Colunas C em diante**: Respostas sobre sintomas da menopausa

## 🎯 Níveis de Estresse

| Nível | Pontuação | Cor | Descrição |
|-------|-----------|-----|-----------|
| Baixo | 0-30 | 🟢 Verde | Nível saudável |
| Moderado | 31-60 | 🟡 Amarelo | Requer atenção |
| Alto | 61-90 | 🟠 Laranja | Intervenção necessária |
| Muito Alto | 91-120 | 🔴 Vermelho | Situação crítica |

## 🌸 Fases da Menopausa

- **Pré-menopausa**: Fase reprodutiva normal
- **Perimenopausa**: Transição para a menopausa
- **Pós-menopausa**: Após a menopausa (12+ meses sem menstruação)

## 📄 Arquivos Gerados

### Pasta `resultados/`
- `resultados_completos.json` - Dados completos em formato JSON
- `resultados_estresse.xlsx` - Resultados do questionário de estresse
- `resultados_menacme.xlsx` - Resultados do questionário de menacme
- `resultados_combinados.xlsx` - Resultados integrados

### Pasta `diagnosticos/`
- `diagnostico_[email].md` - Relatório individual para cada participante
- `indice_diagnosticos.json` - Índice de todos os diagnósticos gerados

## 🔧 Personalização

### Modificar Escalas de Pontuação
Edite o arquivo `config.json` na seção `questionarios.estresse.escala`

### Personalizar Templates de Diagnóstico
Modifique os templates no arquivo `gerador_diagnosticos.py`

### Ajustar Critérios de Classificação
Altere os valores em `config.json` na seção `interpretacao`

## 📞 Recursos de Emergência Incluídos

Os diagnósticos incluem automaticamente:
- **CVV**: 188 (24h, gratuito)
- **SAMU**: 192
- **Emergência**: 193

## 🛠️ Dependências

- `pandas` - Manipulação de dados
- `openpyxl` - Leitura/escrita de arquivos Excel
- `jinja2` - Templates para diagnósticos
- `xlrd` - Suporte adicional para Excel
- `matplotlib` - Visualizações (futuras implementações)
- `seaborn` - Gráficos estatísticos
- `fpdf2` - Geração de PDFs (opcional)
- `reportlab` - Relatórios avançados (opcional)

## 🔍 Troubleshooting

### Erro: "Arquivo não encontrado"
- Verifique se os arquivos Excel estão na pasta `dados_entrada/`
- Confirme os nomes dos arquivos: `questionario_estresse.xlsx` e `questionario_menacme.xlsx`

### Erro: "Módulo não encontrado"
```bash
pip install -r requirements.txt
```

### Erro: "Dados inválidos"
- Verifique se as colunas estão no formato esperado
- Confirme se o arquivo não está corrompido
- Teste com uma amostra menor de dados primeiro

## 📈 Exemplo de Uso

```python
from processador_questionarios import ProcessadorQuestionarios
from gerador_diagnosticos import GeradorDiagnosticos

# Inicializar sistema
processador = ProcessadorQuestionarios()

# Processar dados
resultados = processador.processar_todos_questionarios("dados_entrada")

# Gerar diagnósticos
gerador = GeradorDiagnosticos(processador)
diagnosticos = gerador.gerar_todos_diagnosticos("diagnosticos")

print(f"✅ {len(diagnosticos)} diagnósticos gerados!")
```

## 🤝 Contribuição

Para contribuir com melhorias:

1. Identifique áreas de melhoria nos algoritmos de classificação
2. Sugira novos templates de diagnóstico
3. Proponha funcionalidades adicionais
4. Reporte bugs ou problemas encontrados

## ⚠️ Avisos Importantes

- Este sistema **NÃO substitui** consulta médica profissional
- Os diagnósticos são baseados em questionários e devem ser interpretados por profissionais qualificados
- Sempre inclua disclaimers apropriados nos relatórios gerados
- Mantenha a confidencialidade dos dados dos participantes

## 📧 Contato

Para dúvidas técnicas sobre o sistema, consulte a documentação ou entre em contato com a equipe de desenvolvimento do projeto.

---

*Sistema desenvolvido para o Projeto PIBITI - Stress e Menacme*
