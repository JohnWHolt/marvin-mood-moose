'use client'

import { motion } from 'framer-motion'

interface EnvironmentSelectorProps {
  mood: 'neutral' | 'manic' | 'depressive' | 'transition'
  selectedEnvironment: string
  onEnvironmentChange: (environment: string) => void
}

const environments = {
  neutral: [
    { id: 'default', name: 'Peaceful Space', emoji: '☁️', description: 'Calm, neutral environment' },
    { id: 'meadow', name: 'Gentle Meadow', emoji: '🌾', description: 'Soft grass swaying in breeze' }
  ],
  manic: [
    { id: 'electric-storm', name: 'Electric Studio', emoji: '⚡', description: 'High-energy creative space' },
    { id: 'cosmic-disco', name: 'Cosmic Dance Floor', emoji: '🪐', description: 'Galactic party atmosphere' },
    { id: 'creative-chaos', name: 'Art Workshop', emoji: '🎨', description: 'Explosive creativity zone' },
    { id: 'rocket-launch', name: 'Launch Pad', emoji: '🚀', description: 'Ready for takeoff energy' }
  ],
  depressive: [
    { id: 'misty-forest', name: 'Misty Forest', emoji: '🌲', description: 'Peaceful woodland sanctuary' },
    { id: 'rainy-cabin', name: 'Cozy Cabin', emoji: '🏠', description: 'Warm interior, gentle rain' },
    { id: 'twilight-lake', name: 'Twilight Lake', emoji: '🌅', description: 'Serene water at dusk' },
    { id: 'zen-garden', name: 'Zen Garden', emoji: '🧘', description: 'Meditative stone garden' }
  ],
  transition: [
    { id: 'morphing-sky', name: 'Changing Sky', emoji: '🌗', description: 'Day transitioning to night' },
    { id: 'seasonal-shift', name: 'Season Change', emoji: '🍂', description: 'Environment transforming' }
  ]
}

export default function EnvironmentSelector({
  mood,
  selectedEnvironment,
  onEnvironmentChange
}: EnvironmentSelectorProps) {
  const currentEnvironments = environments[mood] || environments.neutral

  return (
    <div className="mood-card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Environment Settings
      </h3>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-600 text-center">
          Choose the perfect atmosphere for Marvin's current mood
        </p>

        <div className="grid grid-cols-1 gap-2">
          {currentEnvironments.map((env) => (
            <motion.button
              key={env.id}
              onClick={() => onEnvironmentChange(env.id)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedEnvironment === env.id
                  ? mood === 'manic'
                    ? 'border-teal-500 bg-teal-50'
                    : mood === 'depressive'
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{env.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{env.name}</h4>
                  <p className="text-xs text-gray-600">{env.description}</p>
                </div>
                {selectedEnvironment === env.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          className={`mt-4 p-3 rounded-lg text-center ${
            mood === 'manic' 
              ? 'bg-teal-50 border border-teal-200' 
              : mood === 'depressive'
              ? 'bg-purple-50 border border-purple-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-gray-700">
            🎬 <strong>Coming Soon:</strong> Immersive video backgrounds powered by Midjourney!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
