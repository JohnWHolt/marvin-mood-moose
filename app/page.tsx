'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import RealMarvinSVG from '@/components/RealMarvinSVG'
import MoodToggle from '@/components/MoodToggle'
import ChatInterface from '@/components/ChatInterface'
import VoiceController from '@/components/VoiceController'
import EnvironmentSelector from '@/components/EnvironmentSelector'
import { marvinTransitionController } from '@/lib/marvin-transition-controller'

export default function Home() {
  const [mood, setMood] = useState<'neutral' | 'manic' | 'depressive' | 'transition'>('neutral')
  const [selectedEnvironment, setSelectedEnvironment] = useState('default')
  const [textToSpeak, setTextToSpeak] = useState<string | null>(null)
  const [isMarvinSpeaking, setIsMarvinSpeaking] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleMoodChange = useCallback(async (newMood: 'manic' | 'depressive') => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setMood('transition')
    
    // Use transition controller
    await marvinTransitionController.transitionTo(newMood)
    
    setMood(newMood)
    setIsTransitioning(false)
  }, [isTransitioning])

  const handleMarvinSpeak = useCallback((text: string) => {
    setTextToSpeak(text)
  }, [])

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsMarvinSpeaking(speaking)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-5xl font-bold text-gray-800 mb-4"
          animate={{ 
            color: mood === 'manic' ? '#20B2AA' : mood === 'depressive' ? '#D8BFD8' : '#374151'
          }}
          transition={{ duration: 0.5 }}
        >
          🦌 Marvin the Bipolar Mood Moose
        </motion.h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto px-4">
          An emotionally intelligent companion that helps you understand and navigate 
          the beautiful complexity of human emotions through authentic bipolar experiences.
        </p>
        <motion.div
          className="mt-4 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>✨ This is a therapeutic companion, not a replacement for professional mental health care.</p>
        </motion.div>
      </motion.header>

      <div className="marvin-container pb-8">
        {/* Main Marvin Display */}
        <motion.div
          className="mb-8 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="mood-card">
            <RealMarvinSVG
              mood={mood}
              isAnimating={!isTransitioning}
              isTalking={isMarvinSpeaking}
            />
          </div>
        </motion.div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Mood Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MoodToggle
              mood={mood === 'transition' ? 'manic' : mood as 'manic' | 'depressive'}
              onMoodChange={handleMoodChange}
              disabled={isTransitioning}
            />
          </motion.div>

          {/* Environment Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <EnvironmentSelector
              mood={mood}
              selectedEnvironment={selectedEnvironment}
              onEnvironmentChange={setSelectedEnvironment}
            />
          </motion.div>

          {/* Voice Controller */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <VoiceController
              mood={mood === 'transition' ? 'manic' : mood as 'manic' | 'depressive'}
              textToSpeak={textToSpeak}
              onSpeakingChange={handleSpeakingChange}
            />
          </motion.div>
        </div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ChatInterface
            mood={mood === 'transition' ? 'manic' : mood as 'manic' | 'depressive'}
            onMarvinSpeak={handleMarvinSpeak}
            isMarvinSpeaking={isMarvinSpeaking}
          />
        </motion.div>

        {/* Status Display */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="mood-card max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">Current Status</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Mood:</strong> {
                  mood === 'transition' ? '⚡ Transitioning...' :
                  mood === 'manic' ? '🚀 Manic Energy' :
                  mood === 'depressive' ? '🌙 Contemplative Depth' :
                  '🦌 Neutral State'
                }
              </p>
              <p>
                <strong>Environment:</strong> {selectedEnvironment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p>
                <strong>Voice:</strong> {isMarvinSpeaking ? '🔊 Speaking' : '🔇 Quiet'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="text-center py-8 text-gray-500 text-sm border-t border-gray-200 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="marvin-container">
          <p className="mb-2">
            Marvin is designed to normalize emotional fluctuations and provide supportive companionship.
          </p>
          <p>
            If you're experiencing a mental health crisis, please reach out to a qualified professional or crisis helpline.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="text-blue-600 hover:underline">About Marvin</a>
            <a href="#" className="text-blue-600 hover:underline">Mental Health Resources</a>
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
