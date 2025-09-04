import React, { useState } from 'react';
import { Sparkles, Lightbulb, FileText, BarChart3, Code2, Rocket, TrendingUp, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Button } from './ui/Button';
import { Input, TextArea } from './ui/Input';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';
import { useApp } from '../context/AppContext';
import { BusinessIdea } from '../types';
import { generateBusinessIdea, generateMarketResearch, generatePitchDeck, generateTechStack } from '../services/aiService';
import { stripeService } from '../services/stripeService';

export function AITools() {
  const { state, dispatch } = useApp();
  const { businessIdeas, user, loading } = state;
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedIdea, setGeneratedIdea] = useState<BusinessIdea | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('business-idea');

  const tools = [
    {
      id: 'business_idea',
      title: 'Business Idea Generator',
      description: 'Generate AI-powered business ideas based on your interests and market trends',
      icon: Lightbulb,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      available: true,
      tier: 'free'
    },
    {
      id: 'market_research',
      title: 'Market Research Assistant',
      description: 'Get instant market analysis and competitor insights',
      icon: BarChart3,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      available: user?.subscriptionTier !== 'free',
      tier: 'pro'
    },
    {
      id: 'pitch_deck',
      title: 'Pitch Deck Builder',
      description: 'Create compelling pitch deck outlines with AI assistance',
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      available: user?.subscriptionTier !== 'free',
      tier: 'pro'
    },
    {
      id: 'tech_stack',
      title: 'Tech Stack Advisor',
      description: 'Get personalized technology recommendations for your startup',
      icon: Code2,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      available: user?.subscriptionTier === 'premium',
      tier: 'premium'
    }
  ];

  const handleGenerateIdea = async () => {
    if (!prompt.trim()) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const idea = await generateBusinessIdea(prompt);
      setGeneratedIdea(idea);
      dispatch({ type: 'ADD_BUSINESS_IDEA', payload: idea });
    } catch (error) {
      console.error('Failed to generate business idea:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleGenerateContent = async (toolId: string) => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      let content = '';
      
      switch (toolId) {
        case 'market_research':
          content = await generateMarketResearch(prompt);
          break;
        case 'pitch_deck':
          content = await generatePitchDeck(prompt);
          break;
        case 'tech_stack':
          content = await generateTechStack(prompt, 'moderate');
          break;
        default:
          throw new Error('Unknown tool');
      }
      
      setGeneratedContent(content);
    } catch (error) {
      console.error(`Failed to generate ${toolId}:`, error);
      setGeneratedContent('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToolClick = (toolId: string, available: boolean, tier: string) => {
    if (!available) {
      // Check subscription limits and show appropriate message
      const limits = stripeService.getSubscriptionLimits(user?.subscriptionTier || 'free');
      
      if (tier === 'pro' && user?.subscriptionTier === 'free') {
        alert('This feature requires a Pro or Premium subscription. Upgrade to unlock advanced AI tools!');
      } else if (tier === 'premium' && user?.subscriptionTier !== 'premium') {
        alert('This feature requires a Premium subscription. Upgrade to Premium for unlimited access!');
      }
      return;
    }
    setSelectedTool(toolId);
    setPrompt('');
    setGeneratedIdea(null);
    setGeneratedContent('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-dark-text">AI-Powered Startup Tools</h1>
          <p className="text-dark-textMuted mt-2 max-w-2xl mx-auto">
            Leverage artificial intelligence to accelerate your entrepreneurial journey. 
            Generate ideas, conduct research, and build your startup faster.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className={`cursor-pointer transition-all hover:scale-105 ${
                  !tool.available ? 'opacity-60' : ''
                }`}
                onClick={() => handleToolClick(tool.id, tool.available, tool.tier)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    {!tool.available && (
                      <Badge variant="outline" className="capitalize">
                        {tool.tier === 'premium' ? (
                          <><Crown className="w-3 h-3 mr-1" />{tool.tier}</>
                        ) : (
                          tool.tier
                        )}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-dark-text mb-2">{tool.title}</h3>
                  <p className="text-dark-textMuted text-sm">{tool.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Ideas */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-text">Your Generated Ideas</h2>
            <Badge variant="default">{businessIdeas.length} ideas</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessIdeas.slice(0, 6).map((idea) => (
              <Card key={idea.id} className="hover:scale-105 transition-transform cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Rocket className="w-5 h-5 text-accent" />
                    <Badge variant={getDifficultyColor(idea.difficulty)}>
                      {idea.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-dark-text mb-2">{idea.title}</h3>
                  <p className="text-sm text-dark-textMuted mb-3 line-clamp-2">
                    {idea.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{idea.market}</Badge>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">{idea.potential}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {businessIdeas.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-dark-textMuted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-text mb-2">No ideas generated yet</h3>
              <p className="text-dark-textMuted">
                Use the Business Idea Generator to create your first AI-powered business concept!
              </p>
            </div>
          )}
        </div>

        {/* Business Idea Generator Modal */}
        <Modal
          isOpen={selectedTool === 'business_idea'}
          onClose={() => setSelectedTool(null)}
          title="AI Business Idea Generator"
          className="max-w-2xl"
        >
          <div className="space-y-4">
            <div>
              <Input
                label="What interests you?"
                placeholder="e.g., machine learning, sustainable energy, social media..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setSelectedTool(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateIdea} 
                disabled={!prompt.trim() || loading}
              >
                {loading ? 'Generating...' : 'Generate Idea'}
              </Button>
            </div>

            {generatedIdea && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-dark-text">{generatedIdea.title}</h3>
                    <Badge variant={getDifficultyColor(generatedIdea.difficulty)}>
                      {generatedIdea.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-dark-textMuted mb-4">{generatedIdea.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-dark-text mb-1">Market</p>
                      <Badge variant="outline">{generatedIdea.market}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-text mb-1">Potential</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">{generatedIdea.potential}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-dark-text mb-2">AI Technologies</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedIdea.aiTech.map((tech, index) => (
                        <Badge key={index} variant="default">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Modal>

        {/* Other AI Tools Modal */}
        <Modal
          isOpen={selectedTool !== null && selectedTool !== 'business_idea'}
          onClose={() => setSelectedTool(null)}
          title={tools.find(t => t.id === selectedTool)?.title || 'AI Tool'}
          className="max-w-4xl"
        >
          <div className="space-y-4">
            <div>
              <Input
                label="Describe your business idea or topic"
                placeholder="e.g., AI-powered study assistant for college students..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                variant="textarea"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="ghost" onClick={() => setSelectedTool(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedTool && handleGenerateContent(selectedTool)} 
                disabled={!prompt.trim() || isGenerating}
              >
                {isGenerating ? 'Generating...' : `Generate ${tools.find(t => t.id === selectedTool)?.title}`}
              </Button>
            </div>

            {generatedContent && (
              <Card className="mt-6">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-dark-text">Generated Content</h3>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-dark-text bg-dark-bg p-4 rounded-lg overflow-auto max-h-96">
                      {generatedContent}
                    </pre>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedContent);
                        alert('Content copied to clipboard!');
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
