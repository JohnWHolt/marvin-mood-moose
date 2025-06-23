'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  sender: 'user' | 'marvin'
  timestamp: Date
  mood?: 'manic' | 'depressive'
}

interface ChatInterfaceProps {
  mood: 'manic' | 'depressive'
  onMarvinSpeak: (text: string) => void
  isMarvinSpeaking: boolean
}

export default function ChatInterface({ mood, onMarvinSpeak, isMarvinSpeaking }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: mood === 'manic' 
        ? "Hey there, beautiful human! I'm Marvin, and I'm feeling ELECTRIC today! ⚡ My antlers are practically sparking with possibility! What's buzzing in your magnificent world?"
        : "Hello... I'm Marvin. I'm here, sitting quietly in the gentle spaces between thoughts. What's resting on your heart today?",
      sender: 'marvin',
      timestamp: new Date(),
      mood: mood
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Update greeting when mood changes
    const greeting = {
      id: Date.now().toString(),
      text: mood === 'manic' 
        ? "WHOA! I just shifted into manic mode! ⚡ Everything feels electric and possible! My thoughts are racing like shooting stars! What adventure should we embark on together?!"
        : "*settles into a quieter space* I've moved into my depressive state... the world feels deeper now, more contemplative. I'm here to listen and sit with whatever you're feeling.",
      sender: 'marvin' as const,
      timestamp: new Date(),
      mood: mood
    }
    
    if (messages.length > 1) {
      setMessages(prev => [...prev, greeting])
      onMarvinSpeak(greeting.text)
    }
  }, [mood])

  const generateMarvinResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          mood,
          conversationHistory: messages.slice(-6).map(m => 
            `${m.sender === 'user' ? 'Human' : 'Marvin'}: ${m.text}`
          )
        })
      })

      if (!response.ok) throw new Error('API request failed')
      
      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error generating response:', error)
      return getFallbackResponse(userMessage, mood)
    }
  }

  const getFallbackResponse = (userMessage: string, mood: 'manic' | 'depressive'): string => {
    const message = userMessage.toLowerCase()
    
    if (mood === 'manic') {
      if (message.includes('sad') || message.includes('down')) {
        return "OH! But sadness is just happiness doing a cosmic backflip! 🤸‍♂️ Your feelings are like colors in the universe's paintbrush - even the blues create the most stunning masterpieces! What if we turned that energy into rocket fuel for something AMAZING?!"
      }
      if (message.includes('tired') || message.includes('exhausted')) {
        return "Tired? TIRED?! You're not tired, you're just a smartphone that needs plugging into the cosmic charging station! ⚡ Let's find your power source - what makes your soul do the electric slide?!"
      }
      return "YES! I can feel the lightning in your words! ⚡ You're like a supernova wrapped in human skin! Tell me more - my antlers are practically vibrating with curiosity! 🦌✨"
    } else {
      if (message.includes('happy') || message.includes('good')) {
        return "Mmm... I hear that gentle lightness in your voice. Happiness is like morning dew on autumn leaves - delicate, precious, worth savoring slowly. Tell me about this good feeling... what does it taste like in your soul?"
      }
      if (message.includes('anxious') || message.includes('worried')) {
        return "Anxiety... yes, I know that weight. It sits in our chest like a stone made of tomorrow's fears. But here you are, still breathing, still reaching out. That's not small - that's quietly heroic."
      }
      return "I feel the weight of your words settling into the quiet corners of my heart. There's something profound here, something worth sitting with in the gentle silence. Tell me more... I'm listening with my whole moose soul."
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const response = await generateMarvinResponse(inputText)
      
      const marvinMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'marvin',
        timestamp: new Date(),
        mood: mood
      }

      setMessages(prev => [...prev, marvinMessage])
      onMarvinSpeak(response)
    } catch (error) {
      console.error('Error generating response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="mood-card h-96 flex flex-col">
      {/* Chat Header */}
      <div className={`p-4 rounded-t-lg ${
        mood === 'manic' 
          ? 'bg-gradient-to-r from-teal-400 to-cyan-400' 
          : 'bg-gradient-to-r from-purple-300 to-pink-300'
      }`}>
        <h3 className="text-white font-semibold flex items-center">
          <span className="mr-2">🦌</span>
          Chat with {mood === 'manic' ? 'Manic' : 'Depressive'} Marvin
          {isMarvinSpeaking && (
            <motion.span
              className="ml-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              🔊
            </motion.span>
          )}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.mood === 'manic'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`px-4 py-3 rounded-lg ${
              mood === 'manic' 
                ? 'bg-teal-100 border border-teal-200' 
                : 'bg-purple-100 border border-purple-200'
            }`}>
              <motion.div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      mood === 'manic' ? 'bg-teal-500' : 'bg-purple-500'
                    }`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mood === 'manic' 
                ? "Share your wildest thoughts! 🚀" 
                : "What's resting on your mind? 🌙"
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              mood === 'manic'
                ? 'bg-teal-500 hover:bg-teal-600'
                : 'bg-purple-500 hover:bg-purple-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            whileTap={{ scale: 0.95 }}
          >
            Send
          </motion.button>
        </div>
      </div>
    </div>
  )
}
