"""
Script para instalar dependências da API Web
Execute este script antes de iniciar a API
"""

import subprocess
import sys


def instalar_dependencias():
    """Instala as dependências necessárias para a API"""

    dependencias = [
        'flask',
        'flask-cors',
        'openpyxl',
        'pandas',
        'watchdog'
    ]

    print("🚀 Instalando dependências para API Web do Sistema PIBITI...")
    print("📦 Dependências a instalar:", ", ".join(dependencias))

    for dep in dependencias:
        try:
            print(f"\n📥 Instalando {dep}...")
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", dep])
            print(f"✅ {dep} instalado com sucesso!")
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao instalar {dep}: {e}")
            return False

    print("\n🎉 Todas as dependências foram instaladas com sucesso!")
    print("\n📋 Para iniciar a API, execute:")
    print("   python api_web.py")
    print("\n🌐 A API estará disponível em:")
    print("   http://localhost:5000/dashboard")

    return True


if __name__ == "__main__":
    instalar_dependencias()
