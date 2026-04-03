import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, Download, Share2, X, Rocket, ShieldCheck, Star } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  classLevel: number;
  date: string;
  certificateId: string;
  onClose: () => void;
  onShare?: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  studentName,
  classLevel,
  date,
  certificateId,
  onClose,
  onShare
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
    >
      <div className="max-w-4xl w-full flex flex-col gap-6">
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Card */}
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative aspect-[1.414/1] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.2)] border-8 border-slate-800 p-12 flex flex-col items-center justify-between text-center"
          ref={certRef}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] translate-x-1/2 translate-y-1/2" />
          
          {/* Border Pattern */}
          <div className="absolute inset-4 border-2 border-dashed border-white/10 rounded-2xl pointer-events-none" />
          
          {/* Header */}
          <div className="space-y-4 relative">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.5)] rotate-3">
                <Rocket className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white italic">
              CERTIFICATE OF <span className="text-primary">COMPLETION</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </div>

          {/* Body */}
          <div className="space-y-8 relative">
            <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">This is to certify that</p>
            <h2 className="text-6xl font-black text-white tracking-tight">{studentName}</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              has successfully completed <span className="text-primary font-bold">Module 1: STEM Fundamentals</span> 
              (Classes 1-5) with exceptional performance and dedication.
            </p>
          </div>

          {/* Footer */}
          <div className="w-full grid grid-cols-3 items-end relative">
            <div className="text-left space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest">Date Awarded</p>
              <p className="text-lg font-bold text-white">{formattedDate}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                <div className="absolute inset-2 border-2 border-primary/50 rounded-full border-dashed animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-12 h-12 text-primary" />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">{certificateId}</p>
            </div>

            <div className="text-right space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-widest">HustleSTEM Academy</p>
              <div className="flex justify-end gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <p className="text-lg font-bold text-white italic">Verified</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Post-Award Actions */}
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 px-8 py-4 bg-primary text-slate-900 font-black rounded-2xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(34,211,238,0.4)]">
            <Download className="w-5 h-5" />
            DOWNLOAD PDF
          </button>
          <button 
            onClick={onShare}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            SHARE ACHIEVEMENT
          </button>
        </div>
      </div>
    </motion.div>
  );
};
