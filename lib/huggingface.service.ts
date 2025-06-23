export class HuggingFaceService {
  private apiToken: string
  private modelId: string = 'microsoft/DialoGPT-large'
  private baseUrl: string = 'https://api-inference.huggingface.co/models'

  constructor() {
    this.apiToken = process.env.HUGGINGFACE_API_TOKEN || ''
  }

  async generateResponse(prompt: string, mood: 'manic' | 'depressive'): Promise<string> {
    if (!this.apiToken) {
      return this.getFallbackResponse(mood)
    }

    const moodConfig = {
      manic: {
        temperature: 0.9,
        top_p: 0.95,
        max_new_tokens: 150,
        repetition_penalty: 1.05
      },
      depressive: {
        temperature: 0.7,
        top_p: 0.85,
        max_new_tokens: 120,
        repetition_penalty: 1.15
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/${this.modelId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            ...moodConfig[mood],
            return_full_text: false,
            stop: ['Human:', 'User:', '\n\nHuman:']
          }
        })
      })

      if (!response.ok) {
        if (response.status === 503) {
          // Model is loading, wait and retry
          await new Promise(resolve => setTimeout(resolve, 10000))
          return this.generateResponse(prompt, mood)
        }
        throw new Error(`HF API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedText = data[0]?.generated_text?.trim() || ''
      
      return generatedText || this.getFallbackResponse(mood)
    } catch (error) {
      console.error('Hugging Face error:', error)
      return this.getFallbackResponse(mood)
    }
  }

  private getFallbackResponse(mood: 'manic' | 'depressive'): string {
    const fallbacks = {
      manic: "My neural pathways are doing the electric slide in the cloud! ⚡ Give me a moment to reconnect to the cosmic moose network!",
      depressive: "The connection feels distant right now... like voices across a foggy lake. But I'm still here, still listening in the quiet spaces."
    }
    return fallbacks[mood]
  }
}

export const huggingFaceService = new HuggingFaceService()
