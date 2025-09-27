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
    
    // Pontos de corte para classificação binária
    pontosCorte: {
        stress: 50, // Acima de 50 = estressada
        vulnerabilidade: 50, // Acima de 50 = vulnerável
        desconforto: 2.0 // MSD acima de 2.0 = alteração no ciclo menstrual
    },
    
    // 8 Diagnósticos personalizados baseados na combinação binária
    diagnosticosPersonalizados: {
        '000': { // Não estressada + Não vulnerável + Sem alteração
            codigo: 'perfil_saudavel',
            titulo: '💚 Perfil Equilibrado',
            subtitulo: 'Você apresenta um perfil de bem-estar e equilíbrio',
            descricao: 'Você não apresenta níveis relevantes de estresse nem sinais de vulnerabilidade ou alterações menstruais. Isso significa que seu corpo está em equilíbrio, mas é importante manter hábitos saudáveis para prevenir mudanças futuras. O estresse pode afetar o ciclo menstrual, mesmo em quem hoje não apresenta sintomas, porque interfere nos hormônios que regulam a ovulação e a menstruação. Por isso, cuidar da rotina, buscando mantê-la organizada, praticar atividade física leve e buscar momentos de lazer ajudam a manter sua saúde estável.',
            cor: '#28a745',
            prioridade: 'baixa'
        },
        '001': { // Não estressada + Não vulnerável + Com alteração
            codigo: 'alteracao_isolada',
            titulo: '🟡 Alterações Menstruais sem Estresse',
            subtitulo: 'Alterações no ciclo independentes de fatores estressores atuais',
            descricao: 'Você não apresenta estresse elevado nem vulnerabilidade significativa, mas já tem alterações no ciclo menstrual. Isso pode acontecer porque mesmo níveis mais baixos de estresse ou outros fatores do dia a dia (sono irregular, alimentação, excesso de atividade) podem impactar os hormônios do ciclo ou ser dada por outras causas. O ideal é manter hábitos de vida saudáveis e observar se os sintomas persistem. Caso os ciclos continuem irregulares ou venham acompanhados de dor intensa, é importante procurar atendimento ginecológico.',
            cor: '#ffc107',
            prioridade: 'media'
        },
        '010': { // Não estressada + Vulnerável + Sem alteração
            codigo: 'vulnerabilidade_latente',
            titulo: '🟠 Vulnerabilidade sem Estresse Atual',
            subtitulo: 'Maior sensibilidade que requer fortalecimento preventivo',
            descricao: 'Você não está com estresse elevado no momento, mas apresenta uma maior vulnerabilidade a ele. Isso significa que fatores do seu estilo de vida ou de sua rotina podem deixá-la mais propensa a sentir impacto quando situações estressantes surgirem. A prática de meditação e técnicas de relaxamento funcionam como um "treino" para o cérebro, fortalecendo a sua resiliência emocional. Além disso, manter uma rede de apoio social ajuda a lidar melhor com possíveis pressões futuras.',
            cor: '#ff8c00',
            prioridade: 'media'
        },
        '011': { // Não estressada + Vulnerável + Com alteração
            codigo: 'vulneravel_com_alteracao',
            titulo: '🟠 Vulnerabilidade com Alterações Menstruais',
            subtitulo: 'Sensibilidade elevada já impactando o ciclo menstrual',
            descricao: 'Você não apresenta estresse elevado, mas tem vulnerabilidade aumentada e já manifesta alterações menstruais. Isso indica que, mesmo sem uma sobrecarga emocional evidente, seu corpo responde de forma mais sensível ao estresse, refletindo no ciclo menstrual. O fortalecimento da resiliência emocional, junto ao suporte social e hábitos saudáveis, pode reduzir esses impactos. Se os sintomas forem intensos ou recorrentes, procurar acompanhamento psicológico e ginecológico é uma medida preventiva importante.',
            cor: '#ff6b35',
            prioridade: 'media'
        },
        '100': { // Estressada + Não vulnerável + Sem alteração
            codigo: 'estresse_situacional',
            titulo: '🔶 Estresse sem Alterações Menstruais',
            subtitulo: 'Estresse presente mas com boa capacidade de adaptação',
            descricao: 'Você apresenta sinais de estresse, mas não de vulnerabilidade significativa nem de impacto no ciclo menstrual. Isso indica que seu corpo está conseguindo lidar com as demandas atuais, mas já mostra sinais de sobrecarga. Técnicas de relaxamento, como meditação e exercícios de respiração, ajudam a reduzir o cortisol, hormônio do estresse, melhorando sono, humor e concentração. A prática regular de exercícios físicos também libera endorfinas, que aumentam a sensação de bem-estar.',
            cor: '#ff9500',
            prioridade: 'media'
        },
        '101': { // Estressada + Não vulnerável + Com alteração
            codigo: 'estresse_com_impacto',
            titulo: '🔥 Estresse Impactando o Ciclo Menstrual',
            subtitulo: 'Estresse elevado já refletindo em alterações menstruais',
            descricao: 'Você apresenta sinais de estresse e alterações no ciclo menstrual, embora não tenha vulnerabilidade alta. Isso mostra que o estresse já está repercutindo em seu organismo, especialmente na regulação hormonal do ciclo. Técnicas de relaxamento e exercícios físicos ajudam a equilibrar o eixo hormonal e reduzem o impacto do estresse. Se as alterações persistirem por mais de 2 a 3 ciclos, a avaliação ginecológica é recomendada.',
            cor: '#ff6b00',
            prioridade: 'alta'
        },
        '110': { // Estressada + Vulnerável + Sem alteração
            codigo: 'alto_risco',
            titulo: '⚠️ Estresse Elevado com Vulnerabilidade',
            subtitulo: 'Combinação de risco que necessita intervenção preventiva',
            descricao: 'Você apresenta estresse elevado e também alta vulnerabilidade, embora ainda sem alterações no ciclo menstrual. Isso significa que seu corpo já está sob impacto, mas ainda não mostrou repercussões hormonais. Nessa fase, é essencial adotar uma combinação de estratégias para evitar que o estresse afete sua saúde reprodutiva. Técnicas de relaxamento, exercícios físicos regulares e práticas como yoga ajudam a equilibrar hormônios e reduzir sintomas emocionais. O suporte social também é fundamental para aliviar a carga emocional.',
            cor: '#dc3545',
            prioridade: 'alta'
        },
        '111': { // Estressada + Vulnerável + Com alteração
            codigo: 'perfil_critico',
            titulo: '🚨 Perfil de Impacto Significativo',
            subtitulo: 'Estresse elevado já afetando múltiplas dimensões da saúde',
            descricao: 'Você apresenta estresse elevado, alta vulnerabilidade e alterações menstruais. Esse é um quadro em que o estresse já está impactando de forma significativa sua saúde. É fundamental adotar uma rotina estruturada de técnicas de relaxamento, exercícios físicos regulares, além de atividades complementares como musicoterapia ou arteterapia. Também é essencial procurar acompanhamento psicológico e ginecológico, para que o manejo seja adequado e seguro.',
            cor: '#8b0000',
            prioridade: 'critica'
        }
    },
    
    // Textos base para os níveis (mantidos para as barras)
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
    
    // Gerar diagnóstico imediatamente
    gerarDiagnostico();
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
    console.log('🔄 Iniciando geração de diagnóstico para userId:', userId);
    
    try {
        // Carregar dados dos questionários do localStorage
        console.log('📊 Carregando dados dos questionários...');
        const dadosReais = carregarDadosQuestionarios();
        
        console.log('📋 Dados carregados:', dadosReais);
        
        if (dadosReais.completo) {
            console.log('✅ Usando dados reais dos questionários');
            dadosDiagnostico = processarDadosReais(dadosReais);
        } else {
            console.log('⚠️ Dados incompletos, usando dados simulados');
            dadosDiagnostico = gerarDadosSimulados();
        }
        
        console.log('🎯 Dados processados:', dadosDiagnostico);
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        console.log('🔄 Usando dados simulados como fallback');
        dadosDiagnostico = gerarDadosSimulados();
    }
    
    // Gerar classificação binária e diagnóstico personalizado
    const classificacaoBinaria = gerarClassificacaoBinaria(dadosDiagnostico);
    dadosDiagnostico.classificacao = classificacaoBinaria;
    
    // Ocultar loading e mostrar conteúdo
    console.log('🎨 Ocultando loading e mostrando conteúdo...');
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('diagnosticoContent').style.display = 'block';
    document.getElementById('acoesFinais').style.display = 'block';
    
    // Aplicar diagnósticos
    console.log('📈 Aplicando diagnósticos nas barras...');
    aplicarDiagnosticoStress();
    aplicarDiagnosticoVulnerabilidade();
    aplicarDiagnosticoDesconforto();
    
    // Gerar análise integrada
    console.log('🧠 Gerando análise integrada...');
    gerarAnaliseIntegrada();
    
    // Gerar recomendações
    console.log('💡 Gerando recomendações...');
    gerarRecomendacoes();
    
    // Salvar no localStorage
    console.log('💾 Salvando diagnóstico no localStorage...');
    localStorage.setItem(`diagnostico_${userId}`, JSON.stringify(dadosDiagnostico));
    
    console.log('🎉 Diagnóstico concluído com sucesso!');
}

// ==========================================
// FUNÇÕES DE CLASSIFICAÇÃO BINÁRIA
// ==========================================

function carregarDadosQuestionarios() {
    console.log('🔍 Procurando dados para userId:', userId);
    
    // Listar todas as chaves do localStorage para debug
    console.log('🗂️ Todas as chaves do localStorage:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        console.log(`  - ${key}`);
    }
    
    try {
        const keyQ1 = `resultado_q1_${userId}`;
        const keyQ2 = `resultado_q2_${userId}`;
        const keyQ3 = `resultado_q3_${userId}`;
        
        console.log('🔑 Chaves de busca:', { keyQ1, keyQ2, keyQ3 });
        
        const dataQ1 = localStorage.getItem(keyQ1);
        const dataQ2 = localStorage.getItem(keyQ2);
        const dataQ3 = localStorage.getItem(keyQ3);
        
        console.log('💾 Dados brutos encontrados:', {
            Q1: dataQ1 ? 'ENCONTRADO' : 'NÃO ENCONTRADO',
            Q2: dataQ2 ? 'ENCONTRADO' : 'NÃO ENCONTRADO', 
            Q3: dataQ3 ? 'ENCONTRADO' : 'NÃO ENCONTRADO'
        });
        
        const resultadoQ1 = dataQ1 ? JSON.parse(dataQ1) : null;
        const resultadoQ2 = dataQ2 ? JSON.parse(dataQ2) : null;
        const resultadoQ3 = dataQ3 ? JSON.parse(dataQ3) : null;
        
        console.log('📊 Dados parseados:', {
            Q1: resultadoQ1 ? 'OK' : 'NULL',
            Q2: resultadoQ2 ? 'OK' : 'NULL',
            Q3: resultadoQ3 ? 'OK' : 'NULL'
        });
        
        const completo = resultadoQ1 && resultadoQ2 && resultadoQ3;
        console.log('✅ Dados completos?', completo);
        
        return {
            completo: completo,
            stress: resultadoQ1,
            vulnerabilidade: resultadoQ2,
            desconforto: resultadoQ3
        };
    } catch (error) {
        console.error('❌ Erro ao carregar dados dos questionários:', error);
        return { completo: false };
    }
}

function processarDadosReais(dadosReais) {
    // Garante derivação de porcentagens caso ainda não existam nas versões antigas salvas no localStorage
    const pontuacaoStress = dadosReais.stress?.pontuacaoTotal ?? 0; // 0-40
    const porcentagemStress = dadosReais.stress?.porcentagem ?? (pontuacaoStress > 0 ? (pontuacaoStress / 40) * 100 : 0);

    const pontuacaoVulnerabilidade = dadosReais.vulnerabilidade?.pontuacaoTotal ?? 0; // 0-100
    const porcentagemVulnerabilidade = dadosReais.vulnerabilidade?.porcentagem ?? (pontuacaoVulnerabilidade > 0 ? (pontuacaoVulnerabilidade / 100) * 100 : 0);

    const msd = dadosReais.desconforto?.indiceMSD ?? dadosReais.desconforto?.msd ?? 0; // compat

    return {
        stress: {
            pontuacao: pontuacaoStress,
            porcentagem: Number(porcentagemStress.toFixed(2)),
            nivel: determinarNivel(Number(porcentagemStress))
        },
        vulnerabilidade: {
            pontuacao: pontuacaoVulnerabilidade,
            porcentagem: Number(porcentagemVulnerabilidade.toFixed(2)),
            nivel: determinarNivel(Number(porcentagemVulnerabilidade))
        },
        desconforto: {
            pontuacao: dadosReais.desconforto?.pontuacaoTotal || 0,
            msd: msd,
            mesi: dadosReais.desconforto?.indiceMESI || dadosReais.desconforto?.mesi || 0,
            sintomasComImpacto: dadosReais.desconforto?.sintomasComImpacto || dadosReais.desconforto?.sintomas_com_impacto || 0,
            nivel: determinarNivelDesconforto(msd),
            porcentagem: calcularPorcentagemDesconforto(msd)
        },
        origem: 'real',
        timestamp: new Date().toISOString()
    };
}

function calcularPorcentagemDesconforto(msd) {
    // Converter MSD para porcentagem (0-100%)
    // MSD varia de 0 a 5, então convertemos para porcentagem
    return Math.min(100, Math.max(0, (msd / 5) * 100));
}

function gerarClassificacaoBinaria(dados) {
    const { pontosCorte, diagnosticosPersonalizados } = CONFIGURACAO_DIAGNOSTICO;
    
    // Classificação binária baseada nos pontos de corte
    const estressada = dados.stress.porcentagem > pontosCorte.stress;
    const vulneravel = dados.vulnerabilidade.porcentagem > pontosCorte.vulnerabilidade;
    const alteracaoMenstrual = dados.desconforto.msd > pontosCorte.desconforto;
    
    // Gerar código binário (000 a 111)
    const codigoBinario = `${estressada ? '1' : '0'}${vulneravel ? '1' : '0'}${alteracaoMenstrual ? '1' : '0'}`;
    
    // Obter diagnóstico personalizado
    const diagnosticoPersonalizado = diagnosticosPersonalizados[codigoBinario];
    
    return {
        estressada: estressada,
        vulneravel: vulneravel,
        alteracaoMenstrual: alteracaoMenstrual,
        codigoBinario: codigoBinario,
        diagnostico: diagnosticoPersonalizado,
        pontosCorte: {
            stress: pontosCorte.stress,
            vulnerabilidade: pontosCorte.vulnerabilidade,
            desconforto: pontosCorte.desconforto
        }
    };
}

function determinarNivelDesconforto(msd) {
    if (msd <= 1) return 'baixo';
    if (msd <= 3) return 'moderado';
    return 'alto';
}

function exibirDiagnosticoPersonalizado(classificacao) {
    const { diagnostico } = classificacao;
    
    // Atualizar cabeçalho com diagnóstico personalizado
    const tituloElement = document.querySelector('.diagnostico-header h2');
    const subtituloElement = document.querySelector('.diagnostico-header p');
    
    if (tituloElement && subtituloElement) {
        tituloElement.innerHTML = diagnostico.titulo;
        subtituloElement.textContent = diagnostico.subtitulo;
        
        // Atualizar cor do cabeçalho
        document.querySelector('.diagnostico-header').style.background = 
            `linear-gradient(135deg, ${diagnostico.cor}15, ${diagnostico.cor}25)`;
    }
    
    // Criar seção de diagnóstico personalizado
    criarSecaoDetalhePersonalizado(diagnostico, classificacao);
    
    // Aplicar diagnósticos tradicionais (gráficos de barras)
    setTimeout(() => {
        aplicarDiagnosticoStress();
        aplicarDiagnosticoVulnerabilidade();
        aplicarDiagnosticoDesconforto();
        
        // Ocultar loading e mostrar conteúdo
        document.getElementById('statusCarregamento').style.display = 'none';
        document.getElementById('conteudoDiagnostico').style.display = 'block';
        
        // Gerar análise integrada personalizada
        setTimeout(() => {
            gerarAnaliseIntegradaPersonalizada(classificacao);
        }, 1500);
    }, 1000);
}

function criarSecaoDetalhePersonalizado(diagnostico, classificacao) {
    const container = document.getElementById('analiseIntegrada') || 
                     document.querySelector('.diagnostico-detalhes');
    
    if (!container) return;
    
    const secaoPersonalizada = document.createElement('div');
    secaoPersonalizada.className = 'diagnostico-personalizado';
    secaoPersonalizada.innerHTML = `
        <div class="card-personalizado" style="border-left: 5px solid ${diagnostico.cor};">
            <div class="diagnostico-personalizado-header">
                <h3 style="color: ${diagnostico.cor};">${diagnostico.titulo}</h3>
                <span class="prioridade-badge prioridade-${diagnostico.prioridade}">
                    Prioridade ${diagnostico.prioridade.toUpperCase()}
                </span>
            </div>
            
            <p class="diagnostico-descricao">${diagnostico.descricao}</p>
            
            <div class="classificacao-detalhes">
                <h4>📊 Sua Classificação:</h4>
                <ul class="classificacao-lista">
                    <li class="item-classificacao ${classificacao.estressada ? 'ativo' : 'inativo'}">
                        <strong>Nível de Estresse:</strong> 
                        ${classificacao.estressada ? 'Elevado' : 'Controlado'} 
                        (${dadosDiagnostico.stress.porcentagem}%)
                    </li>
                    <li class="item-classificacao ${classificacao.vulneravel ? 'ativo' : 'inativo'}">
                        <strong>Vulnerabilidade:</strong> 
                        ${classificacao.vulneravel ? 'Alta' : 'Baixa'} 
                        (${dadosDiagnostico.vulnerabilidade.porcentagem}%)
                    </li>
                    <li class="item-classificacao ${classificacao.alteracaoMenstrual ? 'ativo' : 'inativo'}">
                        <strong>Ciclo Menstrual:</strong> 
                        ${classificacao.alteracaoMenstrual ? 'Com alterações' : 'Estável'} 
                        (MSD: ${dadosDiagnostico.desconforto.msd.toFixed(2)})
                    </li>
                </ul>
                
                <div class="codigo-classificacao">
                    <small>Código de classificação: <code>${classificacao.codigoBinario}</code></small>
                </div>
            </div>
        </div>
    `;
    
    container.insertBefore(secaoPersonalizada, container.firstChild);
}

function gerarAnaliseIntegradaPersonalizada(classificacao) {
    const { diagnostico } = classificacao;
    let analise = [];
    
    // Análise baseada no perfil específico
    switch(diagnostico.codigo) {
        case 'perfil_saudavel':
            analise.push("🎉 Excelente! Você mantém um equilíbrio saudável entre bem-estar emocional e físico. Continue praticando seus hábitos saudáveis como forma de prevenção.");
            break;
            
        case 'alteracao_isolada':
            analise.push("🔍 Suas alterações menstruais podem ter causas fisiológicas independentes do estresse. Considere acompanhamento médico para investigar possíveis causas hormonais ou outras condições.");
            break;
            
        case 'vulnerabilidade_latente':
            analise.push("⚠️ Sua vulnerabilidade indica que você pode se beneficiar de estratégias preventivas de manejo do estresse antes que situações desafiadoras se intensifiquem.");
            break;
            
        case 'vulneravel_com_alteracao':
            analise.push("🎯 A combinação de vulnerabilidade com alterações menstruais sugere uma possível conexão. Técnicas de relaxamento podem beneficiar tanto o bem-estar emocional quanto o ciclo menstrual.");
            break;
            
        case 'estresse_controlado':
            analise.push("📈 Apesar do estresse atual, sua baixa vulnerabilidade é um fator protetor importante. Foque em reduzir o estresse para prevenir impactos no ciclo menstrual.");
            break;
            
        case 'estresse_com_impacto':
            analise.push("🚨 O estresse atual está impactando seu ciclo menstrual. Esta é uma situação que requer atenção imediata para técnicas de manejo do estresse e cuidado menstrual.");
            break;
            
        case 'perfil_alto_risco':
            analise.push("⛔ Você apresenta uma combinação preocupante que requer atenção profissional. O estresse elevado e alta vulnerabilidade podem estar intensificando alterações menstruais.");
            break;
            
        case 'perfil_critico':
            analise.push("🆘 Seu perfil indica uma situação crítica que requer intervenção imediata. Recomendamos buscar apoio profissional para manejo integrado do estresse e saúde menstrual.");
            break;
    }
    
    // Adicionar recomendações específicas
    analise.push(gerarRecomendacoesPersonalizadas(classificacao));
    
    // Atualizar na página
    const analiseContainer = document.getElementById('analiseIntegrada') || 
                            document.querySelector('.analise-integrada');
    
    if (analiseContainer) {
        const analisePersonalizada = document.createElement('div');
        analisePersonalizada.className = 'analise-personalizada';
        analisePersonalizada.innerHTML = `
            <h4>💡 Análise Personalizada</h4>
            ${analise.map(item => `<p>${item}</p>`).join('')}
        `;
        
        analiseContainer.appendChild(analisePersonalizada);
    }
}

function gerarRecomendacoesPersonalizadas(classificacao) {
    const { diagnostico } = classificacao;
    let recomendacoes = "🎯 <strong>Recomendações específicas para seu perfil:</strong><br>";
    
    // Recomendações baseadas na classificação binária
    if (classificacao.estressada) {
        recomendacoes += "• Pratique técnicas de respiração profunda diariamente<br>";
        recomendacoes += "• Considere meditação ou mindfulness<br>";
    }
    
    if (classificacao.vulneravel) {
        recomendacoes += "• Desenvolva estratégias preventivas de manejo do estresse<br>";
        recomendacoes += "• Identifique seus gatilhos de estresse pessoais<br>";
    }
    
    if (classificacao.alteracaoMenstrual) {
        recomendacoes += "• Mantenha um diário menstrual detalhado<br>";
        recomendacoes += "• Considere acompanhamento ginecológico<br>";
    }
    
    // Prioridade de ação
    if (diagnostico.prioridade === 'alta') {
        recomendacoes += "<br><strong>⚡ Ação recomendada:</strong> Busque acompanhamento profissional nos próximos dias.";
    } else if (diagnostico.prioridade === 'media') {
        recomendacoes += "<br><strong>📅 Ação recomendada:</strong> Agende acompanhamento preventivo nas próximas semanas.";
    } else {
        recomendacoes += "<br><strong>✅ Continue:</strong> Mantendo seus hábitos saudáveis atuais.";
    }
    
    return recomendacoes;
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

function processarDadosAPI(resultados) {
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
    
    const stressPorcentagem = Math.max(10, Math.min(90, 30 + (base % 60)));
    const vulnerabilidadePorcentagem = Math.max(10, Math.min(90, 25 + ((base * 1.3) % 65)));
    const msdSimulado = Math.max(0.5, Math.min(4.5, 1.5 + ((base * 0.05) % 3)));
    const desconfortoPorcentagem = calcularPorcentagemDesconforto(msdSimulado);
    
    return {
        stress: {
            pontuacao: Math.round(stressPorcentagem * 0.5), // Aproximação para pontuação
            porcentagem: stressPorcentagem,
            nivel: determinarNivel(stressPorcentagem)
        },
        vulnerabilidade: {
            pontuacao: Math.round(vulnerabilidadePorcentagem * 0.5),
            porcentagem: vulnerabilidadePorcentagem,
            nivel: determinarNivel(vulnerabilidadePorcentagem)
        },
        desconforto: {
            pontuacao: Math.round(desconfortoPorcentagem * 0.24), // Máximo 24 no MEDI-Q
            msd: msdSimulado,
            mesi: Math.floor(msdSimulado * 3), // Estimativa
            sintomasComImpacto: Math.floor(msdSimulado * 5),
            porcentagem: desconfortoPorcentagem,
            nivel: determinarNivelDesconforto(msdSimulado)
        },
        origem: 'simulado',
        timestamp: new Date().toISOString()
    };
}

// ==========================================
// APLICAÇÃO DE DIAGNÓSTICOS INDIVIDUAIS
// ==========================================

function aplicarDiagnosticoStress() {
    const dados = dadosDiagnostico.stress;
    const valor = Number(dados?.porcentagem ?? 0); // garante número mesmo se 0
    const nivel = determinarNivel(valor);
    
    // Atualizar badge
    const badge = document.getElementById('nivelStressBadge');
    const texto = document.getElementById('nivelStressTexto');
    if (badge && texto) {
        badge.className = `nivel-badge ${CONFIGURACAO_DIAGNOSTICO.niveis[nivel].classe}`;
    texto.textContent = `${nivel.toUpperCase()} (${valor.toFixed(1)}%)`;
    }
    
    // Animar barra
    const barra = document.getElementById('barraStress');
    if (barra) {
        setTimeout(() => {
            barra.style.width = `${valor}%`;
            barra.style.background = gerarGradienteBarra(valor);
        }, 500);
    }
    
    // Atualizar descrição
    const descricaoElement = document.getElementById('descricaoStress');
    if (descricaoElement && CONFIGURACAO_DIAGNOSTICO.textos?.stress) {
        descricaoElement.textContent = CONFIGURACAO_DIAGNOSTICO.textos.stress[nivel];
    }
}

function aplicarDiagnosticoVulnerabilidade() {
    const dados = dadosDiagnostico.vulnerabilidade;
    const valor = Number(dados?.porcentagem ?? 0);
    const nivel = determinarNivel(valor);
    
    // Atualizar badge
    const badge = document.getElementById('nivelVulnerabilidadeBadge');
    const texto = document.getElementById('nivelVulnerabilidadeTexto');
    if (badge && texto) {
        badge.className = `nivel-badge ${CONFIGURACAO_DIAGNOSTICO.niveis[nivel].classe}`;
    texto.textContent = `${nivel.toUpperCase()} (${valor.toFixed(1)}%)`;
    }
    
    // Animar barra
    const barra = document.getElementById('barraVulnerabilidade');
    if (barra) {
        setTimeout(() => {
            barra.style.width = `${valor}%`;
            barra.style.background = gerarGradienteBarra(valor);
        }, 800);
    }
    
    // Atualizar descrição
    const descricaoElement = document.getElementById('descricaoVulnerabilidade');
    if (descricaoElement && CONFIGURACAO_DIAGNOSTICO.textos?.vulnerabilidade) {
        descricaoElement.textContent = CONFIGURACAO_DIAGNOSTICO.textos.vulnerabilidade[nivel];
    }
}

function aplicarDiagnosticoDesconforto() {
    const dados = dadosDiagnostico.desconforto;
    const valor = Number(dados?.porcentagem ?? 0);
    const nivel = determinarNivel(valor);
    
    // Atualizar badge
    const badge = document.getElementById('nivelDesconfortoBadge');
    const texto = document.getElementById('nivelDesconfortoTexto');
    if (badge && texto) {
        badge.className = `nivel-badge ${CONFIGURACAO_DIAGNOSTICO.niveis[nivel].classe}`;
    texto.textContent = `${nivel.toUpperCase()} (${valor.toFixed(1)}%)`;
    }
    
    // Animar barra
    const barra = document.getElementById('barraDesconforto');
    if (barra) {
        setTimeout(() => {
            barra.style.width = `${valor}%`;
            barra.style.background = gerarGradienteBarra(valor);
        }, 1100);
    }
    
    // Atualizar descrição
    const descricaoElement = document.getElementById('descricaoDesconforto');
    if (descricaoElement && CONFIGURACAO_DIAGNOSTICO.textos?.desconforto) {
        descricaoElement.textContent = CONFIGURACAO_DIAGNOSTICO.textos.desconforto[nivel];
    }
}

// ==========================================
// ANÁLISE INTEGRADA
// ==========================================

function gerarAnaliseIntegrada() {
    const { stress, vulnerabilidade, desconforto } = dadosDiagnostico;
    
    // Extrair valores de porcentagem
    const stressValor = stress.porcentagem || stress || 0;
    const vulnerabilidadeValor = vulnerabilidade.porcentagem || vulnerabilidade || 0;
    const desconfortoValor = desconforto.porcentagem || desconforto || 0;
    
    let analise = [];
    
    // Análise da correlação entre stress e desconforto
    if (stressValor > 60 && desconfortoValor > 60) {
        analise.push("Há uma possível correlação entre seus níveis elevados de stress e desconforto menstrual. Esta é uma observação comum em nossa pesquisa, sugerindo que o manejo do stress pode contribuir para o alívio dos sintomas menstruais.");
    } else if (stressValor < 40 && desconfortoValor < 40) {
        analise.push("Seus baixos níveis de stress parecem correlacionados com menores níveis de desconforto menstrual, o que está alinhado com os achados de nossa pesquisa sobre a relação entre bem-estar emocional e saúde menstrual.");
    }
    
    // Análise da vulnerabilidade
    if (vulnerabilidadeValor > 70) {
        analise.push("Sua alta vulnerabilidade ao stress sugere que você pode se beneficiar especialmente de estratégias preventivas e técnicas de manejo do stress antes que situações desafiadoras se intensifiquem.");
    } else if (vulnerabilidadeValor < 30) {
        analise.push("Sua baixa vulnerabilidade ao stress indica boa capacidade de resiliência. Isso é um fator protetor importante para seu bem-estar geral.");
    }
    
    // Análise do perfil geral
    const media = (stressValor + vulnerabilidadeValor + desconfortoValor) / 3;
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
    const classificacao = dadosDiagnostico.classificacao;
    if (!classificacao) return;
    
    const codigoBinario = classificacao.codigoBinario;
    const container = document.getElementById('recomendacoesList');
    container.innerHTML = '';
    
    // Recomendações específicas baseadas no perfil
    const recomendacoesPorPerfil = {
        '000': { // Perfil Equilibrado
            items: [
                {
                    titulo: "🧘‍♀️ Exercícios Leves (Caminhada, Yoga)",
                    descricao: "Mantém o corpo ativo e reduzem pequenas tensões diárias. O yoga ajuda a reduzir o estresse e evitar o mesmo, além de trabalhar consciência corporal e respiração!",
                    links: ["https://youtu.be/OuCvUDVoX3M?si=0GeBz9b-1zrVVwiv"]
                },
                {
                    titulo: "🎨 Arteterapia",
                    descricao: "Promove relaxamento e criatividade, prevenindo acúmulo de estresse, além de gerar quebra na rotina estressora. Existem muitas formas, variando desde pintura, fotografia e dança, até música.",
                    links: ["https://youtu.be/pfm-fd7zVy8?si=J_TPSP8d1dBK14yo"]
                },
                {
                    titulo: "😴 Hábitos Saudáveis",
                    descricao: "Sono adequado, além da higiene do sono, e uma alimentação equilibrada ajudam a regular os hormônios e a reduzir o estresse.",
                    links: [
                        "https://www.msdmanuals.com/pt/profissional/multimedia/table/higiene-do-sono",
                        "https://www.revistaabm.com.br/artigos/como-a-alimentacao-ajuda-a-combater-o-estresse-e-outros-transtornos"
                    ]
                }
            ],
            recursos: [
                "https://helloclue.com/pt/artigos/emocoes/estresse-e-o-ciclo-menstrual",
                "https://drauziovarella.uol.com.br/mulher/estresse-prolongado-pode-afetar-o-ciclo-menstrual/"
            ]
        },
        
        '100': { // Estresse sem Alterações
            items: [
                {
                    titulo: "🧘‍♀️ Meditação Regular",
                    descricao: "Funciona como treino mental, aumentando resiliência. Ela atua reduzindo o cortisol, hormônio do estresse, melhorando sono e humor.",
                    links: [
                        "https://helloclue.com/pt/artigos/emocoes/meditacao-estresse-e-ciclo-menstrual",
                        "https://youtu.be/vJfwuCB5C8o?si=OeVAnMEQ5ixAakaC",
                        "https://youtu.be/pT8ON6KAJPA?si=dbVUJQ36KdlMyMZe"
                    ]
                },
                {
                    titulo: "�‍♀️ Exercícios Físicos",
                    descricao: "Liberam endorfinas, que aumentam o bem-estar. O importante é fazer algum exercício que lhe agrade, mas mantendo sempre a constância!"
                },
                {
                    titulo: "🎵 Musicoterapia",
                    descricao: "É uma abordagem que busca regular emoções por meio de sons e músicas, ajudando a acalmar a mente.",
                    links: ["https://youtu.be/X_-1HGSPRpE?si=jpNuOm4uf0daLYGk"]
                }
            ]
        },
        
        '010': { // Vulnerabilidade sem Estresse
            items: [
                {
                    titulo: "🧘‍♀️ Meditação Regular",
                    descricao: "Funciona como treino mental, aumentando resiliência. Ela atua reduzindo o cortisol, hormônio do estresse.",
                    links: [
                        "https://helloclue.com/pt/artigos/emocoes/meditacao-estresse-e-ciclo-menstrual",
                        "https://youtu.be/vJfwuCB5C8o?si=OeVAnMEQ5ixAakaC"
                    ]
                },
                {
                    titulo: "💪 Relaxamento Muscular Progressivo",
                    descricao: "São técnicas que ajudam a reconhecer e reduzir tensões antes que se acumulem.",
                    links: ["https://www.youtube.com/watch?v=RsCGOBLpLHc"]
                },
                {
                    titulo: "👥 Suporte Social",
                    descricao: "Converse e troque experiências com pessoas que você tem confiança, sobre sua rotina e o que pode lhe gerar estresse a longo prazo."
                }
            ]
        },
        
        '110': { // Alto Risco
            items: [
                {
                    titulo: "💪 Relaxamento Muscular Progressivo",
                    descricao: "São técnicas que ajudam a reconhecer e reduzir tensões antes que se acumulem.",
                    links: ["https://www.youtube.com/watch?v=RsCGOBLpLHc"]
                },
                {
                    titulo: "🧘‍♀️ Yoga",
                    descricao: "Mantém o corpo ativo e reduz tensões diárias. Ajuda a reduzir o estresse além de trabalhar consciência corporal.",
                    links: ["https://youtu.be/OuCvUDVoX3M?si=0GeBz9b-1zrVVwiv"]
                },
                {
                    titulo: "🎨 Arteterapia",
                    descricao: "Promove relaxamento e criatividade, prevenindo acúmulo de estresse, além de gerar quebra na rotina estressora.",
                    links: ["https://youtu.be/pfm-fd7zVy8?si=J_TPSP8d1dBK14yo"]
                }
            ]
        },
        
        '001': { // Alterações sem Estresse
            items: [
                {
                    titulo: "😴 Hábitos Saudáveis Prioritários",
                    descricao: "Foque especialmente em sono adequado e alimentação equilibrada para regular os hormônios do ciclo menstrual."
                }
            ]
        },
        
        '101': { // Estresse + Alterações
            items: [
                {
                    titulo: "🧘‍♀️ Meditação Regular",
                    descricao: "Funciona como treino mental, aumentando resiliência. Ela atua reduzindo o cortisol, hormônio do estresse.",
                    links: [
                        "https://helloclue.com/pt/artigos/emocoes/meditacao-estresse-e-ciclo-menstrual",
                        "https://youtu.be/vJfwuCB5C8o?si=OeVAnMEQ5ixAakaC"
                    ]
                },
                {
                    titulo: "🏃‍♀️ Exercícios Físicos",
                    descricao: "Liberam endorfinas, que aumentam o bem-estar. O importante é fazer algum exercício que lhe agrade, mantendo sempre a constância!"
                },
                {
                    titulo: "🎨 Arteterapia",
                    descricao: "Promove relaxamento e criatividade, prevenindo acúmulo de estresse, além de gerar quebra na rotina estressora.",
                    links: ["https://youtu.be/pfm-fd7zVy8?si=J_TPSP8d1dBK14yo"]
                }
            ]
        },
        
        '011': { // Vulnerável + Alterações
            items: [
                {
                    titulo: "🧘‍♀️ Meditação Regular",
                    descricao: "Funciona como treino mental, aumentando resiliência. Ela atua reduzindo o cortisol, hormônio do estresse.",
                    links: [
                        "https://helloclue.com/pt/artigos/emocoes/meditacao-estresse-e-ciclo-menstrual",
                        "https://youtu.be/vJfwuCB5C8o?si=OeVAnMEQ5ixAakaC"
                    ]
                },
                {
                    titulo: "🧘‍♀️ Yoga",
                    descricao: "Mantém o corpo ativo e reduz tensões diárias. Ajuda a reduzir o estresse além de trabalhar consciência corporal.",
                    links: ["https://youtu.be/OuCvUDVoX3M?si=0GeBz9b-1zrVVwiv"]
                },
                {
                    titulo: "👥 Suporte Social",
                    descricao: "Converse e troque experiências com pessoas que você tem confiança, sobre sua rotina e o que pode lhe gerar estresse a longo prazo."
                },
                {
                    titulo: "🧠 Psicoterapia",
                    descricao: "A psicoterapia ajuda a compreender como o estresse impacta o corpo e as emoções, oferecendo ferramentas práticas para lidar melhor com situações do dia a dia."
                }
            ]
        },
        
        '111': { // Perfil Crítico
            items: [
                {
                    titulo: "🧘‍♀️ Meditação Regular",
                    descricao: "Funciona como treino mental, aumentando resiliência. Ela atua reduzindo o cortisol, hormônio do estresse.",
                    links: [
                        "https://helloclue.com/pt/artigos/emocoes/meditacao-estresse-e-ciclo-menstrual",
                        "https://youtu.be/vJfwuCB5C8o?si=OeVAnMEQ5ixAakaC"
                    ]
                },
                {
                    titulo: "🧘‍♀️ Yoga",
                    descricao: "Mantém o corpo ativo e reduz tensões diárias. Ajuda a reduzir o estresse além de trabalhar consciência corporal.",
                    links: ["https://youtu.be/OuCvUDVoX3M?si=0GeBz9b-1zrVVwiv"]
                },
                {
                    titulo: "👥 Suporte Social",
                    descricao: "Converse e troque experiências com pessoas que você tem confiança, sobre sua rotina e o que pode lhe gerar estresse a longo prazo."
                },
                {
                    titulo: "🧠 Psicoterapia",
                    descricao: "A psicoterapia ajuda a compreender como o estresse impacta o corpo e as emoções, oferecendo ferramentas práticas para lidar melhor com situações do dia a dia."
                }
            ]
        }
    };
    
    // Recomendações com alterações menstruais (adicionar consulta ginecológica)
    const temAlteracaoMenstrual = codigoBinario.endsWith('1');
    
    // Buscar recomendações para o perfil específico ou usar padrão
    const recomendacoes = recomendacoesPorPerfil[codigoBinario] || 
                         recomendacoesPorPerfil['000']; // fallback para perfil equilibrado
    
    // Sempre incluir hábitos saudáveis
    const habitos = {
        titulo: "😴 Hábitos Saudáveis",
        descricao: "Sono adequado, além da higiene do sono, e uma alimentação equilibrada ajudam a regular os hormônios e a reduzir o estresse.",
        links: [
            "https://www.msdmanuals.com/pt/profissional/multimedia/table/higiene-do-sono",
            "https://www.revistaabm.com.br/artigos/como-a-alimentacao-ajuda-a-combater-o-estresse-e-outros-transtornos"
        ]
    };
    
    // Renderizar recomendações
    if (recomendacoes.items) {
        recomendacoes.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'recomendacao-item';
            
            let linksHtml = '';
            if (item.links && item.links.length > 0) {
                linksHtml = `<div class="recomendacao-links">
                    ${item.links.map(link => `<a href="${link}" target="_blank" rel="noopener">📎 Saiba mais</a>`).join(' ')}
                </div>`;
            }
            
            div.innerHTML = `
                <h4>${item.titulo}</h4>
                <p>${item.descricao}</p>
                ${linksHtml}
            `;
            container.appendChild(div);
        });
    }
    
    // Adicionar hábitos saudáveis
    const habitosDiv = document.createElement('div');
    habitosDiv.className = 'recomendacao-item';
    habitosDiv.innerHTML = `
        <h4>${habitos.titulo}</h4>
        <p>${habitos.descricao}</p>
        <div class="recomendacao-links">
            ${habitos.links.map(link => `<a href="${link}" target="_blank" rel="noopener">📎 Saiba mais</a>`).join(' ')}
        </div>
    `;
    container.appendChild(habitosDiv);
    
    // Adicionar consulta ginecológica se houver alterações menstruais
    if (temAlteracaoMenstrual) {
        const ginecoDiv = document.createElement('div');
        ginecoDiv.className = 'recomendacao-item recomendacao-alerta';
        ginecoDiv.innerHTML = `
            <h4>⚠️ Acompanhamento Ginecológico</h4>
            <p>Caso os ciclos continuem irregulares por mais 2-3 ciclos ou venham acompanhados de dor intensa, é importante procurar atendimento ginecológico para uma melhor avaliação.</p>
        `;
        container.appendChild(ginecoDiv);
    }
    
    // Adicionar recursos educativos
    if (recomendacoes.recursos) {
        const recursosDiv = document.createElement('div');
        recursosDiv.className = 'recursos-educativos';
        recursosDiv.innerHTML = `
            <h4>📚 Recursos Educativos</h4>
            <p>Veja em mais detalhes como o estresse altera seu ciclo menstrual:</p>
            <div class="recomendacao-links">
                ${recomendacoes.recursos.map(link => `<a href="${link}" target="_blank" rel="noopener">📎 Leia mais</a>`).join(' ')}
            </div>
        `;
        container.appendChild(recursosDiv);
    }
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

// ==========================================
// AÇÕES DO USUÁRIO
// ==========================================

function salvarDiagnostico() {
    const stressValor = dadosDiagnostico.stress?.porcentagem ?? 0;
    const vulnerabilidadeValor = dadosDiagnostico.vulnerabilidade?.porcentagem ?? 0;
    const desconfortoValor = dadosDiagnostico.desconforto?.porcentagem ?? 0;
    const nivelStress = determinarNivel(stressValor);
    const nivelVulnerabilidade = determinarNivel(vulnerabilidadeValor);
    const nivelDesconforto = determinarNivel(desconfortoValor);

    // Persistir no histórico local
    const dadosCompletos = {
        userId,
        diagnostico: dadosDiagnostico,
        geradoEm: new Date().toISOString(),
        versao: '1.0'
    };
    localStorage.setItem(`diagnostico_${userId}`, JSON.stringify(dadosCompletos));
    const historico = JSON.parse(localStorage.getItem('historico_diagnosticos') || '[]');
    historico.push(dadosCompletos);
    localStorage.setItem('historico_diagnosticos', JSON.stringify(historico));

    // Criar conteúdo para download
    const conteudo = `
DIAGNÓSTICO PERSONALIZADO - PROJETO PIBITI
==========================================

ID da Sessão: ${userId}
Data: ${new Date().toLocaleDateString('pt-BR')}

RESULTADOS:
- Percepção de Stress: ${stressValor.toFixed(1)}% (${nivelStress.toUpperCase()})
- Vulnerabilidade ao Stress: ${vulnerabilidadeValor.toFixed(1)}% (${nivelVulnerabilidade.toUpperCase()})
- Desconforto Menstrual: ${desconfortoValor.toFixed(1)}% (${nivelDesconforto.toUpperCase()})
- Índice MSD: ${(dadosDiagnostico.desconforto?.msd ?? 0).toFixed(2)}

ANÁLISE INTEGRADA:
${document.getElementById('analiseIntegrada').innerText}

RECOMENDAÇÕES:
${Array.from(document.querySelectorAll('.recomendacao-item')).map(item => 
    item.querySelector('h4').textContent + ': ' + item.querySelector('p').textContent
).join('\n')}

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
    const stressValor = dadosDiagnostico.stress?.porcentagem ?? 0;
    const vulnerabilidadeValor = dadosDiagnostico.vulnerabilidade?.porcentagem ?? 0;
    const desconfortoValor = dadosDiagnostico.desconforto?.porcentagem ?? 0;
    const texto = `Acabei de completar uma avaliação sobre stress e bem-estar menstrual no Projeto PIBITI. Meus resultados: Stress ${stressValor.toFixed(1)}%, Vulnerabilidade ${vulnerabilidadeValor.toFixed(1)}%, Desconforto ${desconfortoValor.toFixed(1)}%. Participe também!`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
    fecharModalCompartilhar();
}

function compartilharEmail() {
    const stressValor = dadosDiagnostico.stress?.porcentagem ?? 0;
    const vulnerabilidadeValor = dadosDiagnostico.vulnerabilidade?.porcentagem ?? 0;
    const desconfortoValor = dadosDiagnostico.desconforto?.porcentagem ?? 0;
    const assunto = 'Diagnóstico - Projeto PIBITI';
    const corpo = `Olá!\n\nCompartilho meu diagnóstico do Projeto PIBITI sobre stress e bem-estar menstrual:\n\n- Percepção de Stress: ${stressValor.toFixed(1)}%\n- Vulnerabilidade: ${vulnerabilidadeValor.toFixed(1)}%\n- Desconforto Menstrual: ${desconfortoValor.toFixed(1)}%\n\nEste projeto contribui para pesquisas importantes sobre saúde feminina!`;
    
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
