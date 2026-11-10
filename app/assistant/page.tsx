'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGuardian } from '@/lib/store';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  Info
} from 'lucide-react';
import { ChatMessage } from '@/types';

const SUGGESTIONS = [
  'Analyze transaction TXN-8921-X9',
  'Explain homograph phishing defense',
  'How does OCR detect receipt tampering?',
  'Mitigate card testing attacks',
];

export default function AssistantPage() {
  const { messages, addMessage } = useGuardian();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      isUser: true,
      text,
      timestamp: `${new Date().toUTCString().slice(17, 22)} UTC`,
    };

    addMessage(userMsg);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const aiMsg: ChatMessage = {
          id: `msg-ai-${Date.now()}`,
          isUser: false,
          text: data.reply,
          timestamp: `${new Date().toUTCString().slice(17, 22)} UTC`,
        };
        addMessage(aiMsg);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        isUser: false,
        text: 'Unable to connect to security intelligence service. Please verify your internet connectivity.',
        timestamp: `${new Date().toUTCString().slice(17, 22)} UTC`,
      };
      addMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>AI Security Analyst</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                GEMINI POWERED
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Conversational threat intelligence for fraud analysis, incident forensics, and mitigation guidance.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-[#0F172A] border border-[#1E293B] px-3 py-1.5 rounded-lg">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Advisory Threat Intelligence</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold shrink-0">Prompts:</span>
        {SUGGESTIONS.map((item) => (
          <button
            key={item}
            onClick={() => handleSend(item)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F172A] border border-[#1E293B] hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all shrink-0"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-4 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.isUser 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {msg.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`space-y-1 max-w-[80%] ${msg.isUser ? 'text-right' : 'text-left'}`}>
              <div className="text-[10px] text-slate-500 font-mono">
                {msg.isUser ? 'Auditor' : 'AI Guardian Analyst'} • {msg.timestamp}
              </div>
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.isUser
                    ? 'bg-cyan-600/20 border border-cyan-500/30 text-white rounded-tr-none'
                    : 'bg-[#111928] border border-[#1E293B] text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#111928] border border-[#1E293B] text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Analyzing security telemetry with Gemini AI...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-3 bg-[#0F172A] border border-[#1E293B] p-2 rounded-xl"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Analyst: e.g. Analyze transaction velocity, verify spoofed link..."
          className="flex-1 bg-transparent px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 disabled:opacity-50"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
