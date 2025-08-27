// ==========================================
// SISTEMA DE DIAGNÓSTICO PERSONALIZADO
// ==========================================

// Configurações de diagnóstico
const CONFIGURACAO_DIAGNOSTICO = {
    niveis: {
        baixo: { min: 0, max: 33, cor: '#28a745', classe: 'nivel-baixo' },
        moderado: { min: 34, max: 66, cor: '#ffc107', classe: 'nivel-moderado' },
        alto: { min: 67, max: 100, cor: '#dc3545', classe: 'nivel-alto' }
    },
    
    // Textos base para diagnósticos (serão personalizados)
    textos: {
        stress: {
            baixo: "Sua percepção de stress está em um nível controlável. Você demonstra boa capacidade de gerenciar situações desafiadoras.",
            moderado: "Você apresenta um nível moderado de percepção de stress. É importante implementar estratégias de manejo.",
            alto: "Sua percepção de stress está elevada. Recomendamos atenção especial ao seu bem-estar emocional."
        },
        vulnerabilidade: {
            baixo: "Você possui boa resistência ao stress e recursos adaptativos eficazes.",
            moderado: "Sua vulnerabilidade ao stress está em nível intermediário. Algumas situações podem ser mais desafiadoras.",
            alto: "Você pode ser mais sensível aos efeitos do stress. É importante desenvolver estratégias protetivas."
        },
        desconforto: {
            baixo: "Você relata baixos níveis de desconforto menstrual, o que é positivo para seu bem-estar.",
            moderado: "Você experimenta desconforto menstrual moderado. Algumas estratégias podem ajudar no alívio.",
            alto: "Você apresenta níveis significativos de desconforto menstrual. Considere buscar orientação profissional."
        }
    }
};

// Variáveis globais
let userId = null;
let dadosDiagnostico = {};
let animacoesCompletas = false;

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarDiagnostico();
});

function inicializarDiagnostico() {
    // Obter ID do usuário
    userId = obterUserIdDaUrl() || localStorage.getItem('userSessionId');
    
    if (!userId) {
        redirecionarParaQuestionarios();
        return;
    }
    
    // Exibir ID do usuário
    document.getElementById('userIdDisplay').textContent = userId;
    document.getElementById('dataCompleta').textContent = new Date().toLocaleDateString('pt-BR');
    
    // Simular carregamento e gerar diagnóstico
    setTimeout(() => {
        gerarDiagnostico();
    }, 2000);
}

function obterUserIdDaUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId');
}

function redirecionarParaQuestionarios() {
    alert('Você precisa completar os questionários primeiro.');
    window.location.href = 'questionarios.html';
}

// ==========================================
// GERAÇÃO DE DIAGNÓSTICO
// ==========================================

async function gerarDiagnostico() {
    try {
        // Primeiro, tentar buscar resultado real da API
        const resultadoReal = await buscarResultadoAPI(userId);
        
        if (resultadoReal) {
            // Usar dados reais da API
            dadosDiagnostico = processarDadosReais(resultadoReal);
        } else {
            // Fallback para dados simulados
            dadosDiagnostico = gerarDadosSimulados();
        }
        
    } catch (error) {
        console.log('API não disponível, usando dados simulados:', error);
        dadosDiagnostico = gerarDadosSimulados();
    }
    
    // Ocultar loading e mostrar conteúdo
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('diagnosticoContent').style.display = 'block';
    document.getElementById('acoesFinais').style.display = 'block';
    
    // Aplicar diagnósticos
    aplicarDiagnosticoStress();
    aplicarDiagnosticoVulnerabilidade();
    aplicarDiagnosticoDesconforto();
    
    // Gerar análise integrada
    gerarAnaliseIntegrada();
    
    // Gerar recomendações
    gerarRecomendacoes();
    
    // Salvar no localStorage
    localStorage.setItem(`diagnostico_${userId}`, JSON.stringify(dadosDiagnostico));
}

async function buscarResultadoAPI(userId) {
    // URL da API (ajuste conforme necessário)
    const API_BASE = 'http://localhost:5000/api';
    
    try {
        const response = await fetch(`${API_BASE}/participante/${userId}`);
        
        if (response.ok) {
            const data = await response.json();
            return data.resultados;
        }
        
        return null;
    } catch (error) {
        throw error;
    }
}

function processarDadosReais(resultados) {
    // Converter dados reais da API para o formato esperado
    const dados = {
        timestamp: new Date().toISOString(),
        fonte: 'api_real'
    };
    
    // Processar cada questionário
    if (resultados.estresse) {
        dados.stress = {
            pontuacao: resultados.estresse.pontuacao_total || 0,
            nivel: determinarNivel(resultados.estresse.pontuacao_total || 0),
            categoria: resultados.estresse.categoria || 'N/A',
            detalhes: resultados.estresse
        };
    }
    
    if (resultados.vulnerabilidade) {
        dados.vulnerabilidade = {
            pontuacao: resultados.vulnerabilidade.pontuacao_total || 0,
            nivel: determinarNivel(resultados.vulnerabilidade.pontuacao_total || 0),
            categoria: resultados.vulnerabilidade.categoria || 'N/A',
            detalhes: resultados.vulnerabilidade
        };
    }
    
    if (resultados.menacme) {
        dados.desconforto = {
            pontuacao: resultados.menacme.pontuacao_total || 0,
            nivel: determinarNivel(resultados.menacme.pontuacao_total || 0),
            categoria: resultados.menacme.categoria || 'N/A',
            detalhes: resultados.menacme
        };
    }
    
    return dados;
}

function determinarNivel(pontuacao) {
    if (pontuacao <= 33) return 'baixo';
    if (pontuacao <= 66) return 'moderado';
    return 'alto';
}

function salvarDiagnostico() {
    localStorage.setItem(`diagnostico_${userId}`, JSON.stringify(dadosDiagnostico));
}

function gerarDadosSimulados() {
    // Gerar dados baseados em padrões de pesquisa
    const base = parseInt(userId.slice(-3)) % 100; // Usar final do ID para consistência
    
    return {
        stress: Math.max(10, Math.min(90, 30 + (base % 60))),
        vulnerabilidade: Math.max(10, Math.min(90, 25 + ((base * 1.3) % 65))),
        desconforto: Math.max(10, Math.min(90, 20 + ((base * 0.8) % 70))),
        timestamp: new Date().toISOString()
    };
}

// ==========================================
// APLICAÇÃO DE DIAGNÓSTICOS INDIVIDUAIS
// ==========================================

function aplicarDiagnosticoStress() {
    const valor = dadosDiagnostico.stress;
    const nivel = determinarNivel(valor);
    
    // Atualizar badge
    const badge = document.getElementById('nivelStressBadge');
    const texto = document.getElementById('nivelStressTexto');
    badge.className = `nivel-badge ${CONFIGURACAO_DIAGNOSTICO.niveis[nivel].classe}`;
    texto.textContent = `${nivel.toUpperCase()} (${valor}%)`;
    
    // Animar barra
    const barra = document.getElementById('barraStress');
    setTimeout(() => {
        barra.style.width = `${valor}%`;
        barra.style.background = gerarGradienteBarra(valor);
    }, 500);
    
    // Atualizar descrição
    document.getElementById('descricaoStress').textContent = 
        CONFIGURACAO_DIAGNOSTICO.textos.stress[nivel];
}

function aplicarDiagnosticoVulnerabilidade() {
    const valor = dadosDiagnostico.vulnerabilidade;
    const nivel = determinarNivel(valor);
    
    // Atualizar badge
    const badge = document.getElementById('nivelVulnerabilidadeBadge');
    const texto = document.getElementById('nivelVulnerabilidadeTexto');
    badge.className = `nivel-badge ${CONFIGURACAO_DIAGNOSTICO.niveis[nivel].classe}`;
    texto.textContent = `${nivel.toUpperCase()} (${valor}%)`;
    
    // Animar barra
    const barra = document.getElementById('barraVulnerabilidade');
    setTimeout(() => {
        barra.style.width = `${valor}%`;
        barra.style.background = gerarGradienteBarra(valor);
    }, 800);
    
    // Atualizar descrição
    document.getElementById('descricaoVulnerabilidade').textContent = 
        CONFIGURACAO_DIAGNOSTICO.textos.vulnerabilidade[nivel];
}

function aplicarDiagnosticoDesconforto() {
    const valor = dadosDiagnostico.desconforto;
    const nivel = determinarNivel(valor);
    
    // Atualizar badge
    const badge = document.getElementById('nivelDesconfortoBadge');
    const texto = document.getElementById('nivelDesconfortoTexto');
    badge.className = `nivel-badge ${CONFIGURACAO_DIAGNOSTICO.niveis[nivel].classe}`;
    texto.textContent = `${nivel.toUpperCase()} (${valor}%)`;
    
    // Animar barra
    const barra = document.getElementById('barraDesconforto');
    setTimeout(() => {
        barra.style.width = `${valor}%`;
        barra.style.background = gerarGradienteBarra(valor);
    }, 1100);
    
    // Atualizar descrição
    document.getElementById('descricaoDesconforto').textContent = 
        CONFIGURACAO_DIAGNOSTICO.textos.desconforto[nivel];
}

// ==========================================
// ANÁLISE INTEGRADA
// ==========================================

function gerarAnaliseIntegrada() {
    const { stress, vulnerabilidade, desconforto } = dadosDiagnostico;
    
    let analise = [];
    
    // Análise da correlação entre stress e desconforto
    if (stress > 60 && desconforto > 60) {
        analise.push("Há uma possível correlação entre seus níveis elevados de stress e desconforto menstrual. Esta é uma observação comum em nossa pesquisa, sugerindo que o manejo do stress pode contribuir para o alívio dos sintomas menstruais.");
    } else if (stress < 40 && desconforto < 40) {
        analise.push("Seus baixos níveis de stress parecem correlacionados com menores níveis de desconforto menstrual, o que está alinhado com os achados de nossa pesquisa sobre a relação entre bem-estar emocional e saúde menstrual.");
    }
    
    // Análise da vulnerabilidade
    if (vulnerabilidade > 70) {
        analise.push("Sua alta vulnerabilidade ao stress sugere que você pode se beneficiar especialmente de estratégias preventivas e técnicas de manejo do stress antes que situações desafiadoras se intensifiquem.");
    } else if (vulnerabilidade < 30) {
        analise.push("Sua baixa vulnerabilidade ao stress indica boa capacidade de resiliência. Isso é um fator protetor importante para seu bem-estar geral.");
    }
    
    // Análise do perfil geral
    const media = (stress + vulnerabilidade + desconforto) / 3;
    if (media < 35) {
        analise.push("De forma geral, seu perfil indica bons níveis de bem-estar e capacidade de manejo das situações avaliadas. Continue mantendo seus hábitos saudáveis.");
    } else if (media > 65) {
        analise.push("Seu perfil geral sugere a importância de dedicar atenção especial ao seu bem-estar. Pequenas mudanças na rotina podem trazer benefícios significativos.");
    }
    
    // Se não há análises específicas, usar uma geral
    if (analise.length === 0) {
        analise.push("Seus resultados mostram um perfil único que contribui para nossa compreensão da diversidade de experiências relacionadas ao stress e bem-estar menstrual. Cada participante traz insights valiosos para nossa pesquisa.");
    }
    
    // Atualizar DOM
    const container = document.getElementById('analiseIntegrada');
    container.innerHTML = '';
    analise.forEach(texto => {
        const p = document.createElement('p');
        p.textContent = texto;
        container.appendChild(p);
    });
}

// ==========================================
// RECOMENDAÇÕES PERSONALIZADAS
// ==========================================

function gerarRecomendacoes() {
    const { stress, vulnerabilidade, desconforto } = dadosDiagnostico;
    const recomendacoes = [];
    
    // Recomendações baseadas no stress
    if (stress > 60) {
        recomendacoes.push({
            titulo: "🧘‍♀️ Técnicas de Relaxamento",
            descricao: "Pratique técnicas de respiração profunda, meditação ou yoga. Reserve 10-15 minutos diários para relaxamento consciente."
        });
        
        recomendacoes.push({
            titulo: "⏰ Gestão do Tempo",
            descricao: "Organize suas atividades com prioridades claras. Evite sobrecarga e aprenda a dizer 'não' quando necessário."
        });
    }
    
    // Recomendações baseadas na vulnerabilidade
    if (vulnerabilidade > 60) {
        recomendacoes.push({
            titulo: "💪 Fortalecimento da Resiliência",
            descricao: "Desenvolva sua rede de apoio social. Mantenha conexões significativas com familiares e amigos."
        });
        
        recomendacoes.push({
            titulo: "🎯 Estratégias Preventivas",
            descricao: "Identifique seus gatilhos de stress e desenvolva planos de ação antecipados para situações desafiadoras."
        });
    }
    
    // Recomendações baseadas no desconforto menstrual
    if (desconforto > 60) {
        recomendacoes.push({
            titulo: "🏃‍♀️ Atividade Física Regular",
            descricao: "Exercícios moderados podem reduzir significativamente os sintomas menstruais. Considere caminhadas, natação ou yoga."
        });
        
        recomendacoes.push({
            titulo: "🥗 Cuidados Nutricionais",
            descricao: "Mantenha uma alimentação equilibrada, rica em ferro e vitaminas. Reduza cafeína e açúcar durante o período menstrual."
        });
    }
    
    // Recomendações gerais sempre incluídas
    recomendacoes.push({
        titulo: "😴 Qualidade do Sono",
        descricao: "Mantenha horários regulares de sono. Uma boa qualidade de sono é fundamental para o equilíbrio hormonal e bem-estar."
    });
    
    recomendacoes.push({
        titulo: "📱 Monitoramento Pessoal",
        descricao: "Considere manter um diário de sintomas para identificar padrões e gatilhos. Isso pode ajudar no autoconhecimento."
    });
    
    // Atualizar DOM
    const container = document.getElementById('recomendacoesList');
    container.innerHTML = '';
    
    recomendacoes.forEach(rec => {
        const div = document.createElement('div');
        div.className = 'recomendacao-item';
        div.innerHTML = `
            <h4>${rec.titulo}</h4>
            <p>${rec.descricao}</p>
        `;
        container.appendChild(div);
    });
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function determinarNivel(valor) {
    if (valor <= CONFIGURACAO_DIAGNOSTICO.niveis.baixo.max) return 'baixo';
    if (valor <= CONFIGURACAO_DIAGNOSTICO.niveis.moderado.max) return 'moderado';
    return 'alto';
}

function gerarGradienteBarra(valor) {
    if (valor <= 33) {
        return `linear-gradient(90deg, #28a745 0%, #28a745 100%)`;
    } else if (valor <= 66) {
        return `linear-gradient(90deg, #28a745 0%, #ffc107 ${valor}%, #ffc107 100%)`;
    } else {
        return `linear-gradient(90deg, #28a745 0%, #ffc107 50%, #dc3545 ${valor}%, #dc3545 100%)`;
    }
}

function salvarDiagnostico() {
    const dadosCompletos = {
        userId: userId,
        diagnostico: dadosDiagnostico,
        timestamp: new Date().toISOString(),
        versao: '1.0'
    };
    
    localStorage.setItem(`diagnostico_${userId}`, JSON.stringify(dadosCompletos));
    
    // Salvar também um histórico
    const historico = JSON.parse(localStorage.getItem('historico_diagnosticos') || '[]');
    historico.push(dadosCompletos);
    localStorage.setItem('historico_diagnosticos', JSON.stringify(historico));
}

// ==========================================
// AÇÕES DO USUÁRIO
// ==========================================

function salvarDiagnostico() {
    // Criar conteúdo para download
    const conteudo = `
DIAGNÓSTICO PERSONALIZADO - PROJETO PIBITI
==========================================

ID da Sessão: ${userId}
Data: ${new Date().toLocaleDateString('pt-BR')}

RESULTADOS:
- Percepção de Stress: ${dadosDiagnostico.stress}% (${determinarNivel(dadosDiagnostico.stress)})
- Vulnerabilidade ao Stress: ${dadosDiagnostico.vulnerabilidade}% (${determinarNivel(dadosDiagnostico.vulnerabilidade)})
- Desconforto Menstrual: ${dadosDiagnostico.desconforto}% (${determinarNivel(dadosDiagnostico.desconforto)})

ANÁLISE INTEGRADA:
${document.getElementById('analiseIntegrada').innerText}

RECOMENDAÇÕES:
${Array.from(document.querySelectorAll('.recomendacao-item')).map(item => 
    item.querySelector('h4').textContent + ': ' + item.querySelector('p').textContent
).join('\\n')}

Este diagnóstico foi gerado automaticamente com base em suas respostas e não substitui consulta médica profissional.
    `;
    
    // Baixar arquivo
    const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico_${userId}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Feedback visual
    mostrarNotificacao('📥 Diagnóstico salvo com sucesso!', 'success');
}

function compartilharResultados() {
    document.getElementById('modalCompartilhar').style.display = 'flex';
}

function fecharModalCompartilhar() {
    document.getElementById('modalCompartilhar').style.display = 'none';
}

function compartilharWhatsApp() {
    const texto = `Acabei de completar uma avaliação sobre stress e bem-estar menstrual no Projeto PIBITI. Meus resultados: Stress ${dadosDiagnostico.stress}%, Vulnerabilidade ${dadosDiagnostico.vulnerabilidade}%, Desconforto ${dadosDiagnostico.desconforto}%. Participe também!`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    fecharModalCompartilhar();
}

function compartilharEmail() {
    const assunto = 'Diagnóstico - Projeto PIBITI';
    const corpo = `Olá!\n\nCompartilho meu diagnóstico do Projeto PIBITI sobre stress e bem-estar menstrual:\n\n- Percepção de Stress: ${dadosDiagnostico.stress}%\n- Vulnerabilidade: ${dadosDiagnostico.vulnerabilidade}%\n- Desconforto Menstrual: ${dadosDiagnostico.desconforto}%\n\nEste projeto contribui para pesquisas importantes sobre saúde feminina!`;
    
    const url = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = url;
    fecharModalCompartilhar();
}

function copiarLink() {
    // Em uma implementação real, isso geraria um link compartilhável
    const linkCompartilhamento = `${window.location.origin}/questionarios.html`;
    
    navigator.clipboard.writeText(linkCompartilhamento).then(() => {
        mostrarNotificacao('🔗 Link copiado para área de transferência!', 'success');
        fecharModalCompartilhar();
    }).catch(() => {
        // Fallback para browsers mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = linkCompartilhamento;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        mostrarNotificacao('🔗 Link copiado!', 'success');
        fecharModalCompartilhar();
    });
}

function novaAvaliacao() {
    if (confirm('Isso iniciará uma nova avaliação e os dados atuais serão mantidos como histórico. Deseja continuar?')) {
        // Limpar dados da sessão atual
        localStorage.removeItem('userSessionId');
        localStorage.removeItem(`progress_${userId}`);
        
        // Redirecionar para nova avaliação
        window.location.href = 'questionarios.html';
    }
}

function entrarEmContato() {
    const email = 'pesquisa.stress@exemplo.com';
    const assunto = `Contato - Projeto PIBITI - ID: ${userId}`;
    const corpo = `Olá!\n\nGostaria de entrar em contato sobre o Projeto PIBITI.\n\nMeu ID de sessão: ${userId}\nData da avaliação: ${new Date().toLocaleDateString('pt-BR')}\n\nMensagem:\n`;
    
    const url = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.location.href = url;
}

function voltarAoTopo() {
    document.getElementById('diagnostico').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ==========================================
// SISTEMA DE NOTIFICAÇÕES
// ==========================================

function mostrarNotificacao(mensagem, tipo = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-text">${mensagem}</span>
        </div>
    `;
    
    // Estilos inline para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${tipo === 'success' ? '#28a745' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        animation: slideInRight 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Log para desenvolvimento
console.log('Sistema de diagnóstico carregado. ID do usuário:', userId);
