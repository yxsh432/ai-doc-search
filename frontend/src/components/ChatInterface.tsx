"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CitationChip } from './CitationChip';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ source: string; page?: number }>;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        let errMessage = 'Failed to fetch response';
        try {
          const errData = await response.json();
          errMessage = errData.detail || errMessage;
        } catch (e) {
          // Keep default message if not JSON
        }
        throw new Error(errMessage);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: error.message || 'Sorry, I encountered an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent relative overflow-hidden z-0">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl shadow-indigo-500/10"
            >
              <Sparkles size={40} className="drop-shadow-lg" />
            </motion.div>
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white"
              >
                Welcome<span className="text-indigo-500">.</span>
              </motion.h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg mx-auto">
                Your intelligent document assistant.
                Upload files to start a conversation.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
              {['Summarize document', 'Find key takeaways', 'Explain specific sections', 'Compare multiple files'].map((item) => (
                <motion.button
                  key={item}
                  onClick={() => setInput(item)}
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.97 }}
                  className="p-4 text-sm border border-white/10 bg-white/5 rounded-2xl transition-all duration-300 text-left font-medium shadow-lg backdrop-blur-md"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              key={idx}
              className={cn(
                "flex gap-4 max-w-4xl mx-auto w-full",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md",
                message.role === 'user'
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/20"
                  : "bg-white/10 text-indigo-300 border border-white/10 backdrop-blur-sm"
              )}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "flex-1 space-y-2",
                message.role === 'user' ? "text-right" : "text-left"
              )}>
                <div className={cn(
                  "inline-block rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-lg backdrop-blur-sm whitespace-pre-wrap break-words max-w-full overflow-x-auto custom-scrollbar",
                  message.role === 'user'
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "bg-white/5 border border-white/10 text-foreground"
                )}>
                  {message.content}
                </div>

                {message.citations && message.citations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.citations.map((cit, cidx) => (
                      <CitationChip key={cidx} source={cit.source} page={cit.page} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-4 max-w-4xl mx-auto w-full">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center animate-pulse backdrop-blur-sm shadow-lg">
              <Bot size={18} className="text-indigo-400" />
            </div>
            <div className="flex items-center gap-3 text-indigo-300 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
              <Loader2 size={16} className="animate-spin" />
              <span className="animate-pulse">Analyzing context...</span>
            </div>
          </div>
        )}

        {/* Dedicated spacer to ensure last message clears the floating input area */}
        <div className="h-48 flex-shrink-0" />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-background via-background to-transparent">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto relative group"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your documents..."
            className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all shadow-2xl text-foreground placeholder:text-muted-foreground"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          >
            <Send size={18} className="drop-shadow-lg" />
          </motion.button>
        </form>

      </div>
    </div>
  );
};
