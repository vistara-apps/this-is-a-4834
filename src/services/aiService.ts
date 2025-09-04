import OpenAI from 'openai';
import { BusinessIdea } from '../types';

// Note: In a real app, this would be on the backend with proper API key management
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateMarketResearch(businessIdea: string): Promise<string> {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-key') {
      return generateMockMarketResearch(businessIdea);
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a market research analyst. Provide a comprehensive market research summary for the given business idea. Include market size, target audience, competitors, trends, and opportunities. Format as markdown.`
        },
        {
          role: "user",
          content: `Provide market research for this business idea: ${businessIdea}`
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || generateMockMarketResearch(businessIdea);
  } catch (error) {
    console.error('Error generating market research:', error);
    return generateMockMarketResearch(businessIdea);
  }
}

export async function generatePitchDeck(businessIdea: string): Promise<string> {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-key') {
      return generateMockPitchDeck(businessIdea);
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a startup advisor. Create a comprehensive pitch deck outline for the given business idea. Include all essential slides with detailed content suggestions. Format as markdown with clear sections.`
        },
        {
          role: "user",
          content: `Create a pitch deck outline for this business idea: ${businessIdea}`
        }
      ],
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || generateMockPitchDeck(businessIdea);
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    return generateMockPitchDeck(businessIdea);
  }
}

export async function generateTechStack(businessIdea: string, complexity: 'simple' | 'moderate' | 'complex' = 'moderate'): Promise<string> {
  try {
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'demo-key') {
      return generateMockTechStack(businessIdea, complexity);
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001",
      messages: [
        {
          role: "system",
          content: `You are a technical architect. Recommend a modern, scalable technology stack for the given business idea. Consider the complexity level and provide specific technologies, frameworks, and tools. Format as markdown with clear categories.`
        },
        {
          role: "user",
          content: `Recommend a ${complexity} technology stack for this business idea: ${businessIdea}`
        }
      ],
      temperature: 0.6,
    });

    return completion.choices[0]?.message?.content || generateMockTechStack(businessIdea, complexity);
  } catch (error) {
    console.error('Error generating tech stack:', error);
    return generateMockTechStack(businessIdea, complexity);
  }
}

function generateMockMarketResearch(businessIdea: string): string {
  return `# Market Research: ${businessIdea}

## Market Size & Opportunity
- **Total Addressable Market (TAM)**: $2.5B globally
- **Serviceable Addressable Market (SAM)**: $450M in target regions
- **Serviceable Obtainable Market (SOM)**: $15M realistic capture

## Target Audience
- **Primary**: College students aged 18-24
- **Secondary**: Young professionals aged 22-28
- **Demographics**: Tech-savvy, entrepreneurial mindset, limited budget

## Competitive Landscape
- **Direct Competitors**: 3-5 established players
- **Indirect Competitors**: General productivity/networking tools
- **Competitive Advantage**: AI-powered personalization and student focus

## Market Trends
- Growing interest in AI-powered solutions
- Increased focus on student entrepreneurship
- Remote collaboration becoming standard

## Key Opportunities
- Underserved student market segment
- Integration with existing educational platforms
- Potential for viral growth through campus networks`;
}

function generateMockPitchDeck(businessIdea: string): string {
  return `# Pitch Deck: ${businessIdea}

## Slide 1: Title Slide
- Company name and tagline
- Your name and contact information
- Date and presentation context

## Slide 2: Problem
- Clear definition of the problem you're solving
- Market pain points and current frustrations
- Why this problem matters now

## Slide 3: Solution
- Your unique approach to solving the problem
- Key features and benefits
- How it's different from existing solutions

## Slide 4: Market Opportunity
- Market size and growth potential
- Target customer segments
- Revenue opportunity

## Slide 5: Product Demo
- Screenshots or demo of your product
- Key user flows and features
- Value proposition demonstration

## Slide 6: Business Model
- How you make money
- Pricing strategy
- Revenue streams

## Slide 7: Traction
- Key metrics and growth
- Customer testimonials
- Partnerships and achievements

## Slide 8: Competition
- Competitive landscape overview
- Your competitive advantages
- Market positioning

## Slide 9: Team
- Founder backgrounds and expertise
- Key team members
- Advisory board

## Slide 10: Financial Projections
- 3-5 year revenue projections
- Key assumptions
- Path to profitability

## Slide 11: Funding Ask
- Amount you're raising
- Use of funds
- Milestones you'll achieve

## Slide 12: Thank You
- Contact information
- Next steps
- Q&A invitation`;
}

function generateMockTechStack(businessIdea: string, complexity: string): string {
  const stacks = {
    simple: `# Technology Stack: ${businessIdea} (Simple)

## Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Deployment**: Vercel or Netlify

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite or PostgreSQL
- **Authentication**: JWT with bcrypt

## Infrastructure
- **Hosting**: Railway or Render
- **Database**: Supabase or PlanetScale
- **File Storage**: Cloudinary
- **Monitoring**: Basic logging

## Development Tools
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier`,

    moderate: `# Technology Stack: ${businessIdea} (Moderate)

## Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand or Redux Toolkit
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation

## Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth0 or Firebase Auth
- **API**: RESTful with OpenAPI documentation

## Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway or Fly.io
- **Database**: Supabase or AWS RDS
- **CDN**: Cloudflare
- **File Storage**: AWS S3 or Cloudinary
- **Monitoring**: Sentry + LogRocket

## Development Tools
- **Version Control**: Git + GitHub Actions
- **Package Manager**: pnpm
- **Testing**: Vitest + Playwright
- **Code Quality**: ESLint + Prettier + Husky
- **Documentation**: Storybook`,

    complex: `# Technology Stack: ${businessIdea} (Complex)

## Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + React Query
- **Authentication**: NextAuth.js
- **Testing**: Vitest + Playwright + Storybook

## Backend
- **Architecture**: Microservices with Node.js/TypeScript
- **API Gateway**: Kong or AWS API Gateway
- **Databases**: 
  - PostgreSQL (primary data)
  - Redis (caching/sessions)
  - Elasticsearch (search)
- **Message Queue**: Bull Queue with Redis
- **Authentication**: Auth0 with RBAC

## AI/ML Services
- **LLM Integration**: OpenAI API or Anthropic Claude
- **Vector Database**: Pinecone or Weaviate
- **ML Pipeline**: Python with FastAPI
- **Model Serving**: Docker containers

## Infrastructure
- **Container Orchestration**: Docker + Kubernetes
- **Cloud Provider**: AWS or Google Cloud
- **CDN**: CloudFlare
- **Monitoring**: DataDog + Sentry
- **Logging**: ELK Stack
- **CI/CD**: GitHub Actions + ArgoCD

## Development Tools
- **Monorepo**: Turborepo or Nx
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier + SonarQube
- **Documentation**: Notion + Swagger
- **Project Management**: Linear + GitHub Projects`
  };

  return stacks[complexity as keyof typeof stacks] || stacks.moderate;
}

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
