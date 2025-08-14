"""
Script para criar dados de exemplo para testar o sistema
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os


def criar_dados_exemplo():
    """
    Cria arquivos Excel de exemplo para testar o sistema
    """

    # Dados de exemplo para questionário de estresse
    dados_estresse = {
        'Timestamp': [
            datetime.now() - timedelta(days=i) for i in range(5, 0, -1)
        ],
        'Email Address': [
            'participante1@exemplo.com',
            'participante2@exemplo.com',
            'participante3@exemplo.com',
            'participante4@exemplo.com',
            'participante5@exemplo.com'
        ],
        'Com que frequência você se sente nervosa ou estressada?': [
            'às vezes', 'quase sempre', 'nunca', 'sempre', 'quase nunca'
        ],
        'Você tem dificuldade para relaxar?': [
            'sempre', 'às vezes', 'nunca', 'quase sempre', 'quase nunca'
        ],
        'Você se sente irritada facilmente?': [
            'quase sempre', 'às vezes', 'quase nunca', 'sempre', 'nunca'
        ],
        'Você tem dificuldade para dormir?': [
            'às vezes', 'sempre', 'nunca', 'quase sempre', 'às vezes'
        ],
        'Você se sente sobrecarregada?': [
            'quase sempre', 'sempre', 'quase nunca', 'às vezes', 'nunca'
        ],
        'Você sente tensão muscular?': [
            'às vezes', 'quase sempre', 'nunca', 'sempre', 'quase nunca'
        ],
        'Você tem problemas de concentração?': [
            'sempre', 'às vezes', 'quase nunca', 'quase sempre', 'nunca'
        ],
        'Você se sente ansiosa?': [
            'quase sempre', 'sempre', 'nunca', 'às vezes', 'quase nunca'
        ],
        'Você tem mudanças de humor frequentes?': [
            'às vezes', 'quase sempre', 'nunca', 'sempre', 'às vezes'
        ],
        'Você se sente cansada constantemente?': [
            'sempre', 'quase sempre', 'quase nunca', 'às vezes', 'nunca'
        ]
    }

    # Dados de exemplo para questionário de menacme
    dados_menacme = {
        'Timestamp': [
            datetime.now() - timedelta(days=i, hours=1) for i in range(5, 0, -1)
        ],
        'Email Address': [
            'participante1@exemplo.com',
            'participante2@exemplo.com',
            'participante3@exemplo.com',
            'participante4@exemplo.com',
            'participante5@exemplo.com'
        ],
        'Você experiencia ondas de calor?': [
            'sim, frequentemente', 'às vezes', 'raramente', 'sim, muito intensas', 'não'
        ],
        'Seus períodos menstruais são irregulares?': [
            'sim, muito irregular', 'não', 'às vezes', 'pararam completamente', 'regulares'
        ],
        'Você tem problemas para dormir relacionados a suores noturnos?': [
            'sim, frequente', 'não', 'ocasionalmente', 'sim, intenso', 'raramente'
        ],
        'Você experiencia mudanças de humor intensas?': [
            'sim, frequente', 'às vezes', 'não', 'sim, muito intensas', 'raramente'
        ],
        'Você sente secura vaginal?': [
            'sim', 'não', 'às vezes', 'sim, intenso', 'não aplicável'
        ],
        'Você tem diminuição da libido?': [
            'sim, significativa', 'não', 'às vezes', 'sim', 'não notei mudança'
        ],
        'Você experiencia fadiga extrema?': [
            'sim, frequente', 'às vezes', 'raramente', 'sim, constante', 'não'
        ],
        'Você tem problemas de concentração e memória?': [
            'sim, frequente', 'não', 'às vezes', 'sim, significativo', 'raramente'
        ],
        'Você sente dores articulares?': [
            'sim', 'não', 'às vezes', 'sim, frequente', 'raramente'
        ],
        'Você tem ganho de peso inexplicável?': [
            'sim', 'não', 'pouco', 'sim, significativo', 'perdi peso'
        ]
    }

    # Criar DataFrames
    df_estresse = pd.DataFrame(dados_estresse)
    df_menacme = pd.DataFrame(dados_menacme)

    # Salvar arquivos Excel
    os.makedirs('dados_entrada', exist_ok=True)

    df_estresse.to_excel(
        'dados_entrada/questionario_estresse.xlsx', index=False)
    df_menacme.to_excel('dados_entrada/questionario_menacme.xlsx', index=False)

    print("✅ Arquivos de exemplo criados com sucesso!")
    print("📁 Arquivos salvos em:")
    print("   - dados_entrada/questionario_estresse.xlsx")
    print("   - dados_entrada/questionario_menacme.xlsx")
    print("\n🚀 Agora você pode executar: python main.py")


if __name__ == "__main__":
    print("🔧 Criando dados de exemplo para teste...")
    criar_dados_exemplo()
