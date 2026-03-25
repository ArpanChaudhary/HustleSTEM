import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  Trophy, 
  Bot,
  Trash2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { hustleService } from '../services/hustleService';

type Direction = 'Forward' | 'Backward' | 'Left' | 'Right';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 5;
const START_POS: Position = { x: 0, y: 4 }; // Bottom left
const END_POS: Position = { x: 4, y: 0 };   // Top right

interface LogicMazeProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

export const LogicMaze: React.FC<LogicMazeProps> = ({ levelId, levelTitle, onClose }) => {
  const [botPos, setBotPos] = useState<Position>(START_POS);
  const [commands, setCommands] = useState<Direction[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('Plan your hustle path!');
  const [attempts, setAttempts] = useState(1);

  const resetGame = useCallback(() => {
    setBotPos(START_POS);
    setCommands([]);
    setIsExecuting(false);
    setCurrentStep(-1);
    setGameState('playing');
    setMessage('Plan your hustle path!');
    setAttempts(prev => prev + 1);
  }, []);

  const addCommand = (dir: Direction) => {
    if (isExecuting || gameState !== 'playing') return;
    if (commands.length >= 15) return; // Limit sequence
    setCommands([...commands, dir]);
  };

  const removeCommand = (index: number) => {
    if (isExecuting || gameState !== 'playing') return;
    setCommands(commands.filter((_, i) => i !== index));
  };

  const clearCommands = () => {
    if (isExecuting || gameState !== 'playing') return;
    setCommands([]);
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Hindi
    window.speechSynthesis.speak(utterance);
  };

  const runSequence = async () => {
    if (commands.length === 0 || isExecuting) return;
    
    setIsExecuting(true);
    setBotPos(START_POS);
    setCurrentStep(-1);
    
    let currentPos = { ...START_POS };

    for (let i = 0; i < commands.length; i++) {
      setCurrentStep(i);
      const cmd = commands[i];
      
      // Calculate next position
      const nextPos = { ...currentPos };
      if (cmd === 'Forward') nextPos.y -= 1;
      if (cmd === 'Backward') nextPos.y += 1;
      if (cmd === 'Left') nextPos.x -= 1;
      if (cmd === 'Right') nextPos.x += 1;

      // Wait 500ms
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check bounds
      if (nextPos.x < 0 || nextPos.x >= GRID_SIZE || nextPos.y < 0 || nextPos.y >= GRID_SIZE) {
        setGameState('lost');
        setMessage('Try Again, Hustler!');
        setIsExecuting(false);
        return;
      }

      currentPos = nextPos;
      setBotPos(currentPos);
      hustleService.addPoints(10); // Points for each successful step

      // Check win
      if (currentPos.x === END_POS.x && currentPos.y === END_POS.y) {
        setGameState('won');
        setMessage('Badhiya Kaam!');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0EA5E9', '#ffffff', '#F0F9FF']
        });
        playAudio('Badhiya Kaam!');
        setIsExecuting(false);
        
        // Save progress
        hustleService.completeLevel(levelId, attempts, commands);
        hustleService.addXp(100);
        
        return;
      }
    }

    // Finished sequence but not at trophy
    if (currentPos.x !== END_POS.x || currentPos.y !== END_POS.y) {
      setGameState('lost');
      setMessage('Not quite there! Try again.');
    }
    setIsExecuting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-4xl rounded-[2rem] border border-primary/10 overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.1)] flex flex-col md:flex-row h-[90vh] md:h-auto"
      >
        {/* Header / Close */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Game Area */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-primary/5">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black italic text-primary tracking-tighter">{(levelTitle || '').toUpperCase()}</h2>
            <p className={`font-bold mt-1 transition-colors ${gameState === 'won' ? 'text-primary' : gameState === 'lost' ? 'text-red-500' : 'text-gray-500'}`}>
              {message}
            </p>
          </div>

          {/* 5x5 Grid */}
          <div className="grid grid-cols-5 gap-2 bg-primary/5 p-3 rounded-2xl border border-primary/10">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isBot = botPos.x === x && botPos.y === y;
              const isEnd = END_POS.x === x && END_POS.y === y;
              const isStart = START_POS.x === x && START_POS.y === y;

              return (
                <div 
                  key={i}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center relative transition-all duration-300 ${
                    isBot ? 'bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 
                    isEnd ? 'bg-yellow-500/10 border-2 border-yellow-500/50' :
                    'bg-white border border-primary/5'
                  }`}
                >
                  {isBot && (
                    <motion.div 
                      layoutId="bot"
                      animate={gameState === 'lost' ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                      className="text-primary"
                    >
                      <Bot className="w-8 h-8 md:w-10 md:h-10" />
                    </motion.div>
                  )}
                  {isEnd && !isBot && (
                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 opacity-50" />
                  )}
                  {isStart && !isBot && (
                    <div className="w-2 h-2 rounded-full bg-primary/30" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={runSequence}
              disabled={isExecuting || commands.length === 0}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.4)] disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              RUN HUSTLE
            </button>
            <button
              onClick={resetGame}
              className="p-3 bg-primary/5 hover:bg-primary/10 rounded-2xl border border-primary/10 transition-all text-primary"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Command Center */}
        <div className="w-full md:w-80 bg-background p-8 flex flex-col">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Command Center</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            <CommandButton icon={<ArrowUp />} label="Forward" onClick={() => addCommand('Forward')} />
            <CommandButton icon={<ArrowDown />} label="Backward" onClick={() => addCommand('Backward')} />
            <CommandButton icon={<ArrowLeft />} label="Left" onClick={() => addCommand('Left')} />
            <CommandButton icon={<ArrowRight />} label="Right" onClick={() => addCommand('Right')} />
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Command Sequence</h3>
              <button onClick={clearCommands} className="text-red-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {commands.map((cmd, i) => (
                  <motion.div
                    key={`${cmd}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      backgroundColor: currentStep === i ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.05)',
                      borderColor: currentStep === i ? '#0EA5E9' : 'rgba(14, 165, 233, 0.1)'
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-between p-3 rounded-xl border border-primary/10 bg-white group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-600 w-4">{i + 1}</span>
                      <div className="text-primary">
                        {cmd === 'Forward' && <ArrowUp className="w-4 h-4" />}
                        {cmd === 'Backward' && <ArrowDown className="w-4 h-4" />}
                        {cmd === 'Left' && <ArrowLeft className="w-4 h-4" />}
                        {cmd === 'Right' && <ArrowRight className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-bold">{cmd}</span>
                    </div>
                    <button 
                      onClick={() => removeCommand(i)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {commands.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-primary/10 rounded-2xl p-8 text-center">
                  <Bot className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs font-bold">Add commands to start the hustle!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CommandButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-surface border border-primary/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all group active:scale-95"
  >
    <div className="text-gray-400 group-hover:text-primary transition-colors">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-primary">{label}</span>
  </button>
);
