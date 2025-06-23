'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface RealMarvinProps {
  mood: 'neutral' | 'manic' | 'depressive' | 'transition'
  isAnimating: boolean
  isTalking: boolean
}

export default function RealMarvinSVG({ mood, isAnimating, isTalking }: RealMarvinProps) {
  const [sparklePositions, setSparklePositions] = useState<Array<{x: number, y: number, delay: number}>>([])

  useEffect(() => {
    if (mood === 'manic' || mood === 'transition') {
      const sparkles = Array.from({ length: 8 }, (_, i) => ({
        x: 60 + Math.random() * 180,
        y: 40 + Math.random() * 200,
        delay: i * 0.3
      }))
      setSparklePositions(sparkles)
    }
  }, [mood])

  const moodColors = {
    neutral: { primary: '#D2691E', antlers: '#2F2F2F', effects: '#87CEEB' },
    manic: { primary: '#D2691E', antlers: '#20B2AA', effects: '#FFD700' },
    depressive: { primary: '#D2691E', antlers: '#D8BFD8', effects: '#E6E6FA' },
    transition: { primary: '#D2691E', leftAntler: '#20B2AA', rightAntler: '#D8BFD8', effects: '#FFD700' }
  }

  const colors = moodColors[mood]

  const bodyAnimation = {
    neutral: {
      y: [0, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    manic: {
      y: [0, -15, 0],
      x: [0, 3, 0, -3, 0],
      rotate: [0, 2, 0, -2, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    },
    depressive: {
      y: [0, 3, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    },
    transition: {
      y: [0, -8, 0],
      rotate: [0, 1, 0, -1, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
    }
  }

  const eyeAnimation = {
    neutral: { scaleY: [1, 0.9, 1], transition: { duration: 4, repeat: Infinity } },
    manic: { scale: [1, 1.3, 1], transition: { duration: 1, repeat: Infinity } },
    depressive: { scaleY: [1, 0.7, 1], transition: { duration: 4, repeat: Infinity } },
    transition: { scale: [1, 1.1, 1], transition: { duration: 1, repeat: Infinity } }
  }

  const mouthAnimation = isTalking ? {
    scaleY: [1, 1.4, 0.6, 1.2, 1],
    transition: { duration: 0.5, repeat: Infinity }
  } : {}

  return (
    <div className="flex justify-center items-center w-full h-96">
      <motion.svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <defs>
          <radialGradient id="furGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#F4A460" />
            <stop offset="50%" stopColor={colors.primary} />
            <stop offset="100%" stopColor="#A0522D" />
          </radialGradient>
          
          <radialGradient id="snoutGradient" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFE4B5" />
            <stop offset="100%" stopColor="#F4A460" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="sparkleGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <motion.circle
          cx="150"
          cy="150"
          r="140"
          fill={mood === 'manic' ? 'rgba(32,178,170,0.1)' : 
                mood === 'depressive' ? 'rgba(216,191,216,0.1)' : 
                mood === 'transition' ? 'rgba(255,215,0,0.1)' :
                'rgba(135,206,235,0.05)'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Main Body */}
        <motion.g
          variants={bodyAnimation}
          animate={mood}
          style={{ transformOrigin: '150px 180px' }}
        >
          {/* Body Shadow */}
          <ellipse cx="152" cy="182" rx="43" ry="53" fill="rgba(0,0,0,0.1)" />
          
          {/* Body */}
          <ellipse cx="150" cy="180" rx="42" ry="52" fill="url(#furGradient)" stroke="#A0522D" strokeWidth="1" />
          
          {/* Body Fur Texture */}
          <g stroke="#CD853F" strokeWidth="0.5" opacity="0.6">
            {Array.from({ length: 15 }, (_, i) => (
              <motion.path
                key={i}
                d={`M${125 + i * 2} ${155 + Math.sin(i) * 8} Q${130 + i * 2} ${165 + Math.sin(i) * 6} ${135 + i * 2} ${175 + Math.sin(i) * 10}`}
                fill="none"
                strokeLinecap="round"
                animate={{
                  d: [
                    `M${125 + i * 2} ${155 + Math.sin(i) * 8} Q${130 + i * 2} ${165 + Math.sin(i) * 6} ${135 + i * 2} ${175 + Math.sin(i) * 10}`,
                    `M${125 + i * 2} ${157 + Math.sin(i + 1) * 8} Q${130 + i * 2} ${167 + Math.sin(i + 1) * 6} ${135 + i * 2} ${177 + Math.sin(i + 1) * 10}`,
                    `M${125 + i * 2} ${155 + Math.sin(i) * 8} Q${130 + i * 2} ${165 + Math.sin(i) * 6} ${135 + i * 2} ${175 + Math.sin(i) * 10}`
                  ]
                }}
                transition={{ duration: 3 + i * 0.1, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </g>
          
          {/* Head Shadow */}
          <ellipse cx="152" cy="122" rx="33" ry="30" fill="rgba(0,0,0,0.1)" />
          
          {/* Head */}
          <ellipse cx="150" cy="120" rx="32" ry="29" fill="url(#furGradient)" stroke="#A0522D" strokeWidth="1" />
          
          {/* Snout */}
          <ellipse cx="150" cy="140" rx="18" ry="12" fill="url(#snoutGradient)" stroke="#DEB887" strokeWidth="1" />
          
          {/* Nostrils */}
          <ellipse cx="145" cy="138" rx="2" ry="3" fill="#8B4513" />
          <ellipse cx="155" cy="138" rx="2" ry="3" fill="#8B4513" />
        </motion.g>

        {/* Antlers */}
        <motion.g
          animate={{
            rotate: mood === 'manic' ? [-3, 3, -3] : mood === 'transition' ? [-2, 2, -2] : [0, -1, 0],
            transition: { 
              duration: mood === 'manic' ? 0.4 : mood === 'transition' ? 0.8 : 4, 
              repeat: Infinity 
            }
          }}
          style={{ transformOrigin: '150px 90px' }}
        >
          {mood === 'transition' ? (
            <>
              {/* Left Antler - Manic Color with Glow */}
              <motion.path
                d="M125 95 Q115 75 105 55 Q100 45 95 35 M120 80 Q110 70 100 60 M130 85 Q120 75 110 65"
                stroke={colors.leftAntler}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                filter="url(#glow)"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              {/* Right Antler - Depressive Color */}
              <motion.path
                d="M175 95 Q185 75 195 55 Q200 45 205 35 M180 80 Q190 70 200 60 M170 85 Q180 75 190 65"
                stroke={colors.rightAntler}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </>
          ) : (
            <>
              <path
                d="M125 95 Q115 75 105 55 Q100 45 95 35 M120 80 Q110 70 100 60 M130 85 Q120 75 110 65"
                stroke={colors.antlers}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                filter={mood === 'manic' ? "url(#glow)" : undefined}
              />
              <path
                d="M175 95 Q185 75 195 55 Q200 45 205 35 M180 80 Q190 70 200 60 M170 85 Q180 75 190 65"
                stroke={colors.antlers}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                filter={mood === 'manic' ? "url(#glow)" : undefined}
              />
            </>
          )}
        </motion.g>

        {/* Eyes */}
        <motion.g
          variants={eyeAnimation}
          animate={mood}
          style={{ transformOrigin: '150px 115px' }}
        >
          {/* Left Eye */}
          <ellipse cx="140" cy="115" rx="8" ry="10" fill="white" stroke="#DDD" strokeWidth="0.5" />
          <motion.circle cx="140" cy="115" r="5" fill="black" />
          <circle cx="142" cy="113" r="1.5" fill="white" />
          
          {/* Right Eye */}
          <ellipse cx="160" cy="115" rx="8" ry="10" fill="white" stroke="#DDD" strokeWidth="0.5" />
          <motion.circle cx="160" cy="115" r="5" fill="black" />
          <circle cx="162" cy="113" r="1.5" fill="white" />

          {/* Eye Sparkles for Manic */}
          {mood === 'manic' && (
            <g>
              <motion.circle
                cx="137" cy="118" r="1" fill={colors.effects}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
              <motion.circle
                cx="157" cy="118" r="1" fill={colors.effects}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.8 }}
              />
            </g>
          )}

          {/* Eyelashes for Depressive */}
          {mood === 'depressive' && (
            <g stroke="#9B8B8F" strokeWidth="1" strokeLinecap="round">
              <path d="M135 105 Q133 102 131 105" />
              <path d="M140 103 Q138 100 136 103" />
              <path d="M145 105 Q143 102 141 105" />
              <path d="M155 105 Q157 102 159 105" />
              <path d="M160 103 Q162 100 164 103" />
              <path d="M165 105 Q167 102 169 105" />
            </g>
          )}
        </motion.g>

        {/* Mouth */}
        <motion.g
          animate={mouthAnimation}
          style={{ transformOrigin: '150px 155px' }}
        >
          {mood === 'manic' || mood === 'transition' ? (
            /* Happy/Excited Mouth */
            <g>
              <path
                d="M135 155 Q150 170 165 155"
                stroke="#8B4513"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <ellipse cx="150" cy="162" rx="10" ry="5" fill="#FF6B6B" />
              {/* Teeth */}
              <rect x="145" y="158" width="2" height="4" fill="white" rx="1" />
              <rect x="148" y="158" width="2" height="4" fill="white" rx="1" />
              <rect x="151" y="158" width="2" height="4" fill="white" rx="1" />
              <rect x="154" y="158" width="2" height="4" fill="white" rx="1" />
            </g>
          ) : mood === 'depressive' ? (
            /* Gentle/Peaceful Mouth */
            <ellipse cx="150" cy="155" rx="8" ry="4" fill="#DEB887" />
          ) : (
            /* Neutral Mouth */
            <ellipse cx="150" cy="155" rx="10" ry="3" fill="#DEB887" />
          )}
        </motion.g>

        {/* Mood-Specific Effects */}
        <AnimatePresence>
          {(mood === 'manic' || mood === 'transition') && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sparkles */}
              {sparklePositions.map((pos, i) => (
                <motion.g key={i}>
                  <motion.circle
                    cx={pos.x} cy={pos.y} r="2"
                    fill={colors.effects}
                    filter="url(#sparkleGlow)"
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: pos.delay,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.text
                    x={pos.x - 4} y={pos.y + 2}
                    fontSize="8" fill={colors.effects}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: pos.delay + 0.3
                    }}
                  >
                    ✨
                  </motion.text>
                </motion.g>
              ))}

              {/* Energy Radiations */}
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '150px 150px' }}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <motion.line
                    key={i}
                    x1="150" y1="40" x2="150" y2="60"
                    stroke={colors.effects}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.6"
                    transform={`rotate(${i * 60} 150 150)`}
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </motion.g>
            </motion.g>
          )}

          {mood === 'depressive' && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Breathing Aura */}
              <motion.circle
                cx="150" cy="150" r="100"
                fill="none"
                stroke={colors.effects}
                strokeWidth="1"
                opacity="0.3"
                animate={{
                  r: [95, 105, 95],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Gentle Mist */}
              {Array.from({ length: 6 }, (_, i) => (
                <motion.circle
                  key={i}
                  cx={130 + i * 8} cy={70 + i * 3}
                  r="1.5" fill={colors.effects} opacity="0.5"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0, 0.7, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* Mood Label */}
        <motion.text
          x="150" y="280"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill={mood === 'manic' ? '#20B2AA' : 
                mood === 'depressive' ? '#D8BFD8' : 
                mood === 'transition' ? '#FFD700' : '#2F2F2F'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          {mood === 'manic' && '🚀 MANIC MARVIN'}
          {mood === 'depressive' && '🌙 DEPRESSIVE MARVIN'}
          {mood === 'transition' && '⚡ TRANSITIONING...'}
          {mood === 'neutral' && '🦌 MARVIN'}
        </motion.text>
      </motion.svg>
    </div>
  )
}
