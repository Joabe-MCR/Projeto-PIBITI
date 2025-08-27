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


# ==========================================
# SISTEMA DE DÚVIDAS ANÔNIMAS
# ==========================================

@app.route('/api/duvidas/enviar', methods=['POST'])
def enviar_duvida():
    """Recebe e processa uma nova dúvida anônima"""

    try:
        data = request.get_json()

        # Validar dados
        if not data or not data.get('categoria') or not data.get('duvida'):
            return jsonify({
                'error': 'Dados incompletos',
                'message': 'Categoria e dúvida são obrigatórios'
            }), 400

        # Gerar ID único para a dúvida
        from datetime import datetime
        import uuid

        duvida_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now()

        # Criar dados da dúvida
        duvida_data = {
            'id': duvida_id,
            'categoria': data.get('categoria'),
            'duvida': data.get('duvida'),
            'data_envio': timestamp.isoformat(),
            'status': 'pendente',
            'resposta': None,
            'data_resposta': None,
            'respondida_por': None
        }

        # Salvar dúvida no arquivo JSON
        duvidas_dir = "duvidas"
        os.makedirs(duvidas_dir, exist_ok=True)

        arquivo_duvida = f"{duvidas_dir}/{duvida_id}_duvida.json"
        with open(arquivo_duvida, 'w', encoding='utf-8') as f:
            json.dump(duvida_data, f, ensure_ascii=False, indent=2)

        # Enviar email aos pesquisadores
        try:
            enviar_email_notificacao(duvida_data)
        except Exception as email_error:
            print(f"Erro ao enviar email: {email_error}")
            # Não falhar a operação se o email falhar

        return jsonify({
            'success': True,
            'message': 'Dúvida enviada com sucesso',
            'duvida_id': duvida_id
        })

    except Exception as e:
        print(f"Erro ao processar dúvida: {e}")
        return jsonify({
            'error': 'Erro interno do servidor',
            'message': str(e)
        }), 500


@app.route('/api/duvidas/respondidas', methods=['GET'])
def listar_duvidas_respondidas():
    """Retorna lista de dúvidas já respondidas"""

    try:
        duvidas_dir = "duvidas"
        duvidas_respondidas = []

        if not os.path.exists(duvidas_dir):
            return jsonify([])

        # Buscar todos os arquivos de dúvidas
        for arquivo in os.listdir(duvidas_dir):
            if arquivo.endswith('_duvida.json'):
                caminho_arquivo = os.path.join(duvidas_dir, arquivo)
                try:
                    with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                        duvida = json.load(f)

                    # Incluir apenas dúvidas respondidas
                    if duvida.get('status') == 'respondida' and duvida.get('resposta'):
                        duvidas_respondidas.append({
                            'categoria': duvida.get('categoria'),
                            'duvida': duvida.get('duvida'),
                            'resposta': duvida.get('resposta'),
                            'data_envio': duvida.get('data_envio'),
                            'data_resposta': duvida.get('data_resposta')
                        })

                except Exception as e:
                    print(f"Erro ao ler dúvida {arquivo}: {e}")
                    continue

        # Ordenar por data de resposta (mais recente primeiro)
        duvidas_respondidas.sort(
            key=lambda x: x.get('data_resposta', ''),
            reverse=True
        )

        return jsonify(duvidas_respondidas)

    except Exception as e:
        print(f"Erro ao listar dúvidas: {e}")
        return jsonify({
            'error': 'Erro interno do servidor',
            'message': str(e)
        }), 500


@app.route('/responder-duvida/<string:duvida_id>/<string:token>', methods=['GET', 'POST'])
def responder_duvida(duvida_id, token):
    """Interface para responder dúvidas (acesso via link único)"""

    try:
        # Validar token
        if not validar_token_resposta(duvida_id, token):
            return render_template_string("""
                <html>
                <head><title>Acesso Negado</title></head>
                <body>
                    <h1>Acesso Negado</h1>
                    <p>Token inválido ou expirado.</p>
                </body>
                </html>
            """), 403

        duvidas_dir = "duvidas"
        arquivo_duvida = f"{duvidas_dir}/{duvida_id}_duvida.json"

        if not os.path.exists(arquivo_duvida):
            return render_template_string("""
                <html>
                <head><title>Dúvida não encontrada</title></head>
                <body>
                    <h1>Dúvida não encontrada</h1>
                    <p>A dúvida solicitada não foi encontrada.</p>
                </body>
                </html>
            """), 404

        # Carregar dúvida
        with open(arquivo_duvida, 'r', encoding='utf-8') as f:
            duvida = json.load(f)

        if request.method == 'POST':
            # Processar resposta
            resposta = request.form.get('resposta', '').strip()
            autor = request.form.get('autor', '').strip()

            if not resposta:
                return render_interface_resposta(duvida, "Por favor, forneça uma resposta.")

            # Atualizar dúvida com resposta
            from datetime import datetime
            duvida['resposta'] = resposta
            duvida['status'] = 'respondida'
            duvida['data_resposta'] = datetime.now().isoformat()
            duvida['respondida_por'] = autor or 'Equipe de pesquisa'

            # Salvar atualização
            with open(arquivo_duvida, 'w', encoding='utf-8') as f:
                json.dump(duvida, f, ensure_ascii=False, indent=2)

            return render_template_string("""
                <html>
                <head>
                    <title>Resposta Enviada</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                        .success { background: #d4edda; padding: 20px; border-radius: 5px; color: #155724; }
                    </style>
                </head>
                <body>
                    <div class="success">
                        <h1>✓ Resposta enviada com sucesso!</h1>
                        <p>A resposta foi salva e ficará disponível na seção "Perguntas Respondidas" do site.</p>
                    </div>
                </body>
                </html>
            """)

        else:
            # Mostrar interface de resposta
            return render_interface_resposta(duvida)

    except Exception as e:
        print(f"Erro ao processar resposta: {e}")
        return render_template_string("""
            <html>
            <head><title>Erro</title></head>
            <body>
                <h1>Erro</h1>
                <p>Ocorreu um erro ao processar a solicitação.</p>
            </body>
            </html>
        """), 500


def render_interface_resposta(duvida, erro=None):
    """Renderiza interface para resposta da dúvida"""

    categorias = {
        'estresse': 'Sobre Estresse',
        'menacme': 'Sobre Ciclo Menstrual',
        'questionarios': 'Sobre os Questionários',
        'pesquisa': 'Sobre a Pesquisa',
        'outros': 'Outros'
    }

    categoria_formatada = categorias.get(
        duvida['categoria'], duvida['categoria'])
    data_formatada = datetime.fromisoformat(
        duvida['data_envio']).strftime('%d/%m/%Y às %H:%M')

    erro_html = f'<div class="error">{erro}</div>' if erro else ''

    return render_template_string(f"""
        <html>
        <head>
            <title>Responder Dúvida - Projeto PIBITI</title>
            <meta charset="UTF-8">
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 30px auto;
                    padding: 20px;
                    line-height: 1.6;
                    background-color: #f5f5f5;
                }}
                .container {{
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #4a90e2, #357abd);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    text-align: center;
                }}
                .duvida-info {{
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                }}
                .categoria {{
                    color: #4a90e2;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    margin-bottom: 10px;
                }}
                .pergunta {{
                    font-size: 1.1rem;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    padding: 15px;
                    background: white;
                    border-left: 4px solid #4a90e2;
                    border-radius: 4px;
                }}
                .data {{
                    color: #7f8c8d;
                    font-size: 0.9rem;
                }}
                .form-group {{
                    margin-bottom: 20px;
                }}
                label {{
                    display: block;
                    color: #2c3e50;
                    font-weight: bold;
                    margin-bottom: 8px;
                }}
                input, textarea {{
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e0e6ed;
                    border-radius: 6px;
                    font-size: 1rem;
                    font-family: inherit;
                    box-sizing: border-box;
                }}
                textarea {{
                    min-height: 150px;
                    resize: vertical;
                }}
                input:focus, textarea:focus {{
                    outline: none;
                    border-color: #4a90e2;
                }}
                .submit-btn {{
                    background: linear-gradient(135deg, #27ae60, #2ecc71);
                    color: white;
                    padding: 15px 30px;
                    border: none;
                    border-radius: 6px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s;
                }}
                .submit-btn:hover {{
                    background: linear-gradient(135deg, #219a52, #27ae60);
                    transform: translateY(-2px);
                }}
                .error {{
                    background: #f8d7da;
                    color: #721c24;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    border-left: 4px solid #f5c6cb;
                }}
                .instructions {{
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    border-left: 4px solid #2196f3;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Responder Dúvida</h1>
                    <p>Sistema de Dúvidas - Projeto PIBITI</p>
                </div>
                
                {erro_html}
                
                <div class="instructions">
                    <h3>📋 Instruções:</h3>
                    <p>Você está respondendo a uma dúvida enviada anonimamente através do site do projeto. 
                    Sua resposta ficará disponível publicamente na seção "Perguntas Respondidas" para 
                    que outros usuários possam ver.</p>
                </div>
                
                <div class="duvida-info">
                    <div class="categoria">{categoria_formatada}</div>
                    <div class="pergunta">"{duvida['duvida']}"</div>
                    <div class="data">Enviada em: {data_formatada}</div>
                </div>
                
                <form method="post">
                    <div class="form-group">
                        <label for="autor">Seu nome (opcional):</label>
                        <input type="text" id="autor" name="autor" 
                               placeholder="Ex: Dr. João Silva" 
                               value="Equipe de pesquisa">
                    </div>
                    
                    <div class="form-group">
                        <label for="resposta">Sua resposta: *</label>
                        <textarea id="resposta" name="resposta" 
                                  placeholder="Digite aqui sua resposta detalhada para ajudar o usuário..."
                                  required></textarea>
                    </div>
                    
                    <button type="submit" class="submit-btn">
                        📤 Enviar Resposta
                    </button>
                </form>
            </div>
        </body>
        </html>
    """)


def enviar_email_notificacao(duvida_data):
    """Envia email de notificação para os pesquisadores"""

    import smtplib
    from email.mime.text import MimeText
    from email.mime.multipart import MimeMultipart
    import hashlib

    # Configurações de email (ajustar conforme necessário)
    # NOTA: Você precisará configurar estes dados
    SMTP_SERVER = "smtp.gmail.com"  # ou outro servidor
    SMTP_PORT = 587
    EMAIL_USER = "seu_email@gmail.com"  # CONFIGURAR
    EMAIL_PASS = "sua_senha_app"       # CONFIGURAR

    # Emails dos pesquisadores (CONFIGURAR)
    EMAILS_PESQUISADORES = [
        "pesquisador1@email.com",  # CONFIGURAR
        "pesquisador2@email.com"   # CONFIGURAR
    ]

    # Gerar token único para resposta
    token = hashlib.sha256(
        f"{duvida_data['id']}{duvida_data['data_envio']}chave_secreta".encode()).hexdigest()[:32]

    # URL para responder
    url_resposta = f"http://localhost:5000/responder-duvida/{duvida_data['id']}/{token}"

    # Criar mensagem
    msg = MimeMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = ", ".join(EMAILS_PESQUISADORES)
    msg['Subject'] = f"Nova Dúvida - Projeto PIBITI [{duvida_data['categoria'].upper()}]"

    categorias = {
        'estresse': 'Sobre Estresse',
        'menacme': 'Sobre Ciclo Menstrual',
        'questionarios': 'Sobre os Questionários',
        'pesquisa': 'Sobre a Pesquisa',
        'outros': 'Outros'
    }

    categoria_formatada = categorias.get(
        duvida_data['categoria'], duvida_data['categoria'])
    data_formatada = datetime.fromisoformat(
        duvida_data['data_envio']).strftime('%d/%m/%Y às %H:%M')

    corpo_email = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4a90e2;">Nova Dúvida Recebida</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a90e2; margin-top: 0;">Categoria: {categoria_formatada}</h3>
            <div style="background: white; padding: 15px; border-left: 4px solid #4a90e2; border-radius: 4px;">
                <strong>Pergunta:</strong><br>
                "{duvida_data['duvida']}"
            </div>
            <p style="color: #666; font-size: 0.9rem; margin-top: 15px;">
                Enviada em: {data_formatada}
            </p>
        </div>
        
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Como Responder:</h3>
            <p>Clique no link abaixo para acessar a interface de resposta:</p>
            <a href="{url_resposta}" 
               style="display: inline-block; background: #4a90e2; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
                📝 Responder Dúvida
            </a>
            <p style="font-size: 0.9rem; color: #666;">
                <strong>Importante:</strong> Este link é único e seguro. Apenas quem tem acesso a este email 
                pode responder à dúvida.
            </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 0.9rem;">
            Este email foi gerado automaticamente pelo Sistema de Dúvidas do Projeto PIBITI.
        </p>
    </body>
    </html>
    """

    msg.attach(MimeText(corpo_email, 'html'))

    # Enviar email (descomente e configure para usar)
    """
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)
        server.quit()
        print(f"Email enviado para {len(EMAILS_PESQUISADORES)} pesquisadores")
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        raise
    """

    # Para testes, apenas salvar o email em arquivo
    emails_dir = "emails_enviados"
    os.makedirs(emails_dir, exist_ok=True)

    with open(f"{emails_dir}/{duvida_data['id']}_notificacao.html", 'w', encoding='utf-8') as f:
        f.write(f"""
        <!-- Email de notificação -->
        <!-- Para: {', '.join(EMAILS_PESQUISADORES)} -->
        <!-- Assunto: {msg['Subject']} -->
        <!-- Link de resposta: {url_resposta} -->
        
        {corpo_email}
        """)

    print(
        f"Notificação salva em: emails_enviados/{duvida_data['id']}_notificacao.html")
    print(f"Link para responder: {url_resposta}")


def validar_token_resposta(duvida_id, token):
    """Valida token para resposta da dúvida"""

    try:
        # Carregar dados da dúvida
        duvidas_dir = "duvidas"
        arquivo_duvida = f"{duvidas_dir}/{duvida_id}_duvida.json"

        if not os.path.exists(arquivo_duvida):
            return False

        with open(arquivo_duvida, 'r', encoding='utf-8') as f:
            duvida = json.load(f)

        # Gerar token esperado
        import hashlib
        token_esperado = hashlib.sha256(
            f"{duvida['id']}{duvida['data_envio']}chave_secreta".encode()
        ).hexdigest()[:32]

        return token == token_esperado

    except Exception as e:
        print(f"Erro ao validar token: {e}")
        return False


if __name__ == '__main__':
    print("🚀 Iniciando API do Sistema de Questionários PIBITI...")
    print("📊 Dashboard: http://localhost:5000/dashboard")
    print("🔍 API Status: http://localhost:5000/api/status")
    print("❓ Sistema de Dúvidas ativo")
    print("📋 Documentação completa em: documentacao/05_integracao_javascript_opcional.txt")
    app.run(debug=True, host='0.0.0.0', port=5000)
