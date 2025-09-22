import React from 'react';
import Spinner from './Spinner';
import { SparklesIcon, CodeBracketIcon, ClearIcon } from './Icons';

interface ActionButtonsProps {
  onGenerate: () => void;
  onRefine: () => void;
  onClear: () => void;
  isGenerating: boolean;
  isRefining: boolean;
  isClearDisabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onGenerate, onRefine, onClear, isGenerating, isRefining, isClearDisabled }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
    <button
      onClick={onClear}
      disabled={isClearDisabled || isGenerating || isRefining}
      className="sm:col-span-1 btn-transition inline-flex items-center justify-center px-6 py-3 border border-white/20 text-base font-medium rounded-md text-gray-300 bg-black/20 hover:bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ClearIcon />
      <span className="ml-2">Clear</span>
    </button>
    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
       <button
        onClick={onRefine}
        disabled={isRefining || isGenerating}
        className="btn-transition inline-flex items-center justify-center px-6 py-3 border border-white/20 text-base font-medium rounded-md text-purple-300 bg-black/20 hover:bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRefining ? <Spinner /> : <SparklesIcon />}
        <span className="ml-2">Refine Prompt</span>
      </button>
      <button
        onClick={onGenerate}
        disabled={isGenerating || isRefining}
        className="btn-transition glowing-button inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? <Spinner /> : <CodeBracketIcon />}
        <span className="ml-2">Generate Code</span>
      </button>
    </div>
  </div>
);

export default ActionButtons;