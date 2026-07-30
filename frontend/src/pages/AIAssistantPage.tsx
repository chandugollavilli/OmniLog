import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; data?: any }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your OmniLog AI Security Assistant. Ask me anything about your firewall logs, security incidents, or threat vectors.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const predefinedQueries = [
    'Show blocked traffic today',
    'Summarize VPN activity',
    'Find brute-force attacks',
    'Find top attackers',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || prompt;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    if (!queryText) setPrompt('');
    setLoading(true);

    try {
      const res = await api.post('/ai/query', { prompt: textToSend });
      const aiData = res.data;

      let answerText = `${aiData.summary}\n\nKey Insights:\n` + aiData.insights.map((i: string) => `• ${i}`).join('\n');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: answerText, data: aiData.data },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error querying AI assistant. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="p-3 bg-gradient-to-tr from-purple-600 to-brand-500 rounded-xl shadow-lg shadow-purple-500/20">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Security Assistant</h1>
          <p className="text-xs text-slate-400">Natural language threat analysis, event explanation, and log query engine</p>
        </div>
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex flex-wrap gap-2">
        {predefinedQueries.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:border-purple-500/50 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-xl p-4 rounded-xl text-xs whitespace-pre-line leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white font-medium self-end'
                    : 'bg-slate-950 text-slate-200 border border-slate-800'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
              <Sparkles className="w-4 h-4 animate-spin" /> Analyzing firewall log telemetry...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="mt-6 flex gap-3 pt-4 border-t border-slate-800">
          <input
            type="text"
            placeholder="Ask AI: e.g. 'Show blocked traffic today' or 'Find top attackers'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white font-semibold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
