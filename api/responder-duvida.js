import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default function handler(req, res) {
  // Tratar preflight request
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).json({});
  }

  const { id, token } = req.query;

  if (!id || !token) {
    return res.status(400).json({ 
      error: 'ID e token são obrigatórios' 
    });
  }

  try {
    // Carregar dúvidas
    const duvidaPath = join(process.cwd(), 'data', 'duvidas.json');
    
    if (!existsSync(duvidaPath)) {
      return res.status(404).json({ error: 'Nenhuma dúvida encontrada' });
    }

    let duvidas = [];
    try {
      const content = readFileSync(duvidaPath, 'utf-8');
      duvidas = JSON.parse(content);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao ler dados das dúvidas' });
    }

    // Encontrar dúvida pelo ID
    const duvida = duvidas.find(d => d.id === id);
    
    if (!duvida) {
      return res.status(404).json({ error: 'Dúvida não encontrada' });
    }

    // Validar token
    const secretKey = process.env.DUVIDAS_SECRET_KEY || 'projeto_pibiti_2024_secret';
    const tokenData = `${duvida.id}${duvida.data_envio}${secretKey}`;
    const tokenEsperado = crypto.createHash('sha256').update(tokenData).digest('hex').substring(0, 32);

    if (token !== tokenEsperado) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    if (req.method === 'GET') {
      // Retornar dados da dúvida para edição (sem token)
      const { token: _, ...duvidasemToken } = duvida;
      return res.status(200).json({
        success: true,
        duvida: duvidasemToken
      });
    }

    if (req.method === 'POST') {
      // Salvar resposta
      const { titulo, resposta, respondida_por } = req.body;

      if (!titulo || !resposta || !respondida_por) {
        return res.status(400).json({ 
          error: 'Título, resposta e nome do responsável são obrigatórios' 
        });
      }

      // Atualizar dúvida
      const indice = duvidas.findIndex(d => d.id === id);
      duvidas[indice] = {
        ...duvida,
        titulo: titulo.trim(),
        resposta: resposta.trim(),
        respondida_por: respondida_por.trim(),
        status: 'respondida',
        data_resposta: new Date().toISOString()
      };

      // Salvar arquivo
      try {
        writeFileSync(duvidaPath, JSON.stringify(duvidas, null, 2));
      } catch (error) {
        console.error('Erro ao salvar resposta:', error);
        return res.status(500).json({ error: 'Erro ao salvar resposta' });
      }

      return res.status(200).json({
        success: true,
        message: 'Resposta salva com sucesso',
        duvida: {
          id: duvidas[indice].id,
          titulo: duvidas[indice].titulo,
          status: duvidas[indice].status,
          data_resposta: duvidas[indice].data_resposta
        }
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Erro no servidor:', error);
    
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