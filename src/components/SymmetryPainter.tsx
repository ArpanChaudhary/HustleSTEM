import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Eraser, Trash2, Download, Undo, Palette, Grid3X3, RotateCw, Type, Sparkles, Square, Circle, Triangle, Layers } from 'lucide-react';

type SymmetryType = 'vertical' | 'horizontal' | 'radial' | 'kaleidoscope';
type BrushType = 'normal' | 'rainbow' | 'neon' | 'dotted';
type PaperType = 'plain' | 'grid' | 'dots' | 'isometric';
type ToolType = 'brush' | 'circle' | 'square' | 'triangle';

interface SymmetryPainterProps {
  onBuddyMessage?: (msg: string, mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral') => void;
}

export const SymmetryPainter: React.FC<SymmetryPainterProps> = ({ onBuddyMessage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0EA5E9');
  const [brushSize, setBrushSize] = useState(5);
  const [symmetryType, setSymmetryType] = useState<SymmetryType>('vertical');
  const [brushType, setBrushType] = useState<BrushType>('normal');
  const [paperType, setPaperType] = useState<PaperType>('grid');
  const [toolType, setToolType] = useState<ToolType>('brush');
  const [radialCount, setRadialCount] = useState(6);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [hue, setHue] = useState(0);

  useEffect(() => {
    if (onBuddyMessage) {
      onBuddyMessage("Welcome to the Creative Lab! Try using different symmetry modes to create amazing patterns.", 'happy');
    }
  }, []);

  useEffect(() => {
    if (onBuddyMessage && symmetryType === 'kaleidoscope') {
      onBuddyMessage("Kaleidoscope mode! This is my favorite. Everything you draw is mirrored perfectly!", 'celebrating');
    }
  }, [symmetryType]);

  useEffect(() => {
    if (onBuddyMessage && brushType === 'rainbow') {
      onBuddyMessage("Rainbow colors! This is going to look spectacular!", 'happy');
    }
  }, [brushType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const temp = canvas.toDataURL();
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        const img = new Image();
        img.src = temp;
        img.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
      }
    };

    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prev = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);

    const img = new Image();
    img.src = prev;
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    saveToHistory();
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const getBrushColor = () => {
    if (brushType === 'rainbow') {
      return `hsl(${hue}, 100%, 50%)`;
    }
    return color;
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    if (brushType === 'rainbow') setHue(prev => (prev + 2) % 360);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = getBrushColor();

    if (brushType === 'neon') {
      ctx.shadowBlur = brushSize * 2;
      ctx.shadowColor = getBrushColor();
    } else {
      ctx.shadowBlur = 0;
    }

    if (brushType === 'dotted') {
      ctx.setLineDash([brushSize, brushSize * 2]);
    } else {
      ctx.setLineDash([]);
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const applySymmetry = (drawFn: (px: number, py: number) => void) => {
      if (symmetryType === 'vertical') {
        drawFn(x, y);
        drawFn(canvas.width - x, y);
      } else if (symmetryType === 'horizontal') {
        drawFn(x, y);
        drawFn(x, canvas.height - y);
      } else if (symmetryType === 'radial' || symmetryType === 'kaleidoscope') {
        const angle = (Math.PI * 2) / radialCount;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const startAngle = Math.atan2(dy, dx);

        for (let i = 0; i < radialCount; i++) {
          const currentAngle = startAngle + i * angle;
          const rx = centerX + Math.cos(currentAngle) * distance;
          const ry = centerY + Math.sin(currentAngle) * distance;
          drawFn(rx, ry);

          if (symmetryType === 'kaleidoscope') {
            const mirrorAngle = -startAngle + i * angle;
            const mx = centerX + Math.cos(mirrorAngle) * distance;
            const my = centerY + Math.sin(mirrorAngle) * distance;
            drawFn(mx, my);
          }
        }
      }
    };

    if (toolType === 'brush') {
      applySymmetry((px, py) => {
        ctx.lineTo(px, py);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(px, py);
      });
    } else {
      // Shape tools are better handled on mouse up or with a temporary canvas
      // For simplicity in this sandbox, we'll draw them continuously
      applySymmetry((px, py) => {
        ctx.beginPath();
        if (toolType === 'circle') ctx.arc(px, py, brushSize * 2, 0, Math.PI * 2);
        if (toolType === 'square') ctx.rect(px - brushSize * 2, py - brushSize * 2, brushSize * 4, brushSize * 4);
        if (toolType === 'triangle') {
          ctx.moveTo(px, py - brushSize * 2);
          ctx.lineTo(px + brushSize * 2, py + brushSize * 2);
          ctx.lineTo(px - brushSize * 2, py + brushSize * 2);
          ctx.closePath();
        }
        ctx.stroke();
      });
    }
  };

  const clearCanvas = () => {
    saveToHistory();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'hustle-art.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl">
      {/* Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-4">
        {/* Symmetry Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {(['vertical', 'horizontal', 'radial', 'kaleidoscope'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSymmetryType(type)}
              className={`px-3 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${
                symmetryType === type ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Brush Type Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {(['normal', 'rainbow', 'neon', 'dotted'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setBrushType(type)}
              className={`p-2 rounded-lg transition-all ${
                brushType === type ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
              }`}
              title={type}
            >
              {type === 'normal' && <Palette className="w-4 h-4" />}
              {type === 'rainbow' && <Sparkles className="w-4 h-4" />}
              {type === 'neon' && <Layers className="w-4 h-4" />}
              {type === 'dotted' && <Grid3X3 className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Tool Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {(['brush', 'circle', 'square', 'triangle'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setToolType(type)}
              className={`p-2 rounded-lg transition-all ${
                toolType === type ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
              }`}
              title={type}
            >
              {type === 'brush' && <Type className="w-4 h-4" />}
              {type === 'circle' && <Circle className="w-4 h-4" />}
              {type === 'square' && <Square className="w-4 h-4" />}
              {type === 'triangle' && <Triangle className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Paper Type Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {(['plain', 'grid', 'dots', 'isometric'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPaperType(type)}
              className={`px-3 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${
                paperType === type ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={undo} disabled={history.length === 0} className={`p-3 rounded-xl transition-all ${history.length > 0 ? 'bg-white text-primary border border-slate-200' : 'text-slate-200 cursor-not-allowed'}`}>
            <Undo className="w-5 h-5" />
          </button>
          <button onClick={clearCanvas} className="p-3 bg-white text-red-500 border border-slate-200 rounded-xl hover:bg-red-50 transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={downloadImage} className="p-3 bg-primary text-white rounded-xl shadow-lg hover:scale-105 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-slate-100 overflow-hidden">
        {/* Paper Background */}
        <div className={`absolute inset-0 pointer-events-none opacity-10 ${
          paperType === 'grid' ? 'bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]' :
          paperType === 'dots' ? 'bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:40px_40px]' :
          paperType === 'isometric' ? 'bg-[linear-gradient(30deg,#000_1px,transparent_1px),linear-gradient(150deg,#000_1px,transparent_1px)] bg-[size:40px_40px]' : ''
        }`} />

        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
            {symmetryType === 'vertical' && <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-900" />}
            {symmetryType === 'horizontal' && <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-900" />}
            {(symmetryType === 'radial' || symmetryType === 'kaleidoscope') && (
              <>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-900" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-900" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-slate-900 rounded-full" style={{ width: '50%', height: '50%' }} />
              </>
            )}
          </div>
        )}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="w-full h-full cursor-crosshair touch-none relative z-20"
        />
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-24 right-8 flex flex-col gap-4 z-30">
        <div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-slate-400" />
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
              <span>Size</span>
              <span>{brushSize}</span>
            </div>
            <input 
              type="range" min="1" max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-32 accent-primary"
            />
          </div>
          { (symmetryType === 'radial' || symmetryType === 'kaleidoscope') && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span>Segments</span>
                <span>{radialCount}</span>
              </div>
              <input 
                type="range" min="2" max="24" step="1" 
                value={radialCount} 
                onChange={(e) => setRadialCount(parseInt(e.target.value))}
                className="w-32 accent-primary"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Creative Sandbox Active
        </div>
        <p className="text-slate-400 text-[10px] font-mono">Try Kaleidoscope mode with Rainbow brush for amazing patterns!</p>
      </div>
    </div>
  );
};
