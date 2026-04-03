import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Download, Save, Plus, RotateCw, Maximize2, Minimize2, Trash, Sparkles } from 'lucide-react';
import { hustleService, StudentProfile } from '../services/hustleService';

const STICKER_DATA: Record<string, { icon: string; color: string }> = {
  'Star': { icon: '⭐', color: 'text-yellow-400' },
  'Lion': { icon: '🦁', color: 'text-orange-500' },
  'Beaker': { icon: '🧪', color: 'text-emerald-500' },
  'Puzzle': { icon: '🧩', color: 'text-indigo-500' },
  'Pattern': { icon: '🎨', color: 'text-pink-500' },
  'Leaf': { icon: '🍃', color: 'text-green-500' },
  'Brain': { icon: '🧠', color: 'text-purple-500' },
  'Human': { icon: '👤', color: 'text-blue-500' },
  'Tree': { icon: '🌳', color: 'text-green-600' },
  'Math': { icon: '➕', color: 'text-red-500' },
  'Circuit': { icon: '🔌', color: 'text-amber-500' },
  'Binary': { icon: '🔢', color: 'text-slate-500' },
  'Robot': { icon: '🤖', color: 'text-cyan-500' },
  'Planet': { icon: '🪐', color: 'text-orange-400' },
  'Rocket': { icon: '🚀', color: 'text-red-600' },
  'Galaxy': { icon: '🌌', color: 'text-purple-600' },
  'Elephant': { icon: '🐘', color: 'text-slate-400' },
  'Giraffe': { icon: '🦒', color: 'text-orange-400' },
  'Penguin': { icon: '🐧', color: 'text-slate-200' },
  'Turtle': { icon: '🐢', color: 'text-emerald-600' },
  'Butterfly': { icon: '🦋', color: 'text-pink-400' },
  'UFO': { icon: '🛸', color: 'text-emerald-400' },
  'Comet': { icon: '☄️', color: 'text-blue-400' },
  'Satellite': { icon: '🛰️', color: 'text-slate-300' },
  'Astronaut': { icon: '👨‍🚀', color: 'text-white' },
  'DNA': { icon: '🧬', color: 'text-indigo-400' },
  'Microscope': { icon: '🔬', color: 'text-slate-500' },
  'Telescope': { icon: '🔭', color: 'text-indigo-600' },
  'Battery': { icon: '🔋', color: 'text-emerald-500' },
  'Cactus': { icon: '🌵', color: 'text-green-700' },
  'Mushroom': { icon: '🍄', color: 'text-red-400' },
  'Rainbow': { icon: '🌈', color: 'text-pink-400' },
  'Lightning': { icon: '⚡', color: 'text-yellow-400' },
  'Wave': { icon: '🌊', color: 'text-blue-500' },
  'Laptop': { icon: '💻', color: 'text-slate-600' },
  'Phone': { icon: '📱', color: 'text-slate-700' },
  'Gamepad': { icon: '🎮', color: 'text-indigo-500' },
  'Gear': { icon: '⚙️', color: 'text-slate-400' },
};

interface StickerBookProps {
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

export const StickerBook: React.FC<StickerBookProps> = ({ onBuddyMessage }) => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [stickers, setStickers] = useState<StudentProfile['stickers']>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [background, setBackground] = useState<'white' | 'space' | 'jungle' | 'lab'>('white');
  const bookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const p = await hustleService.getProfile();
      if (p) {
        setProfile(p);
        setStickers(p.stickers);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("This is your STEM trophy room! Use the stickers you've earned to create a masterpiece.", 'happy');
    }
  }, []);

  useEffect(() => {
    if (onBuddyMessage && stickers.length > 0 && stickers.length % 5 === 0) {
      onBuddyMessage("Your sticker book is looking amazing! I love how you're arranging them.", 'celebrating');
    }
  }, [stickers.length]);

  if (!profile) return null;

  const addSticker = (stickerId: string) => {
    const newSticker = {
      id: stickerId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };
    const updated = [...stickers, newSticker];
    setStickers(updated);
    hustleService.updateStickers(updated);
    if (onBuddyMessage) {
      onBuddyMessage(`Added a ${stickerId} sticker! You can drag it around and resize it.`, 'happy');
    }
  };

  const updateSticker = (index: number, updates: Partial<typeof stickers[0]>) => {
    const updated = stickers.map((s, i) => i === index ? { ...s, ...updates } : s);
    setStickers(updated);
    hustleService.updateStickers(updated);
  };

  const removeSticker = (index: number) => {
    const updated = stickers.filter((_, i) => i !== index);
    setStickers(updated);
    hustleService.updateStickers(updated);
    setSelectedId(null);
  };

  const handleDrag = (index: number, e: any, info: any) => {
    const book = bookRef.current;
    if (!book) return;
    const rect = book.getBoundingClientRect();
    const x = ((info.point.x - rect.left) / rect.width) * 100;
    const y = ((info.point.y - rect.top) / rect.height) * 100;
    updateSticker(index, { x, y });
  };

  const backgrounds = {
    white: 'bg-white',
    space: 'bg-slate-900 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_100%)]',
    jungle: 'bg-emerald-900 bg-[radial-gradient(circle_at_center,_#065f46_0%,_#064e3b_100%)]',
    lab: 'bg-slate-100 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:20px_20px]',
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter text-slate-900">STEM STICKER BOOK</h2>
          <p className="text-slate-500 font-bold text-sm">Earn stickers by completing missions and create your own STEM world!</p>
        </div>
        <div className="flex items-center gap-2">
          {(['white', 'space', 'jungle', 'lab'] as const).map((bg) => (
            <button
              key={bg}
              onClick={() => setBackground(bg)}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
                background === bg ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sticker Inventory */}
        <div className="w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-6 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
            <Plus className="w-4 h-4" />
            Your Stickers
          </div>
          <div className="grid grid-cols-3 gap-3 overflow-y-auto pr-2 custom-scrollbar">
            {profile.unlockedStickers.map((id) => (
              <button
                key={id}
                onClick={() => addSticker(id)}
                className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-3xl hover:scale-110 hover:bg-primary/5 hover:border-primary/20 transition-all group relative"
              >
                <span className="group-hover:drop-shadow-lg">{STICKER_DATA[id]?.icon}</span>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-2 h-2" />
                </div>
              </button>
            ))}
          </div>
          
          {selectedId !== null && stickers[selectedId] && (
            <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controls</span>
                <button onClick={() => removeSticker(selectedId)} className="text-red-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateSticker(selectedId, { scale: stickers[selectedId].scale + 0.1 })}
                  className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <Maximize2 className="w-3 h-3" /> Size+
                </button>
                <button 
                  onClick={() => updateSticker(selectedId, { scale: Math.max(0.2, stickers[selectedId].scale - 0.1) })}
                  className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold"
                >
                  <Minimize2 className="w-3 h-3" /> Size-
                </button>
                <button 
                  onClick={() => updateSticker(selectedId, { rotation: stickers[selectedId].rotation + 15 })}
                  className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold col-span-2"
                >
                  <RotateCw className="w-3 h-3" /> Rotate
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div 
          ref={bookRef}
          className={`flex-1 rounded-[3rem] border-8 border-white shadow-2xl relative overflow-hidden transition-all duration-500 ${backgrounds[background]}`}
          onClick={() => setSelectedId(null)}
        >
          {stickers.map((sticker, index) => (
            <motion.div
              key={index}
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => handleDrag(index, e, info)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(index);
              }}
              style={{
                position: 'absolute',
                left: `${sticker.x}%`,
                top: `${sticker.y}%`,
                scale: sticker.scale,
                rotate: sticker.rotation,
                cursor: 'grab',
                zIndex: selectedId === index ? 50 : 10,
              }}
              className={`text-6xl select-none transition-shadow ${selectedId === index ? 'drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]' : 'drop-shadow-md'}`}
              whileHover={{ scale: sticker.scale * 1.1 }}
              whileTap={{ cursor: 'grabbing' }}
            >
              {STICKER_DATA[sticker.id]?.icon}
              {selectedId === index && (
                <div className="absolute -inset-4 border-2 border-primary border-dashed rounded-xl pointer-events-none animate-pulse" />
              )}
            </motion.div>
          ))}

          {stickers.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-20 pointer-events-none">
              <Sparkles className="w-24 h-24 mb-4" />
              <p className="text-2xl font-black italic uppercase tracking-tighter">Your Canvas is Empty</p>
              <p className="font-bold">Add stickers from the left to start creating!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
