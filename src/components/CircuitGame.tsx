import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { hustleService } from '../services/hustleService';

interface CircuitGameProps {
  levelId: number;
  levelTitle: string;
  onClose: () => void;
}

const GAME_DATA: Record<number, { nodes: { id: string, x: number, y: number }[], connections: [string, string][] }> = {
  41: { // Circuit Builder
    nodes: [
      { id: '1', x: 20, y: 20 },
      { id: '2', x: 80, y: 20 },
      { id: '3', x: 80, y: 80 },
      { id: '4', x: 20, y: 80 },
    ],
    connections: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '1']]
  }
};

export const CircuitGame: React.FC<CircuitGameProps> = ({ levelId, levelTitle, onClose }) => {
  const data = GAME_DATA[levelId] || GAME_DATA[41];
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [userConnections, setUserConnections] = useState<[string, string][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');
  const [moves, setMoves] = useState<any[]>([]);

  const handleNodeClick = (nodeId: string) => {
    if (gameState === 'won') return;
    
    if (!selectedNode) {
      setSelectedNode(nodeId);
    } else if (selectedNode === nodeId) {
      setSelectedNode(null);
    } else {
      const newConn: [string, string] = [selectedNode, nodeId];
      const isCorrect = data.connections.some(c => 
        (c[0] === newConn[0] && c[1] === newConn[1]) || (c[0] === newConn[1] && c[1] === newConn[0])
      );
      
      setMoves(prev => [...prev, { connection: newConn, correct: isCorrect }]);

      if (isCorrect) {
        const exists = userConnections.some(c => 
          (c[0] === newConn[0] && c[1] === newConn[1]) || (c[0] === newConn[1] && c[1] === newConn[0])
        );
        if (!exists) {
          hustleService.addPoints(40); // Points for correct connection
          const newConns = [...userConnections, newConn];
          setUserConnections(newConns);
          if (newConns.length === data.connections.length) {
            setGameState('won');
            confetti({ particleCount: 150, spread: 70 });
            hustleService.completeLevel(levelId, 1, moves);
            hustleService.addXp(150);
          }
        }
      }
      setSelectedNode(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface w-full max-w-2xl rounded-[2rem] border border-primary/10 p-8 relative shadow-[0_0_50px_rgba(14,165,233,0.1)]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-primary/5 hover:bg-primary/10 rounded-full transition-colors z-10 text-primary">
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black italic text-primary tracking-tighter">{(levelTitle || '').toUpperCase()}</h2>
          <p className="text-gray-500 font-bold mt-1">Connect the circuit!</p>
        </div>

        <div className="relative aspect-square bg-primary/5 rounded-3xl border border-primary/10 p-12">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {userConnections.map((conn, i) => {
              const n1 = data.nodes.find(n => n.id === conn[0])!;
              const n2 = data.nodes.find(n => n.id === conn[1])!;
              return (
                <line
                  key={i}
                  x1={`${n1.x}%`} y1={`${n1.y}%`}
                  x2={`${n2.x}%`} y2={`${n2.y}%`}
                  stroke="#0EA5E9" strokeWidth="4" strokeDasharray="8 4"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {data.nodes.map(node => (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-4 flex items-center justify-center transition-all ${
                selectedNode === node.id ? 'bg-primary border-primary text-white scale-110' : 'bg-white border-primary/20 hover:border-primary/40 text-primary/40'
              }`}
            >
              <Zap className="w-6 h-6" />
            </button>
          ))}
        </div>

        {gameState === 'won' && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-10 text-center">
            <div className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(14,165,233,0.4)] mx-auto w-fit">
              <CheckCircle2 className="w-6 h-6" />
              CIRCUIT COMPLETE!
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
