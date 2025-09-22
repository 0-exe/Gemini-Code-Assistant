import React, { useState, useEffect, useRef } from 'react';
import { CopyIcon, CheckIcon, BookmarkIcon } from './Icons';
import { SupportedLanguage } from '../types';

// Tell TypeScript that Prism exists on the window object
declare var Prism: any;

interface CodeOutputProps {
  code: string;
  isLoading: boolean;
  language: SupportedLanguage;
  onSaveClick: () => void;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 bg-white/10 rounded w-3/4"></div>
    <div className="h-4 bg-white/10 rounded w-full"></div>
    <div className="h-4 bg-white/10 rounded w-5/6"></div>
    <div className="h-4 bg-white/10 rounded w-1/2"></div>
    <div className="h-4 bg-white/10 rounded w-full"></div>
  </div>
);

const getPrismLanguage = (lang: SupportedLanguage): string => {
    switch (lang) {
      case SupportedLanguage.JavaScript: return 'javascript';
      case SupportedLanguage.Python: return 'python';
      case SupportedLanguage.Java: return 'java';
      case SupportedLanguage.CPP: return 'cpp';
      case SupportedLanguage.CSharp:
      case SupportedLanguage.CSharpWinForms:
        return 'csharp';
      case SupportedLanguage.HTML_CSS: return 'markup'; // for HTML/XML
      default: return 'clike';
    }
};

const CodeOutput: React.FC<CodeOutputProps> = ({ code, isLoading, language, onSaveClick }) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const prismLang = getPrismLanguage(language);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  // Reset copied state if the code changes
  useEffect(() => {
    setCopied(false);
  }, [code]);
  
  // Highlight code when it changes
  useEffect(() => {
    if (codeRef.current && code && typeof Prism !== 'undefined') {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div>
      <div className="glass-effect rounded-lg">
        <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-b border-white/10 rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-300">Generated Code</h3>
          {!isLoading && code && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onSaveClick}
                className="btn-transition inline-flex items-center justify-center px-3 py-1.5 border border-white/20 text-xs font-medium rounded-md text-gray-300 bg-black/20 hover:bg-black/30"
                aria-label="Save snippet"
              >
                <BookmarkIcon />
                <span className="ml-2 hidden sm:inline">Save</span>
              </button>
              <button
                onClick={handleCopy}
                className={`btn-transition inline-flex items-center justify-center px-3 py-1.5 border text-xs font-medium rounded-md ${
                  copied
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-white/20 bg-black/20 text-gray-300 hover:bg-black/30'
                }`}
                aria-label={copied ? "Code copied" : "Copy code"}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span className="ml-2">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
        <div className="p-4 min-h-[150px] max-h-[500px] overflow-y-auto text-sm">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <pre className={`language-${prismLang} !bg-transparent !p-0 !m-0 whitespace-pre-wrap`}>
              <code ref={codeRef} className={`language-${prismLang}`}>
                {code}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeOutput;