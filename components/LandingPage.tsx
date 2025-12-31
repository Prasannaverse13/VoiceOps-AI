import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen w-full overflow-hidden flex flex-col items-center justify-center relative selection:bg-landing-primary/30 selection:text-white">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 z-0 bg-void">
        {/* Main deep gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-void to-black opacity-90"></div>
        {/* Ambient Color Spots */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-landing-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 noise-bg z-10"></div>
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-6">
        {/* The Voice Orb */}
        <div className="relative mb-16 group cursor-default">
          {/* Far Outer Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] orb-glow rounded-full blur-[60px] opacity-30 animate-pulse-slow"></div>
          {/* Mid Glow layer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-[40px] animate-breathe-slow"></div>
          {/* The Orb Core */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full animate-drift">
            {/* Inner Gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4c1d95] via-landing-primary to-[#06b6d4] opacity-90 blur-md animate-breathe-slow"></div>
            {/* Sharper Core Definition */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-black/60 via-transparent to-white/10 blur-[1px]"></div>
            {/* Specular Highlight mimicking a glass sphere */}
            <div className="absolute top-4 right-8 w-16 h-8 bg-white/10 rounded-full blur-xl transform rotate-[-45deg]"></div>
            {/* Interactive reaction hint */}
            <div className="absolute inset-0 rounded-full border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"></div>
          </div>
        </div>
        
        {/* Typography */}
        <div className="flex flex-col items-center gap-6 text-center animate-in fade-in duration-1000">
          <h1 className="text-white text-5xl md:text-7xl font-light tracking-tight md:tracking-wide font-display bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60">
            VoiceOps AI
          </h1>
          <p className="text-white/60 text-lg md:text-xl font-light tracking-wide max-w-md leading-relaxed">
            Operate systems through voice.
          </p>
        </div>
        
        {/* Call to Action */}
        <div className="mt-12 animate-in fade-in duration-1500 flex flex-col items-center gap-12" style={{ animationDelay: '500ms' }}>
          <button 
            onClick={onStart}
            className="glass-btn group relative flex items-center justify-center gap-3 px-12 py-5 rounded-full text-white/90 font-medium tracking-widest uppercase text-sm overflow-hidden"
          >
            <span className="relative z-10">Initiate Control</span>
            <span className="material-symbols-outlined text-sm relative z-10 transition-transform duration-300 group-hover:translate-x-1 text-white/70">
              arrow_forward
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          {/* Built with section - Scaled up for better visibility */}
          <div className="flex flex-col items-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
            <span className="text-sm uppercase tracking-[0.4em] font-bold text-white/40">Built with Industrial Intelligence</span>
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-3 group cursor-help">
                <span className="material-symbols-outlined text-2xl text-primary-light">psychology</span>
                <span className="text-sm font-bold tracking-tighter">GEMINI</span>
              </div>
              <div className="flex items-center gap-3 group cursor-help">
                <span className="material-symbols-outlined text-2xl text-cyan-400">cloud</span>
                <span className="text-sm font-bold tracking-tighter">GCP</span>
              </div>
              <div className="flex items-center gap-3 group cursor-help">
                <span className="material-symbols-outlined text-2xl text-terminal-green">settings_voice</span>
                <span className="text-sm font-bold tracking-tighter">ELEVENLABS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Image Data Alt (For compliance) */}
      <div className="hidden" data-alt="Abstract deep violet and black gradient background representing a digital void"></div>
      <div className="hidden" data-alt="Glowing cyan and violet orb representing an AI voice interface"></div>
    </div>
  );
};

export default LandingPage;