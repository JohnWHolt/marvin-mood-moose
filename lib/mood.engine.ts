export type MoodState = 'neutral' | 'manic' | 'depressive' | 'transition'

export interface MoodTransition {
  from: MoodState
  to: MoodState
  duration: number
  trigger: 'manual' | 'automatic' | 'sentiment'
}

export interface MoodData {
  timestamp: Date
  mood: MoodState
  intensity: number // 1-10
  triggers?: string[]
  notes?: string
  duration?: number // minutes in this state
}

export class MoodEngine {
  private currentMood: MoodState = 'neutral'
  private moodHistory: MoodData[] = []
  private transitionCallbacks: ((transition: MoodTransition) => void)[] = []

  constructor(initialMood: MoodState = 'neutral') {
    this.currentMood = initialMood
    this.logMoodChange(initialMood, 5, 'Initial state')
  }

  getCurrentMood(): MoodState {
    return this.currentMood
  }

  getMoodHistory(): MoodData[] {
    return [...this.moodHistory]
  }

  async switchMood(newMood: 'manic' | 'depressive', trigger: 'manual' | 'automatic' | 'sentiment' = 'manual'): Promise<void> {
    if (newMood === this.currentMood) return

    const transition: MoodTransition = {
      from: this.currentMood,
      to: newMood,
      duration: this.calculateTransitionDuration(this.currentMood, newMood),
      trigger
    }

    // Set transition state
    this.currentMood = 'transition'
    this.notifyTransition(transition)

    // Wait for transition duration
    await new Promise(resolve => setTimeout(resolve, transition.duration))

    // Complete transition
    this.currentMood = newMood
    this.logMoodChange(newMood, 5, `Switched via ${trigger}`)
    
    // Notify completion
    this.transitionCallbacks.forEach(callback => callback({
      ...transition,
      from: 'transition',
      to: newMood
    }))
  }

  onMoodTransition(callback: (transition: MoodTransition) => void): void {
    this.transitionCallbacks.push(callback)
  }

  analyzeSentiment(text: string): MoodState {
    const manicKeywords = ['excited', 'amazing', 'fantastic', 'energy', 'creative', 'idea', 'fast', 'quick', 'awesome', 'incredible']
    const depressiveKeywords = ['sad', 'tired', 'slow', 'heavy', 'quiet', 'think', 'feel', 'deep', 'lonely', 'empty']
    
    const lowerText = text.toLowerCase()
    const manicScore = manicKeywords.reduce((score, word) => 
      score + (lowerText.includes(word) ? 1 : 0), 0)
    const depressiveScore = depressiveKeywords.reduce((score, word) => 
      score + (lowerText.includes(word) ? 1 : 0), 0)

    if (manicScore > depressiveScore && manicScore > 0) return 'manic'
    if (depressiveScore > manicScore && depressiveScore > 0) return 'depressive'
    return 'neutral'
  }

  getMoodStats(): {
    totalEntries: number
    manicPercentage: number
    depressivePercentage: number
    neutralPercentage: number
    averageIntensity: number
    longestStreak: { mood: MoodState, count: number }
  } {
    const total = this.moodHistory.length
    if (total === 0) return {
      totalEntries: 0,
      manicPercentage: 0,
      depressivePercentage: 0,
      neutralPercentage: 0,
      averageIntensity: 0,
      longestStreak: { mood: 'neutral', count: 0 }
    }

    const manicCount = this.moodHistory.filter(entry => entry.mood === 'manic').length
    const depressiveCount = this.moodHistory.filter(entry => entry.mood === 'depressive').length
    const neutralCount = this.moodHistory.filter(entry => entry.mood === 'neutral').length
    const avgIntensity = this.moodHistory.reduce((sum, entry) => sum + entry.intensity, 0) / total

    // Calculate longest streak
    let longestStreak = { mood: 'neutral' as MoodState, count: 0 }
    let currentStreak = { mood: this.moodHistory[0]?.mood || 'neutral', count: 1 }

    for (let i = 1; i < this.moodHistory.length; i++) {
      if (this.moodHistory[i].mood === currentStreak.mood) {
        currentStreak.count++
      } else {
        if (currentStreak.count > longestStreak.count) {
          longestStreak = { ...currentStreak }
        }
        currentStreak = { mood: this.moodHistory[i].mood, count: 1 }
      }
    }

    if (currentStreak.count > longestStreak.count) {
      longestStreak = { ...currentStreak }
    }

    return {
      totalEntries: total,
      manicPercentage: (manicCount / total) * 100,
      depressivePercentage: (depressiveCount / total) * 100,
      neutralPercentage: (neutralCount / total) * 100,
      averageIntensity: avgIntensity,
      longestStreak
    }
  }

  private logMoodChange(mood: MoodState, intensity: number, notes?: string): void {
    const entry: MoodData = {
      timestamp: new Date(),
      mood,
      intensity,
      notes
    }
    
    this.moodHistory.push(entry)
    
    // Keep only last 100 entries for performance
    if (this.moodHistory.length > 100) {
      this.moodHistory = this.moodHistory.slice(-100)
    }
  }

  private calculateTransitionDuration(from: MoodState, to: MoodState): number {
    // Transition durations in milliseconds
    const transitions = {
      'neutral-to-manic': 2000,
      'neutral-to-depressive': 2500,
      'manic-to-depressive': 3000,
      'depressive-to-manic': 2000,
      'manic-to-neutral': 1500,
      'depressive-to-neutral': 2000
    }
    
    const key = `${from}-to-${to}` as keyof typeof transitions
    return transitions[key] || 2500
  }

  private notifyTransition(transition: MoodTransition): void {
    this.transitionCallbacks.forEach(callback => callback(transition))
  }
}

// Singleton instance
export const moodEngine = new MoodEngine()
