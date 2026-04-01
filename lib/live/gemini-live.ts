/**
 * gemini-live.ts
 * Real-time multimodal (voice/chat) interaction using Gemini Live API.
 */

export class GeminiLiveService {
  private socket: WebSocket | null = null;
  private onMessage: (msg: any) => void;

  constructor(onMessage: (msg: any) => void) {
    this.onMessage = onMessage;
  }

  async connect(roomId: string) {
    console.log(`Connecting to Gemini Live for room: ${roomId}`);
    
    // In production, this would use a secure WebSocket connection to 
    // the Gemini Live endpoint or a proxy server handling auth.
    // e.g., wss://api.gemini.google.com/v1beta/live?room=${roomId}
    
    this.socket = new WebSocket(`wss://api.example.com/live/${roomId}`);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onMessage(data);
    };

    this.socket.onopen = () => {
      console.log('Gemini Live Connected.');
      // Initial handshake with voice/modality config
      this.send({ type: 'setup', config: { model: 'gemini-2.0-flash-exp-multimodal' } });
    };

    this.socket.onerror = (err) => console.error('Gemini Live WS Error:', err);
  }

  send(payload: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
    }
  }

  disconnect() {
    this.socket?.close();
  }
}
