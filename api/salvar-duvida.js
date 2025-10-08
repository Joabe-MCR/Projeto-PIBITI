import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default function handler(req, res) {
  // Tratar preflight request (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { categoria, duvida } = req.body;

    // Validar entrada
    if (!categoria || !duvida || duvida.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Categoria e dúvida são obrigatórios' 
      });
    }

    if (duvida.length > 500) {
      return res.status(400).json({ 
        error: 'Dúvida não pode ter mais de 500 caracteres' 
      });
    }

    // Gerar ID único
    const duvidasId = crypto.randomBytes(4).toString('hex');
    const timestamp = new Date().toISOString();
    
    // Gerar token único para resposta (usando chave secreta)
    const secretKey = process.env.DUVIDAS_SECRET_KEY || 'projeto_pibiti_2024_secret';
    const tokenData = `${duvidasId}${timestamp}${secretKey}`;
    const token = crypto.createHash('sha256').update(tokenData).digest('hex').substring(0, 32);

    // Criar objeto da dúvida
    const novaDuvida = {
      id: duvidasId,
      categoria,
      duvida: duvida.trim(),
      status: 'pendente',
      data_envio: timestamp,
      token: token,
      resposta: null,
      titulo: null,
      data_resposta: null,
      respondida_por: null
    };

    // Carregar dúvidas existentes
    const duvidaPath = join(process.cwd(), 'data', 'duvidas.json');
    let duvidas = [];
    
    if (existsSync(duvidaPath)) {
      try {
        const content = readFileSync(duvidaPath, 'utf-8');
        duvidas = JSON.parse(content);
      } catch (error) {
        console.warn('Erro ao ler duvidas.json, criando novo:', error.message);
        duvidas = [];
      }
    }

    // Adicionar nova dúvida
    duvidas.push(novaDuvida);

    // Salvar arquivo
    try {
      writeFileSync(duvidaPath, JSON.stringify(duvidas, null, 2));
    } catch (error) {
      console.error('Erro ao salvar dúvidas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    // Gerar link único para resposta
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://seu-site.vercel.app';
    
    const linkResposta = `${baseUrl}/duvidas-admin.html?id=${duvidasId}&token=${token}`;

    // Preparar dados para envio do email (via webhook ou serviço)
    const emailData = {
      to: 'antmattody@gmail.com',
      subject: `Nova dúvida recebida - ${categoria.toUpperCase()}`,
      body: `
        <h2>Nova Dúvida Recebida</h2>
        <p><strong>Categoria:</strong> ${categoria}</p>
        <p><strong>Dúvida:</strong></p>
        <blockquote style="border-left: 3px solid #007bff; padding-left: 15px; margin: 10px 0;">
          ${duvida}
        </blockquote>
        <p><strong>Data:</strong> ${new Date(timestamp).toLocaleString('pt-BR')}</p>
        <hr>
        <p><strong>Para responder, clique no link abaixo:</strong></p>
        <p><a href="${linkResposta}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">RESPONDER DÚVIDA</a></p>
        <p>ID da dúvida: ${duvidasId}</p>
      `
    };

    // Aqui você pode integrar com EmailJS, SendGrid, ou outro serviço de email
    // Por enquanto, vamos apenas retornar os dados
    
    // Headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(201).json({
      success: true,
      message: 'Dúvida enviada com sucesso',
      duvida_id: duvidasId,
      link_resposta: linkResposta,
      email_data: emailData // Para debug - remover em produção
    });

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