import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { Beaker, Sparkles, Info, Play, Pause, RotateCcw } from 'lucide-react';

interface StemModelsProps {
  classLevel: number;
}

export const StemModels: React.FC<StemModelsProps> = ({ classLevel }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedModel, setSelectedModel] = useState<'solar' | 'heart' | 'plant'>(
    classLevel >= 5 ? 'solar' : classLevel >= 3 ? 'heart' : 'plant'
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    if (selectedModel === 'solar') {
      renderSolarSystem(g, width, height);
    } else if (selectedModel === 'heart') {
      renderHeart(g, width, height);
    } else {
      renderPlant(g, width, height);
    }

    return () => {
      svg.selectAll('*').remove();
    };
  }, [selectedModel, isPlaying]);

  const renderSolarSystem = (g: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number) => {
    const planets = [
      { name: 'Mercury', distance: 60, radius: 5, color: '#94a3b8', speed: 0.04 },
      { name: 'Venus', distance: 90, radius: 8, color: '#fbbf24', speed: 0.02 },
      { name: 'Earth', distance: 130, radius: 9, color: '#3b82f6', speed: 0.015 },
      { name: 'Mars', distance: 170, radius: 7, color: '#ef4444', speed: 0.01 },
      { name: 'Jupiter', distance: 230, radius: 20, color: '#d97706', speed: 0.005 },
    ];

    // Sun
    g.append('circle')
      .attr('r', 30)
      .attr('fill', 'url(#sunGradient)')
      .attr('filter', 'url(#glow)');

    const defs = g.append('defs');
    const sunGradient = defs.append('radialGradient').attr('id', 'sunGradient');
    sunGradient.append('stop').attr('offset', '0%').attr('stop-color', '#fde047');
    sunGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b');

    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Orbits and Planets
    planets.forEach(planet => {
      g.append('circle')
        .attr('r', planet.distance)
        .attr('fill', 'none')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

      const planetGroup = g.append('g').attr('class', `planet-${planet.name}`);
      
      planetGroup.append('circle')
        .attr('r', planet.radius)
        .attr('fill', planet.color)
        .attr('cx', planet.distance)
        .attr('cy', 0)
        .style('cursor', 'pointer')
        .on('mouseover', function() {
          d3.select(this).transition().attr('r', planet.radius * 1.5);
        })
        .on('mouseout', function() {
          d3.select(this).transition().attr('r', planet.radius);
        });

      planetGroup.append('text')
        .attr('x', planet.distance)
        .attr('y', -planet.radius - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#64748b')
        .text(planet.name);
    });

    if (isPlaying) {
      d3.timer((elapsed) => {
        if (!isPlaying) return true;
        planets.forEach(planet => {
          const angle = elapsed * planet.speed;
          g.select(`.planet-${planet.name}`)
            .attr('transform', `rotate(${angle})`);
        });
      });
    }
  };

  const renderHeart = (g: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number) => {
    const heartPath = "M0,30 A20,20 0,0,1 0,-10 A20,20 0,0,1 0,30 Z"; // Simplified heart shape
    
    const heart = g.append('path')
      .attr('d', "M0 200 C -100 100, -100 0, 0 -50 C 100 0, 100 100, 0 200")
      .attr('fill', '#ef4444')
      .attr('transform', 'scale(0.5) translate(0, -100)')
      .style('cursor', 'pointer');

    const label = g.append('text')
      .attr('y', 120)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'black')
      .attr('class', 'text-slate-900')
      .text('Click to hear the beat!');

    heart.on('click', () => {
      heart.transition()
        .duration(100)
        .attr('transform', 'scale(0.6) translate(0, -100)')
        .transition()
        .duration(100)
        .attr('transform', 'scale(0.5) translate(0, -100)')
        .transition()
        .duration(100)
        .attr('transform', 'scale(0.55) translate(0, -100)')
        .transition()
        .duration(100)
        .attr('transform', 'scale(0.5) translate(0, -100)');
      
      label.text('Lub-Dub! Lub-Dub!');
      setTimeout(() => label.text('Click to hear the beat!'), 2000);
    });

    if (isPlaying) {
      const pulse = () => {
        heart.transition()
          .duration(600)
          .attr('transform', 'scale(0.55) translate(0, -100)')
          .transition()
          .duration(600)
          .attr('transform', 'scale(0.5) translate(0, -100)')
          .on('end', pulse);
      };
      pulse();
    }
  };

  const renderPlant = (g: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number) => {
    // Pot
    g.append('rect')
      .attr('x', -30)
      .attr('y', 100)
      .attr('width', 60)
      .attr('height', 40)
      .attr('fill', '#92400e')
      .attr('rx', 5);

    const stem = g.append('line')
      .attr('x1', 0)
      .attr('y1', 100)
      .attr('x2', 0)
      .attr('y2', 100)
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 8)
      .attr('stroke-linecap', 'round');

    const flower = g.append('g').attr('opacity', 0);
    
    // Petals
    for (let i = 0; i < 8; i++) {
      flower.append('ellipse')
        .attr('rx', 15)
        .attr('ry', 8)
        .attr('fill', '#f472b6')
        .attr('transform', `rotate(${i * 45}) translate(20, 0)`);
    }
    
    // Center
    flower.append('circle')
      .attr('r', 10)
      .attr('fill', '#facc15');

    if (isPlaying) {
      stem.transition()
        .duration(3000)
        .attr('y2', -50)
        .on('end', () => {
          flower.attr('transform', 'translate(0, -50)')
            .transition()
            .duration(1000)
            .attr('opacity', 1);
        });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-[radial-gradient(circle_at_top_right,_#f0f9ff_0%,_#ffffff_100%)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-12">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
              STEM <span className="text-primary">Models</span>
            </h2>
          </div>
          <p className="text-slate-500 font-bold text-sm">Interactive 3D learning for Class {classLevel}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setSelectedModel('plant')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedModel === 'plant' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Plant
          </button>
          <button
            onClick={() => setSelectedModel('heart')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedModel === 'heart' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Heart
          </button>
          <button
            onClick={() => setSelectedModel('solar')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedModel === 'solar' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Solar
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[400px]">
        <svg ref={svgRef} className="w-full h-full" />
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 shadow-xl">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-primary text-white rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => {
              setIsPlaying(false);
              setTimeout(() => setIsPlaying(true), 50);
            }}
            className="p-2 text-slate-400 hover:text-primary transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <div className="h-4 w-[1px] bg-slate-200 mx-2" />
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {selectedModel === 'solar' ? 'Drag planets to explore orbits' : 
               selectedModel === 'heart' ? 'Click the heart to hear it beat' : 
               'Watch the plant grow from a seed'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-50 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-2">Did you know?</h4>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              {selectedModel === 'solar' ? 'Jupiter is so big that all the other planets in the solar system could fit inside it!' :
               selectedModel === 'heart' ? 'Your heart beats about 100,000 times in a single day!' :
               'Plants use sunlight, water, and air to make their own food. This is called photosynthesis!'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">STEM Concept</h4>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              {selectedModel === 'solar' ? 'Gravity: The invisible force that keeps planets orbiting around the Sun.' :
               selectedModel === 'heart' ? 'Circulation: How the heart pumps blood to carry oxygen to your whole body.' :
               'Biology: The study of living things and how they grow and change.'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Interactive Task</h4>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              {selectedModel === 'solar' ? 'Try to identify which planet moves the fastest around the Sun!' :
               selectedModel === 'heart' ? 'Click the heart and count how many times it beats in 10 seconds.' :
               'Reset the model and watch how the stem grows before the flower blooms.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
