import React, { useState, useEffect } from 'react';
import { SupportedLanguage, TestGenerationOutput } from '../types';
import Spinner from './Spinner';
import { BeakerIcon, CopyIcon, CheckIcon } from './Icons';

interface TestGeneratorProps {
  onGenerateTests: () => void;
  isGeneratingTests: boolean;
  testOutput: TestGenerationOutput | null;
  language: SupportedLanguage;
}

const SUPPORTED_TEST_LANGUAGES = [SupportedLanguage.JavaScript, SupportedLanguage.Python];

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-4 pt-2">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="h-24 bg-black/20 rounded w-full mt-4"></div>
    </div>
);

const CodeBlock: React.FC<{ title: string; code: string }> = ({ title, code }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
        }
    }, [copied]);

    useEffect(() => {
        setCopied(false);
    }, [code]);

    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code);
        setCopied(true);
    };

    return (
        <div className="glass-effect rounded-lg mt-4">
        <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-b border-white/10 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
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
        <div className="p-4 max-h-[400px] overflow-y-auto">
            <pre><code className="text-sm text-gray-300 whitespace-pre-wrap">{code}</code></pre>
        </div>
        </div>
    );
};

const TestGenerator: React.FC<TestGeneratorProps> = ({ onGenerateTests, isGeneratingTests, testOutput, language }) => {
  if (!SUPPORTED_TEST_LANGUAGES.includes(language)) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="flex justify-center">
        <button
          onClick={onGenerateTests}
          disabled={isGeneratingTests}
          className="btn-transition inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-teal-400 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingTests ? <Spinner /> : <BeakerIcon />}
          <span className="ml-2">Generate Tests</span>
        </button>
      </div>

      {isGeneratingTests && (
         <div className="mt-6">
            <LoadingSkeleton />
         </div>
      )}
      
      {testOutput && !isGeneratingTests && (
        <div className="mt-6">
          <div className="p-4 glass-effect rounded-lg">
             <h3 className="text-lg font-semibold text-gray-300 mb-2">Setup & Run Instructions</h3>
             <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{testOutput.setupInstructions}</pre>
          </div>

          <CodeBlock title="Generated Test Code" code={testOutput.testCode} />
        </div>
      )}
    </div>
  );
};

export default TestGenerator;