import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface StemQuizProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

interface Question {
  q: string;
  options: string[];
  a: number;
}

const QUIZ_DATA: Record<number, Question[]> = {
  13: [
    { q: "Which animal is the King of the Jungle?", options: ["Tiger", "Lion", "Elephant", "Monkey"], a: 1 },
    { q: "What do monkeys love to eat?", options: ["Meat", "Fish", "Bananas", "Grass"], a: 2 },
    { q: "Which animal has a long trunk?", options: ["Giraffe", "Elephant", "Zebra", "Lion"], a: 1 },
  ],
  23: [
    { q: "What part of the plant is underground?", options: ["Leaves", "Stem", "Roots", "Flower"], a: 2 },
    { q: "What do plants need to grow?", options: ["Soda", "Sunlight", "Pizza", "Toys"], a: 1 },
    { q: "Which part makes food for the plant?", options: ["Root", "Stem", "Leaf", "Seed"], a: 2 },
  ],
  53: [
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], a: 1 },
    { q: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], a: 1 },
    { q: "Which is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Neptune"], a: 2 },
  ]
};

export const StemQuiz: React.FC<StemQuizProps> = ({ levelId, levelTitle, onClose }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = QUIZ_DATA[levelId] || QUIZ_DATA[13];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => [...prev, idx]);
    
    if (idx === questions[currentQ].a) {
      setScore(s => s + 1);
      hustleService.addPoints(20); // Points for correct answer
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
        setSelected(null);
      } else {
        setGameState('finished');
        if (score + (idx === questions[currentQ].a ? 1 : 0) >= 2) {
          confetti({ particleCount: 150, spread: 70 });
          hustleService.completeLevel(levelId, 1, [...answers, idx]);
          hustleService.addXp(200);
        }
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-xl rounded-[2rem] border border-primary/10 p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{levelTitle.toUpperCase()}</h2>
          {gameState === 'playing' && <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Question {currentQ + 1} of {questions.length}</p>}
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div key="q" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
              <h3 className="text-xl font-bold mb-8 text-center text-text-main">{questions[currentQ].q}</h3>
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`p-4 rounded-2xl border-2 font-bold transition-all text-left flex items-center justify-between ${
                      selected === i 
                        ? i === questions[currentQ].a ? 'border-primary bg-primary/10 text-primary' : 'border-red-500 bg-red-500/10 text-red-500'
                        : selected !== null && i === questions[currentQ].a ? 'border-primary bg-primary/10 text-primary' : 'border-primary/5 bg-primary/5 hover:border-primary/20 text-text-main'
                    }`}
                  >
                    {opt}
                    {selected === i && (i === questions[currentQ].a ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-black mb-2 text-text-main">QUIZ COMPLETE!</h3>
              <p className="text-gray-500 mb-8 font-bold">You scored {score} out of {questions.length}</p>
              <button onClick={onClose} className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                CONTINUE HUSTLE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
