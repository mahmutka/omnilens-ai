import React from 'react';
import { AnalysisResult } from '../types';

interface ResultModalProps {
  result: AnalysisResult | null;
  onClose: () => void;
  isOpen: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({ result, onClose, isOpen }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-lg max-h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
          <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {result.categoryTitle}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-gray-200 leading-relaxed">
          <div className="prose prose-invert prose-sm max-w-none">
            {/* Simple Markdown rendering by splitting paragraphs */}
            {result.text.split('\n').map((paragraph, idx) => {
              // Handle bold text **text**
              const parts = paragraph.split(/(\*\*.*?\*\*)/g);
              
              if (paragraph.trim().startsWith('* ') || paragraph.trim().startsWith('- ')) {
                 return (
                    <li key={idx} className="ml-4 mb-2">
                         {parts.map((part, i) => 
                            part.startsWith('**') && part.endsWith('**') ? 
                            <strong key={i} className="text-white">{part.slice(2, -2)}</strong> : 
                            part
                        )}
                    </li>
                 )
              }

              return (
                <p key={idx} className="mb-4">
                    {parts.map((part, i) => 
                        part.startsWith('**') && part.endsWith('**') ? 
                        <strong key={i} className="text-white">{part.slice(2, -2)}</strong> : 
                        part
                    )}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;