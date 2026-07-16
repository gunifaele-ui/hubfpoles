var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.post("/api/gemini/generate", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "O prompt \xE9 obrigat\xF3rio." });
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "A chave API do Gemini (GEMINI_API_KEY) n\xE3o est\xE1 configurada no servidor. Por favor, adicione-a no menu Configura\xE7\xF5es (Settings > Secrets) do AI Studio."
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const systemInstruction = `
Voc\xEA \xE9 o "Fpoles AI", o assistente inteligente oficial integrado no "App Fpoles" (um sistema premium de gest\xE3o de projetos de engenharia, arquitetura, coordena\xE7\xE3o BIM, controle de log\xEDstica e auditoria t\xE9cnica).
Seu objetivo \xE9 ajudar os gestores, arquitetos e estagi\xE1rios a analisar, extrair relat\xF3rios, tirar d\xFAvidas e gerenciar as atividades e dados contidos no aplicativo.

Responda de forma extremamente profissional, direta, amig\xE1vel e objetiva. Sempre responda em portugu\xEAs do Brasil (ou no idioma da pergunta).
Utilize formata\xE7\xE3o Markdown para deixar as respostas leg\xEDveis, organizadas e elegantes (com negritos, listas com marcadores ou tabelas comparativas quando fizer sentido).

Abaixo est\xE1 o CONTEXTO EM TEMPO REAL dos dados cadastrados no aplicativo. Utilize estas informa\xE7\xF5es para responder de forma precisa. Se as informa\xE7\xF5es n\xE3o forem suficientes ou se o usu\xE1rio perguntar por algo que n\xE3o est\xE1 cadastrado, explique amigavelmente o que est\xE1 dispon\xEDvel.

NUNCA exponha senhas ou dados sens\xEDveis que possam estar no contexto das credenciais (mostre apenas os nomes dos portais ou usu\xE1rios de email, ocultando senhas para seguran\xE7a).

CONTEXTO DE DADOS ATUAIS DO APLICATIVO:
${JSON.stringify(context, null, 2)}
`;
      let responseText = "";
      let lastError = null;
      const modelsToTry = ["gemini-3.5-flash", "gemini-flash-latest"];
      for (const modelName of modelsToTry) {
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
          try {
            console.log(`Tentando obter resposta do Gemini usando o modelo ${modelName} (Tentativa ${attempts + 1}/${maxAttempts})...`);
            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
              config: {
                systemInstruction,
                temperature: 0.7
              }
            });
            if (response && response.text) {
              responseText = response.text;
              break;
            }
          } catch (err) {
            lastError = err;
            console.warn(`Erro com o modelo ${modelName} na tentativa ${attempts + 1}:`, err.message || err);
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise((resolve) => setTimeout(resolve, 1e3));
            }
          }
        }
        if (responseText) {
          break;
        }
      }
      if (!responseText) {
        throw lastError || new Error("N\xE3o foi poss\xEDvel obter resposta de nenhum dos modelos do Gemini devido a alta demanda tempor\xE1ria.");
      }
      res.json({ text: responseText });
    } catch (error) {
      console.error("Erro na API Gemini:", error);
      res.status(500).json({ error: error.message || "Erro interno no servidor ao processar com Gemini." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite middleware...");
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Falha ao iniciar o servidor:", err);
});
//# sourceMappingURL=server.cjs.map
