'use client'

import { motion } from 'framer-motion'

interface MoodToggleProps {
  mood: 'manic' | 'depressive'
  onMoodChange: (mood: 'manic' | 'depressive') => void
  disabled?: boolean
}

export default function MoodToggle({ mood, onMoodChange, disabled = false }: MoodToggleProps) {
  const toggleVariants = {
    manic: {
      backgroundColor: '#20B2AA',
      boxShadow: '0 0 20px rgba(32, 178, 170, 0.5)'
    },
    depressive: {
      backgroundColor: '#D8BFD8',
      boxShadow: '0 0 20px rgba(216, 191, 216, 0.5)'
    }
  }

  const switchVariants = {
    manic: { x: 60 },
    depressive: { x: 0 }
  }

  return (
    <div className="mood-card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Marvin's Current Mood
      </h3>
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <span className={`text-sm font-medium ${mood === 'depressive' ? 'text-gray-800' : 'text-gray-400'}`}>
          🌙 Depressive
        </span>
        
        <motion.div
          className="relative w-24 h-12 rounded-full cursor-pointer"
          variants={toggleVariants}
          animate={mood}
          onClick={() => !disabled && onMoodChange(mood === 'manic' ? 'depressive' : 'manic')}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
            variants={switchVariants}
            animate={mood}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <span className="text-lg">
              {mood === 'manic' ? '🚀' : '🌙'}
            </span>
          </motion.div>
        </motion.div>
        
        <span className={`text-sm font-medium ${mood === 'manic' ? 'text-gray-800' : 'text-gray-400'}`}>
          🚀 Manic
        </span>
      </div>

      <motion.div
        className="text-center"
        key={mood}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-gray-600 mb-2">
          {mood === 'manic' 
            ? "Marvin is feeling energetic, creative, and ready to take on the world!"
            : "Marvin is in a contemplative, introspective, and gentle state."
          }
        </p>
        
        <div className="space-y-2 text-xs text-gray-500">
          {mood === 'manic' ? (
            <>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                <span>High energy, creative, optimistic</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Fast speech, wild ideas, enthusiastic</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
                <span>Contemplative, introspective, gentle</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Slow speech, poetic, emotionally honest</span>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {disabled && (
        <motion.div
          className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xs text-yellow-700">
            ⚡ Marvin is transitioning between moods...
          </p>
        </motion.div>
      )}
    </div>
  )
}
'use client'

import { motion } from 'framer-motion'

interface MoodToggleProps {
  mood: 'manic' | 'depressive'
  onMoodChange: (mood: 'manic' | 'depressive') => void
  disabled?: boolean
}

export default function MoodToggle({ mood, onMoodChange, disabled = false }: MoodToggleProps) {
  const toggleVariants = {
    manic: {
      backgroundColor: '#20B2AA',
      boxShadow: '0 0 20px rgba(32, 178, 170, 0.5)'
    },
    depressive: {
      backgroundColor: '#D8BFD8',
      boxShadow: '0 0 20px rgba(216, 191, 216, 0.5)'
    }
  }

  const switchVariants = {
    manic: { x: 60 },
    depressive: { x: 0 }
  }

  return (
    <div className="mood-card">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Marvin's Current Mood
      </h3>
      
      <div className="flex items-center justify-center space-x-4 mb-4">
        <span className={`text-sm font-medium ${mood === 'depressive' ? 'text-gray-800' : 'text-gray-400'}`}>
          🌙 Depressive
        </span>
        
        <motion.div
          className="relative w-24 h-12 rounded-full cursor-pointer"
          variants={toggleVariants}
          animate={mood}
          onClick={() => !disabled && onMoodChange(mood === 'manic' ? 'depressive' : 'manic')}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center"
            variants={switchVariants}
            animate={mood}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <span className="text-lg">
              {mood === 'manic' ? '🚀' : '🌙'}
            </span>
          </motion.div>
        </motion.div>
        
        <span className={`text-sm font-medium ${mood === 'manic' ? 'text-gray-800' : 'text-gray-400'}`}>
          🚀 Manic
        </span>
      </div>

      <motion.div
        className="text-center"
        key={mood}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-gray-600 mb-2">
          {mood === 'manic' 
            ? "Marvin is feeling energetic, creative, and ready to take on the world!"
            : "Marvin is in a contemplative, introspective, and gentle state."
          }
        </p>
        
        <div className="space-y-2 text-xs text-gray-500">
          {mood === 'manic' ? (
            <>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                <span>High energy, creative, optimistic</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Fast speech, wild ideas, enthusiastic</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-purple-300 rounded-full"></span>
                <span>Contemplative, introspective, gentle</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                <span>Slow speech, poetic, emotionally honest</span>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {disabled && (
        <motion.div
          className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-xs text-yellow-700">
            ⚡ Marvin is transitioning between moods...
          </p>
        </motion.div>
      )}
    </div>
  )
}
