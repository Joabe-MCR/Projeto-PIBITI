// ==========================================
// SISTEMA DE GERENCIAMENTO DE QUESTIONÁRIOS
// ==========================================

// URLs dos Google Forms (substitua pelos links reais dos seus formulários)
const QUESTIONARIOS_URLS = {
    1: 'https://docs.google.com/forms/d/e/1FAIpQLSe_EXEMPLO1/viewform', // Escala de Percepção ao Stress
    2: 'https://docs.google.com/forms/d/e/1FAIpQLSe_EXEMPLO2/viewform', // Escala de Vulnerabilidade ao Stress  
    3: 'https://docs.google.com/forms/d/e/1FAIpQLSe_EXEMPLO3/viewform'  // Questionário de Desconforto Menstrual
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
    
    // Construir URL do questionário com ID do usuário
    const baseUrl = QUESTIONARIOS_URLS[numero];
    
    // Para Google Forms, adicionar parâmetros via URL
    // Você deve configurar campos no seu Google Form com nomes específicos
    const urlComId = `${baseUrl}?entry.USER_ID=${userId}&entry.TIMESTAMP=${Date.now()}`;
    
    // Mostrar modal de confirmação
    mostrarModal(
        `Você será redirecionado para o questionário "${obterTituloQuestionario(numero)}". 
         
         📝 IMPORTANTE:
         • Anote seu ID: ${userId}
         • Complete todo o questionário
         • Após enviar, volte para esta página
         • O sistema detectará automaticamente que você completou`,
        () => {
            // Salvar timestamp de início
            localStorage.setItem(`inicio_q${numero}_${userId}`, Date.now());
            
            // Abrir questionário em nova aba
            const novaAba = window.open(urlComId, '_blank');
            
            // Se o popup foi bloqueado, mostrar instrução
            if (!novaAba || novaAba.closed || typeof novaAba.closed == 'undefined') {
                alert('⚠️ Pop-ups bloqueados! Clique no link abaixo para acessar o questionário:\n\n' + urlComId);
            }
            
            // Simular progresso após 30 segundos (método de fallback)
            setTimeout(() => {
                if (!progressoUsuario[`questionario${numero}`]) {
                    mostrarModal(
                        `Você completou o questionário ${numero}?`,
                        () => marcarQuestionarioCompleto(numero)
                    );
                }
            }, 30000); // 30 segundos
        }
    );
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
    // Verificar parâmetros da URL para detectar retorno
    const urlParams = new URLSearchParams(window.location.search);
    const completed = urlParams.get('completed');
    
    if (completed) {
        const numeroQuestionario = parseInt(completed);
        if (numeroQuestionario >= 1 && numeroQuestionario <= 3) {
            // Marcar como completo com delay para animação
            setTimeout(() => {
                marcarQuestionarioCompleto(numeroQuestionario);
                mostrarMensagemSucesso(numeroQuestionario);
            }, 1000);
        }
        
        // Limpar URL
        window.history.replaceState({}, '', window.location.pathname);
    }
    
    // Detectar retorno por foco na janela (método alternativo)
    let windowFocused = true;
    
    window.addEventListener('blur', () => {
        windowFocused = false;
    });
    
    window.addEventListener('focus', () => {
        if (!windowFocused) {
            // Usuário voltou para a página - verificar se completou algum questionário
            setTimeout(verificarCompletudePorTempo, 2000);
        }
        windowFocused = true;
    });
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
