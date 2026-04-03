import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface StemQuizProps {
  levelId: number;
  levelTitle: string;
  onClose: (reward?: any, performance?: { accuracy: number; time: number }) => void;
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
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
    { q: "What do plants need to grow?", options: ["Sunlight", "Soda", "Pizza", "Toys"], a: 0 },
    { q: "Which part makes food for the plant?", options: ["Root", "Stem", "Leaf", "Seed"], a: 2 },
  ],
  53: [
    { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], a: 1 },
    { q: "How many planets are in our solar system?", options: ["7", "8", "9", "10"], a: 1 },
    { q: "Which is the largest planet?", options: ["Earth", "Mars", "Jupiter", "Neptune"], a: 2 },
  ]
};

export const StemQuiz: React.FC<StemQuizProps> = ({ levelId, levelTitle, onClose, onBuddyMessage }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [hint, setHint] = useState<string | null>(null);

  const questions = QUIZ_DATA[levelId] || QUIZ_DATA[13];

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Time for a knowledge check! Choose the best answer for each question.", 'neutral');
    }
  }, []);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => [...prev, idx]);
    setHint(null);
    
    const isCorrect = idx === questions[currentQ].a;
    const newScore = score + (isCorrect ? 1 : 0);
    if (isCorrect) {
      setScore(newScore);
      hustleService.addPoints(20); // Points for correct answer
      if (onBuddyMessage) {
        onBuddyMessage("Correct! You're a natural!", 'happy');
      }
    } else {
      setHint(`Psst! The correct answer is: ${questions[currentQ].options[questions[currentQ].a]}`);
      if (onBuddyMessage) {
        onBuddyMessage("Not quite! Let's learn from this one.", 'thinking');
      }
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setHint(null);
      } else {
        setGameState('finished');
        if (newScore >= 2) {
          if (onBuddyMessage) {
            onBuddyMessage("QUIZ MASTER! You've proven your STEM skills!", 'celebrating');
          }
          confetti({ particleCount: 150, spread: 70 });
          const reward = hustleService.completeLevel(levelId, 1, [...answers, idx]);
          hustleService.addXp(200);
          
          const accuracy = Math.floor((newScore / questions.length) * 100);
          const time = Math.floor((Date.now() - startTime) / 1000);
          setTimeout(() => onClose(reward, { accuracy, time }), 2000);
        } else {
          if (onBuddyMessage) {
            onBuddyMessage("Good try! Review the mission and let's try again to pass!", 'encouraging');
          }
        }
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border border-slate-200 p-8 rounded-xl max-w-xl w-full relative shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-text-main">{(levelTitle || '').toUpperCase()}</h3>
            <p className="text-xs font-medium text-text-muted uppercase tracking-widest mt-1">Knowledge Check</p>
          </div>
          <button onClick={() => onClose()} className="p-2 hover:bg-slate-100 rounded-lg text-text-muted transition-colors">
            <X size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div key="q" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
              <div className="flex justify-between items-center text-xs font-bold text-text-muted uppercase tracking-widest">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span className="text-primary">Score: {score}</span>
              </div>
              
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  className="h-full bg-primary"
                />
              </div>

              <div className="space-y-6">
                <h4 className="text-lg font-bold text-text-main leading-relaxed text-center">
                  {questions[currentQ].q}
                </h4>

                <div className="grid gap-3">
                  {questions[currentQ].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selected !== null}
                      className={`w-full p-4 rounded-lg border text-left font-medium transition-all flex items-center justify-between group
                        ${selected === null 
                          ? 'bg-white border-slate-200 hover:border-primary hover:bg-primary/5 text-text-main' 
                          : selected === idx
                            ? idx === questions[currentQ].a
                              ? 'bg-success/10 border-success text-success shadow-sm'
                              : 'bg-danger/10 border-danger text-danger shadow-sm'
                            : idx === questions[currentQ].a
                              ? 'bg-success/10 border-success text-success'
                              : 'bg-white border-slate-200 text-text-muted opacity-50'}
                      `}
                    >
                      <span>{opt}</span>
                      {selected !== null && idx === questions[currentQ].a && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                      {selected === idx && idx !== questions[currentQ].a && (
                        <XCircle className="w-5 h-5 text-danger" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {hint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-primary font-medium flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      {hint}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main mb-2">Quiz Complete!</h3>
                <p className="text-text-muted font-medium">
                  You scored {score} out of {questions.length}
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <div className="bg-slate-50 px-6 py-3 rounded-lg border border-slate-200">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Accuracy</p>
                  <p className="text-xl font-bold text-text-main">{Math.floor((score / questions.length) * 100)}%</p>
                </div>
                <div className="bg-slate-50 px-6 py-3 rounded-lg border border-slate-200">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">XP Earned</p>
                  <p className="text-xl font-bold text-text-main">+200</p>
                </div>
              </div>
              <button 
                onClick={() => onClose()} 
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all"
              >
                CONTINUE HUSTLE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
