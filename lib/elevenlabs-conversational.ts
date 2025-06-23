interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  model: string
  conversationId?: string
}

interface ConversationState {
  isActive: boolean
  isListening: boolean
  isSpeaking: boolean
  conversationId: string | null
}

export class ElevenLabsConversational {
  private config: ElevenLabsConfig
  private websocket: WebSocket | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private state: ConversationState = {
    isActive: false,
    isListening: false,
    isSpeaking: false,
    conversationId: null
  }
  private callbacks: {
    onResponse?: (text: string, audio: ArrayBuffer) => void
    onStateChange?: (state: ConversationState) => void
    onError?: (error: string) => void
  } = {}

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      voiceId: '', // Will be set based on mood
      model: 'eleven_turbo_v2_5'
    }
  }

  async startConversation(mood: 'manic' | 'depressive'): Promise<void> {
    try {
      // Set voice based on mood
      this.config.voiceId = this.getVoiceForMood(mood)
      
      // Initialize audio context
      this.audioContext = new AudioContext()
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      })
      
      // Setup WebSocket connection
      await this.setupWebSocket(mood)
      
      // Setup media recorder
      this.setupMediaRecorder(stream)
      
      this.state.isActive = true
      this.state.conversationId = this.generateConversationId()
      this.notifyStateChange()
      
    } catch (error) {
      this.handleError(`Failed to start conversation: ${error}`)
    }
  }

  async stopConversation(): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    
    if (this.websocket) {
      this.websocket.close()
    }
    
    if (this.audioContext) {
      await this.audioContext.close()
    }
    
    this.state.isActive = false
    this.state.isListening = false
    this.state.isSpeaking = false
    this.notifyStateChange()
  }

  private async setupWebSocket(mood: 'manic' | 'depressive'): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${this.getAgentId(mood)}`
      
      this.websocket = new WebSocket(wsUrl, [], {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      })

      this.websocket.onopen = () => {
        console.log('ElevenLabs WebSocket connected')
        resolve()
      }

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event)
      }

      this.websocket.onerror = (error) => {
        reject(error)
      }

      this.websocket.onclose = () => {
        console.log('ElevenLabs WebSocket disconnected')
      }
    })
  }

  private setupMediaRecorder(stream: MediaStream): void {
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    })

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.websocket?.readyState === WebSocket.OPEN) {
        // Send audio data to ElevenLabs
        this.websocket.send(event.data)
      }
    }

    this.mediaRecorder.onstart = () => {
      this.state.isListening = true
      this.notifyStateChange()
    }

    this.mediaRecorder.onstop = () => {
      this.state.isListening = false
      this.notifyStateChange()
    }
  }

  private handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'conversation_initiation_metadata':
          console.log('Conversation initiated:', data)
          break
          
        case 'audio':
          this.playAudioResponse(data.audio_event.audio_base_64)
          break
          
        case 'interruption':
          this.handleInterruption()
          break
          
        case 'ping':
          this.websocket?.send(JSON.stringify({ type: 'pong' }))
          break
          
        default:
          console.log('Unknown message type:', data.type)
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error)
    }
  }

  private async playAudioResponse(audioBase64: string): Promise<void> {
    try {
      this.state.isSpeaking = true
      this.notifyStateChange()
      
      const audioData = atob(audioBase64)
      const audioBuffer = new ArrayBuffer(audioData.length)
      const view = new Uint8Array(audioBuffer)
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i)
      }
      
      const decodedAudio = await this.audioContext!.decodeAudioData(audioBuffer)
      const source = this.audioContext!.createBufferSource()
      source.buffer = decodedAudio
      source.connect(this.audioContext!.destination)
      
      source.onended = () => {
        this.state.isSpeaking = false
        this.notifyStateChange()
      }
      
      source.start()
      
      // Notify callback with response
      if (this.callbacks.onResponse) {
        this.callbacks.onResponse('', audioBuffer)
      }
      
    } catch (error) {
      this.handleError(`Audio playback error: ${error}`)
      this.state.isSpeaking = false
      this.notifyStateChange()
    }
  }

  private handleInterruption(): void {
    // Stop current audio playback
    if (this.audioContext) {
      this.audioContext.suspend()
      setTimeout(() => {
        this.audioContext?.resume()
      }, 100)
    }
  }

  startListening(): void {
    if (this.mediaRecorder && this.state.isActive) {
      this.mediaRecorder.start(100) // Send chunks every 100ms
    }
  }

  stopListening(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop()
    }
  }

  private getVoiceForMood(mood: 'manic' | 'depressive'): string {
    // You'll need to get these voice IDs from ElevenLabs dashboard
    const voices = {
      manic: 'pNInz6obpgDQGcFmaJgB', // Adam - energetic voice
      depressive: 'EXAVITQu4vr4xnSDxMaL' // Sarah - gentle voice
    }
    return voices[mood]
  }

  private getAgentId(mood: 'manic' | 'depressive'): string {
    // You'll create these agents in ElevenLabs dashboard
    const agents = {
      manic: 'your_manic_agent_id',
      depressive: 'your_depressive_agent_id'
    }
    return agents[mood]
  }

  private generateConversationId(): string {
    return `marvin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private notifyStateChange(): void {
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange({ ...this.state })
    }
  }

  private handleError(error: string): void {
    console.error('ElevenLabs error:', error)
    if (this.callbacks.onError) {
      this.callbacks.onError(error)
    }
  }

  // Public methods for setting callbacks
  onResponse(callback: (text: string, audio: ArrayBuffer) => void): void {
    this.callbacks.onResponse = callback
  }

  onStateChange(callback: (state: ConversationState) => void): void {
    this.callbacks.onStateChange = callback
  }

  onError(callback: (error: string) => void): void {
    this.callbacks.onError = callback
  }

  getState(): ConversationState {
    return { ...this.state }
  }
}
