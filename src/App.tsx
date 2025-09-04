import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { CommunityFeed } from './components/CommunityFeed';
import { AITools } from './components/AITools';

function AppContent() {
  const { state } = useApp();
  const { showAITools, activeCommunity } = state;

  return (
    <div className="flex h-screen bg-dark-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {showAITools ? <AITools /> : <CommunityFeed />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;