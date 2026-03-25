import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Image as KonvaImage, Transformer } from 'react-konva';
import { 
  Pencil, 
  Square, 
  Circle as CircleIcon, 
  Type, 
  Eraser, 
  Trash2, 
  Download, 
  MousePointer2,
  Undo,
  Redo,
  Grid3X3,
  Bot,
  Beaker,
  Rocket,
  Zap,
  Atom,
  Star
} from 'lucide-react';
import useImage from 'use-image';

interface Shape {
  id: string;
  type: 'line' | 'rect' | 'circle' | 'text' | 'sticker';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  src?: string;
}

const STEM_STICKERS = [
  { id: 'bot', icon: <Bot className="w-6 h-6" />, name: 'Robot' },
  { id: 'beaker', icon: <Beaker className="w-6 h-6" />, name: 'Lab' },
  { id: 'rocket', icon: <Rocket className="w-6 h-6" />, name: 'Space' },
  { id: 'zap', icon: <Zap className="w-6 h-6" />, name: 'Energy' },
  { id: 'atom', icon: <Atom className="w-6 h-6" />, name: 'Science' },
  { id: 'star', icon: <Star className="w-6 h-6" />, name: 'Star' },
];

const StickerImage = ({ src, x, y, id, onSelect, isSelected }: any) => {
  const [image] = useImage(src, 'anonymous');
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        x={x}
        y={y}
        id={id}
        draggable
        onClick={() => onSelect(id)}
        onTap={() => onSelect(id)}
        ref={shapeRef}
        width={100}
        height={100}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export const SmartWhiteboard: React.FC = () => {
  const [tool, setTool] = useState<'select' | 'pencil' | 'rect' | 'circle' | 'text' | 'eraser'>('pencil');
  const [color, setColor] = useState('#0EA5E9');
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [redoStack, setRedoStack] = useState<Shape[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();

    return () => observer.disconnect();
  }, []);

  const handleMouseDown = (e: any) => {
    if (tool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
      return;
    }

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const id = Date.now().toString();
    
    setHistory([...history, shapes]);
    setRedoStack([]);

    if (tool === 'pencil' || tool === 'eraser') {
      setShapes([...shapes, {
        id,
        type: 'line',
        points: [pos.x, pos.y],
        stroke: tool === 'eraser' ? '#ffffff' : color,
        strokeWidth: strokeWidth,
      }]);
    } else if (tool === 'rect') {
      setShapes([...shapes, {
        id,
        type: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: color,
        strokeWidth: strokeWidth,
      }]);
    } else if (tool === 'circle') {
      setShapes([...shapes, {
        id,
        type: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke: color,
        strokeWidth: strokeWidth,
      }]);
    } else if (tool === 'text') {
      const text = prompt('Enter your text:');
      if (text) {
        setShapes([...shapes, {
          id,
          type: 'text',
          x: pos.x,
          y: pos.y,
          text,
          fill: color,
        }]);
      }
      isDrawing.current = false;
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || tool === 'select') return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    setShapes(prevShapes => {
      const newShapes = [...prevShapes];
      const lastShape = { ...newShapes[newShapes.length - 1] };

      if (tool === 'pencil' || tool === 'eraser') {
        lastShape.points = [...(lastShape.points || []), point.x, point.y];
      } else if (tool === 'rect') {
        lastShape.width = point.x - (lastShape.x || 0);
        lastShape.height = point.y - (lastShape.y || 0);
      } else if (tool === 'circle') {
        const dx = point.x - (lastShape.x || 0);
        const dy = point.y - (lastShape.y || 0);
        lastShape.radius = Math.sqrt(dx * dx + dy * dy);
      }

      newShapes[newShapes.length - 1] = lastShape;
      return newShapes;
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([...redoStack, shapes]);
    setShapes(prev);
    setHistory(history.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory([...history, shapes]);
    setShapes(next);
    setRedoStack(redoStack.slice(0, -1));
  };

  const clear = () => {
    setHistory([...history, shapes]);
    setShapes([]);
  };

  const download = () => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addSticker = (type: string) => {
    const id = Date.now().toString();
    const src = `https://api.dicebear.com/7.x/bottts/svg?seed=${type}&backgroundColor=transparent`;
    setHistory([...history, shapes]);
    setShapes([...shapes, {
      id,
      type: 'sticker',
      x: 100,
      y: 100,
      src
    }]);
    setTool('select');
    setSelectedId(id);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl">
      {/* Top Toolbar */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setTool('select')}
            className={`p-2 rounded-lg transition-all ${tool === 'select' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Select"
          >
            <MousePointer2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('pencil')}
            className={`p-2 rounded-lg transition-all ${tool === 'pencil' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Pencil"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-2 rounded-lg transition-all ${tool === 'rect' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Rectangle"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded-lg transition-all ${tool === 'circle' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Circle"
          >
            <CircleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded-lg transition-all ${tool === 'text' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Text"
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-all ${tool === 'eraser' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
          />
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-24 accent-primary"
          />
        </div>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button onClick={undo} disabled={history.length === 0} className="p-2 text-slate-400 hover:text-primary disabled:opacity-30">
            <Undo className="w-5 h-5" />
          </button>
          <button onClick={redo} disabled={redoStack.length === 0} className="p-2 text-slate-400 hover:text-primary disabled:opacity-30">
            <Redo className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setShowGrid(!showGrid)} className={`p-2 rounded-xl transition-all ${showGrid ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}>
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button onClick={clear} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={download} className="p-2 bg-primary text-white rounded-xl shadow-lg hover:scale-105 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Stickers */}
        <div className="w-16 bg-slate-50 border-r border-slate-100 flex flex-col items-center py-4 gap-4">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stickers</div>
          {STEM_STICKERS.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => addSticker(sticker.id)}
              className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm"
              title={sticker.name}
            >
              {sticker.icon}
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden" ref={containerRef}>
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]" />
          )}
          <Stage
            width={dimensions.width}
            height={dimensions.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              {shapes.map((shape) => {
                if (shape.type === 'line') {
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation={
                        shape.stroke === '#ffffff' ? 'destination-out' : 'source-over'
                      }
                    />
                  );
                } else if (shape.type === 'rect') {
                  return (
                    <Rect
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                } else if (shape.type === 'circle') {
                  return (
                    <Circle
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                    />
                  );
                } else if (shape.type === 'text') {
                  return (
                    <Text
                      key={shape.id}
                      x={shape.x}
                      y={shape.y}
                      text={shape.text}
                      fill={shape.fill}
                      fontSize={24}
                      fontStyle="bold"
                      draggable={tool === 'select'}
                    />
                  );
                } else if (shape.type === 'sticker') {
                  return (
                    <StickerImage
                      key={shape.id}
                      id={shape.id}
                      src={shape.src}
                      x={shape.x}
                      y={shape.y}
                      isSelected={shape.id === selectedId}
                      onSelect={setSelectedId}
                    />
                  );
                }
                return null;
              })}
            </Layer>
          </Stage>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Smart Whiteboard Active
        </div>
        <p className="text-slate-400 text-[10px] font-mono">Use stickers to build your STEM diagrams!</p>
      </div>
    </div>
  );
};
