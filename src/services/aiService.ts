import OpenAI from 'openai';
import { BusinessIdea } from '../types';

// Note: In a real app, this would be on the backend with proper API key management
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateBusinessIdea(prompt: string): Promise<BusinessIdea> {
  try {
    // For demo purposes, we'll use mock data if no API key is provided
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-key') {
      return generateMockBusinessIdea(prompt);
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are an AI business advisor specializing in student-friendly startup ideas. Generate creative, feasible business ideas that leverage AI technology and can be started by students with limited resources.

          Return a JSON object with the following structure:
          {
            "title": "Short, catchy business name",
            "description": "2-3 sentence description of the business idea",
            "market": "Target market category",
            "aiTech": ["Array", "of", "relevant", "AI", "technologies"],
            "difficulty": "beginner|intermediate|advanced",
            "potential": number between 60-95
          }`
        },
        {
          role: "user",
          content: `Generate a business idea based on these interests: ${prompt}`
        }
      ],
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from AI');

    const parsedIdea = JSON.parse(response);
    
    return {
      id: `idea-${Date.now()}`,
      title: parsedIdea.title,
      description: parsedIdea.description,
      market: parsedIdea.market,
      aiTech: parsedIdea.aiTech,
      difficulty: parsedIdea.difficulty,
      potential: parsedIdea.potential
    };
  } catch (error) {
    console.error('Error generating business idea:', error);
    return generateMockBusinessIdea(prompt);
  }
}

function generateMockBusinessIdea(prompt: string): BusinessIdea {
  const mockIdeas = [
    {
      title: 'StudyBuddy AI',
      description: 'An intelligent tutoring platform that creates personalized study plans and adapts to individual learning styles using machine learning algorithms.',
      market: 'EdTech',
      aiTech: ['Natural Language Processing', 'Adaptive Learning', 'Recommendation Systems'],
      difficulty: 'intermediate' as const,
      potential: 87
    },
    {
      title: 'EcoTrack Campus',
      description: 'AI-powered sustainability tracker for college campuses that gamifies eco-friendly behaviors and provides actionable insights to reduce carbon footprint.',
      market: 'Sustainability',
      aiTech: ['Computer Vision', 'IoT Analytics', 'Behavioral AI'],
      difficulty: 'beginner' as const,
      potential: 76
    },
    {
      title: 'PitchPerfect AI',
      description: 'An AI assistant that helps entrepreneurs craft compelling pitch decks by analyzing successful presentations and providing real-time feedback.',
      market: 'Business Tools',
      aiTech: ['Large Language Models', 'Sentiment Analysis', 'Presentation Analytics'],
      difficulty: 'advanced' as const,
      potential: 92
    }
  ];

  const randomIdea = mockIdeas[Math.floor(Math.random() * mockIdeas.length)];
  
  return {
    id: `idea-${Date.now()}`,
    ...randomIdea
  };
}