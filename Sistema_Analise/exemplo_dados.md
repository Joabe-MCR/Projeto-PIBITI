# Exemplo de Dados para Teste

Este arquivo contém exemplos de como os dados devem estar estruturados nas planilhas Excel exportadas do Google Forms.

## Formato do Google Forms Export

### Questionário de Estresse (questionario_estresse.xlsx)

| Timestamp | Email Address | Pergunta 1 | Pergunta 2 | Pergunta 3 | ... |
|-----------|---------------|------------|------------|------------|-----|
| 2024-08-14 10:30:00 | participante1@email.com | às vezes | nunca | sempre | ... |
| 2024-08-14 11:15:00 | participante2@email.com | quase sempre | às vezes | nunca | ... |

### Questionário de Menacme (questionario_menacme.xlsx)

| Timestamp | Email Address | Sintoma 1 | Sintoma 2 | Sintoma 3 | ... |
|-----------|---------------|-----------|-----------|-----------|-----|
| 2024-08-14 10:35:00 | participante1@email.com | sim, frequente | não | às vezes | ... |
| 2024-08-14 11:20:00 | participante2@email.com | raramente | sim, intenso | não aplicável | ... |

## Palavras-chave Reconhecidas

### Para Estresse:
- "nunca" = 0 pontos
- "quase nunca" = 1 ponto
- "às vezes" = 2 pontos
- "quase sempre" = 3 pontos
- "sempre" = 4 pontos

### Para Menacme:
- "sim", "frequente", "intenso" = sintoma presente
- "não", "nunca", "ausente" = sintoma ausente
- "irregular", "parou" = indicadores de mudanças hormonais

## Criando Dados de Teste

Para testar o sistema, você pode criar arquivos Excel simples com esta estrutura ou usar os scripts de exemplo incluídos.
