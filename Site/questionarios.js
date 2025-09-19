// ==========================================
// SISTEMA DE GERENCIAMENTO DE QUESTIONÁRIOS
// ==========================================

// URLs dos questionários HTML locais
const QUESTIONARIOS_URLS = {
    1: 'questionario1-stress.html', // Escala de Percepção ao Stress
    2: 'questionario2-vulnerabilidade.html', // Escala de Vulnerabilidade ao Stress  
    3: 'questionario3-menstrual.html'  // Questionário de Desconforto Menstrual
};

// Variáveis globais
let userId = null;
let progressoUsuario = {
    questionario1: false,
    questionario2: false,
    questionario3: false
};

// ==========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário aceitou o TCLE
    if (!verificarConsentimentoTCLE()) {
        // Redirecionar de volta para o TCLE se não houver consentimento
        alert('É necessário aceitar o Termo de Consentimento antes de acessar os questionários.');
        window.location.href = 'index.html#tcle';
        return;
    }
    
    inicializarSistema();
    configurarDeteccaoRetorno();
});

function verificarConsentimentoTCLE() {
    const consentimento = localStorage.getItem('tcleConsentimento');
    const dataConsentimento = localStorage.getItem('tcleDataConsentimento');
    
    // Verificar se há consentimento e se foi dado recentemente (últimas 24h para segurança)
    if (consentimento === 'true' && dataConsentimento) {
        const agora = new Date();
        const dataConsent = new Date(dataConsentimento);
        const diferencaHoras = (agora - dataConsent) / (1000 * 60 * 60);
        
        // Permitir acesso se consentiu nas últimas 24 horas
        return diferencaHoras <= 24;
    }
    
    return false;
}

function inicializarSistema() {
    // Gerar ou recuperar ID do usuário
    userId = obterOuCriarUserId();
    
    // Carregar progresso salvo
    carregarProgresso();
    
    // Atualizar interface
    atualizarInterface();
    
    console.log(`Sistema inicializado para usuário: ${userId}`);
    console.log(`Consentimento TCLE verificado e válido`);
}

// ==========================================
// GERENCIAMENTO DE ID DE USUÁRIO
// ==========================================

function obterOuCriarUserId() {
    // Verificar se há ID na URL (retorno de formulário)
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get('userId');
    
    if (urlUserId) {
        localStorage.setItem('userSessionId', urlUserId);
        return urlUserId;
    }
    
    // Verificar se há ID salvo no localStorage
    const savedId = localStorage.getItem('userSessionId');
    if (savedId) {
        return savedId;
    }
    
    // Gerar novo ID único
    const newId = gerarIdUnico();
    localStorage.setItem('userSessionId', newId);
    return newId;
}

function gerarIdUnico() {
    // Gerar ID baseado em timestamp + random para garantir unicidade
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `USR_${timestamp}_${random}`.toUpperCase();
}

// ==========================================
// GERENCIAMENTO DE PROGRESSO
// ==========================================

function carregarProgresso() {
    const savedProgress = localStorage.getItem(`progress_${userId}`);
    if (savedProgress) {
        progressoUsuario = JSON.parse(savedProgress);
    }
}

function salvarProgresso() {
    localStorage.setItem(`progress_${userId}`, JSON.stringify(progressoUsuario));
}

function marcarQuestionarioCompleto(numeroQuestionario) {
    progressoUsuario[`questionario${numeroQuestionario}`] = true;
    salvarProgresso();
    atualizarInterface();
    
    // Verificar se todos foram completados
    if (todosQuestionariosCompletos()) {
        mostrarBotaoDiagnostico();
    }
}

function todosQuestionariosCompletos() {
    return progressoUsuario.questionario1 && 
           progressoUsuario.questionario2 && 
           progressoUsuario.questionario3;
}

function questionarioDesbloqueado(numero) {
    // Questionário 1 sempre está desbloqueado
    if (numero === 1) return true;
    
    // Questionário 2 só se questionário 1 estiver completo
    if (numero === 2) return progressoUsuario.questionario1;
    
    // Questionário 3 só se questionários 1 e 2 estiverem completos
    if (numero === 3) return progressoUsuario.questionario1 && progressoUsuario.questionario2;
    
    return false;
}

// ==========================================
// ATUALIZAÇÃO DA INTERFACE
// ==========================================

function atualizarInterface() {
    // Mostrar ID do usuário
    document.getElementById('userIdDisplay').textContent = userId;
    
    // Atualizar progresso
    atualizarBarraProgresso();
    
    // Atualizar estado dos questionários
    atualizarEstadoQuestionarios();
}

function atualizarBarraProgresso() {
    const completados = Object.values(progressoUsuario).filter(Boolean).length;
    const porcentagem = (completados / 3) * 100;
    
    document.getElementById('progressFill').style.width = `${porcentagem}%`;
    document.getElementById('progressText').textContent = 
        `${completados} de 3 questionários concluídos`;
}

function atualizarEstadoQuestionarios() {
    // Questionário 1 - sempre habilitado
    atualizarQuestionario(1, true, progressoUsuario.questionario1);
    
    // Questionário 2 - habilitado se 1 completo
    atualizarQuestionario(2, progressoUsuario.questionario1, progressoUsuario.questionario2);
    
    // Questionário 3 - habilitado se 1 e 2 completos
    atualizarQuestionario(3, 
        progressoUsuario.questionario1 && progressoUsuario.questionario2, 
        progressoUsuario.questionario3
    );
}

function atualizarQuestionario(numero, habilitado, completo) {
    const item = document.getElementById(`questionario${numero}`);
    const botao = document.getElementById(`btn${numero}`);
    const icon = document.getElementById(`icon${numero}`);
    
    // Remover classes anteriores
    item.classList.remove('disabled', 'completed');
    botao.classList.remove('disabled', 'completed');
    icon.classList.remove('completed');
    
    if (completo) {
        // Questionário completo
        item.classList.add('completed');
        botao.classList.add('completed');
        icon.classList.add('completed');
        botao.disabled = false;
        botao.querySelector('.btn-status').textContent = 'Concluído ✓';
        botao.querySelector('.btn-text').textContent = 'Responder Novamente';
    } else if (habilitado) {
        // Questionário habilitado
        botao.disabled = false;
        botao.querySelector('.btn-status').textContent = 'Disponível';
        botao.querySelector('.btn-text').textContent = 'Responder Questionário';
    } else {
        // Questionário desabilitado
        item.classList.add('disabled');
        botao.classList.add('disabled');
        botao.disabled = true;
        
        if (numero === 2) {
            botao.querySelector('.btn-status').textContent = 'Aguardando anterior';
        } else if (numero === 3) {
            botao.querySelector('.btn-status').textContent = 'Aguardando anteriores';
        }
    }
}

// ==========================================
// FUNÇÕES DE NAVEGAÇÃO
// ==========================================

function abrirQuestionario(numero) {
    if (document.getElementById(`btn${numero}`).disabled) {
        return;
    }
    
    // Verificar se questionário está desbloqueado
    if (!questionarioDesbloqueado(numero)) {
        alert(`Complete o questionário ${numero - 1} primeiro!`);
        return;
    }
    
    // URL do questionário HTML local
    const urlQuestionario = QUESTIONARIOS_URLS[numero];
    
    // Salvar timestamp de início
    localStorage.setItem(`inicio_q${numero}_${userId}`, Date.now());
    
    // Redirecionar diretamente para o questionário HTML
    window.location.href = urlQuestionario;
}

function obterTituloQuestionario(numero) {
    const titulos = {
        1: 'Escala de Percepção ao Stress',
        2: 'Escala de Vulnerabilidade ao Stress',
        3: 'Questionário de Desconforto Menstrual'
    };
    return titulos[numero];
}

function verDiagnostico() {
    if (!todosQuestionariosCompletos()) {
        alert('Complete todos os questionários antes de ver o diagnóstico.');
        return;
    }
    
    // Tentar processar resultados via API antes de redirecionar
    processarResultadosAPI().then(() => {
        // Redirecionar para página de diagnóstico
        window.location.href = `diagnostico.html?userId=${userId}`;
    }).catch((error) => {
        console.log('API não disponível, prosseguindo com dados simulados:', error);
        // Redirecionar mesmo sem API
        window.location.href = `diagnostico.html?userId=${userId}`;
    });
}

async function processarResultadosAPI() {
    const API_BASE = 'http://localhost:5000/api';
    
    try {
        const response = await fetch(`${API_BASE}/processar/${userId}`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Processamento API concluído:', data);
            return data;
        } else {
            throw new Error('Erro na API: ' + response.status);
        }
    } catch (error) {
        throw error;
    }
}

function mostrarBotaoDiagnostico() {
    document.getElementById('diagnosticoSection').style.display = 'block';
    document.getElementById('diagnosticoSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// ==========================================
// DETECÇÃO DE RETORNO DE FORMULÁRIO
// ==========================================

function configurarDeteccaoRetorno() {
    // Sistema simplificado - os questionários HTML já marcam como completo automaticamente
    // Apenas verificar se há atualizações no progresso quando a página é carregada
    
    // Detectar se voltou de um questionário
    const urlParams = new URLSearchParams(window.location.search);
    const fromQuestionario = urlParams.get('from');
    
    if (fromQuestionario) {
        // Mostrar mensagem de sucesso se especificado
        const numeroQuestionario = parseInt(fromQuestionario);
        if (numeroQuestionario >= 1 && numeroQuestionario <= 3) {
            setTimeout(() => {
                mostrarMensagemSucesso(numeroQuestionario);
            }, 500);
        }
        
        // Limpar URL
        window.history.replaceState({}, '', window.location.pathname);
    }
}

function verificarCompletudePorTempo() {
    // Verificar se há questionários iniciados recentemente
    const agora = Date.now();
    const limiteTempo = 5 * 60 * 1000; // 5 minutos
    
    for (let i = 1; i <= 3; i++) {
        const inicio = localStorage.getItem(`inicio_q${i}_${userId}`);
        if (inicio && !progressoUsuario[`questionario${i}`]) {
            const tempoDecorrido = agora - parseInt(inicio);
            
            // Se passou tempo suficiente, assumir que foi completado
            if (tempoDecorrido > limiteTempo) {
                mostrarModal(
                    `Parece que você completou o questionário "${obterTituloQuestionario(i)}". Confirma?`,
                    () => {
                        marcarQuestionarioCompleto(i);
                        localStorage.removeItem(`inicio_q${i}_${userId}`);
                    }
                );
                break;
            }
        }
    }
}

function mostrarMensagemSucesso(numero) {
    // Criar notificação de sucesso
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">
                Questionário "${obterTituloQuestionario(numero)}" concluído com sucesso!
            </span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// ==========================================
// FUNÇÕES DE MODAL
// ==========================================

function mostrarModal(mensagem, onConfirm) {
    document.getElementById('modalMessage').textContent = mensagem;
    document.getElementById('confirmModal').style.display = 'flex';
    
    document.getElementById('confirmBtn').onclick = () => {
        fecharModal();
        if (onConfirm) onConfirm();
    };
}

function fecharModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function voltarAoTopo() {
    document.getElementById('questionarios').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Função para resetar progresso (apenas para desenvolvimento/teste)
function resetarProgresso() {
    if (confirm('Tem certeza que deseja resetar todo o progresso? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem(`progress_${userId}`);
        localStorage.removeItem('userSessionId');
        
        // Remover timestamps de início
        for (let i = 1; i <= 3; i++) {
            localStorage.removeItem(`inicio_q${i}_${userId}`);
        }
        
        // Recarregar página
        window.location.reload();
    }
}

// Adicionar função de reset no console para desenvolvimento
console.log('Para resetar progresso, execute: resetarProgresso()');
