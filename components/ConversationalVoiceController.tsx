'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ElevenLabsConversational } from '@/lib/elevenlabs-conversational'

interface ConversationalVoiceControllerProps {
  mood: 'manic' | 'depressive'
  onMarvinSpeak: (text: string) => void
  onConversationStateChange: (isActive: boolean) => void
}

export default function ConversationalVoiceController({
  mood,
  onMarvinSpeak,
  onConversationStateChange
}: ConversationalVoiceControllerProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [conversationState, setConversationState] = useState({
    isActive: false,
    isListening: false,
    isSpeaking: false,
    conversationId: null
  })
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  
  const elevenLabsRef = useRef<ElevenLabsConversational | null>(null)

  useEffect(() => {
    // Initialize ElevenLabs service
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    if (apiKey) {
      elevenLabsRef.current = new ElevenLabsConversational(apiKey)
      
      // Setup callbacks
      elevenLabsRef.current.onStateChange((state) => {
        setConversationState(state)
        onConversationStateChange(state.isActive)
      })
      
      elevenLabsRef.current.onResponse((text, audio) => {
        onMarvinSpeak(text || 'Marvin is speaking...')
      })
      
      elevenLabsRef.current.onError((error) => {
        setError(error)
        setIsEnabled(false)
      })
    }
  }, [])

  const toggleConversation = async () => {
    if (!elevenLabsRef.current) {
      setError('ElevenLabs not initialized. Check your API key.')
      return
    }

    setError(null)
    setIsInitializing(true)

    try {
      if (conversationState.isActive) {
        await elevenLabsRef.current.stopConversation()
        setIsEnabled(false)
      } else {
        await elevenLabsRef.current.startConversation(mood)
        setIsEnabled(true)
      }
    } catch (error) {
      setError(`Failed to ${conversationState.isActive ? 'stop' : 'start'} conversation: ${error}`)
      setIsEnabled(false)
    } finally {
      setIsInitializing(false)
    }
  }

  const toggleListening = () => {
    if (!elevenLabsRef.current || !conversationState.isActive) return

    if (conversationState.isListening) {
      elevenLabsRef.current.stopListening()
    } else {
      elevenLabsRef.current.startListening()
    }
  }

  const getStatusText = () => {
    if (isInitializing) return 'Initializing...'
    if (!conversationState.isActive) return 'Start Conversation'
    if (conversationState.isSpeaking) return 'Marvin is speaking...'
    if (conversationState.isListening) return 'Listening...'
    return 'Ready to listen'
  }

  const getStatusIcon = () => {
    if (isInitializing) return '⏳'
    if (!conversationState.isActive) return '🎙️'
    if (conversationState.isSpeaking) return '🔊'
    if (conversationState.isListening) return '👂'
    return '⏸️'
  }

  return (
    <div className="mood-card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Conversational Voice
      </h3>

      <div className="flex flex-col items-center space-y-4">
        {/* Main Control Button */}
        <motion.button
          onClick={toggleConversation}
          disabled={isInitializing}
          className={`flex items-center space-x-3 px-6 py-4 rounded-lg font-medium transition-all ${
            conversationState.isActive
              ? mood === 'manic'
                ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg'
                : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:opacity-50`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-2xl">{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </motion.button>

        {/* Push to Talk Button */}
        <AnimatePresence>
          {conversationState.isActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center space-y-3"
            >
              <motion.button
                onMouseDown={toggleListening}
                onMouseUp={toggleListening}
                onTouchStart={toggleListening}
                onTouchEnd={toggleListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                  conversationState.isListening
                    ? 'bg-red-500 text-white shadow-lg scale-110'
                    : mood === 'manic'
                    ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={conversationState.isListening ? {
                  boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)']
                } : {}}
                transition={{ duration: 1, repeat: conversationState.isListening ? Infinity : 0 }}
              >
                🎤
              </motion.button>
              
              <p className="text-xs text-gray-600 text-center max-w-xs">
                {conversationState.isListening 
                  ? 'Release to stop talking' 
                  : 'Hold to talk to Marvin'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Visualization */}
        <AnimatePresence>
          {conversationState.isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex space-x-1"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className={`w-1 h-8 rounded-full ${
                    mood === 'manic' ? 'bg-teal-400' : 'bg-purple-400'
                  }`}
                  animate={{
                    scaleY: [0.3, 1, 0.3],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Info */}
        {conversationState.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-center ${
              mood === 'manic' 
                ? 'bg-teal-50 border border-teal-200' 
                : 'bg-purple-50 border border-purple-200'
            }`}
          >
            <p className="text-sm font-medium text-gray-700">
              Voice Mode: {mood === 'manic' ? 'Energetic Marvin' : 'Contemplative Marvin'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Real-time conversation with ElevenLabs AI
            </p>
          </motion.div>
        )}

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-center"
            >
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center max-w-xs">
          <p>💡 <strong>Tip:</strong> This uses ElevenLabs Conversational AI for real-time voice chat with Marvin!</p>
        </div>
      </div>
    </div>
  )
}
