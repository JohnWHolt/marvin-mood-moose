'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { motion } from 'framer-motion'

export default function AuthButton() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  )

  if (error) return (
    <div className="text-sm text-red-600">Error: {error.message}</div>
  )

  if (user) {
    return (
      <motion.div 
        className="flex items-center space-x-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center space-x-2">
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-full border-2 border-blue-200"
            />
          )}
          <div className="text-sm">
            <p className="font-medium text-gray-700">
              Welcome, {user.name?.split(' ')[0] || 'Friend'}!
            </p>
            <p className="text-xs text-gray-500">Ready to chat with Marvin</p>
          </div>
        </div>
        <motion.a
          href="/api/auth/logout"
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.a>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-sm text-gray-600">
        <p>Chat anonymously or sign in for personalized experience</p>
      </div>
      <motion.a
        href="/api/auth/login"
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Sign In
      </motion.a>
    </motion.div>
  )
}
