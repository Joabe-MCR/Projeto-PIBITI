// Função para alternar respostas do FAQ
function toggleResposta(index) {
  const respostas = document.querySelectorAll(".faq-answer");
  const resposta = respostas[index];

  if (resposta.style.display === "block") {
    resposta.style.display = "none";
  } else {
    respostas.forEach(r => r.style.display = "none");
    resposta.style.display = "block";
  }
}

// Melhorias para dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar classe para detectar dispositivos touch
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
  
  // Melhorar navegação suave em dispositivos móveis
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Adicionar feedback visual para botões em dispositivos touch
  const buttons = document.querySelectorAll('button, .faq-question');
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
  
  // Prevenir zoom acidental em inputs (se houver)
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    });
    
    input.addEventListener('blur', function() {
      const viewport = document.querySelector('meta[name=viewport]');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
    });
  });
});

// Função para detectar orientação da tela
window.addEventListener('orientationchange', function() {
  // Força um reflow para ajustar layouts após mudança de orientação
  setTimeout(function() {
    window.scrollTo(0, window.scrollY);
  }, 100);
});

// ==========================================
// FUNÇÕES PARA BOTÃO VOLTAR AO TOPO
// ==========================================

// Função para voltar ao topo
function voltarAoTopo() {
  document.getElementById('pginicial').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Controlar visibilidade do botão baseado na posição do scroll
function controlarBotaoVoltarTopo() {
  const botao = document.getElementById('voltarTopo');
  if (!botao) return;
  
  // Obter posição atual do scroll
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  // Verificar se passou da primeira seção (página inicial)
  const paginaInicial = document.getElementById('pginicial');
  let mostrarBotao = false;
  
  if (paginaInicial) {
    const rectInicial = paginaInicial.getBoundingClientRect();
    // Se a página inicial não está mais ocupando a maior parte da tela
    if (rectInicial.bottom < window.innerHeight * 0.5) {
      mostrarBotao = true;
    }
  }
  
  // Verificar se está na seção TCLE (esconder botão)
  const tcleSection = document.getElementById('tcle');
  if (tcleSection && tcleSection.style.display !== 'none') {
    mostrarBotao = false;
  }
  
  // Aplicar mudanças de visibilidade
  if (mostrarBotao && botao.style.display !== 'flex') {
    console.log('Mostrando botão');
    botao.style.display = 'flex';
    botao.classList.remove('esconder');
    botao.classList.add('mostrar');
  } else if (!mostrarBotao && botao.style.display === 'flex') {
    console.log('Escondendo botão');
    botao.classList.remove('mostrar');
    botao.classList.add('esconder');
    // Esconder completamente após animação
    setTimeout(() => {
      botao.style.display = 'none';
      botao.classList.remove('esconder');
    }, 300);
  }
}

// Adicionar event listeners quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Garantir que o botão existe
  const botaoVoltarTopo = document.getElementById('voltarTopo');
  if (botaoVoltarTopo) {
    console.log('Botão voltar ao topo encontrado e inicializado');
    
    // Event listener para scroll com throttle
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
      if (!isScrolling) {
        requestAnimationFrame(function() {
          controlarBotaoVoltarTopo();
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
    
    // Verificar posição inicial após um pequeno delay
    setTimeout(() => {
      controlarBotaoVoltarTopo();
    }, 500);
    
    // Event listener para redimensionamento da janela
    let timeoutResize;
    window.addEventListener('resize', function() {
      clearTimeout(timeoutResize);
      timeoutResize = setTimeout(controlarBotaoVoltarTopo, 150);
    });
  } else {
    console.error('Botão voltar ao topo não encontrado');
  }
  
  // Verificar se as seções existem
  const secoes = ['projeto', 'pesquisadores', 'perguntas', 'contato'];
  secoes.forEach(secaoId => {
    const secao = document.getElementById(secaoId);
    if (secao) {
      console.log(`Seção encontrada: ${secaoId}`);
    } else {
      console.warn(`Seção não encontrada: ${secaoId}`);
    }
  });
});

// ==========================================
// FUNÇÕES PARA QUESTIONÁRIO DE TRIAGEM
// ==========================================

// Função para ir para o questionário de triagem
function irParaTriagem() {
  console.log('irParaTriagem chamada');
  
  const pginicial = document.getElementById('pginicial');
  const triagem = document.getElementById('triagem');
  
  if (!pginicial || !triagem) {
    console.error('Elementos de triagem não encontrados!');
    return;
  }
  
  // Esconder seção inicial
  pginicial.style.display = 'none';
  // Mostrar questionário de triagem
  triagem.style.display = 'flex';
  
  // Scroll para o topo
  window.scrollTo(0, 0);
}

// Função para processar respostas da triagem
function processarTriagem() {
  const anticoncepcional = document.querySelector('input[name="anticoncepcional"]:checked');
  const gestante = document.querySelector('input[name="gestante"]:checked');
  const medicamentos = document.querySelector('input[name="medicamentos"]:checked');
  
  if (!anticoncepcional || !gestante || !medicamentos) {
    alert('Por favor, responda todas as perguntas antes de continuar.');
    return;
  }
  
  // Salvar respostas da triagem
  const respostasTriagem = {
    anticoncepcional: anticoncepcional.value,
    gestante: gestante.value,
    medicamentos: medicamentos.value,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('respostasTriagem', JSON.stringify(respostasTriagem));
  
  // Verificar critérios de exclusão
  // Se respondeu SIM para qualquer uma das perguntas, exclui
  if (anticoncepcional.value === 'sim' || gestante.value === 'sim' || medicamentos.value === 'sim') {
    // Mostrar tela de exclusão
    mostrarTelaExclusao();
  } else {
    // Continuar para o TCLE
    irParaTCLE();
  }
}

// Função para mostrar tela de exclusão
function mostrarTelaExclusao() {
  const triagem = document.getElementById('triagem');
  const exclusao = document.getElementById('exclusao');
  
  triagem.style.display = 'none';
  exclusao.style.display = 'flex';
  
  // Scroll para o topo
  window.scrollTo(0, 0);
}

// ==========================================
// FUNÇÕES PARA NAVEGAÇÃO DO TCLE
// ==========================================

// Função para ir para a página do TCLE (após aprovação na triagem)
function irParaTCLE() {
  console.log('irParaTCLE chamada');
  
  const triagem = document.getElementById('triagem');
  const tcle = document.getElementById('tcle');
  
  if (!tcle) {
    console.error('Elemento TCLE não encontrado!');
    return;
  }
  
  // Esconder triagem se estiver visível
  if (triagem) {
    triagem.style.display = 'none';
  }
  
  // Mostrar seção do TCLE
  tcle.style.display = 'flex';
  console.log('tcle mostrada com display flex');
  
  // Scroll para o topo
  window.scrollTo(0, 0);
  
  // Gerar userId se não existir
  if (!localStorage.getItem('userSessionId')) {
    localStorage.setItem('userSessionId', generateUserId());
  }
  
  // Garantir listener do checkbox para habilitar botão
  toggleProsseguirButton();
}

// Função para voltar à página inicial
function voltarInicio() {
  // Esconder todas as seções
  document.getElementById('tcle').style.display = 'none';
  document.getElementById('triagem').style.display = 'none';
  document.getElementById('exclusao').style.display = 'none';
  
  // Mostrar seção inicial
  document.getElementById('pginicial').style.display = 'block';
  
  // Limpar checkbox do TCLE
  const checkbox = document.getElementById('consentimento');
  if (checkbox) {
    checkbox.checked = false;
    toggleProsseguirButton();
  }
  
  // Limpar respostas da triagem
  const inputs = document.querySelectorAll('input[name="anticoncepcional"], input[name="gestante"], input[name="medicamentos"]');
  inputs.forEach(input => {
    input.checked = false;
  });
  
  // Desabilitar botão continuar da triagem
  const btnTriagem = document.getElementById('btnContinuarTriagem');
  if (btnTriagem) {
    btnTriagem.disabled = true;
  }
  
  // Scroll para o topo
  window.scrollTo(0, 0);
}

// Função para prosseguir para os questionários
function prosseguirQuestionarios() {
  const checkbox = document.getElementById('consentimento');
  if (checkbox && checkbox.checked) {
    // Salvar consentimento no localStorage
    localStorage.setItem('tcleConsentimento', 'true');
    localStorage.setItem('tcleDataConsentimento', new Date().toISOString());
    
    // Redirecionar para o questionário sociodemográfico (Q0) primeiro
    window.location.href = 'questionario0-sociodemografico.html';
  } else {
    alert('Por favor, aceite o termo de consentimento para prosseguir.');
  }
}

// Gerar ID único
function generateUserId() {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substring(2, 7);
  return `user_${timestamp}_${randomNum}`;
}

// Função para habilitar/desabilitar o botão Prosseguir
function toggleProsseguirButton() {
  const checkbox = document.getElementById('consentimento');
  const button = document.querySelector('.btn-prosseguir');
  
  console.log('toggleProsseguirButton - checkbox:', checkbox);
  console.log('toggleProsseguirButton - button:', button);
  
  if (checkbox && button) {
    button.disabled = !checkbox.checked;
    console.log('Botão prosseguir disabled:', button.disabled);
  }
}

// Adicionar event listeners quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  // Event listener para checkbox do TCLE
  const checkbox = document.getElementById('consentimento');
  if (checkbox) {
    checkbox.addEventListener('change', toggleProsseguirButton);
    // Inicializar estado do botão
    toggleProsseguirButton();
  }
  
  // Event listeners para questionário de triagem
  const inputsTriagem = document.querySelectorAll('input[name="anticoncepcional"], input[name="gestante"], input[name="medicamentos"]');
  inputsTriagem.forEach(input => {
    input.addEventListener('change', verificarTriagemCompleta);
  });
  
  // Inicializar estado do botão de triagem
  verificarTriagemCompleta();
});

// Função para verificar se todas as perguntas da triagem foram respondidas
function verificarTriagemCompleta() {
  const anticoncepcional = document.querySelector('input[name="anticoncepcional"]:checked');
  const gestante = document.querySelector('input[name="gestante"]:checked');
  const medicamentos = document.querySelector('input[name="medicamentos"]:checked');
  
  const btnContinuar = document.getElementById('btnContinuarTriagem');
  
  if (btnContinuar) {
    if (anticoncepcional && gestante && medicamentos) {
      btnContinuar.disabled = false;
    } else {
      btnContinuar.disabled = true;
    }
  }
}

// ==========================================
// FUNÇÕES PARA SISTEMA DE DÚVIDAS
// ==========================================

// URL base da API (ajustar conforme necessário)
const API_BASE_URL = 'http://localhost:5000'; // ou o endereço do seu servidor

// Função para alternar formulário de dúvida
function toggleFormularioDuvida() {
  const formulario = document.getElementById('formulario-duvida');
  const isVisible = formulario.style.display !== 'none';
  
  if (isVisible) {
    formulario.style.display = 'none';
    limparFormularioDuvida();
  } else {
    formulario.style.display = 'block';
    // Fechar perguntas respondidas se estiver aberto
    const perguntasRespondidas = document.getElementById('lista-perguntas-respondidas');
    if (perguntasRespondidas.style.display !== 'none') {
      perguntasRespondidas.style.display = 'none';
    }
  }
}

// Função para alternar perguntas respondidas
function togglePerguntasRespondidas() {
  const lista = document.getElementById('lista-perguntas-respondidas');
  const isVisible = lista.style.display !== 'none';
  
  if (isVisible) {
    lista.style.display = 'none';
  } else {
    lista.style.display = 'block';
    // Fechar formulário de dúvida se estiver aberto
    const formulario = document.getElementById('formulario-duvida');
    if (formulario.style.display !== 'none') {
      formulario.style.display = 'none';
    }
    carregarPerguntasRespondidas();
  }
}

// Sistema de dúvidas será carregado via duvidas-sistema.js
// Esta função é mantida para compatibilidade, mas será sobrescrita pelo novo sistema

// Função de carregamento será gerenciada pelo novo sistema de dúvidas

// Função para exibir perguntas respondidas
function exibirPerguntasRespondidas(perguntas) {
  const container = document.getElementById('perguntas-container');
  
  perguntas.forEach((pergunta, index) => {
    const perguntaDiv = document.createElement('div');
    perguntaDiv.className = 'pergunta-respondida-item';
    perguntaDiv.innerHTML = `
      <div class="pergunta-header" onclick="toggleResposta${index}()">
        <div class="pergunta-info">
          <div class="pergunta-categoria">${formatarCategoria(pergunta.categoria)}</div>
          <div class="pergunta-texto">${pergunta.duvida}</div>
        </div>
        <div class="pergunta-data">${formatarData(pergunta.data_envio)}</div>
      </div>
      <div class="pergunta-resposta" id="resposta-${index}">
        <div class="resposta-autor">Resposta da equipe:</div>
        <div class="resposta-texto">${pergunta.resposta}</div>
      </div>
    `;
    
    container.appendChild(perguntaDiv);
    
    // Criar função específica para esta pergunta
    window[`toggleResposta${index}`] = function() {
      const resposta = document.getElementById(`resposta-${index}`);
      resposta.style.display = resposta.style.display === 'block' ? 'none' : 'block';
    };
  });
}

// Função para atualizar perguntas respondidas
function atualizarPerguntasRespondidas() {
  carregarPerguntasRespondidas();
}

// Função para limpar formulário de dúvida
function limparFormularioDuvida() {
  document.getElementById('categoria-duvida').value = '';
  document.getElementById('texto-duvida').value = '';
  document.getElementById('char-counter').textContent = '0';
}

// Função para fechar mensagem de sucesso
function fecharMensagemSucesso() {
  document.getElementById('mensagem-sucesso').style.display = 'none';
  document.getElementById('formulario-duvida').style.display = 'none';
}

// Função para formatar categoria
function formatarCategoria(categoria) {
  const categorias = {
    'estresse': 'Sobre Estresse',
    'menacme': 'Sobre Ciclo Menstrual',
    'questionarios': 'Sobre os Questionários',
    'pesquisa': 'Sobre a Pesquisa',
    'outros': 'Outros'
  };
  return categorias[categoria] || categoria;
}

// Função para formatar data
function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Event listener para contador de caracteres
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('texto-duvida');
  const counter = document.getElementById('char-counter');
  
  if (textarea && counter) {
    textarea.addEventListener('input', function() {
      counter.textContent = this.value.length;
      
      // Mudar cor quando próximo do limite
      if (this.value.length > 450) {
        counter.style.color = '#e74c3c';
      } else if (this.value.length > 400) {
        counter.style.color = '#f39c12';
      } else {
        counter.style.color = '#7f8c8d';
      }
    });
  }
});
