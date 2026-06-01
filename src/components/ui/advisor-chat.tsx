"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { MessageSquare, X, Send, Cpu, Bot, User, Hourglass } from "lucide-react";
import type { ChatMessage } from "@/types";

const SUGGESTED_QUESTIONS = [
  "¿Qué stack me recomiendan para una plataforma SaaS?",
  "¿Cómo estructuran las auditorías de ciberseguridad?",
  "¿Cuáles son los plazos estimados para un desarrollo Next.js?",
  "¿Cómo implementan agentes de Inteligencia Artificial (RAG)?",
] as const;

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "advisor",
  text: "¡Hola! Soy Crysta, Directora de Consultoría e Ingeniería de OhmRoyal. Estoy aquí para guiarte en el diseño técnico, la arquitectura y estimación de tu próximo software premium. ¿De qué trata tu proyecto?",
  timestamp: new Date(),
};

function newMessageId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export default function AdvisorChat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSendMessage = async (textToSend: string): Promise<void> => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: newMessageId("msg"),
      sender: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      const data = (await response.json()) as { text?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const answerText =
        data.text ||
        "Disculpa, obtuve una respuesta vacía del modelo. ¿Podrías reformular tu consulta técnica?";

      setMessages((prev) => [
        ...prev,
        { id: newMessageId("reply"), sender: "advisor", text: answerText, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error("Chat Advisor Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId("err"),
          sender: "advisor",
          text: "Disculpa, he tenido una falla técnica temporal al consultar con mis servidores el diseño de su arquitectura. ¿Me permites reintentar o deseas probar nuestro Calculador de Proyectos?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSendMessage(inputValue);
    }
  };

  return (
    <div
      id="advisor-chatbot-widget"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {isOpen && (
        <div
          ref={dialogRef}
          id="advisor-chat-window"
          role="dialog"
          aria-modal="true"
          aria-label="Asistente OhmRoyal — Crysta"
          className="mb-4 flex h-[500px] w-80 origin-bottom-right scale-100 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all duration-300 sm:w-96"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50 p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  id="crysta-avatar-bg"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-brand-500 p-0.5 shadow-sm"
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <Cpu className="h-5 w-5 animate-pulse text-brand-600" />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="font-sans text-sm font-extrabold text-slate-900">Crysta</h4>
                  <span className="rounded border border-brand-100 bg-brand-50 px-1 font-mono text-xs font-extrabold uppercase text-brand-600">
                    INGENIERÍA
                  </span>
                </div>
                <p className="font-sans text-xs font-medium text-slate-500">
                  Asesora Tecnológica OhmRoyal
                </p>
              </div>
            </div>
            <button
              type="button"
              id="close-chat-btn"
              aria-label="Cerrar chat"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            id="chat-messages-log"
            className="scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4"
          >
            {messages.map((m) => {
              const isAdvisor = m.sender === "advisor";
              return (
                <div
                  key={m.id}
                  className={`flex ${isAdvisor ? "justify-start" : "justify-end"} items-start space-x-2`}
                >
                  {isAdvisor && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-600">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex max-w-[80%] flex-col">
                    <div
                      className={`whitespace-pre-line rounded-2xl px-3.5 py-2.5 font-sans text-sm leading-relaxed ${
                        isAdvisor
                          ? "border border-slate-200/80 bg-white text-slate-800 shadow-sm"
                          : "bg-gradient-to-r from-brand-600 to-brand-500 font-bold text-white shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="mt-1 px-1 text-xs font-medium text-slate-400">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {!isAdvisor && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center justify-start space-x-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-600">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center space-x-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <Hourglass className="h-3.5 w-3.5 animate-spin text-brand-500" />
                  <span className="font-medium">Crysta está analizando la arquitectura...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="scrollbar-none flex gap-2 overflow-x-auto whitespace-nowrap border-t border-slate-200/80 bg-slate-50 px-4 py-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => void handleSendMessage(q)}
                className="inline-block cursor-pointer rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-black text-slate-600 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center space-x-2 border-t border-slate-200/80 bg-white p-3">
            <input
              id="advisor-chat-input"
              type="text"
              placeholder="Escribe tu consulta o idea de app..."
              value={inputValue}
              aria-label="Mensaje a Crysta"
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
            />
            <button
              type="button"
              id="advisor-chat-send-btn"
              aria-label="Enviar mensaje"
              onClick={() => void handleSendMessage(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-sm transition-all hover:from-brand-500 hover:to-brand-400 active:scale-95 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating launcher */}
      <button
        type="button"
        id="advisor-chat-launcher"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat con Crysta"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-brand-500/10 bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-xl shadow-brand-200 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-300 focus:outline-none active:scale-95"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5 animate-pulse" />}
      </button>
    </div>
  );
}
