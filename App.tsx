import React, { useState, useEffect, useRef } from 'react';
import { AppState, SystemStatus } from './types';
import { GoogleGenAI, Chat } from '@google/genai';
import Orb from './components/Orb';
import CommandScreen, { ScreenType } from './components/CommandScreen';
import LandingPage from './components/LandingPage';
import { tools, SYSTEM_INSTRUCTION } from './services/geminiService';
import { speechToText, textToSpeech } from './services/elevenLabsService';

const SYSTEM_STATUS_API = 'https://get-system-status-92503952538.asia-south1.run.app';

const App: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [history, setHistory] = useState<{ role: string; text: string; timestamp: string }[]>([]);
  const [activeScreen, setActiveScreen] = useState<ScreenType>('IDLE');
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [systemData, setSystemData] = useState<SystemStatus | null>(null);
  const [automatedTask, setAutomatedTask] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatRef = useRef<Chat | null>(null);
  const isProcessingRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Persistent Mission Chronology Auto-scroll
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Initialize Chat Session
  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ functionDeclarations: tools }],
      },
    });
  }, []);

  const triggerSystemAction = async (name: string, args: any) => {
    setIsLoadingScreen(true);
    let dataResult: any = { status: "pending" };
    
    const mockData: SystemStatus = {
      health: "Nominal (Simulated)",
      latency_ms: 42,
      error_rate: 0.01,
      last_deployment: new Date().toISOString(),
      deployment_status: "SUCCESS",
      incident_active: false,
      updated_at: new Date().toISOString()
    };

    try {
      if (name === 'runHealthCheck' || name === 'checkSystemStatus') {
        try {
          const res = await fetch(SYSTEM_STATUS_API);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setSystemData(data);
          dataResult = data;
        } catch (fetchErr) {
          console.warn("API Unavailable, using simulation data:", fetchErr);
          setSystemData(mockData);
          dataResult = mockData;
        }
        setActiveScreen('METRICS_DASHBOARD');
      } else if (name === 'openPage') {
        setActiveScreen(args.pageName as ScreenType);
        dataResult = { status: "success", view: args.pageName };
      } else if (name === 'performAutomatedAction') {
        setActiveScreen('AUTOMATED_ACTION');
        setAutomatedTask(args.taskDescription);
        await new Promise(r => setTimeout(r, 2000));
        dataResult = { status: "complete", task: args.taskDescription, logs: ["Navigating to GCP Console", "Verifying IAM permissions", "Executing script"] };
      }
    } catch (e) {
      console.error("Critical Tool Execution Error:", e);
      dataResult = { status: "error", message: String(e) };
    }
    setIsLoadingScreen(false);
    return dataResult;
  };

  const processUserVoice = async (audioBlob: Blob | string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setAppState(AppState.THINKING);
    setShowSuggestions(false);
    setSuggestions([]);

    try {
      let transcript = "";
      if (typeof audioBlob === 'string') {
        transcript = audioBlob;
      } else {
        transcript = await speechToText(audioBlob);
      }

      if (!transcript || transcript.trim().length < 2) {
        setAppState(AppState.IDLE);
        isProcessingRef.current = false;
        return;
      }

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setHistory(prev => [...prev, { role: 'user', text: transcript, timestamp }]);

      if (chatRef.current) {
        let response = await chatRef.current.sendMessage({ message: transcript });
        
        if (response.functionCalls && response.functionCalls.length > 0) {
          for (const fc of response.functionCalls) {
            const result = await triggerSystemAction(fc.name, fc.args);
            response = await chatRef.current.sendMessage({ message: `Grounded Report: ${JSON.stringify(result)}` });
          }
        }

        let fullText = response.text || "Report received.";
        
        const suggestionMatch = fullText.match(/\[SUGGESTIONS: (.*?)\]/);
        let parsedSuggestions: string[] = [];
        if (suggestionMatch) {
          parsedSuggestions = suggestionMatch[1].split(',').map(s => s.trim());
          fullText = fullText.replace(suggestionMatch[0], '').trim();
        }

        setHistory(prev => [...prev, { role: 'ai', text: fullText, timestamp }]);
        setSuggestions(parsedSuggestions);

        setAppState(AppState.RESPONDING);
        const audio = await textToSpeech(fullText);
        audio.onended = () => {
          setAppState(AppState.IDLE);
          isProcessingRef.current = false;
          setShowSuggestions(true);
        };
        await audio.play();
      }
    } catch (err) {
      console.error('Bridge processing failure:', err);
      setAppState(AppState.ERROR);
      isProcessingRef.current = false;
      setTimeout(() => setAppState(AppState.IDLE), 3000);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const mediaRecorder = MediaRecorder.isTypeSupported(options.mimeType) 
        ? new MediaRecorder(stream, options)
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        processUserVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setAppState(AppState.LISTENING);
      setIsSessionActive(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      setAppState(AppState.ERROR);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsSessionActive(false);
  };

  const toggleBridge = () => {
    if (isSessionActive) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const clearLogs = () => {
    setHistory([]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const logout = () => {
    setShowDashboard(false);
    setIsSessionActive(false);
    setAppState(AppState.IDLE);
  };

  if (!showDashboard) {
    return <LandingPage onStart={() => setShowDashboard(true)} />;
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#070708] text-white font-display animate-in fade-in duration-700">
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none"></div>
      
      <header className="relative z-40 flex items-center justify-between px-16 py-4 liquid-glass border-b border-white/5 mx-6 mt-4 rounded-3xl">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-xs font-bold tracking-[0.5em] uppercase opacity-80">VoiceOps <span className="text-primary-light">SRE</span></h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`size-1 rounded-full ${isSessionActive ? 'bg-terminal-green animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-white/10'}`}></span>
              <span className="text-[9px] text-white/20 font-bold tracking-widest uppercase">Bridge: {isSessionActive ? 'Capturing' : 'Standby'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/20">Mission_Control_v4.5.2</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center size-10 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-red-500/30 transition-all duration-300 group"
          >
            <span className="material-symbols-outlined text-white/30 group-hover:text-red-400 text-lg">logout</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex px-6 py-6 gap-6 overflow-hidden">
        
        {/* Mission Chronology Sidebar */}
        <aside className="w-80 flex flex-col liquid-glass rounded-[3.5rem] overflow-hidden animate-in slide-in-from-left duration-700">
          <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
             <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/30">Mission_Logs</h2>
             {history.length > 0 && (
               <button onClick={clearLogs} className="text-[8px] uppercase font-bold tracking-widest text-red-400/40 hover:text-red-400 transition-colors">Clear</button>
             )}
          </div>
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10 scroll-smooth">
             {history.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                  <span className="material-symbols-outlined text-4xl mb-6">history</span>
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Locked</p>
               </div>
             ) : (
               history.map((msg, idx) => (
                 <div key={idx} className={`space-y-3 transition-opacity duration-500 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'opacity-30' : 'opacity-100'}`}>
                   <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-white/20">
                      <span>{msg.role}</span>
                      <span>{msg.timestamp}</span>
                   </div>
                   <p className="text-[11px] leading-relaxed font-medium p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                     {msg.text}
                   </p>
                 </div>
               ))
             )}
             <div ref={logsEndRef} />
          </div>
        </aside>

        {/* Tactical HUD */}
        <div className="flex-1 flex flex-col items-center justify-end pb-4 relative">
          <div className="relative mb-20 transition-all duration-1000 scale-[1.1]">
            <Orb state={appState} isRecording={isSessionActive} />
          </div>

          <div className="z-20 flex flex-col items-center gap-10 w-full max-w-lg shrink-0 mb-4">
             <button 
                onClick={toggleBridge}
                disabled={appState === AppState.THINKING || appState === AppState.RESPONDING}
                className={`group relative flex items-center justify-center gap-6 rounded-full h-16 px-16 transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed
                  ${isSessionActive 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 shadow-[0_0_40px_rgba(239,68,68,0.2)] animate-pulse' 
                    : 'bg-white/[0.03] border border-white/10 text-white shadow-[0_0_80px_rgba(127,13,242,0.2)] hover:bg-white/[0.05] hover:border-primary/40'
                  }`}
              >
                <span className="material-symbols-outlined text-2xl">{isSessionActive ? 'stop_circle' : 'keyboard_voice'}</span>
                <span className="text-sm font-bold tracking-[0.5em] uppercase">{isSessionActive ? 'Stop & Process' : 'Initiate Command'}</span>
              </button>

              <div className="flex flex-wrap justify-center gap-3 h-20">
                {showSuggestions && suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => processUserVoice(s)}
                    disabled={appState !== AppState.IDLE}
                    className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-primary-light hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 animate-in fade-in slide-in-from-top-2 shadow-[0_0_15px_rgba(127,13,242,0.05)] hover:shadow-[0_0_20px_rgba(127,13,242,0.2)]"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="text-center h-8">
                {appState === AppState.THINKING && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-cyan-400 animate-pulse">Scanning Telemetry...</p>
                )}
                {appState === AppState.LISTENING && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary-light animate-pulse">Capturing Audio Stream...</p>
                )}
                {appState === AppState.RESPONDING && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-terminal-green animate-pulse">Transmitting Report...</p>
                )}
                {appState === AppState.ERROR && (
                  <p className="text-[10px] font-bold uppercase tracking-[0.8em] text-red-500">Telemetry Link Failure</p>
                )}
              </div>
          </div>
        </div>

        <aside className="w-[500px] flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-700">
          <CommandScreen 
            type={activeScreen} 
            isLoading={isLoadingScreen} 
            systemData={systemData} 
            automatedTask={automatedTask}
          />
        </aside>

      </main>

      <footer className="relative z-40 px-12 py-6 flex items-center justify-between liquid-glass border-t border-white/5 mx-6 mb-4 rounded-3xl">
        <div className="flex gap-16">
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-white/20 mb-1 font-bold">Cloud Endpoint</span>
              <span className="text-xs font-bold text-terminal-green tracking-tighter uppercase flex items-center gap-2">
                 <span className="size-1.5 rounded-full bg-terminal-green animate-pulse"></span>
                 asia-south1: OPERATIONAL
              </span>
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest text-white/20 mb-1 font-bold">Inference Engine</span>
              <span className="text-xs font-bold text-primary-light tracking-tighter uppercase">GEMINI_PRO_GROUNDED</span>
           </div>
        </div>
        <div className="flex items-center gap-6 text-white/10 text-[8px] font-bold tracking-[0.5em] uppercase">
           <span>VoiceOps Hudson v4.5.2</span>
           <span className="material-symbols-outlined text-sm">verified</span>
        </div>
      </footer>
    </div>
  );
};

export default App;