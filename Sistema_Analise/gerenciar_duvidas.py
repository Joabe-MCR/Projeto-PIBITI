#!/usr/bin/env python3
"""
Gerenciador de Dúvidas - Projeto PIBITI
Script para gerenciar dúvidas enviadas pelos usuários
"""

import json
import os
import sys
import argparse
from datetime import datetime
from typing import List, Dict


class GerenciadorDuvidas:
    def __init__(self):
        self.duvidas_dir = "duvidas"
        self.config_file = "config_duvidas.json"
        self.config = self.carregar_config()

        # Criar diretório se não existir
        os.makedirs(self.duvidas_dir, exist_ok=True)

    def carregar_config(self) -> Dict:
        """Carrega configurações do arquivo config"""
        if os.path.exists(self.config_file):
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)

        # Config padrão
        config_padrao = {
            "sistema_duvidas": {
                "emails_pesquisadores": [],
                "smtp": {"ativo": False},
                "configuracoes": {
                    "chave_secreta": "projeto_pibiti_2024",
                    "limite_caracteres": 500,
                    "auto_aprovar": False
                }
            }
        }

        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(config_padrao, f, ensure_ascii=False, indent=2)

        return config_padrao

    def listar_duvidas(self, status: str = None):
        """Lista dúvidas por status"""
        print(f"\n📋 DÚVIDAS RECEBIDAS")
        print("=" * 80)

        duvidas = []

        if not os.path.exists(self.duvidas_dir):
            print("Nenhuma dúvida encontrada.")
            return

        # Carregar todas as dúvidas
        for arquivo in os.listdir(self.duvidas_dir):
            if arquivo.endswith('_duvida.json'):
                try:
                    with open(os.path.join(self.duvidas_dir, arquivo), 'r', encoding='utf-8') as f:
                        duvida = json.load(f)
                        duvidas.append(duvida)
                except Exception as e:
                    print(f"Erro ao carregar {arquivo}: {e}")

        # Filtrar por status se especificado
        if status:
            duvidas = [d for d in duvidas if d.get('status') == status]

        if not duvidas:
            status_msg = f" com status '{status}'" if status else ""
            print(f"Nenhuma dúvida encontrada{status_msg}.")
            return

        # Ordenar por data
        duvidas.sort(key=lambda x: x.get('data_envio', ''), reverse=True)

        # Exibir dúvidas
        for i, duvida in enumerate(duvidas, 1):
            status_icon = "✅" if duvida.get('status') == 'respondida' else "⏳"
            categoria = duvida.get('categoria', 'N/A').upper()
            data_envio = self.formatar_data(duvida.get('data_envio'))

            print(
                f"\n{i}. {status_icon} [{categoria}] ID: {duvida.get('id', 'N/A')}")
            print(f"   Data: {data_envio}")
            print(
                f"   Pergunta: \"{duvida.get('duvida', '')[:100]}{'...' if len(duvida.get('duvida', '')) > 100 else ''}\"")

            if duvida.get('status') == 'respondida':
                data_resposta = self.formatar_data(duvida.get('data_resposta'))
                autor = duvida.get('respondida_por', 'N/A')
                print(f"   Respondida em: {data_resposta} por {autor}")

    def ver_duvida(self, duvida_id: str):
        """Exibe detalhes de uma dúvida específica"""
        arquivo = os.path.join(self.duvidas_dir, f"{duvida_id}_duvida.json")

        if not os.path.exists(arquivo):
            print(f"❌ Dúvida com ID '{duvida_id}' não encontrada.")
            return

        try:
            with open(arquivo, 'r', encoding='utf-8') as f:
                duvida = json.load(f)

            print(f"\n📋 DETALHES DA DÚVIDA")
            print("=" * 80)
            print(f"ID: {duvida.get('id')}")
            print(f"Categoria: {duvida.get('categoria', 'N/A').upper()}")
            print(f"Status: {duvida.get('status', 'N/A').upper()}")
            print(
                f"Data de envio: {self.formatar_data(duvida.get('data_envio'))}")

            print(f"\nPERGUNTA:")
            print(f"\" {duvida.get('duvida', 'N/A')} \"")

            if duvida.get('status') == 'respondida' and duvida.get('resposta'):
                print(f"\nRESPOSTA:")
                print(f"Autor: {duvida.get('respondida_por', 'N/A')}")
                print(
                    f"Data: {self.formatar_data(duvida.get('data_resposta'))}")
                print(f"\" {duvida.get('resposta')} \"")

            # Mostrar link de resposta se pendente
            if duvida.get('status') == 'pendente':
                token = self.gerar_token(duvida)
                print(f"\n🔗 LINK PARA RESPONDER:")
                print(
                    f"http://localhost:5000/responder-duvida/{duvida_id}/{token}")

        except Exception as e:
            print(f"❌ Erro ao carregar dúvida: {e}")

    def gerar_link_resposta(self, duvida_id: str):
        """Gera link para responder uma dúvida"""
        arquivo = os.path.join(self.duvidas_dir, f"{duvida_id}_duvida.json")

        if not os.path.exists(arquivo):
            print(f"❌ Dúvida com ID '{duvida_id}' não encontrada.")
            return

        try:
            with open(arquivo, 'r', encoding='utf-8') as f:
                duvida = json.load(f)

            token = self.gerar_token(duvida)
            link = f"http://localhost:5000/responder-duvida/{duvida_id}/{token}"

            print(f"\n🔗 Link para responder a dúvida:")
            print(f"ID: {duvida_id}")
            print(f"Categoria: {duvida.get('categoria', 'N/A').upper()}")
            print(f"Link: {link}")

            return link

        except Exception as e:
            print(f"❌ Erro ao gerar link: {e}")

    def gerar_token(self, duvida: Dict) -> str:
        """Gera token único para resposta"""
        import hashlib
        chave = self.config.get('sistema_duvidas', {}).get(
            'configuracoes', {}).get('chave_secreta', 'projeto_pibiti_2024')
        token_data = f"{duvida['id']}{duvida['data_envio']}{chave}"
        return hashlib.sha256(token_data.encode()).hexdigest()[:32]

    def responder_duvida_cli(self, duvida_id: str):
        """Interface de linha de comando para responder dúvida"""
        arquivo = os.path.join(self.duvidas_dir, f"{duvida_id}_duvida.json")

        if not os.path.exists(arquivo):
            print(f"❌ Dúvida com ID '{duvida_id}' não encontrada.")
            return

        try:
            with open(arquivo, 'r', encoding='utf-8') as f:
                duvida = json.load(f)

            if duvida.get('status') == 'respondida':
                print(f"⚠️  Esta dúvida já foi respondida.")
                return

            # Mostrar pergunta
            print(f"\n📋 RESPONDER DÚVIDA")
            print("=" * 80)
            print(f"Categoria: {duvida.get('categoria', 'N/A').upper()}")
            print(f"Pergunta: \"{duvida.get('duvida')}\"")
            print(f"Data: {self.formatar_data(duvida.get('data_envio'))}")
            print("-" * 80)

            # Coletar resposta
            print("\nDigite sua resposta (pressione Enter duas vezes para finalizar):")
            linhas = []
            linha_vazia_count = 0

            while True:
                linha = input()
                if linha.strip() == "":
                    linha_vazia_count += 1
                    if linha_vazia_count >= 2:
                        break
                else:
                    linha_vazia_count = 0
                linhas.append(linha)

            resposta = "\n".join(linhas).strip()

            if not resposta:
                print("❌ Resposta não pode estar vazia.")
                return

            # Coletar autor
            autor = input(
                "\nSeu nome (opcional, pressione Enter para 'Equipe de pesquisa'): ").strip()
            if not autor:
                autor = "Equipe de pesquisa"

            # Confirmar
            print(f"\n📝 CONFIRMAR RESPOSTA:")
            print(f"Autor: {autor}")
            print(
                f"Resposta: \"{resposta[:100]}{'...' if len(resposta) > 100 else ''}\"")

            confirmar = input("\nConfirmar resposta? (s/N): ").strip().lower()

            if confirmar == 's':
                # Salvar resposta
                duvida['resposta'] = resposta
                duvida['status'] = 'respondida'
                duvida['data_resposta'] = datetime.now().isoformat()
                duvida['respondida_por'] = autor

                with open(arquivo, 'w', encoding='utf-8') as f:
                    json.dump(duvida, f, ensure_ascii=False, indent=2)

                print("✅ Resposta salva com sucesso!")
            else:
                print("❌ Resposta cancelada.")

        except Exception as e:
            print(f"❌ Erro ao responder dúvida: {e}")

    def estatisticas(self):
        """Exibe estatísticas das dúvidas"""
        print(f"\n📊 ESTATÍSTICAS DAS DÚVIDAS")
        print("=" * 80)

        if not os.path.exists(self.duvidas_dir):
            print("Nenhuma dúvida registrada ainda.")
            return

        total = 0
        pendentes = 0
        respondidas = 0
        categorias = {}

        for arquivo in os.listdir(self.duvidas_dir):
            if arquivo.endswith('_duvida.json'):
                try:
                    with open(os.path.join(self.duvidas_dir, arquivo), 'r', encoding='utf-8') as f:
                        duvida = json.load(f)

                    total += 1

                    status = duvida.get('status', 'pendente')
                    if status == 'respondida':
                        respondidas += 1
                    else:
                        pendentes += 1

                    categoria = duvida.get('categoria', 'outros')
                    categorias[categoria] = categorias.get(categoria, 0) + 1

                except Exception as e:
                    print(f"Erro ao processar {arquivo}: {e}")

        print(f"Total de dúvidas: {total}")
        print(f"Pendentes: {pendentes}")
        print(f"Respondidas: {respondidas}")

        if total > 0:
            porcentagem = (respondidas / total) * 100
            print(f"Taxa de resposta: {porcentagem:.1f}%")

        if categorias:
            print(f"\nPor categoria:")
            for categoria, count in sorted(categorias.items()):
                print(f"  {categoria.capitalize()}: {count}")

    def configurar_emails(self):
        """Configura emails dos pesquisadores"""
        print(f"\n📧 CONFIGURAÇÃO DE EMAILS")
        print("=" * 80)

        emails_atuais = self.config.get(
            'sistema_duvidas', {}).get('emails_pesquisadores', [])

        if emails_atuais:
            print("Emails atuais:")
            for i, email in enumerate(emails_atuais, 1):
                print(f"  {i}. {email}")
        else:
            print("Nenhum email configurado.")

        print("\nOpções:")
        print("1. Adicionar email")
        print("2. Remover email")
        print("3. Limpar todos")
        print("0. Voltar")

        opcao = input("\nEscolha uma opção: ").strip()

        if opcao == '1':
            email = input("Digite o email para adicionar: ").strip()
            if email and '@' in email:
                if 'sistema_duvidas' not in self.config:
                    self.config['sistema_duvidas'] = {}
                if 'emails_pesquisadores' not in self.config['sistema_duvidas']:
                    self.config['sistema_duvidas']['emails_pesquisadores'] = []

                if email not in self.config['sistema_duvidas']['emails_pesquisadores']:
                    self.config['sistema_duvidas']['emails_pesquisadores'].append(
                        email)
                    self.salvar_config()
                    print(f"✅ Email '{email}' adicionado.")
                else:
                    print(f"⚠️  Email '{email}' já existe.")
            else:
                print("❌ Email inválido.")

        elif opcao == '2' and emails_atuais:
            try:
                indice = int(
                    input("Digite o número do email para remover: ")) - 1
                if 0 <= indice < len(emails_atuais):
                    email_removido = emails_atuais.pop(indice)
                    self.salvar_config()
                    print(f"✅ Email '{email_removido}' removido.")
                else:
                    print("❌ Número inválido.")
            except ValueError:
                print("❌ Digite um número válido.")

        elif opcao == '3':
            confirmar = input(
                "Tem certeza que deseja remover todos os emails? (s/N): ")
            if confirmar.lower() == 's':
                self.config['sistema_duvidas']['emails_pesquisadores'] = []
                self.salvar_config()
                print("✅ Todos os emails foram removidos.")

    def salvar_config(self):
        """Salva configurações no arquivo"""
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, ensure_ascii=False, indent=2)

    def formatar_data(self, data_iso: str) -> str:
        """Formata data ISO para exibição"""
        if not data_iso:
            return "N/A"

        try:
            data = datetime.fromisoformat(data_iso.replace('Z', '+00:00'))
            return data.strftime('%d/%m/%Y às %H:%M')
        except:
            return data_iso


def main():
    parser = argparse.ArgumentParser(
        description='Gerenciador de Dúvidas - Projeto PIBITI')
    parser.add_argument('comando', nargs='?', choices=['listar', 'ver', 'responder', 'link', 'stats', 'config'],
                        help='Comando a executar')
    parser.add_argument('--id', help='ID da dúvida')
    parser.add_argument(
        '--status', choices=['pendente', 'respondida'], help='Filtrar por status')

    args = parser.parse_args()

    gerenciador = GerenciadorDuvidas()

    if args.comando == 'listar' or not args.comando:
        gerenciador.listar_duvidas(args.status)

    elif args.comando == 'ver':
        if not args.id:
            print("❌ ID da dúvida é obrigatório. Use --id ID_DA_DUVIDA")
            return
        gerenciador.ver_duvida(args.id)

    elif args.comando == 'responder':
        if not args.id:
            print("❌ ID da dúvida é obrigatório. Use --id ID_DA_DUVIDA")
            return
        gerenciador.responder_duvida_cli(args.id)

    elif args.comando == 'link':
        if not args.id:
            print("❌ ID da dúvida é obrigatório. Use --id ID_DA_DUVIDA")
            return
        gerenciador.gerar_link_resposta(args.id)

    elif args.comando == 'stats':
        gerenciador.estatisticas()

    elif args.comando == 'config':
        gerenciador.configurar_emails()

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
