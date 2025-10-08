const { readFileSync, existsSync } = require('fs');
const { join } = require('path');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

module.exports = function handler(req, res) {
  // Tratar preflight request
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { status } = req.query;
    
    // Carregar dúvidas
    const duvidaPath = join(process.cwd(), 'data', 'duvidas.json');
    let duvidas = [];
    
    if (existsSync(duvidaPath)) {
      try {
        const content = readFileSync(duvidaPath, 'utf-8');
        duvidas = JSON.parse(content);
      } catch (error) {
        console.warn('Erro ao ler duvidas.json:', error.message);
        duvidas = [];
      }
    }

    // Filtrar por status se especificado
    if (status) {
      duvidas = duvidas.filter(d => d.status === status);
    }

    // Para dúvidas respondidas (públicas), remover informações sensíveis
    let duvidasFiltradas;
    if (status === 'respondida') {
      duvidasFiltradas = duvidas.map(d => ({
        id: d.id,
        categoria: d.categoria,
        titulo: d.titulo || 'Dúvida sobre ' + d.categoria,
        resposta: d.resposta,
        data_resposta: d.data_resposta,
        respondida_por: d.respondida_por || 'Equipe de Pesquisa'
      }));
    } else {
      // Para admin, incluir mais detalhes mas remover token
      duvidasFiltradas = duvidas.map(d => {
        const { token, ...duvidasemToken } = d;
        return duvidasemToken;
      });
    }

    // Ordenar por data (mais recentes primeiro)
    duvidasFiltradas.sort((a, b) => {
      const dateA = new Date(a.data_envio || a.data_resposta);
      const dateB = new Date(b.data_envio || b.data_resposta);
      return dateB - dateA;
    });

    // Headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json({
      success: true,
      duvidas: duvidasFiltradas,
      total: duvidasFiltradas.length,
      status_filtro: status || 'todas'
    });

  } catch (error) {
    console.error('Erro ao buscar dúvidas:', error);
    
    // Headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
}