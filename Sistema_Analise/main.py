"""
Script principal para executar o sistema de análise de questionários
"""

from gerador_diagnosticos import GeradorDiagnosticos
from processador_questionarios import ProcessadorQuestionarios
import os
import sys
from pathlib import Path

# Adicionar o diretório atual ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


def main():
    """
    Função principal do sistema
    """
    print("=" * 60)
    print("🔬 SISTEMA DE ANÁLISE DE QUESTIONÁRIOS")
    print("   Projeto: Stress e Menacme")
    print("=" * 60)

    try:
        # Inicializar processador
        print("\n📊 Inicializando processador de questionários...")
        processador = ProcessadorQuestionarios()

        # Criar diretórios necessários
        print("📁 Criando estrutura de diretórios...")
        os.makedirs("dados_entrada", exist_ok=True)
        os.makedirs("resultados", exist_ok=True)
        os.makedirs("diagnosticos", exist_ok=True)

        # Verificar se existem arquivos para processar
        arquivos_entrada = os.listdir("dados_entrada")
        if not arquivos_entrada:
            print("\n⚠️  ATENÇÃO: Nenhum arquivo encontrado em 'dados_entrada'")
            print("\n📋 Para usar o sistema:")
            print(
                "1. Coloque os arquivos Excel dos Google Forms na pasta 'dados_entrada'")
            print("2. Nomeie os arquivos como:")
            print("   - questionario_estresse.xlsx (para questionário de estresse)")
            print("   - questionario_menacme.xlsx (para questionário de menacme)")
            print("3. Execute este script novamente")
            return

        print(f"📄 Arquivos encontrados: {len(arquivos_entrada)}")

        # Processar questionários
        print("\n🔄 Processando questionários...")
        resultados = processador.processar_todos_questionarios("dados_entrada")

        # Salvar resultados
        print("💾 Salvando resultados...")
        processador.salvar_resultados("resultados")

        # Gerar diagnósticos
        print("🎯 Gerando diagnósticos personalizados...")
        gerador = GeradorDiagnosticos(processador)
        diagnosticos = gerador.gerar_todos_diagnosticos("diagnosticos")

        # Mostrar estatísticas finais
        print("\n" + "=" * 60)
        print("✅ PROCESSAMENTO CONCLUÍDO COM SUCESSO!")
        print("=" * 60)
        print(
            f"📊 Questionários de estresse processados: {len(resultados['estresse'])}")
        print(
            f"🌸 Questionários de menacme processados: {len(resultados['menacme'])}")
        print(f"🔗 Resultados combinados: {len(resultados['combinados'])}")
        print(f"📋 Diagnósticos gerados: {len(diagnosticos)}")

        print("\n📁 Arquivos gerados:")
        print("   📂 resultados/")
        print("      ├── resultados_completos.json")
        print("      ├── resultados_estresse.xlsx")
        print("      ├── resultados_menacme.xlsx")
        print("      └── resultados_combinados.xlsx")
        print("   📂 diagnosticos/")
        print("      ├── indice_diagnosticos.json")
        for diag in diagnosticos:
            print(f"      └── {diag['arquivo']}")

        print("\n🎉 Sistema executado com sucesso!")

    except Exception as e:
        print(f"\n❌ ERRO durante o processamento: {e}")
        print("\n🔧 Verifique:")
        print("1. Se os arquivos Excel estão no formato correto")
        print("2. Se as dependências estão instaladas (pip install -r requirements.txt)")
        print("3. Se os arquivos não estão corrompidos")

        import traceback
        print(f"\n🐛 Detalhes técnicos do erro:")
        traceback.print_exc()


def verificar_dependencias():
    """
    Verifica se as dependências necessárias estão instaladas
    """
    dependencias = ['pandas', 'openpyxl', 'jinja2']
    faltando = []

    for dep in dependencias:
        try:
            __import__(dep)
        except ImportError:
            faltando.append(dep)

    if faltando:
        print(f"⚠️  Dependências faltando: {', '.join(faltando)}")
        print("📦 Para instalar, execute: pip install -r requirements.txt")
        return False

    return True


if __name__ == "__main__":
    print("🔍 Verificando dependências...")
    if verificar_dependencias():
        print("✅ Todas as dependências estão instaladas!")
        main()
    else:
        print("❌ Instale as dependências antes de continuar.")
