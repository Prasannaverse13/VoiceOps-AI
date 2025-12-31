import React from 'react';
import { SystemStatus } from '../types';

export type ScreenType = 'IDLE' | 'METRICS_DASHBOARD' | 'LOGS_VIEW' | 'INCIDENT_SUMMARY' | 'DEPLOYMENT_HISTORY' | 'AUTOMATED_ACTION';

interface CommandScreenProps {
  type: ScreenType;
  isLoading?: boolean;
  systemData?: SystemStatus | null;
  automatedTask?: string | null;
}

const CommandScreen: React.FC<CommandScreenProps> = ({ type, isLoading, systemData, automatedTask }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
          <div className="size-16 relative">
            <div className="absolute inset-0 rounded-full border-[2px] border-primary/10 border-t-primary animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-[1px] border-cyan-400/20 border-b-cyan-400 animate-[spin_1.5s_linear_infinite_reverse]"></div>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-white/20 mb-2">Syncing_Telemetry</p>
            <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
               <div className="h-full bg-primary animate-[scan_2s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      );
    }

    switch (type) {
      case 'AUTOMATED_ACTION':
        return (
          <div className="h-full flex flex-col animate-in slide-in-from-bottom duration-700 space-y-8">
            <div className="flex items-center gap-4 p-6 bg-white/[0.02] border border-white/10 rounded-[2rem]">
               <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-light animate-pulse">robot_2</span>
               </div>
               <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Grounded_Executor_v1</h3>
                  <p className="text-xs font-mono text-cyan-400 truncate max-w-[300px]">{automatedTask || "Operational Task Execution..."}</p>
               </div>
            </div>

            <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col p-4 shadow-2xl relative">
              {/* Terminal Overlay Grid */}
              <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>

              {/* Simulated Browser Bar */}
              <div className="h-10 bg-white/[0.03] rounded-2xl mb-4 flex items-center px-4 gap-4 z-10">
                <div className="flex gap-1.5">
                  <div className="size-1.5 rounded-full bg-red-500/60"></div>
                  <div className="size-1.5 rounded-full bg-yellow-500/60"></div>
                  <div className="size-1.5 rounded-full bg-green-500/60"></div>
                </div>
                <div className="flex-1 h-6 bg-black/50 rounded-lg flex items-center px-3 border border-white/5">
                  <span className="text-[8px] font-mono text-white/40 truncate">https://console.cloud.google.com/run/services/details/asia-south1/...</span>
                </div>
                <span className="material-symbols-outlined text-[10px] text-white/20">shield_lock</span>
              </div>

              {/* Action Progress Visualizer */}
              <div className="flex-1 relative overflow-hidden bg-white/[0.01] rounded-xl border border-white/[0.02] z-10 flex flex-col">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(127,13,242,0.2),transparent)] animate-pulse"></div>
                
                {/* Visual "Terminal" Output */}
                <div className="flex-1 p-6 space-y-3 font-mono text-[10px] overflow-hidden">
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300">
                    <span className="text-terminal-green/60">09:12:44</span>
                    <span className="text-terminal-green font-bold">READY</span>
                    <span className="text-white/40">Initializing Cloud Shell secure proxy...</span>
                  </div>
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: '400ms' }}>
                    <span className="text-terminal-green/60">09:12:45</span>
                    <span className="text-terminal-green font-bold">INFO</span>
                    <span className="text-white/40">Fetching service manifest for 'api-v4'</span>
                  </div>
                  <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: '800ms' }}>
                    <span className="text-cyan-400/60">09:12:46</span>
                    <span className="text-cyan-400 font-bold animate-pulse">BUSY</span>
                    <span className="text-white/60">Applying non-destructive operational overrides...</span>
                  </div>
                  
                  {/* Floating Cursor/Action Dot */}
                  <div className="absolute bottom-12 right-12 size-3 bg-primary-light rounded-full blur-[2px] animate-pulse"></div>
                  <div className="absolute bottom-12 right-12 size-3 border border-primary-light rounded-full animate-ping"></div>
                </div>

                {/* Simulated Interaction Layer (Keyboard/Mouse visual) */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        <div className="w-4 h-1 bg-primary/40 rounded-full animate-pulse"></div>
                        <div className="w-8 h-1 bg-primary/20 rounded-full"></div>
                      </div>
                      <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Synthetic Input Active</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-light w-3/4 animate-[scan_3s_ease-in-out_infinite]"></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'METRICS_DASHBOARD':
        return (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white/40 font-bold tracking-[0.4em] text-[10px] uppercase">Telemetry_Dashboard</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-terminal-green/5 rounded-full border border-terminal-green/10">
                 <span className="size-1 bg-terminal-green rounded-full"></span>
                 <span className="text-[9px] font-bold text-terminal-green tracking-widest uppercase">Live_Node: Asia-South1</span>
              </div>
            </div>
            
            {systemData ? (
              <div className="grid grid-cols-1 gap-6">
                <div className="flex justify-between items-center p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.02] transition-colors relative group overflow-hidden">
                  <div className="absolute inset-0 bg-terminal-green/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest">Health_State</span>
                    <p className={`text-4xl font-light tracking-tighter uppercase ${systemData.health.toLowerCase().includes('green') || systemData.health.toLowerCase().includes('nominal') ? 'text-terminal-green' : 'text-red-400'}`}>
                      {systemData.health}
                    </p>
                  </div>
                  <span className={`material-symbols-outlined text-4xl relative z-10 ${systemData.incident_active ? 'text-red-400/40 animate-pulse' : 'text-terminal-green/40'}`}>
                    {systemData.incident_active ? 'warning' : 'cloud_done'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block mb-2">Latency</span>
                    <p className="text-3xl font-light tracking-tighter text-cyan-400">{systemData.latency_ms}<span className="text-xs ml-1 opacity-50">ms</span></p>
                  </div>
                  <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                    <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block mb-2">Error_Rate</span>
                    <p className={`text-3xl font-light tracking-tighter ${systemData.error_rate > 1 ? 'text-red-400' : 'text-terminal-green'}`}>
                      {systemData.error_rate}<span className="text-xs ml-1 opacity-50">%</span>
                    </p>
                  </div>
                </div>
                <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] flex justify-between items-center">
                   <div>
                     <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block mb-1">Active_Alert</span>
                     <p className={`text-xl font-bold tracking-widest uppercase ${systemData.incident_active ? 'text-red-400' : 'text-white/20'}`}>
                       {systemData.incident_active ? 'Positive' : 'None'}
                     </p>
                   </div>
                   <div className="text-right">
                     <span className="text-[9px] text-white/20 uppercase font-bold tracking-widest block mb-1">Sync_Buffer</span>
                     <p className="text-[10px] font-mono opacity-30">{new Date(systemData.updated_at).toLocaleTimeString()}</p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center opacity-10 space-y-4">
                 <span className="material-symbols-outlined text-5xl">terminal</span>
                 <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Grounded Data</p>
              </div>
            )}
          </div>
        );
      case 'INCIDENT_SUMMARY':
        return (
          <div className="h-full flex flex-col animate-in fade-in duration-500">
             <div className={`p-10 border rounded-[3.5rem] mb-10 transition-colors ${systemData?.incident_active ? 'bg-red-500/[0.03] border-red-500/10' : 'bg-white/[0.01] border-white/5'}`}>
                <h3 className={`font-bold tracking-[0.4em] uppercase text-[10px] mb-4 ${systemData?.incident_active ? 'text-red-400' : 'text-white/10'}`}>
                  {systemData?.incident_active ? 'Operational_Anomaly_Logged' : 'Operational_Status_Clear'}
                </h3>
                <p className="text-lg font-light leading-relaxed text-white/70">
                  {systemData?.incident_active 
                    ? 'Current telemetry indicates an active operational disruption. Recommend immediate inspection of deployment logs.' 
                    : 'System state is within nominal parameters. No active anomalies or incidents reported in the last synchronization window.'}
                </p>
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                 <span className="block text-[9px] uppercase text-white/20 font-bold mb-2 tracking-widest">Alert_Level</span>
                 <p className={`text-2xl font-light tracking-tighter ${systemData?.incident_active ? 'text-red-400' : 'text-white/10'}`}>
                   {systemData?.incident_active ? 'Critical' : 'P0_None'}
                 </p>
               </div>
               <div className="p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem]">
                 <span className="block text-[9px] uppercase text-white/20 font-bold mb-2 tracking-widest">Provider</span>
                 <p className="text-2xl font-light tracking-tighter text-primary-light">GCP_SRE</p>
               </div>
             </div>
          </div>
        );
      case 'LOGS_VIEW':
        return (
          <div className="h-full flex flex-col font-mono text-[11px] animate-in fade-in duration-500">
             <h3 className="text-white/20 font-bold uppercase tracking-[0.5em] mb-12 text-[9px]">Ingested_Cloud_Logs</h3>
            <div className="flex-1 space-y-4 overflow-hidden font-mono opacity-40">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex gap-6 animate-in slide-in-from-left" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="text-white/20 shrink-0 uppercase font-bold text-[8px] tracking-widest">{new Date().toLocaleTimeString()}</span>
                  <p className="truncate tracking-tight leading-none text-white/60">
                    {i % 4 === 0 ? '[WARN] health_probe_failed cluster-01' : '[INFO] request_trace_id: ' + Math.random().toString(36).substring(7)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center opacity-5 text-center space-y-12 grayscale">
            <span className="material-symbols-outlined text-[120px]">cloud_queue</span>
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-[0.8em]">Link_Standby</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary-light">Awaiting Telemetry Request</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="liquid-glass h-full rounded-[4rem] flex flex-col overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.6)]">
      {/* HUD Frame Header */}
      <div className="h-16 bg-white/[0.01] border-b border-white/5 flex items-center px-10 gap-6 shrink-0 z-20">
        <div className="flex gap-2.5">
          <div className="size-2 rounded-full bg-white/5"></div>
          <div className="size-2 rounded-full bg-white/5"></div>
          <div className="size-2 rounded-full bg-white/5"></div>
        </div>
        <div className="flex-1 h-8 bg-black/40 rounded-full border border-white/5 flex items-center px-6">
           <span className="text-[9px] text-white/20 font-mono truncate uppercase tracking-[0.5em] font-bold">Secure_Data_Tunnel_HUD</span>
        </div>
        <div className="flex gap-2">
           <span className="material-symbols-outlined text-white/10 text-xs animate-pulse">sensors</span>
        </div>
      </div>

      {/* Primary Viewport */}
      <div className="flex-1 p-14 relative overflow-hidden z-10">
        {renderContent()}
      </div>
      
      {/* System Metadata Footer */}
      <div className="h-14 bg-white/[0.01] border-t border-white/5 flex items-center px-10 justify-between text-[8px] font-bold uppercase tracking-[0.5em] text-white/10 shrink-0 z-20">
         <div className="flex items-center gap-4">
            <span>Region: asia-south1</span>
            <span className="size-1 rounded-full bg-white/5"></span>
            <span>Prot: GRPC_SECURE</span>
         </div>
         <span className="flex items-center gap-2 text-terminal-green/30">
            <span className="size-1 rounded-full bg-terminal-green animate-pulse"></span>
            BRIDGE_ESTABLISHED
         </span>
      </div>
    </div>
  );
};

export default CommandScreen;