import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, AlertTriangle, Check, Loader2, MessageSquare, Bot, X } from "lucide-react";

interface GeminiAssistantProps {
  tasks?: any[];
  projects?: any[];
  complementares?: any[];
  tablets?: any[];
  placas?: any[];
  clashes?: any[];
  licenses?: any[];
  backupRecords?: any[];
  revitRequirements?: any[];
}

const FpolesAIIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    {/* Left Bar */}
    <rect x="2" y="12" width="11" height="2" />
    {/* Middle Bar (Raised) */}
    <rect x="13" y="9" width="6" height="2" />
    {/* Right Bar */}
    <rect x="19" y="12" width="3" height="2" />
  </svg>
);

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({
  tasks,
  projects,
  complementares,
  tablets,
  placas,
  clashes,
  licenses,
  backupRecords,
  revitRequirements,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("fpoles_ai_messages");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
        }
      } catch (e) {
        // ignore error and fallback
      }
    }
    return [
      {
        id: "welcome",
        role: "model",
        content: "Olá! Eu sou o assistente inteligente do **App Fpoles**. Posso ajudar você a analisar o cronograma, verificar projetos complementares, rastrear tablets e placas de obra, monitorar licenças de softwares, visualizar backups semanais e muito mais. \n\nO que gostaria de saber hoje?",
        timestamp: new Date(),
      },
    ];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem("fpoles_ai_messages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getApplicationContext = () => {
    return {
      tasks: (tasks || []).map((t) => ({
        titulo: t.title,
        projeto: t.project,
        data: t.date,
        status: t.status,
        prioridade: t.priority,
      })),
      projects: (projects || []).map((p) => ({
        codigo: p.code,
        nome: p.name,
        responsavel: p.responsavel,
        status: p.status,
        tabletStatus: p.tabletStatus,
        placaStatus: p.placaStatus,
        tabletMonth: p.tabletMonth,
        placaMonth: p.placaMonth,
      })),
      complementares: (complementares || []).map((c) => ({
        titulo: c.title,
        disciplina: c.discipline,
        status: c.status,
        autor: c.author,
        atualizado: c.updated,
      })),
      tablets: (projects || [])
        .filter(p => p.tabletStatus && p.tabletStatus !== 'Não Necessita')
        .map(p => ({
          projeto: p.name,
          status: p.tabletStatus,
          mesPlanejado: p.tabletMonth || 'Não Definido'
        })),
      placas: (projects || [])
        .filter(p => p.placaStatus && p.placaStatus !== 'Não Necessita')
        .map(p => ({
          projeto: p.name,
          status: p.placaStatus,
          mesPlanejado: p.placaMonth || 'Não Definido'
        })),
      clashesBIM: (clashes || []).map((c) => ({
        elementoA: c.elementA,
        elementoB: c.elementB,
        severidade: c.severity,
        status: c.status,
        andar: c.floor,
      })),
      backupRecords: (backupRecords || []).map((b) => ({
        projeto: b.project,
        fase: b.fase,
        status: b.status,
        tecnico: b.tecnico,
      })),
      revitRequirements: (revitRequirements || []).map((r) => ({
        titulo: r.title,
        prioridade: r.priority,
        status: r.status,
        notas: r.notes,
      })),
      licenses: (licenses || []).map((l) => ({
        usuario: l.usuario,
        hardware: l.hardware,
        software: l.software,
        statusRevit: l.revitStatus,
        loginRevit: l.revitLogin,
      })),
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const context = getApplicationContext();
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: textToSend,
          context: context,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao consultar o assistente Gemini.");
      }

      const modelMsg: Message = {
        id: Math.random().toString(36).substring(7),
        role: "model",
        content: data.text || "Desculpe, não consegui gerar uma resposta.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Deseja mesmo limpar o histórico de conversa com o assistente?")) {
      setMessages([
        {
          id: "welcome",
          role: "model",
          content: "Olá! Histórico limpo. Como posso ajudar você agora com os dados do sistema?",
          timestamp: new Date(),
        },
      ]);
      setError(null);
    }
  };

  // Clickable Suggestion Chips
  const suggestionChips = [
    { label: "Projetos Complementares pendentes", prompt: "Quais projetos complementares estão pendentes ou sob revisão?" },
    { label: "Status dos Tablets", prompt: "Quais tablets de obra estão atualmente em stock?" },
    { label: "Resumo do Cronograma", prompt: "Dê um resumo das atividades de hoje e quais têm alta prioridade." },
    { label: "Licenças de Revit", prompt: "Quais licenças de Revit estão cadastradas e qual o status delas?" },
  ];

  // Simple Markdown Parsing to render elegant structures in the bubble
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-xs font-semibold font-display text-black mt-3 mb-1 uppercase tracking-tight">
            {line.slice(4)}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-xs font-semibold font-display text-black mt-4 mb-1.5 uppercase tracking-wide border-b border-black/10 pb-1">
            {line.slice(3)}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={idx} className="text-sm font-semibold font-display text-black mt-4 mb-2 uppercase tracking-widest">
            {line.slice(2)}
          </h2>
        );
      }

      // Bullet lists
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const content = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-black/85 font-sans leading-relaxed my-0.5">
            {renderInlineFormatting(content)}
          </li>
        );
      }

      // Ordered lists
      const numListMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numListMatch) {
        const content = numListMatch[2];
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-black/85 font-sans leading-relaxed my-0.5">
            {renderInlineFormatting(content)}
          </li>
        );
      }

      // Table Row rendering helper (simple display)
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
        // Check if it is a separator line like |---|---|
        if (cells.every(c => c.startsWith("-"))) {
          return null; // skip divider rows
        }
        return (
          <div key={idx} className="grid grid-cols-4 gap-1.5 border-b border-black/5 py-1 px-1.5 font-mono text-[10px] bg-black/[0.01]">
            {cells.map((cell, cidx) => (
              <span key={cidx} className="truncate font-semibold text-black/90">
                {renderInlineFormatting(cell)}
              </span>
            ))}
          </div>
        );
      }

      // Default line
      if (line.trim() === "") return <div key={idx} className="h-1.5" />;
      return (
        <p key={idx} className="text-xs text-black/85 font-sans leading-relaxed mb-1">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };

  const renderInlineFormatting = (text: string) => {
    // Basic bold **text** parsing
    const parts = text.split("**");
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="font-semibold text-black bg-black/[0.03] px-1 rounded">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Chat Container */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[420px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white border-2 border-black rounded-3xl shadow-2xl flex flex-col z-[9999] overflow-hidden animate-scale-up p-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-black text-white rounded-xl animate-pulse flex items-center justify-center">
                <FpolesAIIcon className="w-5.5 h-5.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold font-display text-black uppercase tracking-wider">
                    Fpoles AI Assistente
                  </h3>
                  <span className="bg-black text-[8px] text-white px-1.5 py-0.5 rounded-full font-mono uppercase font-semibold tracking-tight">
                    Gemini 3.5
                  </span>
                </div>
                <p className="text-[9px] font-mono text-black/50">
                  Análise de dados do app em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Limpar Conversa"
                className="p-1.5 text-black/60 hover:text-black bg-black/5 hover:bg-black/10 rounded-lg transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fechar"
                className="p-1.5 text-black/60 hover:text-black bg-black/5 hover:bg-black/10 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-3 scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`p-1.5 rounded-xl shrink-0 ${msg.role === "user" ? "bg-black text-white" : "bg-black/5 text-black"}`}>
                  {msg.role === "user" ? (
                    <MessageSquare className="w-3.5 h-3.5" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Bubble */}
                <div className="max-w-[85%] flex flex-col">
                  <div
                    className={`p-3 rounded-2xl border ${
                      msg.role === "user"
                        ? "bg-black text-white border-black rounded-tr-none text-left"
                        : "bg-black/[0.02] text-black border-black/10 rounded-tl-none text-left"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="text-xs font-sans leading-relaxed break-words">{msg.content}</p>
                    ) : (
                      <div className="space-y-1 overflow-x-auto">{renderMessageContent(msg.content)}</div>
                    )}
                  </div>
                  <span className={`text-[8px] font-mono mt-1 text-black/40 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-2.5 flex-row">
                <div className="p-1.5 rounded-xl bg-black/5 text-black shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="max-w-[85%]">
                  <div className="p-3 bg-black/[0.02] border border-black/10 rounded-2xl rounded-tl-none">
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-black/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-black/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-black/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      <span className="text-[10px] font-mono text-black/50 ml-1.5">Analisando dados...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Falha no Assistente</p>
                  <p className="text-[11px] leading-tight">{error}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-2 shrink-0 scrollbar-none scroll-smooth">
            {suggestionChips.map((chip, i) => (
              <button
                key={i}
                disabled={loading}
                type="button"
                onClick={() => handleSendMessage(chip.prompt)}
                className="text-[10px] font-semibold font-display border border-black/10 hover:border-black rounded-full px-3 py-1 bg-white whitespace-nowrap transition-all text-black/70 hover:text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex gap-2 border-2 border-black rounded-2xl p-1 shrink-0"
          >
            <input
              type="text"
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte ao Gemini sobre os dados do app..."
              className="flex-1 bg-transparent px-3 text-xs text-black placeholder:text-black/40 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-black hover:bg-black/85 text-white rounded-xl transition-all cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black border-2 border-black text-white hover:bg-neutral-900 flex items-center justify-center rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 z-[9999] group cursor-pointer"
        title="Fpoles AI"
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform rotate-0 group-hover:rotate-90 duration-300" />
        ) : (
          <FpolesAIIcon className="w-7 h-7 animate-pulse" />
        )}
        {!isOpen && (
          <span className="absolute right-16 bg-black text-white text-[10px] uppercase font-mono font-semibold tracking-wider py-1 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow border border-white/20 pointer-events-none">
            Perguntar ao Fpoles AI
          </span>
        )}
      </button>
    </>
  );
};
