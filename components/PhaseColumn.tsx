import React from 'react';
import { ProcessPhase, ProcessNode } from '../types';
import ProcessNodeComponent from './ProcessNode';

interface PhaseColumnProps {
  phase: ProcessPhase;
  selectedNodeId: string | null;
  onSelectNode: (node: ProcessNode, phaseTitle: string) => void;
}

const PhaseColumn: React.FC<PhaseColumnProps> = ({ phase, selectedNodeId, onSelectNode }) => {
  return (
    <div className={`flex-shrink-0 w-80 flex flex-col h-full rounded-xl overflow-hidden border-2 ${phase.borderColor} bg-white shadow-xl`}>
      {/* Header */}
      <div className={`p-4 font-bold text-center uppercase tracking-wider text-sm border-b-2 ${phase.borderColor} ${phase.color} ${phase.textColor}`}>
        {phase.title}
      </div>

      {/* Scrollable Content */}
      <div className={`flex-1 overflow-y-auto p-4 ${phase.color} bg-opacity-30 scrollbar-thin scrollbar-thumb-gray-300`}>
        {phase.nodes.map((node) => (
          <ProcessNodeComponent
            key={node.id}
            node={node}
            onSelect={(n) => onSelectNode(n, phase.title)}
            isActive={selectedNodeId === node.id}
            phaseColor={phase.textColor}
          />
        ))}
        
        {/* Visual terminator for the column flow */}
        <div className="h-8 flex items-center justify-center opacity-20">
            <div className="w-1 h-full bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PhaseColumn;
