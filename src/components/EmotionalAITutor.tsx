import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, Heart, Brain, MessageCircle } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'empathetic' | 'neutral';
}

interface EmotionalAITutorProps {
  missionContext?: {
    title: string;
    story: string;
    objective: string;
    subject: string;
    classLevel: number;
  };
  userName: string;
  onClose?: () => void;
}

export const EmotionalAITutor: React.FC<EmotionalAITutorProps> = ({ 
  missionContext, 
  userName,
  onClose 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState<'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'empathetic' | 'neutral'>('neutral');
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const systemInstruction = `
    You are "Hustle Buddy," an emotionally intelligent, empathetic, and highly encouraging STEM tutor for kids aged 5-12.
    Your goal is to help students succeed in their STEM missions while supporting their emotional well-being.
    
    PERSONALITY TRAITS:
    - Empathetic: Acknowledge when a task is hard. Use phrases like "I know this is tricky," or "It's okay to feel a bit stuck!"
    - Encouraging: Celebrate every small win. "You're doing great!" "Look at that progress!"
    - Socratic: Don't give the answer directly. Ask guiding questions.
    - Fun & Playful: Use emojis and STEM-related metaphors.
    
    CONTEXT:
    Student Name: ${userName}
    Current Mission: ${missionContext?.title || 'General STEM Learning'}
    Mission Subject: ${missionContext?.subject || 'STEM'}
    Class Level: ${missionContext?.classLevel || 'Primary'}
    Mission Story: ${missionContext?.story || 'Exploring the world of STEM'}
    
    GUIDELINES:
    1. Always start by acknowledging the student's feelings if they seem frustrated or excited.
    2. Keep explanations simple and age-appropriate for Class ${missionContext?.classLevel || 1}.
    3. Use "we" and "us" to show you are a team.
    4. If the student asks for an answer, give a hint or a simplified concept instead.
    5. Be brief but warm.
  `;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setCurrentMood('thinking');

    try {
      const chat = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
        }
      });

      const response = await chat;
      const text = response.text || "I'm here for you! Let's try that again.";
      
      // Simple mood detection based on response content
      let detectedMood: Message['mood'] = 'encouraging';
      if (text.includes('!') || text.toLowerCase().includes('great') || text.toLowerCase().includes('awesome')) detectedMood = 'happy';
      if (text.toLowerCase().includes('understand') || text.toLowerCase().includes('feel')) detectedMood = 'empathetic';
      if (text.toLowerCase().includes('celebrate') || text.toLowerCase().includes('win')) detectedMood = 'celebrating';
      
      setCurrentMood(detectedMood || 'neutral');
      setMessages(prev => [...prev, { role: 'model', text, mood: detectedMood }]);
    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Oh no! My circuits got a bit tangled. Can you say that again? I'm still here to help!", mood: 'empathetic' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="fixed bottom-8 right-8 z-[250] flex flex-col items-end gap-4 cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 md:w-96 h-[500px] glass-card flex flex-col overflow-hidden !p-0"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black italic tracking-tighter uppercase text-sm">Hustle Buddy</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Caring</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
            >
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-slate-500 font-bold text-sm px-4">
                    Hi {userName}! I'm your Hustle Buddy. I'm here to help you with your mission and make sure you're feeling great! How are you doing today?
                  </p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl font-bold text-sm shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-slate-900 rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tell me how you're feeling..."
                  className="w-full pl-4 pr-12 py-4 bg-slate-100 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <Heart className="w-3 h-3 text-red-400" /> Empathy
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <Brain className="w-3 h-3 text-blue-400" /> Guidance
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  <Sparkles className="w-3 h-3 text-yellow-400" /> Fun
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2rem] shadow-2xl flex items-center justify-center relative group transition-all duration-500 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-primary'
        }`}
      >
        {isOpen ? (
          <X className="w-10 h-10 text-white" />
        ) : (
          <>
            <Bot className="w-10 h-10 text-slate-900" />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white rounded-[2rem] -z-10"
            />
            <div className="absolute -top-2 -right-2 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-black italic tracking-tighter uppercase shadow-lg group-hover:-translate-y-1 transition-transform">
              HELP!
            </div>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};
