import React, { useState, useEffect } from 'react';
import { PROCESS_DATA } from './constants';
import PhaseColumn from './components/PhaseColumn';
import AssistantPanel from './components/AssistantPanel';
import { ProcessNode, AIResponse } from './types';
import { generatePMPGuidance } from './services/geminiService';
import { Layout } from 'lucide-react';

const App: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ProcessNode | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [aiData, setAiData] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectNode = async (node: ProcessNode, phaseTitle: string) => {
    setSelectedNode(node);
    setSelectedPhase(phaseTitle);
    setIsPanelOpen(true);
    setAiData(null); // Clear previous data
    
    // Don't fetch for simple groups unless they have no sub-items, 
    // but usually users click the sub-items. However, the requirement is prompt help at each stage.
    // We will fetch for everything.
    
    setIsLoading(true);
    try {
      const data = await generatePMPGuidance(node.label, phaseTitle);
      setAiData(data);
    } catch (error) {
      console.error("Failed to fetch guidance", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* Navbar */}
      <header className="flex-none bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Predictive Process Dashboard</h1>
            <p className="text-xs text-slate-500 font-medium">Interactive PMP Process Flow Chart</p>
          </div>
        </div>
      </header>

      {/* Main Flow Canvas */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
        <div className="inline-flex h-full gap-6 min-w-max pb-4">
          
          {/* Loop through phases */}
          {PROCESS_DATA.map((phase) => (
             <PhaseColumn 
               key={phase.id} 
               phase={phase} 
               selectedNodeId={selectedNode?.id || null}
               onSelectNode={handleSelectNode}
             />
          ))}

        </div>
      </main>

      {/* Side Panel */}
      <AssistantPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)}
        isLoading={isLoading}
        node={selectedNode}
        data={aiData}
        phaseTitle={selectedPhase}
      />
      
    </div>
  );
};

export default App;