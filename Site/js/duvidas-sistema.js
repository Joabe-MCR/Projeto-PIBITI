/**
 * Sistema de Gerenciamento de Dúvidas - JavaScript
 * Substitui o sistema Python anterior
 */

class SistemaDuvidas {
    constructor() {
        this.API_BASE = window.location.origin;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCharCounter();
    }

    setupEventListeners() {
        // Event listener para envio de dúvidas
        const formDuvida = document.getElementById('form-enviar-duvida');
        if (formDuvida) {
            formDuvida.addEventListener('submit', (e) => this.enviarDuvida(e));
        }

        // Event listener para contador de caracteres
        const textareaDuvida = document.getElementById('texto-duvida');
        if (textareaDuvida) {
            textareaDuvida.addEventListener('input', () => this.updateCharCounter());
        }
    }

    setupCharCounter() {
        this.updateCharCounter();
    }

    updateCharCounter() {
        const textarea = document.getElementById('texto-duvida');
        const counter = document.getElementById('char-counter');
        
        if (textarea && counter) {
            const currentLength = textarea.value.length;
            counter.textContent = currentLength;
            
            // Mudar cor se próximo do limite
            if (currentLength > 450) {
                counter.style.color = '#e74c3c';
            } else if (currentLength > 400) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#666';
            }
        }
    }

    async enviarDuvida(event) {
        event.preventDefault();
        
        const categoria = document.getElementById('categoria-duvida').value;
        const duvida = document.getElementById('texto-duvida').value;
        const btnEnviar = document.querySelector('.btn-enviar');
        
        // Validar campos
        if (!categoria || !duvida.trim()) {
            this.showError('Por favor, preencha todos os campos.');
            return;
        }

        if (duvida.trim().length > 500) {
            this.showError('A dúvida não pode ter mais de 500 caracteres.');
            return;
        }
        
        // Desabilitar botão durante envio
        const originalText = btnEnviar.textContent;
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        
        try {
            const response = await fetch(`${this.API_BASE}/api/salvar-duvida`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoria: categoria,
                    duvida: duvida.trim(),
                    timestamp: new Date().toISOString()
                })
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                this.showSuccess();
                this.limparFormularioDuvida();
                
                // Enviar email usando EmailJS (opcional)
                this.enviarEmailNotificacao(result.email_data);
            } else {
                throw new Error(result.error || 'Erro ao enviar dúvida');
            }
        } catch (error) {
            console.error('Erro ao enviar dúvida:', error);
            this.showError('Erro ao enviar dúvida. Tente novamente mais tarde.');
        } finally {
            // Reabilitar botão
            btnEnviar.disabled = false;
            btnEnviar.textContent = originalText;
        }
    }

    async carregarPerguntasRespondidas() {
        const container = document.getElementById('perguntas-container');
        const loading = document.getElementById('loading-respondidas');
        const semPerguntas = document.getElementById('sem-perguntas');
        
        if (!container) return;
        
        // Mostrar loading
        if (loading) loading.style.display = 'flex';
        if (semPerguntas) semPerguntas.style.display = 'none';
        
        // Limpar container
        const perguntasExistentes = container.querySelectorAll('.pergunta-respondida-item');
        perguntasExistentes.forEach(p => p.remove());
        
        try {
            const response = await fetch(`${this.API_BASE}/api/get-duvidas?status=respondida`);
            
            if (response.ok) {
                const result = await response.json();
                const perguntas = result.duvidas || [];
                
                if (loading) loading.style.display = 'none';
                
                if (perguntas.length === 0) {
                    if (semPerguntas) {
                        semPerguntas.style.display = 'block';
                    } else {
                        container.innerHTML = '<p class="sem-perguntas">Nenhuma pergunta respondida ainda.</p>';
                    }
                } else {
                    this.exibirPerguntasRespondidas(perguntas, container);
                }
            } else {
                throw new Error('Erro ao carregar perguntas');
            }
        } catch (error) {
            console.error('Erro ao carregar perguntas:', error);
            if (loading) loading.style.display = 'none';
            
            const errorMsg = '<p class="erro-carregar">Erro ao carregar perguntas. Tente novamente.</p>';
            if (semPerguntas) {
                semPerguntas.innerHTML = errorMsg;
                semPerguntas.style.display = 'block';
            } else {
                container.innerHTML = errorMsg;
            }
        }
    }

    exibirPerguntasRespondidas(perguntas, container) {
        perguntas.forEach(pergunta => {
            const perguntaElement = this.createPerguntaElement(pergunta);
            container.appendChild(perguntaElement);
        });
    }

    createPerguntaElement(pergunta) {
        const div = document.createElement('div');
        div.className = 'pergunta-respondida-item';
        
        const categoriaLabel = this.getCategoriaLabel(pergunta.categoria);
        const dataResposta = pergunta.data_resposta 
            ? new Date(pergunta.data_resposta).toLocaleDateString('pt-BR')
            : 'Data não disponível';
            
        div.innerHTML = `
            <div class="pergunta-header">
                <span class="categoria-badge">${categoriaLabel}</span>
                <span class="data-resposta">Respondida em ${dataResposta}</span>
            </div>
            <div class="pergunta-conteudo">
                <h4 class="pergunta-titulo">${pergunta.titulo}</h4>
                <div class="pergunta-resposta">
                    <p>${pergunta.resposta}</p>
                    <div class="resposta-autor">
                        <small>— ${pergunta.respondida_por}</small>
                    </div>
                </div>
            </div>
        `;
        
        return div;
    }

    getCategoriaLabel(categoria) {
        const labels = {
            'estresse': 'Estresse',
            'menacme': 'Ciclo Menstrual',
            'questionarios': 'Questionários',
            'pesquisa': 'Pesquisa',
            'outros': 'Outros'
        };
        return labels[categoria] || categoria;
    }

    async enviarEmailNotificacao(emailData) {
        // Integração com EmailJS (opcional)
        if (typeof emailjs !== 'undefined' && window.EMAIL_CONFIG) {
            try {
                await emailjs.send(
                    window.EMAIL_CONFIG.SERVICE_ID,
                    window.EMAIL_CONFIG.TEMPLATE_ID,
                    {
                        to_email: emailData.to,
                        subject: emailData.subject,
                        message: emailData.body,
                        reply_to: 'noreply@projeto-pibiti.com'
                    },
                    window.EMAIL_CONFIG.PUBLIC_KEY
                );
                console.log('Email de notificação enviado com sucesso');
            } catch (error) {
                console.warn('Erro ao enviar email de notificação:', error);
            }
        }
    }

    showSuccess() {
        const mensagem = document.getElementById('mensagem-sucesso');
        if (mensagem) {
            mensagem.style.display = 'flex';
        }
    }

    showError(message) {
        alert(message); // Por simplicidade, pode ser melhorado com um modal customizado
    }

    limparFormularioDuvida() {
        const form = document.getElementById('form-enviar-duvida');
        if (form) {
            form.reset();
            this.updateCharCounter();
        }
    }

    fecharMensagemSucesso() {
        const mensagem = document.getElementById('mensagem-sucesso');
        const formulario = document.getElementById('formulario-duvida');
        
        if (mensagem) mensagem.style.display = 'none';
        if (formulario) formulario.style.display = 'none';
    }

    toggleFormularioDuvida() {
        const formulario = document.getElementById('formulario-duvida');
        const perguntasRespondidas = document.getElementById('lista-perguntas-respondidas');
        
        if (formulario) {
            const isVisible = formulario.style.display !== 'none';
            formulario.style.display = isVisible ? 'none' : 'block';
            
            // Fechar perguntas respondidas se aberto
            if (perguntasRespondidas && formulario.style.display === 'block') {
                perguntasRespondidas.style.display = 'none';
            }
        }
    }

    togglePerguntasRespondidas() {
        const lista = document.getElementById('lista-perguntas-respondidas');
        const formulario = document.getElementById('formulario-duvida');
        
        if (lista) {
            const isVisible = lista.style.display !== 'none';
            lista.style.display = isVisible ? 'none' : 'block';
            
            // Fechar formulário se aberto
            if (formulario && lista.style.display === 'block') {
                formulario.style.display = 'none';
            }
            
            // Carregar perguntas se abrindo
            if (lista.style.display === 'block') {
                this.carregarPerguntasRespondidas();
            }
        }
    }
}

// Instância global do sistema
let sistemaDuvidas;

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    sistemaDuvidas = new SistemaDuvidas();
    
    // Expor funções globalmente para compatibilidade com HTML existente
    window.enviarDuvida = (event) => sistemaDuvidas.enviarDuvida(event);
    window.toggleFormularioDuvida = () => sistemaDuvidas.toggleFormularioDuvida();
    window.togglePerguntasRespondidas = () => sistemaDuvidas.togglePerguntasRespondidas();
    window.fecharMensagemSucesso = () => sistemaDuvidas.fecharMensagemSucesso();
});

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaDuvidas;
}