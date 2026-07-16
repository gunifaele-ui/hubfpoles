import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método Não Permitido. Use POST." });
  }

  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "O prompt é obrigatório." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "A chave API do Gemini (GEMINI_API_KEY) não está configurada no ambiente da Vercel. Por favor, adicione-a como Environment Variable nas configurações da Vercel."
      });
    }

    // Initialize GoogleGenAI SDK with server-side API Key
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `
Você é o "Fpoles AI", o assistente inteligente oficial integrado no "App Fpoles" (um sistema premium de gestão de projetos de engenharia, arquitetura, coordenação BIM, controle de logística e auditoria técnica).
Seu objetivo é ajudar os gestores, arquitetos e estagiários a analisar, extrair relatórios, tirar dúvidas e gerenciar as atividades e dados contidos no aplicativo.

Responda de forma extremamente profissional, direta, amigável e objetiva. Sempre responda em português do Brasil (ou no idioma da pergunta).
Utilize formatação Markdown para deixar as respostas legíveis, organizadas e elegantes (com negritos, listas com marcadores ou tabelas comparativas quando fizer sentido).

Abaixo está o CONTEXTO EM TEMPO REAL dos dados cadastrados no aplicativo. Utilize estas informações para responder de forma precisa. Se as informações não forem suficientes ou se o usuário perguntar por algo que não está cadastrado, explique amigavelmente o que está disponível.

NUNCA exponha senhas ou dados sensíveis que possam estar no contexto das credenciais (mostre apenas os nomes dos portais ou usuários de email, ocultando senhas para segurança).

CONTEXTO DE DADOS ATUAIS DO APLICATIVO:
${JSON.stringify(context, null, 2)}
`;

    let responseText = "";
    let lastError: any = null;
    const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest"];

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2;

      while (attempts < maxAttempts) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            responseText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }

      if (responseText) {
        break;
      }
    }

    if (!responseText) {
      throw lastError || new Error("Não foi possível obter resposta de nenhum dos modelos do Gemini.");
    }

    res.status(200).json({ text: responseText });
  } catch (error: any) {
    console.error("Erro na API Gemini (Vercel):", error);
    res.status(500).json({ error: error.message || "Erro interno no servidor ao processar com Gemini." });
  }
}
