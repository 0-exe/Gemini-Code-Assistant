import React from 'react';
import { XMarkIcon, SparklesIcon } from './Icons';

interface PromptSuggestionsModalProps {
  isLoading: boolean;
  suggestions: string[];
  onClose: () => void;
  onSelect: (suggestion: string) => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start p-4 space-x-4 bg-black/10 rounded-lg">
                <div className="w-6 h-6 bg-white/10 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

const PromptSuggestionsModal: React.FC<PromptSuggestionsModalProps> = ({ isLoading, suggestions, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="glass-effect rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Refine Prompt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <XMarkIcon />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <ul className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => onSelect(suggestion)}
                    className="w-full text-left p-4 rounded-lg bg-black/20 hover:bg-black/40 border border-white/10 hover:border-purple-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <div className="flex items-start space-x-3">
                        <div className="text-purple-400 mt-1 flex-shrink-0"><SparklesIcon /></div>
                        <p className="text-gray-200">{suggestion}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && suggestions.length === 0 && (
             <div className="text-center py-10">
                <p className="text-gray-400">Could not generate suggestions for this prompt.</p>
                <p className="text-sm text-gray-500 mt-2">Please try rephrasing your request.</p>
             </div>
          )}
        </div>
        <div className="flex justify-end p-4 border-t border-white/10">
            <button type="button" onClick={onClose} className="btn-transition px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-black/20 hover:bg-black/30">
                Cancel
            </button>
        </div>
      </div>
    </div>
  );
};

export default PromptSuggestionsModal;
