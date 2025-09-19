from processador_questionarios import ProcessadorQuestionarios
from jinja2 import Template
import os
from datetime import datetime
import json
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class GeradorDiagnosticos:
    """
    Classe para gerar diagnósticos personalizados baseados nos resultados dos questionários
    """

    def __init__(self, processador: ProcessadorQuestionarios):
        """
        Inicializa o gerador de diagnósticos

        Args:
            processador: Instância do ProcessadorQuestionarios
        """
        self.processador = processador
        self.templates = self.carregar_templates()

    def carregar_templates(self) -> Dict[str, str]:
        """
        Carrega templates de diagnósticos

        Returns:
            Dicionário com templates de diagnósticos
        """
        return {
            "estresse_baixo": """
## 🟢 Diagnóstico de Estresse: BAIXO

Parabéns! Seus níveis de estresse estão em uma faixa saudável. 

**Sua pontuação:** {{pontuacao}}/120 pontos

### ✅ Pontos Positivos:
- Você demonstra bom controle emocional
- Capacidade adequada de lidar com pressões do dia a dia
- Baixo risco de desenvolver problemas relacionados ao estresse

### 💡 Recomendações para Manter:
- Continue praticando atividades relaxantes
- Mantenha uma rotina de exercícios regulares
- Preserve seus momentos de lazer e descanso
- Pratique técnicas de respiração quando necessário

### 📞 Quando Procurar Ajuda:
Se você notar mudanças significativas em seu bem-estar emocional.
            """,

            "estresse_moderado": """
## 🟡 Diagnóstico de Estresse: MODERADO

Seus níveis de estresse estão em uma faixa que merece atenção.

**Sua pontuação:** {{pontuacao}}/120 pontos

### ⚠️ Sinais Identificados:
- Presença de alguns sintomas de estresse
- Possível impacto no bem-estar diário
- Necessidade de estratégias de manejo

### 💡 Recomendações:
- **Exercícios físicos:** 30 minutos, 3x por semana
- **Técnicas de relaxamento:** meditação, yoga ou respiração profunda
- **Organização do tempo:** estabeleça prioridades e prazos realistas
- **Sono adequado:** 7-8 horas por noite
- **Alimentação equilibrada:** evite excesso de cafeína e açúcar

### 📞 Quando Procurar Ajuda:
Se os sintomas piorarem ou interferirem significativamente em suas atividades.
            """,

            "estresse_alto": """
## 🟠 Diagnóstico de Estresse: ALTO

ATENÇÃO: Seus níveis de estresse estão elevados e requerem intervenção.

**Sua pontuação:** {{pontuacao}}/120 pontos

### 🚨 Sinais de Alerta:
- Múltiplos sintomas de estresse presentes
- Provável impacto significativo na qualidade de vida
- Risco aumentado para problemas de saúde

### 🎯 Ações Urgentes Recomendadas:
- **Consulte um profissional:** psicólogo ou médico
- **Reavalie sua rotina:** identifique principais fontes de estresse
- **Técnicas de manejo imediato:** respiração profunda, caminhadas
- **Apoio social:** converse com pessoas de confiança
- **Limite compromissos:** priorize o que é realmente essencial

### 📋 Estratégias Específicas:
- Mindfulness e meditação diária (15-20 min)
- Exercícios físicos regulares (consulte médico antes)
- Evite álcool e substâncias como automedicação
- Estabeleça limites claros entre trabalho e vida pessoal

### 📞 Busque Ajuda Profissional IMEDIATAMENTE se:
- Sentir-se sobrecarregada constantemente
- Tiver pensamentos negativos persistentes
- Apresentar sintomas físicos (dores, insônia, problemas digestivos)
            """,

            "estresse_muito_alto": """
## 🔴 Diagnóstico de Estresse: MUITO ALTO

⚠️ ALERTA MÁXIMO: Seus níveis de estresse estão em uma faixa crítica.

**Sua pontuação:** {{pontuacao}}/120 pontos

### 🚨 SITUAÇÃO CRÍTICA:
- Múltiplos sintomas graves de estresse
- Alto risco para a saúde física e mental
- Impacto severo na qualidade de vida
- **NECESSITA INTERVENÇÃO PROFISSIONAL IMEDIATA**

### 🏥 AÇÕES URGENTES:
1. **PROCURE AJUDA MÉDICA/PSICOLÓGICA HOJE**
2. **Informe familiares/amigos sobre sua situação**
3. **Considere afastamento temporário de atividades estressantes**
4. **Não tome decisões importantes neste momento**

### 🆘 Estratégias de Emergência:
- **Respiração:** 4 segundos inspirando, 4 segurando, 4 expirando
- **Hidratação:** beba água regularmente
- **Contato social:** não se isole
- **Ambiente calmo:** reduza estímulos (ruído, luz forte)

### 📞 CONTATOS DE EMERGÊNCIA:
- **CVV:** 188 (24h, gratuito)
- **SAMU:** 192
- **Emergência:** 193

### ⚡ Não ignore estes sinais. Sua saúde é prioridade!
            """,

            "menacme_template": """
## 🌸 Análise da Fase de Menopausa

**Fase identificada:** {{fase_descricao}}

### 📊 Sintomas Identificados:
{{sintomas_lista}}

### 💡 Informações sobre sua fase:
{{informacoes_fase}}

### 🌿 Recomendações Específicas:
{{recomendacoes_fase}}

### 🏥 Acompanhamento Médico:
É importante manter consultas regulares com ginecologista para monitoramento adequado desta fase da vida.
            """,

            "diagnostico_combinado": """
# 📋 Relatório Diagnóstico Personalizado

**Data:** {{data_diagnostico}}
**ID do Participante:** {{id_participante}}

---

{{diagnostico_estresse}}

---

{{diagnostico_menacme}}

---

## 🔗 Análise Integrada

{{analise_integrada}}

---

## 📞 Recursos de Apoio

### 🏥 Profissionais Recomendados:
- **Psicólogo:** para manejo do estresse e bem-estar emocional
- **Ginecologista:** para acompanhamento da saúde feminina
- **Endocrinologista:** se necessário para questões hormonais

### 📚 Recursos Adicionais:
- **Grupos de apoio:** busque grupos de mulheres na sua região
- **Apps de meditação:** Headspace, Calm, Lojong
- **Atividades físicas:** yoga, pilates, caminhada

### 🆘 Em caso de emergência:
- **CVV:** 188 (24h, gratuito)
- **SAMU:** 192

---

*Este relatório foi gerado automaticamente baseado em suas respostas. Não substitui consulta médica profissional.*
            """
        }

    def gerar_diagnostico_estresse(self, resultado_estresse: Dict) -> str:
        """
        Gera diagnóstico personalizado para estresse

        Args:
            resultado_estresse: Resultado do questionário de estresse

        Returns:
            Diagnóstico formatado
        """
        nivel = resultado_estresse["nivel_estresse"]
        pontuacao = resultado_estresse["pontuacao_total"]

        template_key = f"estresse_{nivel}"
        if template_key not in self.templates:
            template_key = "estresse_moderado"  # fallback

        template = Template(self.templates[template_key])
        return template.render(pontuacao=pontuacao)

    def gerar_diagnostico_menacme(self, resultado_menacme: Dict) -> str:
        """
        Gera diagnóstico personalizado para menacme

        Args:
            resultado_menacme: Resultado do questionário de menacme

        Returns:
            Diagnóstico formatado
        """
        fase = resultado_menacme["fase_menopausa"]
        sintomas = resultado_menacme["sintomas_identificados"]

        # Descrições das fases
        fases_descricao = {
            "pre_menopausa": "Pré-menopausa - Fase reprodutiva",
            "perimenopausa": "Perimenopausa - Transição para a menopausa",
            "pos_menopausa": "Pós-menopausa - Fase não reprodutiva"
        }

        # Informações específicas por fase
        informacoes_fases = {
            "pre_menopausa": """
Você está na fase reprodutiva, mas pode estar começando a notar algumas mudanças sutis.
Esta é uma fase ideal para se preparar para as mudanças futuras.
            """,
            "perimenopausa": """
Você está na fase de transição, que pode durar alguns anos.
É normal experimentar flutuações hormonais e sintomas variados.
Esta fase requer atenção especial ao bem-estar.
            """,
            "pos_menopausa": """
Você já passou pela menopausa (ausência de menstruação por 12 meses consecutivos).
O foco agora é manter a saúde óssea, cardiovascular e o bem-estar geral.
            """
        }

        # Recomendações específicas por fase
        recomendacoes_fases = {
            "pre_menopausa": """
- Mantenha hábitos saudáveis de alimentação e exercício
- Monitore seu ciclo menstrual
- Considere suplementação de cálcio e vitamina D
- Pratique técnicas de relaxamento
            """,
            "perimenopausa": """
- Acompanhamento médico regular
- Considere terapia hormonal se apropriada (consulte médico)
- Técnicas para manejo de ondas de calor
- Atenção especial ao sono e hidratação
- Exercícios de fortalecimento ósseo
            """,
            "pos_menopausa": """
- Foco na prevenção de osteoporose
- Monitoramento cardiovascular regular
- Manutenção de peso saudável
- Atividades que promovam bem-estar mental
- Exames preventivos regulares
            """
        }

        # Formatar lista de sintomas
        sintomas_lista = ""
        if sintomas:
            sintomas_lista = "\n".join(
                [f"- {sintoma}" for sintoma in sintomas])
        else:
            sintomas_lista = "- Nenhum sintoma específico identificado"

        template = Template(self.templates["menacme_template"])
        return template.render(
            fase_descricao=fases_descricao.get(fase, "Fase não identificada"),
            sintomas_lista=sintomas_lista,
            informacoes_fase=informacoes_fases.get(fase, ""),
            recomendacoes_fase=recomendacoes_fases.get(fase, "")
        )

    def gerar_analise_integrada(self, resultado_combinado: Dict) -> str:
        """
        Gera análise integrada combinando estresse e menacme

        Args:
            resultado_combinado: Resultado combinado dos questionários

        Returns:
            Análise integrada
        """
        nivel_estresse = resultado_combinado["estresse"]["nivel"]
        fase_menacme = resultado_combinado["menacme"]["fase"]

        # Análises específicas por combinação
        if nivel_estresse in ["alto", "muito_alto"] and fase_menacme in ["perimenopausa", "pos_menopausa"]:
            return """
### ⚠️ Atenção Especial Necessária

A combinação de altos níveis de estresse com mudanças hormonais da menopausa pode amplificar os sintomas.
É fundamental buscar acompanhamento profissional integrado (ginecologista + psicólogo).

**Estratégias Prioritárias:**
- Terapia hormonal pode ajudar tanto com sintomas da menopausa quanto com o estresse
- Técnicas de mindfulness são especialmente eficazes nesta combinação
- Exercícios físicos regulares ajudam em ambas as condições
- Considere grupos de apoio específicos para mulheres na menopausa
            """

        elif nivel_estresse == "baixo" and fase_menacme == "pre_menopausa":
            return """
### ✅ Situação Favorável

Você está em uma situação privilegiada com baixos níveis de estresse e ainda na fase reprodutiva.
Este é o momento ideal para estabelecer hábitos saudáveis que a ajudarão nas fases futuras.

**Mantenha:**
- Suas estratégias atuais de manejo do estresse
- Hábitos de vida saudáveis
- Acompanhamento médico preventivo
            """

        else:
            return """
### 🔄 Abordagem Integrada Recomendada

Seus resultados sugerem que tanto aspectos hormonais quanto de estresse podem estar interagindo.
Uma abordagem que considere ambos os fatores será mais eficaz.

**Recomendações:**
- Discuta com seu médico como o estresse pode estar afetando seus sintomas hormonais
- Considere técnicas que abordem ambos aspectos (yoga, meditação, exercícios)
- Monitore como mudanças em uma área afetam a outra
            """

    def gerar_diagnostico_completo(self, resultado_combinado: Dict) -> str:
        """
        Gera diagnóstico completo combinando estresse e menacme

        Args:
            resultado_combinado: Resultado combinado dos questionários

        Returns:
            Diagnóstico completo formatado
        """
        # Buscar resultados individuais
        user_id = resultado_combinado["user_id"]
        resultado_estresse = None
        resultado_menacme = None

        for est in self.processador.resultados["estresse"]:
            if est["user_id"] == user_id:
                resultado_estresse = est
                break

        for men in self.processador.resultados["menacme"]:
            if men["user_id"] == user_id:
                resultado_menacme = men
                break

        if not resultado_estresse or not resultado_menacme:
            raise ValueError(
                f"Não foi possível encontrar resultados completos para {user_id}")

        # Gerar diagnósticos individuais
        diagnostico_estresse = self.gerar_diagnostico_estresse(
            resultado_estresse)
        diagnostico_menacme = self.gerar_diagnostico_menacme(resultado_menacme)
        analise_integrada = self.gerar_analise_integrada(resultado_combinado)

        # Gerar diagnóstico completo
        template = Template(self.templates["diagnostico_combinado"])
        return template.render(
            data_diagnostico=datetime.now().strftime("%d/%m/%Y às %H:%M"),
            id_participante=resultado_combinado["id_combinado"],
            diagnostico_estresse=diagnostico_estresse,
            diagnostico_menacme=diagnostico_menacme,
            analise_integrada=analise_integrada
        )

    def gerar_todos_diagnosticos(self, diretorio_saida: str = "diagnosticos"):
        """
        Gera diagnósticos para todos os participantes

        Args:
            diretorio_saida: Diretório para salvar os diagnósticos
        """
        os.makedirs(diretorio_saida, exist_ok=True)

        diagnosticos_gerados = []

        # Gerar diagnósticos combinados
        for resultado_combinado in self.processador.resultados["combinados"]:
            try:
                diagnostico = self.gerar_diagnostico_completo(
                    resultado_combinado)

                # Salvar arquivo individual
                nome_arquivo = f"diagnostico_{resultado_combinado['user_id']}.md"
                caminho_arquivo = os.path.join(diretorio_saida, nome_arquivo)

                with open(caminho_arquivo, 'w', encoding='utf-8') as f:
                    f.write(diagnostico)

                diagnosticos_gerados.append({
                    "user_id": resultado_combinado["user_id"],
                    "arquivo": nome_arquivo,
                    "timestamp": resultado_combinado["timestamp"]
                })

                logger.info(
                    f"Diagnóstico gerado para {resultado_combinado['user_id']}")

            except Exception as e:
                logger.error(
                    f"Erro ao gerar diagnóstico para {resultado_combinado['user_id']}: {e}")

        # Salvar índice de diagnósticos
        with open(os.path.join(diretorio_saida, "indice_diagnosticos.json"), 'w', encoding='utf-8') as f:
            json.dump(diagnosticos_gerados, f, indent=2,
                      ensure_ascii=False, default=str)

        print(
            f"✅ {len(diagnosticos_gerados)} diagnósticos gerados em {diretorio_saida}")
        return diagnosticos_gerados


if __name__ == "__main__":
    # Exemplo de uso
    processador = ProcessadorQuestionarios()

    # Processar questionários
    resultados = processador.processar_todos_questionarios("dados_entrada")

    # Gerar diagnósticos
    gerador = GeradorDiagnosticos(processador)
    gerador.gerar_todos_diagnosticos("diagnosticos")
