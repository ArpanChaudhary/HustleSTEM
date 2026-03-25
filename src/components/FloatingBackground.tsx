import React from 'react';

export const FloatingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="glow-orb w-[500px] h-[500px] bg-primary/20 -top-20 -left-20" />
      <div className="glow-orb w-[600px] h-[600px] bg-accent/20 -bottom-40 -right-20" />
      <div className="glow-orb w-[400px] h-[400px] bg-cyan-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="animate-float absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 10 + 10 + 's'
            }}
          />
        ))}
      </div>
    </div>
  );
};
