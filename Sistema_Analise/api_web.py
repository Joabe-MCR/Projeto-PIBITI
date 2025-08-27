"""
API Web para servir resultados dos questionários
Permite integração com JavaScript no frontend
"""

from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import json
import os
from datetime import datetime
import subprocess

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend


@app.route('/api/participante/<string:user_id>')
def get_resultado_participante(user_id):
    """Retorna resultado de um participante específico"""

    resultados_dir = "resultados"
    resultados = {}

    # Buscar resultados de todos os questionários
    questionarios = ['estresse', 'vulnerabilidade', 'menacme']

    for questionario in questionarios:
        arquivo = f"{resultados_dir}/{user_id}_{questionario}.json"
        if os.path.exists(arquivo):
            try:
                with open(arquivo, 'r', encoding='utf-8') as f:
                    resultados[questionario] = json.load(f)
            except Exception as e:
                print(f"Erro ao ler {arquivo}: {e}")

    if not resultados:
        return jsonify({
            'error': 'Nenhum resultado encontrado para este usuário',
            'user_id': user_id,
            'status': 'not_found'
        }), 404

    return jsonify({
        'user_id': user_id,
        'resultados': resultados,
        'timestamp': datetime.now().isoformat(),
        'status': 'found'
    })


@app.route('/api/processar/<string:user_id>')
def processar_usuario(user_id):
    """Força processamento de um usuário específico"""

    try:
        # Executar o sistema de processamento
        resultado = subprocess.run([
            'python', 'processador_questionarios.py',
            '--user-id', user_id
        ], capture_output=True, text=True, timeout=60)

        if resultado.returncode == 0:
            return jsonify({
                'success': True,
                'user_id': user_id,
                'message': 'Processamento concluído com sucesso',
                'output': resultado.stdout
            })
        else:
            return jsonify({
                'success': False,
                'user_id': user_id,
                'error': resultado.stderr,
                'message': 'Erro no processamento'
            }), 500

    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'user_id': user_id,
            'error': 'Timeout no processamento',
            'message': 'Processamento demorou mais que 60 segundos'
        }), 408
    except Exception as e:
        return jsonify({
            'success': False,
            'user_id': user_id,
            'error': str(e),
            'message': 'Erro interno do servidor'
        }), 500


@app.route('/api/diagnostico/<string:user_id>')
def get_diagnostico_participante(user_id):
    """Retorna diagnóstico HTML completo de um participante"""

    diagnosticos_dir = "diagnosticos"
    arquivo = f"{diagnosticos_dir}/{user_id}_diagnostico_completo.html"

    if not os.path.exists(arquivo):
        return jsonify({
            'error': 'Diagnóstico não encontrado',
            'user_id': user_id,
            'status': 'not_found'
        }), 404

    try:
        with open(arquivo, 'r', encoding='utf-8') as f:
            diagnostico_html = f.read()

        return jsonify({
            'user_id': user_id,
            'diagnostico_html': diagnostico_html,
            'timestamp': datetime.now().isoformat(),
            'status': 'found'
        })
    except Exception as e:
        return jsonify({
            'error': f'Erro ao ler diagnóstico: {str(e)}',
            'user_id': user_id,
            'status': 'error'
        }), 500


@app.route('/api/aguardar/<string:user_id>')
def aguardar_resultado(user_id):
    """Endpoint para aguardar resultado de um participante"""
    import time

    max_tentativas = 120  # 2 minutos

    # Aguardar até que pelo menos um resultado apareça
    for tentativa in range(max_tentativas):
        arquivo = f"resultados/{user_id}_estresse.json"
        if os.path.exists(arquivo):
            return get_resultado_participante(user_id)
        time.sleep(1)

    return jsonify({
        'error': 'Tempo limite esgotado - processamento pode estar em andamento',
        'user_id': user_id,
        'status': 'timeout',
        'message': 'Tente novamente em alguns minutos'
    }), 408


@app.route('/api/status')
def get_status_sistema():
    """Retorna status geral do sistema"""

    try:
        # Contar arquivos processados
        resultados_dir = "resultados"
        if os.path.exists(resultados_dir):
            total_processados = len(
                [f for f in os.listdir(resultados_dir) if f.endswith('.json')])
        else:
            total_processados = 0

        # Verificar se controle de IDs existe
        controle_file = 'controle_ids.json'
        if os.path.exists(controle_file):
            with open(controle_file, 'r', encoding='utf-8') as f:
                controle = json.load(f)
        else:
            controle = {
                'ultimo_id_processado': 0,
                'ultima_atualizacao': 'Nunca',
                'questionarios_processados': {}
            }

        return jsonify({
            'total_processados': total_processados,
            'ultimo_id': controle.get('ultimo_id_processado', 0),
            'ultima_atualizacao': controle.get('ultima_atualizacao', 'Nunca'),
            'questionarios_processados': controle.get('questionarios_processados', {}),
            'status_sistema': 'online',
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        return jsonify({
            'error': f'Erro ao verificar status: {str(e)}',
            'status_sistema': 'error'
        }), 500


@app.route('/dashboard')
def dashboard():
    """Página de dashboard simples"""

    html = '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Dashboard - Questionários PIBITI</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 20px; 
                background: #f5f5f5;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
            }
            .card { 
                background: white; 
                padding: 20px; 
                margin: 15px 0; 
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .resultado { background: #e8f5e8; border-left: 4px solid #28a745; }
            .erro { background: #ffeaea; border-left: 4px solid #dc3545; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; }
            button { 
                padding: 12px 24px; 
                margin: 8px; 
                cursor: pointer; 
                border: none;
                border-radius: 8px;
                background: #007bff;
                color: white;
                font-weight: 500;
            }
            button:hover { background: #0056b3; }
            input {
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 6px;
                margin-right: 10px;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }
            .stat-item {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
            .stat-number {
                font-size: 2em;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .loading {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔬 Dashboard - Análise de Questionários PIBITI</h1>
            
            <div class="card">
                <h3>📊 Status do Sistema</h3>
                <div class="stats" id="stats">
                    <div class="loading"></div>
                </div>
                <button onclick="atualizarStatus()">🔄 Atualizar</button>
            </div>
            
            <div class="card">
                <h3>🔍 Buscar Resultado por ID</h3>
                <input type="text" id="idParticipante" placeholder="ID do Participante (ex: USR_123456_ABC)" style="width: 300px">
                <button onclick="buscarResultado()">🔍 Buscar</button>
                <button onclick="processarUsuario()">⚡ Processar</button>
                <div id="resultado"></div>
            </div>
            
            <div class="card">
                <h3>📋 Ações Rápidas</h3>
                <button onclick="window.open('index.html', '_blank')">🏠 Ir para Site</button>
                <button onclick="window.open('teste_sistema.html', '_blank')">🧪 Página de Testes</button>
                <button onclick="abrirDiretorioResultados()">📁 Ver Resultados</button>
            </div>
        </div>
        
        <script>
            function atualizarStatus() {
                const statsDiv = document.getElementById('stats');
                statsDiv.innerHTML = '<div class="loading"></div>';
                
                fetch('/api/status')
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            statsDiv.innerHTML = `<div class="erro">❌ ${data.error}</div>`;
                        } else {
                            statsDiv.innerHTML = `
                                <div class="stat-item">
                                    <div class="stat-number">${data.total_processados}</div>
                                    <div>Total Processados</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">${data.ultimo_id}</div>
                                    <div>Último ID</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-number">${data.status_sistema}</div>
                                    <div>Status do Sistema</div>
                                </div>
                            `;
                        }
                    })
                    .catch(error => {
                        statsDiv.innerHTML = '<div class="erro">❌ Erro ao carregar status</div>';
                    });
            }
            
            function buscarResultado() {
                const id = document.getElementById('idParticipante').value;
                if (!id) {
                    alert('Digite um ID válido');
                    return;
                }
                
                const resultadoDiv = document.getElementById('resultado');
                resultadoDiv.innerHTML = '<div class="loading"></div> Buscando...';
                
                fetch(`/api/participante/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            resultadoDiv.innerHTML = `<div class="erro">❌ ${data.error}</div>`;
                        } else {
                            let html = '<div class="resultado"><h4>✅ Resultados Encontrados:</h4>';
                            for (const [questionario, resultado] of Object.entries(data.resultados)) {
                                html += `
                                    <div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                                        <strong>📝 ${questionario.toUpperCase()}</strong><br>
                                        <strong>Categoria:</strong> ${resultado.categoria || 'N/A'}<br>
                                        <strong>Pontuação:</strong> ${resultado.pontuacao_total || 'N/A'}<br>
                                    </div>
                                `;
                            }
                            html += `<button onclick="verDiagnosticoCompleto('${id}')">📊 Ver Diagnóstico Completo</button></div>`;
                            resultadoDiv.innerHTML = html;
                        }
                    })
                    .catch(error => {
                        resultadoDiv.innerHTML = '<div class="erro">❌ Erro ao buscar resultado</div>';
                    });
            }
            
            function processarUsuario() {
                const id = document.getElementById('idParticipante').value;
                if (!id) {
                    alert('Digite um ID válido');
                    return;
                }
                
                const resultadoDiv = document.getElementById('resultado');
                resultadoDiv.innerHTML = '<div class="loading"></div> Processando usuário...';
                
                fetch(`/api/processar/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            resultadoDiv.innerHTML = `<div class="resultado">✅ ${data.message}</div>`;
                            setTimeout(() => buscarResultado(), 2000);
                        } else {
                            resultadoDiv.innerHTML = `<div class="erro">❌ ${data.message}: ${data.error}</div>`;
                        }
                    })
                    .catch(error => {
                        resultadoDiv.innerHTML = '<div class="erro">❌ Erro ao processar usuário</div>';
                    });
            }
            
            function verDiagnosticoCompleto(userId) {
                fetch(`/api/diagnostico/${userId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert('Diagnóstico não encontrado: ' + data.error);
                        } else {
                            const novaJanela = window.open('', '_blank');
                            novaJanela.document.write(data.diagnostico_html);
                            novaJanela.document.close();
                        }
                    })
                    .catch(error => {
                        alert('Erro ao carregar diagnóstico completo');
                    });
            }
            
            function abrirDiretorioResultados() {
                alert('Verifique a pasta "resultados" no diretório do sistema Python');
            }
            
            // Atualizar status automaticamente na inicialização
            atualizarStatus();
            
            // Atualizar status a cada 30 segundos
            setInterval(atualizarStatus, 30000);
        </script>
    </body>
    </html>
    '''

    return render_template_string(html)


@app.route('/')
def index():
    """Redirecionar para dashboard"""
    return dashboard()


if __name__ == '__main__':
    print("🚀 Iniciando API do Sistema de Questionários PIBITI...")
    print("📊 Dashboard: http://localhost:5000/dashboard")
    print("🔍 API Status: http://localhost:5000/api/status")
    print("📋 Documentação completa em: documentacao/05_integracao_javascript_opcional.txt")
    app.run(debug=True, host='0.0.0.0', port=5000)
