import { NextRequest, NextResponse } from 'next/server'
import { huggingFaceService } from '@/lib/huggingface-service'
import { marvinPrompts } from '@/lib/marvin-prompts'

export async function POST(request: NextRequest) {
  try {
    const { userMessage, mood, conversationHistory = [] } = await request.json()

    if (!userMessage || !mood) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Build the full prompt with Marvin's personality
    const systemPrompt = marvinPrompts[mood as 'manic' | 'depressive'].systemPrompt
    const recentHistory = conversationHistory.slice(-4).join('\n')
    
    const fullPrompt = `${systemPrompt}

Recent conversation:
${recentHistory}
