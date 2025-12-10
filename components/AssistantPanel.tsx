import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, CheckSquare, Lightbulb, Loader2, Send, MessageSquare, User } from 'lucide-react';
import { AIResponse, ProcessNode } from '../types';
import { askPMPQuestion } from '../services/geminiService';

interface AssistantPanelProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  node: ProcessNode | null;
  data: AIResponse | null;
  phaseTitle: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ 
  isOpen, 
  isLoading, 
  onClose, 
  node, 
  data,
  phaseTitle 
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);

  // Reset chat when the selected node changes
  useEffect(() => {
    setChatMessages([]);
    setQuestion('');
    setIsChatLoading(false);
  }, [node?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, data, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!question.trim() || !node) return;

    const userMsg: ChatMessage = { role: 'user', text: question };
    setChatMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setIsChatLoading(true);

    try {
      const answer = await askPMPQuestion(
        userMsg.text, 
        node.label, 
        phaseTitle, 
        data, 
        chatMessages
      );
      setChatMessages(prev => [...prev, { role: 'model', text: answer }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-start bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div>
           <div className="flex items-center gap-2 text-indigo-600 mb-1">
             <Sparkles size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">PMP Assistant</span>
           </div>
           <h2 className="text-lg font-bold text-gray-900 leading-tight">
             {node?.label || 'Select an activity'}
           </h2>
           <p className="text-xs text-gray-500 mt-1">{phaseTitle}</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-pulse">
            <Loader2 className="animate-spin mb-4 text-indigo-500" size={32} />
            <p className="text-sm">Consulting the PMBOK Guide...</p>
            <p className="text-xs mt-2 opacity-70">Powered by Gemini 2.5</p>
          </div>
        ) : data ? (
          <>
            {/* Summary */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-gray-700 text-sm leading-relaxed">
                {data.summary}
              </p>
            </div>

            {/* Checklist */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <CheckSquare size={16} className="text-green-600" />
                Action Checklist
              </h3>
              <ul className="space-y-2">
                {data.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 group">
                    <input type="checkbox" className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                    <span className="group-hover:text-gray-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tip */}
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-2">
                <Lightbulb size={16} className="text-amber-500" />
                Pro Tip
              </h3>
              <p className="text-sm text-amber-900 italic">
                "{data.tips}"
              </p>
            </div>

            {/* Chat Section Divider */}
            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare size={12} />
                  Ask a question
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="space-y-4">
               {chatMessages.length === 0 && (
                 <p className="text-center text-xs text-gray-400 italic py-2">
                   Need clarification? Ask me anything about this step.
                 </p>
               )}
               
               {chatMessages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                 </div>
               ))}

               {isChatLoading && (
                 <div className="flex justify-start">
                   <div className="bg-gray-100 rounded-lg rounded-bl-none p-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                 </div>
               )}
               <div ref={scrollBottomRef} />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 py-10">
            <p>Select any process step from the dashboard to get AI-powered guidance.</p>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      {data && (
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
           <form onSubmit={handleSend} className="relative">
             <input
               type="text"
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder="Ask about this activity..."
               disabled={isChatLoading}
               className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm shadow-sm"
             />
             <button 
               type="submit"
               disabled={!question.trim() || isChatLoading}
               className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send size={16} />
             </button>
           </form>
           <p className="text-[10px] text-center text-gray-400 mt-2">
             AI can make mistakes. Verify important information.
           </p>
        </div>
      )}
    </div>
  );
};

export default AssistantPanel;