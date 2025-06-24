import { moodEngine, MoodState } from './mood.engine'

export class MarvinTransitionController {
  private isTransitioning: boolean = false

  async transitionTo(newMood: 'manic' | 'depressive'): Promise<void> {
    if (this.isTransitioning) return

    this.isTransitioning = true
    
    try {
      await moodEngine.switchMood(newMood, 'manual')
    } finally {
      this.isTransitioning = false
    }
  }

  getCurrentMood(): MoodState {
    return moodEngine.getCurrentMood()
  }

  isCurrentlyTransitioning(): boolean {
    return this.isTransitioning || moodEngine.getCurrentMood() === 'transition'
  }

  onMoodChange(callback: (mood: MoodState) => void): void {
    moodEngine.onMoodTransition((transition) => {
      callback(transition.to)
    })
  }

  getMoodStats() {
    return moodEngine.getMoodStats()
  }
}

export const marvinTransitionController = new MarvinTransitionController()