#!/usr/bin/env python3
"""
Criar Dados de Exemplo para Sistema de Dúvidas
Script para gerar dúvidas de exemplo para testar o sistema
"""

import json
import os
import uuid
from datetime import datetime, timedelta


def criar_duvidas_exemplo():
    """Cria dúvidas de exemplo para teste"""

    duvidas_dir = "duvidas"
    os.makedirs(duvidas_dir, exist_ok=True)

    # Exemplos de dúvidas
    exemplos = [
        {
            "categoria": "estresse",
            "duvida": "Tenho sentido muito estresse ultimamente, principalmente no trabalho. Isso pode estar afetando meu ciclo menstrual?",
            "dias_atras": 5,
            "respondida": True,
            "resposta": "Sim, o estresse pode definitivamente afetar o ciclo menstrual. O estresse prolongado pode causar alterações hormonais que levam a irregularidades menstruais, ciclos mais longos ou mais curtos, e até mesmo amenorreia em casos extremos. Recomendamos técnicas de relaxamento como meditação, exercícios regulares e, se necessário, buscar ajuda profissional.",
            "autor": "Dra. Maria Santos"
        },
        {
            "categoria": "questionarios",
            "duvida": "Quanto tempo leva para responder todos os questionários? É muito demorado?",
            "dias_atras": 3,
            "respondida": True,
            "resposta": "Os questionários foram desenvolvidos para serem respondidos em aproximadamente 15-20 minutos no total. Eles são divididos em seções que podem ser pausadas e retomadas. O importante é responder com honestidade para obtermos dados precisos para sua análise personalizada.",
            "autor": "Equipe de pesquisa"
        },
        {
            "categoria": "menacme",
            "duvida": "Meu ciclo sempre foi irregular. Os questionários ainda podem me ajudar a entender melhor meu corpo?",
            "dias_atras": 7,
            "respondida": True,
            "resposta": "Absolutamente! Nossos questionários são especificamente desenhados para mulheres com diferentes padrões de ciclo menstrual. Ciclos irregulares são mais comuns do que se pensa, e nosso sistema pode ajudar a identificar padrões e fatores que podem estar influenciando essas irregularidades, incluindo o estresse.",
            "autor": "Dr. Antônio Mateus"
        },
        {
            "categoria": "pesquisa",
            "duvida": "Posso confiar que meus dados serão mantidos em sigilo? Como vocês garantem a privacidade?",
            "dias_atras": 2,
            "respondida": True,
            "resposta": "Sim, garantimos total confidencialidade. Todos os dados são anonimizados e utilizados apenas para fins de pesquisa científica. Seguimos rigorosamente as normas éticas de pesquisa e LGPD. Não compartilhamos informações pessoais com terceiros e você pode retirar sua participação a qualquer momento.",
            "autor": "Prof. Demétrio Gonçalves"
        },
        {
            "categoria": "estresse",
            "duvida": "Quais são as melhores técnicas de relaxamento que vocês recomendam?",
            "dias_atras": 1,
            "respondida": False
        },
        {
            "categoria": "outros",
            "duvida": "Existe algum aplicativo ou ferramenta que vocês recomendam para acompanhar os sintomas?",
            "dias_atras": 4,
            "respondida": False
        }
    ]

    print("🏗️  Criando dúvidas de exemplo...")

    for i, exemplo in enumerate(exemplos):
        # Gerar ID único
        duvida_id = str(uuid.uuid4())[:8]

        # Calcular data de envio
        data_envio = datetime.now() - timedelta(days=exemplo["dias_atras"])

        # Criar estrutura da dúvida
        duvida_data = {
            "id": duvida_id,
            "categoria": exemplo["categoria"],
            "duvida": exemplo["duvida"],
            "data_envio": data_envio.isoformat(),
            "status": "respondida" if exemplo["respondida"] else "pendente",
            "resposta": exemplo.get("resposta"),
            "data_resposta": (data_envio + timedelta(hours=2, minutes=30)).isoformat() if exemplo["respondida"] else None,
            "respondida_por": exemplo.get("autor", "Equipe de pesquisa") if exemplo["respondida"] else None
        }

        # Salvar arquivo
        arquivo_duvida = os.path.join(duvidas_dir, f"{duvida_id}_duvida.json")
        with open(arquivo_duvida, 'w', encoding='utf-8') as f:
            json.dump(duvida_data, f, ensure_ascii=False, indent=2)

        status = "✅ Respondida" if exemplo["respondida"] else "⏳ Pendente"
        print(
            f"  {i+1}. [{exemplo['categoria'].upper()}] {status} - ID: {duvida_id}")

    print(f"\n✅ {len(exemplos)} dúvidas de exemplo criadas!")
    print(f"📁 Arquivos salvos em: {duvidas_dir}/")
    print("\n💡 Para testar:")
    print("   - Inicie o servidor: python api_web.py")
    print("   - Abra o site e vá para 'Perguntas Respondidas'")
    print("   - Use: python gerenciar_duvidas.py listar")


if __name__ == "__main__":
    criar_duvidas_exemplo()
