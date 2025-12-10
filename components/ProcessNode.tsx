import React from 'react';
import { ProcessNode } from '../types';
import { FileText, CheckCircle, GitCommit, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface ProcessNodeProps {
  node: ProcessNode;
  onSelect: (node: ProcessNode) => void;
  isActive: boolean;
  phaseColor: string;
}

const ProcessNodeComponent: React.FC<ProcessNodeProps> = ({ node, onSelect, isActive, phaseColor }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const getIcon = () => {
    switch (node.type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'decision': return <GitCommit className="w-4 h-4" />;
      case 'milestone': return <CheckCircle className="w-4 h-4" />;
      case 'group': return <Layers className="w-4 h-4" />;
      default: return <div className="w-2 h-2 rounded-full bg-current" />;
    }
  };

  const baseClasses = `
    relative transition-all duration-200 ease-in-out
    cursor-pointer select-none group
    ${node.type === 'decision' ? 'w-24 h-24 mx-auto rotate-45 flex items-center justify-center my-4' : 'w-full rounded-lg mb-3 p-3 border shadow-sm'}
    ${isActive ? 'ring-2 ring-offset-1 ring-blue-500 bg-white' : 'bg-white hover:bg-opacity-90 hover:shadow-md'}
    ${node.type === 'milestone' ? 'border-2 border-dashed border-gray-400 font-bold bg-yellow-50' : 'border-gray-200'}
  `;

  const contentClasses = node.type === 'decision' ? '-rotate-45 text-center text-xs font-bold leading-tight' : 'flex items-start gap-2';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col items-center w-full">
        {/* Connector Line Top (if needed logically, usually handled by parent layout) */}
        
        <div 
          onClick={handleClick}
          className={baseClasses}
        >
          <div className={contentClasses}>
             {/* Icon handling */}
            {node.type !== 'decision' && (
              <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                {getIcon()}
              </span>
            )}
            
            <div className="flex-1">
              <span className={`text-sm ${node.type === 'milestone' ? 'uppercase tracking-wide text-xs' : ''}`}>
                {node.label}
              </span>
              
              {node.subItems && (
                 <button 
                  onClick={handleToggle}
                  className="ml-auto float-right p-1 hover:bg-gray-100 rounded text-gray-400"
                 >
                   {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                 </button>
              )}
            </div>
          </div>
        </div>

        {/* Sub Items (Recursive) */}
        {node.subItems && isExpanded && (
          <div className="w-full pl-6 border-l-2 border-gray-200 ml-4 mb-4 space-y-2">
            {node.subItems.map((subNode) => (
               <ProcessNodeComponent 
                 key={subNode.id} 
                 node={subNode} 
                 onSelect={onSelect} 
                 isActive={isActive} // Simplified: Sub-items don't inherit active state visually in the same way, or passed down
                 phaseColor={phaseColor}
               />
            ))}
          </div>
        )}
        
        {/* Simple connector line to next sibling, purely visual spacer */}
        {node.type !== 'decision' && <div className="h-2" />}
    </div>
  );
};

export default ProcessNodeComponent;
