import pandas as pd
import numpy as np
from datetime import datetime
import os
import json
from pathlib import Path
from typing import Dict, List, Tuple, Any
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ProcessadorQuestionarios:
    """
    Classe principal para processar questionários de estresse e menacme
    """

    def __init__(self, config_path: str = "config.json"):
        """
        Inicializa o processador com configurações

        Args:
            config_path: Caminho para o arquivo de configuração
        """
        self.config = self.carregar_configuracao(config_path)
        self.resultados = {}

    def carregar_configuracao(self, config_path: str) -> Dict:
        """
        Carrega configurações do arquivo JSON

        Args:
            config_path: Caminho para o arquivo de configuração

        Returns:
            Dicionário com as configurações
        """
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning(
                f"Arquivo de configuração {config_path} não encontrado. Usando configuração padrão.")
            return self.configuracao_padrao()

    def configuracao_padrao(self) -> Dict:
        """
        Retorna configuração padrão para os questionários

        Returns:
            Dicionário com configuração padrão
        """
        return {
            "questionarios": {
                "estresse": {
                    "arquivo": "questionario_estresse.xlsx",
                    "colunas_perguntas": "B:Z",
                    "escala": {
                        "nunca": 0,
                        "quase nunca": 1,
                        "às vezes": 2,
                        "quase sempre": 3,
                        "sempre": 4
                    },
                    "interpretacao": {
                        "baixo": {"min": 0, "max": 30, "cor": "verde"},
                        "moderado": {"min": 31, "max": 60, "cor": "amarelo"},
                        "alto": {"min": 61, "max": 90, "cor": "laranja"},
                        "muito_alto": {"min": 91, "max": 120, "cor": "vermelho"}
                    }
                },
                "menacme": {
                    "arquivo": "questionario_menacme.xlsx",
                    "colunas_perguntas": "B:Z",
                    "interpretacao": {
                        "pre_menopausa": "Fase pré-menopausa",
                        "perimenopausa": "Fase de perimenopausa",
                        "pos_menopausa": "Fase pós-menopausa"
                    }
                }
            },
            "diretorios": {
                "entrada": "dados_entrada",
                "saida": "resultados",
                "templates": "templates"
            }
        }

    def ler_planilha_excel(self, caminho_arquivo: str, sheet_name: str = None) -> pd.DataFrame:
        """
        Lê dados de uma planilha Excel

        Args:
            caminho_arquivo: Caminho para o arquivo Excel
            sheet_name: Nome da aba (opcional)

        Returns:
            DataFrame com os dados
        """
        try:
            if sheet_name:
                df = pd.read_excel(caminho_arquivo, sheet_name=sheet_name)
            else:
                df = pd.read_excel(caminho_arquivo)

            logger.info(
                f"Planilha {caminho_arquivo} carregada com {len(df)} registros")
            return df

        except Exception as e:
            logger.error(f"Erro ao ler planilha {caminho_arquivo}: {e}")
            raise

    def processar_questionario_estresse(self, df: pd.DataFrame) -> List[Dict]:
        """
        Processa questionário de estresse

        Args:
            df: DataFrame com respostas do questionário

        Returns:
            Lista com resultados processados
        """
        resultados = []
        config_estresse = self.config["questionarios"]["estresse"]
        escala = config_estresse["escala"]
        interpretacao = config_estresse["interpretacao"]

        for index, row in df.iterrows():
            try:
                # Extrair informações básicas
                timestamp = row.iloc[0] if pd.notna(
                    row.iloc[0]) else datetime.now()
                email = row.iloc[1] if len(row) > 1 and pd.notna(
                    row.iloc[1]) else f"participante_{index+1}"

                # Processar respostas (assumindo que começam na coluna 2)
                respostas = []
                pontuacao_total = 0

                for i in range(2, len(row)):
                    resposta = str(row.iloc[i]).lower(
                    ).strip() if pd.notna(row.iloc[i]) else ""

                    # Converter resposta para pontuação
                    pontos = 0
                    for key, value in escala.items():
                        if key in resposta:
                            pontos = value
                            break

                    respostas.append({
                        "pergunta": f"Q{i-1}",
                        "resposta": resposta,
                        "pontos": pontos
                    })
                    pontuacao_total += pontos

                # Determinar nível de estresse
                nivel_estresse = "baixo"
                for nivel, config in interpretacao.items():
                    if config["min"] <= pontuacao_total <= config["max"]:
                        nivel_estresse = nivel
                        break

                resultado = {
                    "id": f"EST_{index+1}",
                    "timestamp": timestamp,
                    "email": email,
                    "respostas": respostas,
                    "pontuacao_total": pontuacao_total,
                    "nivel_estresse": nivel_estresse,
                    "cor_indicativa": interpretacao[nivel_estresse]["cor"],
                    "total_perguntas": len(respostas)
                }

                resultados.append(resultado)
                logger.info(
                    f"Processado questionário de estresse para {email}: {pontuacao_total} pontos - {nivel_estresse}")

            except Exception as e:
                logger.error(f"Erro ao processar linha {index}: {e}")
                continue

        return resultados

    def processar_questionario_menacme(self, df: pd.DataFrame) -> List[Dict]:
        """
        Processa questionário de menacme

        Args:
            df: DataFrame com respostas do questionário

        Returns:
            Lista com resultados processados
        """
        resultados = []

        for index, row in df.iterrows():
            try:
                # Extrair informações básicas
                timestamp = row.iloc[0] if pd.notna(
                    row.iloc[0]) else datetime.now()
                email = row.iloc[1] if len(row) > 1 and pd.notna(
                    row.iloc[1]) else f"participante_{index+1}"

                # Processar respostas específicas do menacme
                respostas = []
                sintomas_menacme = []

                for i in range(2, len(row)):
                    resposta = str(row.iloc[i]).strip(
                    ) if pd.notna(row.iloc[i]) else ""
                    respostas.append({
                        "pergunta": f"M{i-1}",
                        "resposta": resposta
                    })

                    # Identificar sintomas (você pode personalizar esta lógica)
                    if any(palavra in resposta.lower() for palavra in ["sim", "frequente", "intenso"]):
                        sintomas_menacme.append(f"M{i-1}")

                # Determinar fase da menopausa (lógica personalizada)
                fase_menopausa = self.determinar_fase_menopausa(respostas)

                resultado = {
                    "id": f"MEN_{index+1}",
                    "timestamp": timestamp,
                    "email": email,
                    "respostas": respostas,
                    "sintomas_identificados": sintomas_menacme,
                    "fase_menopausa": fase_menopausa,
                    "total_perguntas": len(respostas)
                }

                resultados.append(resultado)
                logger.info(
                    f"Processado questionário de menacme para {email}: {fase_menopausa}")

            except Exception as e:
                logger.error(f"Erro ao processar linha {index}: {e}")
                continue

        return resultados

    def determinar_fase_menopausa(self, respostas: List[Dict]) -> str:
        """
        Determina a fase da menopausa baseada nas respostas

        Args:
            respostas: Lista de respostas do questionário

        Returns:
            Fase da menopausa identificada
        """
        # Lógica personalizada para determinar a fase
        # Você pode ajustar esta lógica conforme seus critérios específicos

        sintomas_intensos = 0
        irregularidade_menstrual = False

        for resposta in respostas:
            texto = resposta["resposta"].lower()

            if any(palavra in texto for palavra in ["muito frequente", "intenso", "severo"]):
                sintomas_intensos += 1

            if any(palavra in texto for palavra in ["irregular", "parou", "ausente"]):
                irregularidade_menstrual = True

        if sintomas_intensos >= 5 and irregularidade_menstrual:
            return "pos_menopausa"
        elif sintomas_intensos >= 3:
            return "perimenopausa"
        else:
            return "pre_menopausa"

    def combinar_resultados(self, resultado_estresse: Dict, resultado_menacme: Dict) -> Dict:
        """
        Combina resultados de estresse e menacme para um mesmo participante

        Args:
            resultado_estresse: Resultado do questionário de estresse
            resultado_menacme: Resultado do questionário de menacme

        Returns:
            Resultado combinado
        """
        return {
            "id_combinado": f"COMB_{resultado_estresse['id']}_{resultado_menacme['id']}",
            "email": resultado_estresse["email"],
            "timestamp": max(resultado_estresse["timestamp"], resultado_menacme["timestamp"]),
            "estresse": {
                "pontuacao": resultado_estresse["pontuacao_total"],
                "nivel": resultado_estresse["nivel_estresse"],
                "cor": resultado_estresse["cor_indicativa"]
            },
            "menacme": {
                "fase": resultado_menacme["fase_menopausa"],
                "sintomas": resultado_menacme["sintomas_identificados"]
            }
        }

    def processar_todos_questionarios(self, diretorio_entrada: str) -> Dict:
        """
        Processa todos os questionários encontrados no diretório

        Args:
            diretorio_entrada: Diretório com os arquivos Excel

        Returns:
            Dicionário com todos os resultados
        """
        resultados = {
            "estresse": [],
            "menacme": [],
            "combinados": []
        }

        # Processar questionários de estresse
        arquivo_estresse = os.path.join(
            diretorio_entrada, "questionario_estresse.xlsx")
        if os.path.exists(arquivo_estresse):
            df_estresse = self.ler_planilha_excel(arquivo_estresse)
            resultados["estresse"] = self.processar_questionario_estresse(
                df_estresse)

        # Processar questionários de menacme
        arquivo_menacme = os.path.join(
            diretorio_entrada, "questionario_menacme.xlsx")
        if os.path.exists(arquivo_menacme):
            df_menacme = self.ler_planilha_excel(arquivo_menacme)
            resultados["menacme"] = self.processar_questionario_menacme(
                df_menacme)

        # Combinar resultados por email
        for est in resultados["estresse"]:
            for men in resultados["menacme"]:
                if est["email"] == men["email"]:
                    resultado_combinado = self.combinar_resultados(est, men)
                    resultados["combinados"].append(resultado_combinado)

        self.resultados = resultados
        return resultados

    def salvar_resultados(self, diretorio_saida: str):
        """
        Salva os resultados processados em arquivos

        Args:
            diretorio_saida: Diretório para salvar os resultados
        """
        os.makedirs(diretorio_saida, exist_ok=True)

        # Salvar como JSON
        with open(os.path.join(diretorio_saida, "resultados_completos.json"), 'w', encoding='utf-8') as f:
            json.dump(self.resultados, f, indent=2,
                      ensure_ascii=False, default=str)

        # Salvar como Excel
        if self.resultados["estresse"]:
            df_estresse = pd.DataFrame(self.resultados["estresse"])
            df_estresse.to_excel(os.path.join(
                diretorio_saida, "resultados_estresse.xlsx"), index=False)

        if self.resultados["menacme"]:
            df_menacme = pd.DataFrame(self.resultados["menacme"])
            df_menacme.to_excel(os.path.join(
                diretorio_saida, "resultados_menacme.xlsx"), index=False)

        if self.resultados["combinados"]:
            df_combinados = pd.DataFrame(self.resultados["combinados"])
            df_combinados.to_excel(os.path.join(
                diretorio_saida, "resultados_combinados.xlsx"), index=False)

        logger.info(f"Resultados salvos em {diretorio_saida}")


if __name__ == "__main__":
    # Exemplo de uso
    processador = ProcessadorQuestionarios()

    # Criar diretórios necessários
    os.makedirs("dados_entrada", exist_ok=True)
    os.makedirs("resultados", exist_ok=True)

    # Processar questionários
    try:
        resultados = processador.processar_todos_questionarios("dados_entrada")
        processador.salvar_resultados("resultados")
        print("Processamento concluído com sucesso!")

        # Mostrar estatísticas
        print(
            f"Questionários de estresse processados: {len(resultados['estresse'])}")
        print(
            f"Questionários de menacme processados: {len(resultados['menacme'])}")
        print(f"Resultados combinados: {len(resultados['combinados'])}")

    except Exception as e:
        logger.error(f"Erro durante o processamento: {e}")
