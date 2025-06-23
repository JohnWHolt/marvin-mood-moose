'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@auth0/nextjs-auth0/client'
import RealMarvinSVG from '@/components/RealMarvinSVG'
import MoodToggle from '@/components/MoodToggle'
import ChatInterface from '@/components/ChatInterface'
import ConversationalVoiceController from '@/components/ConversationalVoiceController'
import EnvironmentSelector from '@/components/EnvironmentSelector'
import AuthButton from '@/components/AuthButton'
import { marvinTransitionController } from '@/lib/marvin-transition-controller'

export default function Home() {
  const { user } = useUser()
  const [mood, setMood] = useState<'neutral' | 'manic' | 'depressive' | 'transition'>('neutral')
  const [selectedEnvironment, setSelectedEnvironment] = useState('default')
  const [textToSpeak, setTextToSpeak] = useState<string | null>(null)
  const [isMarvinSpeaking, setIsMarvinSpeaking] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isVoiceConversationActive, setIsVoiceConversationActive] = useState(false)

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

  const handleConversationStateChange = useCallback((isActive: boolean) => {
    setIsVoiceConversationActive(isActive)
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
        {/* Auth Section */}
        <div className="absolute top-4 right-4">
          <AuthButton />
        </div>

        <motion.h1 
          className="text-5xl font-bold text-gray-800 mb-4"
          animate={{ 
            color: mood === 'manic' ? '#20B2AA' : mood === 'depressive' ? '#D8BFD8' : '#374151'
          }}
          transition={{ duration: 0.5 }}
        >
          🦌 Marvin
        </motion.h1>
        <motion.p 
          className="text-2xl text-gray-600 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The Bipolar Mood Moose
        </motion.p>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto px-4">
          An emotionally intelligent AI companion that helps you understand and navigate 
          the beautiful complexity of human emotions through authentic bipolar experiences.
        </p>
        <motion.div
          className="mt-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>✨ Powered by <span className="text-blue-500 font-medium">Infinite Synergy AI</span></p>
          <p className="text-xs mt-1">This is a therapeutic companion, not a replacement for professional mental health care.</p>
        </motion.div>
      </motion.header>

      <div className="marvin-container pb-8">
        {/* Welcome Message for Authenticated Users */}
        {user && (
          <motion.div
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-blue-800">
              Welcome back, {user.name?.split(' ')[0]}! Marvin remembers your previous conversations and mood preferences.
            </p>
          </motion.div>
        )}

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
              isTalking={isMarvinSpeaking || isVoiceConversationActive}
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

          {/* Conversational Voice Controller */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ConversationalVoiceController
              mood={mood === 'transition' ? 'manic' : mood as 'manic' | 'depressive'}
              onMarvinSpeak={handleMarvinSpeak}
              onConversationStateChange={handleConversationStateChange}
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
            userId={user?.sub} // Pass user ID for personalization
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
                <strong>User:</strong> {user ? `${user.name?.split(' ')[0]} (Signed In)` : 'Anonymous Guest'}
              </p>
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
                <strong>Interaction:</strong> {
                  isVoiceConversationActive ? '🎙️ Voice Chat Active' :
                  isMarvinSpeaking ? '🔊 Speaking' : 
                  '💬 Text Chat'
                }
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
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🦌 Marvin</h3>
            <p className="text-gray-600 mb-2">
              Designed to normalize emotional fluctuations and provide supportive companionship.
            </p>
            <p className="text-red-600 font-medium">
              If you're experiencing a mental health crisis, please reach out to a qualified professional or crisis helpline.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Resources</h4>
              <div className="space-y-1">
                <a href="https://infinitesynergy.ai/mental-health-resources" className="block text-blue-600 hover:underline">Mental Health Resources</a>
                <a href="https://988lifeline.org" className="block text-blue-600 hover:underline">Crisis Lifeline (988)</a>
                <a href="https://www.nami.org" className="block text-blue-600 hover:underline">NAMI Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">About</h4>
              <div className="space-y-1">
                <a href="https://infinitesynergy.ai/about" className="block text-blue-600 hover:underline">About Infinite Synergy AI</a>
                <a href="https://infinitesynergy.ai/marvin" className="block text-blue-600 hover:underline">How Marvin Works</a>
                <a href="https://infinitesynergy.ai/research" className="block text-blue-600 hover:underline">Research & Ethics</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Legal</h4>
              <div className="space-y-1">
                <a href="https://infinitesynergy.ai/privacy" className="block text-blue-600 hover:underline">Privacy Policy</a>
                <a href="https://infinitesynergy.ai/terms" className="block text-blue-600 hover:underline">Terms of Service</a>
                <a href="https://infinitesynergy.ai/contact" className="block text-blue-600 hover:underline">Contact Us</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-400">
              © 2024 <a href="https://infinitesynergy.ai" className="text-blue-500 hover:underline">Infinite Synergy AI</a>. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Marvin is an experimental AI companion designed for emotional exploration and support.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

