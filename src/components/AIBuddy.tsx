import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X } from 'lucide-react';

interface AIBuddyProps {
  message: string;
  onClose?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral';
}

export const AIBuddy: React.FC<AIBuddyProps> = ({ 
  message, 
  onClose, 
  position = 'bottom-right',
  mood = 'neutral' 
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8'
  };

  const moodColors = {
    happy: 'text-green-400',
    thinking: 'text-blue-400',
    celebrating: 'text-yellow-400',
    encouraging: 'text-primary',
    neutral: 'text-primary'
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className={`fixed ${positionClasses[position]} z-[200] flex items-end gap-4 pointer-events-auto cursor-grab active:cursor-grabbing`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="bg-white border border-slate-200 p-4 rounded-xl rounded-br-none max-w-xs pointer-events-auto relative shadow-xl"
        >
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <p className="text-sm font-medium text-text-main leading-relaxed">{message}</p>
          <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45 transform translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: mood === 'celebrating' ? [0, 10, -10, 10, 0] : 0
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.5, repeat: mood === 'celebrating' ? Infinity : 0 }
        }}
        className={`w-16 h-16 bg-primary rounded-xl border border-white/20 flex items-center justify-center shadow-xl pointer-events-auto text-white`}
      >
        <Bot className="w-10 h-10" />
        {mood === 'celebrating' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="absolute -top-2 -right-2 bg-accent text-white p-1 rounded-full"
          >
            <span className="text-[10px] font-bold px-1">WOW!</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
