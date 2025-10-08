/**
 * Configuração do EmailJS para envio de notificações por email
 * 
 * INSTRUÇÕES DE CONFIGURAÇÃO:
 * 
 * 1. Cadastre-se no EmailJS (https://www.emailjs.com/)
 * 2. Crie um serviço de email (Gmail, Outlook, etc.)
 * 3. Crie um template de email
 * 4. Substitua as configurações abaixo pelas suas
 * 5. Adicione o script do EmailJS no HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
 */

// Configuração do EmailJS
window.EMAIL_CONFIG = {
    // Substitua pelos seus IDs do EmailJS
    SERVICE_ID: 'seu_service_id',        // Ex: 'service_abc123'
    TEMPLATE_ID: 'seu_template_id',      // Ex: 'template_xyz789'
    PUBLIC_KEY: 'sua_public_key',       // Ex: 'user_abc123def456'
    
    // Template sugerido para o EmailJS:
    TEMPLATE_EXEMPLO: {
        /*
        Assunto: Nova Dúvida Recebida - {{subject}}
        
        Corpo do Email:
        
        Olá,
        
        Uma nova dúvida foi enviada no site do Projeto PIBITI.
        
        **Detalhes:**
        - Categoria: {{categoria}}
        - Data: {{data}}
        
        **Dúvida:**
        {{message}}
        
        **Para responder:**
        Clique no link abaixo para acessar a página de administração e responder à dúvida:
        {{link_resposta}}
        
        ---
        Sistema de Dúvidas - Projeto PIBITI
        */
    }
};

/**
 * Função para inicializar o EmailJS
 */
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(window.EMAIL_CONFIG.PUBLIC_KEY);
        console.log('EmailJS inicializado com sucesso');
        return true;
    } else {
        console.warn('EmailJS não encontrado. Carregue o script: https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js');
        return false;
    }
}

/**
 * Função para enviar notificação por email
 */
async function enviarNotificacaoEmail(dadosDuvida) {
    if (!window.EMAIL_CONFIG.SERVICE_ID || !initEmailJS()) {
        console.log('EmailJS não configurado, pulando envio de email');
        return false;
    }
    
    try {
        const templateParams = {
            to_email: 'antmattody@gmail.com',
            categoria: dadosDuvida.categoria,
            message: dadosDuvida.duvida,
            data: new Date().toLocaleString('pt-BR'),
            link_resposta: dadosDuvida.link_resposta,
            subject: `${dadosDuvida.categoria.toUpperCase()}`
        };
        
        const result = await emailjs.send(
            window.EMAIL_CONFIG.SERVICE_ID,
            window.EMAIL_CONFIG.TEMPLATE_ID,
            templateParams
        );
        
        console.log('Email enviado com sucesso:', result);
        return true;
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        return false;
    }
}

// Inicializar automaticamente se EmailJS estiver disponível
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que EmailJS foi carregado
    setTimeout(initEmailJS, 1000);
});

/**
 * ALTERNATIVA: Usar Webhook para Zapier/IFTTT
 * 
 * Se preferir usar um webhook em vez do EmailJS:
 */
window.WEBHOOK_CONFIG = {
    // URL do webhook (Zapier, IFTTT, ou similar)
    WEBHOOK_URL: '', // Ex: 'https://hooks.zapier.com/hooks/catch/123456/abcdef/'
    ENABLED: false   // Alterar para true para ativar
};

async function enviarViaWebhook(dadosDuvida) {
    if (!window.WEBHOOK_CONFIG.ENABLED || !window.WEBHOOK_CONFIG.WEBHOOK_URL) {
        return false;
    }
    
    try {
        const response = await fetch(window.WEBHOOK_CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'antmattody@gmail.com',
                assunto: `Nova Dúvida - ${dadosDuvida.categoria}`,
                categoria: dadosDuvida.categoria,
                duvida: dadosDuvida.duvida,
                data: new Date().toISOString(),
                link_resposta: dadosDuvida.link_resposta
            })
        });
        
        console.log('Webhook enviado:', response.ok);
        return response.ok;
    } catch (error) {
        console.error('Erro no webhook:', error);
        return false;
    }
}