'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface VoiceControllerProps {
  mood: 'manic' | 'depressive'
  textToSpeak: string | null
  onSpeakingChange: (isSpeaking: boolean) => void
}

export default function VoiceController({ mood, textToSpeak, onSpeakingChange }: VoiceControllerProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
    }

    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [])

  useEffect(() => {
    if (textToSpeak && isEnabled) {
      speakText(textToSpeak)
    }
  }, [textToSpeak, isEnabled, mood])

  const speakText = (text: string) => {
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    const voiceSettings = {
      manic: {
        rate: 1.4,
        pitch: 1.2,
        volume: 0.9
      },
      depressive: {
        rate: 0.7,
        pitch: 0.8,
        volume: 0.8
      }
    }

    const settings = voiceSettings[mood]
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch
    utterance.volume = settings.volume

    // Try to find a suitable voice
    const preferredVoices = mood === 'manic' 
      ? ['Google US English', 'Microsoft David', 'Alex', 'Daniel']
      : ['Google UK English Female', 'Microsoft Zira', 'Samantha', 'Victoria']

    for (const preferredVoice of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preferredVoice))
      if (voice) {
        utterance.voice = voice
        break
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
      onSpeakingChange(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      onSpeakingChange(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      onSpeakingChange(false)
    }

    speechSynthesis.speak(utterance)
  }

  const toggleVoice = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      onSpeakingChange(false)
    }
    setIsEnabled(!isEnabled)
  }

  return (
    <div className="mood-card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Voice Settings
      </h3>

      <div className="flex flex-col items-center space-y-4">
        <motion.button
          onClick={toggleVoice}
          className={`flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all ${
            isEnabled
              ? mood === 'manic'
                ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg'
                : 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-xl">
            {isSpeaking ? '🔊' : isEnabled ? '🔈' : '🔇'}
          </span>
          <span>
            {isSpeaking ? 'Speaking...' : isEnabled ? 'Voice Enabled' : 'Voice Disabled'}
          </span>
        </motion.button>

        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <div className={`p-3 rounded-lg ${
              mood === 'manic' ? 'bg-teal-50 border border-teal-200' : 'bg-purple-50 border border-purple-200'
            }`}>
              <p className="text-sm font-medium text-gray-700">
                Current Voice Mode: {mood === 'manic' ? 'Energetic & Fast' : 'Calm & Gentle'}
              </p>
              <div className="flex items-center justify-center mt-2 space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    mood === 'manic' ? 'bg-teal-400' : 'bg-purple-400'
                  }`}></div>
                  <span>Rate: {mood === 'manic' ? '1.4x' : '0.7x'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    mood === 'manic' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                  <span>Pitch: {mood === 'manic' ? 'High' : 'Low'}</span>
                </div>
              </div>
            </div>

            {isSpeaking && (
              <motion.div
                className="flex justify-center space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => (
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
          </motion.div>
        )}

        <div className="text-xs text-gray-500 text-center max-w-xs">
          <p>💡 <strong>Tip:</strong> Marvin's voice changes with his mood - energetic when manic, gentle when depressive.</p>
        </div>
      </div>
    </div>
  )
}
