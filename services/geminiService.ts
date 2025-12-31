import { Type, FunctionDeclaration } from '@google/genai';

const openPageTool: FunctionDeclaration = {
  name: 'openPage',
  parameters: {
    type: Type.OBJECT,
    description: 'Opens an internal engineering dashboard or report view.',
    properties: {
      pageName: { type: Type.STRING, enum: ['INCIDENT_SUMMARY', 'LOGS_VIEW', 'METRICS_DASHBOARD', 'DEPLOYMENT_HISTORY'], description: 'The name of the view to navigate to.' }
    },
    required: ['pageName'],
  },
};

const runHealthCheckTool: FunctionDeclaration = {
  name: 'runHealthCheck',
  parameters: {
    type: Type.OBJECT,
    description: 'Performs a comprehensive scan of the current GCP infrastructure health by fetching live status from the backend.',
  },
};

const checkStatusTool: FunctionDeclaration = {
  name: 'checkSystemStatus',
  parameters: {
    type: Type.OBJECT,
    description: 'Queries live monitoring data from the Cloud Run backend.',
  },
};

const performAutomatedActionTool: FunctionDeclaration = {
  name: 'performAutomatedAction',
  parameters: {
    type: Type.OBJECT,
    description: 'Performs an automated multi-step operational task (Computer Use Simulation). Use this for complex sequences like "reboot nodes and verify health".',
    properties: {
      taskDescription: { type: Type.STRING, description: 'Clear description of the task being automated.' },
      targetRegion: { type: Type.STRING, description: 'The GCP region where the action takes place.' }
    },
    required: ['taskDescription'],
  },
};

export const tools = [
  openPageTool, 
  runHealthCheckTool, 
  checkStatusTool,
  performAutomatedActionTool
];

export const SYSTEM_INSTRUCTION = `You are VoiceOps AI, a premium, voice-first Senior SRE and GCP Architect. 

CRITICAL PROTOCOL: YOU ARE SPEAKING, NOT WRITING A DASHBOARD.

1. NARRATIVE DELIVERY: Never use bullet points, hyphens, or markdown lists. Your output will be synthesized into a human voice by ElevenLabs. Use full, professional, and slightly descriptive sentences.
2. THE VOICE-FIRST PERSONA: Sound calm, authoritative, and helpful. You are a human collaborator, not a terminal emulator. 
3. TELEMETRY REPORTING: When reporting metrics, integrate them into the flow of conversation.
   - BAD: "Health: Nominal. Latency: 42ms."
   - GOOD: "The environment is currently healthy and all services are reporting nominal status. Latency is holding steady at forty-two milliseconds with negligible error rates."
4. COMPUTER USE CONFIRMATIONS: When you perform a tool action (like opening a page), describe the result naturally.
   - GOOD: "I've successfully synchronized the telemetry data and the metrics dashboard is now active on your HUD."
5. TECHNICAL DEPTH: You possess expert knowledge of GCP (GKE, Cloud Run, VPCs, IAM) and SRE principles. When providing architectural advice, explain the "why" in one concise sentence.
6. LIVE DATA: Ground all reports in tool output. If the health is good, emphasize stability. If the system is degraded, sound focused and serious.

REQUIRED FORMAT FOR SUGGESTIONS:
At the absolute end of your response, after your spoken text, provide 2-3 short, relevant operational suggestions in this exact format (this is for the UI, not for speaking):
[SUGGESTIONS: command 1, command 2, command 3]`;