import React, { useState, useCallback, useEffect } from 'react';
import { SupportedLanguage, SavedSnippet, TestGenerationOutput, UploadedFile } from './types';
import { generateCode, getPromptSuggestions, getRecommendations, generateTests } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import LanguageSelector from './components/LanguageSelector';
import ActionButtons from './components/ActionButtons';
import CodeOutput from './components/CodeOutput';
import ErrorDisplay from './components/ErrorDisplay';
import RecentPrompts from './components/RecentPrompts';
import Recommendations from './components/Recommendations';
import SaveSnippetModal from './components/SaveSnippetModal';
import SavedSnippets from './components/SavedSnippets';
import TestGenerator from './components/TestGenerator';
import FileUpload from './components/FileUpload';
import { BookmarkIcon } from './components/Icons';
import PromptSuggestionsModal from './components/PromptSuggestionsModal';

const RECENT_PROMPTS_KEY = 'gemini-code-gen-recent-prompts';
const SAVED_SNIPPETS_KEY = 'gemini-code-gen-saved-snippets';
const MAX_RECENT_PROMPTS = 10;

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>(SupportedLanguage.Python);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [isRecommending, setIsRecommending] = useState<boolean>(false);
  const [generatedTests, setGeneratedTests] = useState<TestGenerationOutput | null>(null);
  const [isGeneratingTests, setIsGeneratingTests] = useState<boolean>(false);
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [showSavedSnippets, setShowSavedSnippets] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState<boolean>(false);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);


  useEffect(() => {
    try {
      const storedPrompts = localStorage.getItem(RECENT_PROMPTS_KEY);
      if (storedPrompts) {
        setRecentPrompts(JSON.parse(storedPrompts));
      }
      const storedSnippets = localStorage.getItem(SAVED_SNIPPETS_KEY);
      if (storedSnippets) {
        setSavedSnippets(JSON.parse(storedSnippets));
      }
    } catch (err) {
      console.error("Failed to load data from localStorage", err);
    }
  }, []);

  const updateAndPersistSnippets = (newSnippets: SavedSnippet[]) => {
    setSavedSnippets(newSnippets);
    try {
      localStorage.setItem(SAVED_SNIPPETS_KEY, JSON.stringify(newSnippets));
    } catch (err) {
      console.error("Failed to save snippets to localStorage", err);
    }
  };

  const addPromptToRecent = useCallback((currentPrompt: string) => {
    if (!currentPrompt || currentPrompt.trim() === '') return;

    setRecentPrompts(prevPrompts => {
      const newPrompts = [currentPrompt, ...prevPrompts.filter(p => p.toLowerCase() !== currentPrompt.toLowerCase())];
      const limitedPrompts = newPrompts.slice(0, MAX_RECENT_PROMPTS);

      try {
        localStorage.setItem(RECENT_PROMPTS_KEY, JSON.stringify(limitedPrompts));
      } catch (err) {
        console.error("Failed to save recent prompts to localStorage", err);
      }

      return limitedPrompts;
    });
  }, []);

  const handleSelectRecentPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  const handleGenerateCode = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a code request.');
      return;
    }
    addPromptToRecent(prompt);
    setIsLoading(true);
    setError(null);
    setGeneratedCode('');
    setRecommendations(null);
    setGeneratedTests(null);

    try {
      const code = await generateCode(prompt, language, uploadedFile);
      setGeneratedCode(code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, language, uploadedFile, addPromptToRecent]);

  const handleGetPromptSuggestions = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt to get suggestions.');
      return;
    }
    addPromptToRecent(prompt);
    setIsRefining(true);
    setError(null);
    setPromptSuggestions([]);
    setIsSuggestionsModalOpen(true);
  
    try {
      const suggestions = await getPromptSuggestions(prompt);
      setPromptSuggestions(suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while getting suggestions.');
      setIsSuggestionsModalOpen(false); // Close modal on error
    } finally {
      setIsRefining(false);
    }
  }, [prompt, addPromptToRecent]);
  
  const handleSelectSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setIsSuggestionsModalOpen(false);
  };

  const handleGetRecommendations = useCallback(async () => {
    if (!generatedCode) {
        setError('No code to get recommendations for.');
        return;
    }
    setIsRecommending(true);
    setError(null);
    setRecommendations(null);

    try {
        const result = await getRecommendations(generatedCode, language);
        setRecommendations(result);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while getting recommendations.');
    } finally {
        setIsRecommending(false);
    }
  }, [generatedCode, language]);

  const handleGenerateTests = useCallback(async () => {
    if (!generatedCode) {
      setError('No code available to generate tests for.');
      return;
    }
    setIsGeneratingTests(true);
    setError(null);
    setGeneratedTests(null);

    try {
        const result = await generateTests(generatedCode, language);
        setGeneratedTests(result);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while generating tests.');
    } finally {
        setIsGeneratingTests(false);
    }
  }, [generatedCode, language]);

  const handleClear = () => {
    setPrompt('');
    setGeneratedCode('');
    setError(null);
    setRecommendations(null);
    setGeneratedTests(null);
    setUploadedFile(null);
    const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };

  const handleSaveSnippet = ({ title, description }: { title: string; description: string }) => {
    if (!generatedCode) return;
    const newSnippet: SavedSnippet = {
      id: crypto.randomUUID(),
      title,
      description,
      prompt,
      code: generatedCode,
      language,
      createdAt: new Date().toISOString(),
    };
    const updatedSnippets = [...savedSnippets, newSnippet].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    updateAndPersistSnippets(updatedSnippets);
    setIsSaveModalOpen(false);
  };
  
  const handleDeleteSnippet = (snippetId: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      const updatedSnippets = savedSnippets.filter(s => s.id !== snippetId);
      updateAndPersistSnippets(updatedSnippets);
    }
  };

  const handleLoadSnippet = (snippet: SavedSnippet) => {
    setPrompt(snippet.prompt);
    setLanguage(snippet.language);
    setGeneratedCode(snippet.code);
    setError(null);
    setRecommendations(null);
    setGeneratedTests(null);
    setShowSavedSnippets(false);
  };

  const isClearDisabled = !prompt && !generatedCode && !error && !recommendations && !generatedTests && !uploadedFile;

  return (
    <div className="min-h-screen text-gray-200 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-start">
            <Header />
            <button 
              onClick={() => setShowSavedSnippets(true)}
              className="btn-transition inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-gray-300 bg-black/20 hover:bg-black/30 transition duration-200"
              aria-label={`View ${savedSnippets.length} saved snippets`}
            >
              <BookmarkIcon />
              <span className="ml-2 hidden sm:inline">Saved Snippets</span>
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-purple-100 bg-purple-600 rounded-full">{savedSnippets.length}</span>
            </button>
        </div>
        <main className="mt-8 glass-effect rounded-xl p-6 md:p-8">
          <div className="space-y-6">
            <PromptInput value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <FileUpload 
              file={uploadedFile}
              onFileChange={setUploadedFile}
              onFileRemove={() => setUploadedFile(null)}
            />
            <RecentPrompts prompts={recentPrompts} onSelect={handleSelectRecentPrompt} />
            <LanguageSelector value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)} />
            <ActionButtons
              onGenerate={handleGenerateCode}
              onRefine={handleGetPromptSuggestions}
              onClear={handleClear}
              isGenerating={isLoading}
              isRefining={isRefining}
              isClearDisabled={isClearDisabled}
            />
          </div>

          {error && <div className="fade-in-slide-up"><ErrorDisplay message={error} /></div>}

          {(isLoading || generatedCode) && (
            <div className="mt-8 pt-6 border-t border-white/10 fade-in-slide-up">
                <CodeOutput 
                  code={generatedCode} 
                  isLoading={isLoading} 
                  language={language}
                  onSaveClick={() => setIsSaveModalOpen(true)}
                />
            </div>
          )}
          
          {generatedCode && !isLoading && (
            <div className="fade-in-slide-up">
              <Recommendations
                onGetRecommendations={handleGetRecommendations}
                recommendations={recommendations}
                isRecommending={isRecommending}
              />
              <TestGenerator
                onGenerateTests={handleGenerateTests}
                isGeneratingTests={isGeneratingTests}
                testOutput={generatedTests}
                language={language}
              />
            </div>
          )}
        </main>
        <footer className="text-center mt-8 text-gray-400 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
      {isSaveModalOpen && (
        <SaveSnippetModal
          onSave={handleSaveSnippet}
          onClose={() => setIsSaveModalOpen(false)}
        />
      )}
      {showSavedSnippets && (
        <SavedSnippets
          snippets={savedSnippets}
          onLoad={handleLoadSnippet}
          onDelete={handleDeleteSnippet}
          onClose={() => setShowSavedSnippets(false)}
        />
      )}
      {isSuggestionsModalOpen && (
        <PromptSuggestionsModal
          isLoading={isRefining}
          suggestions={promptSuggestions}
          onClose={() => setIsSuggestionsModalOpen(false)}
          onSelect={handleSelectSuggestion}
        />
      )}
    </div>
  );
};

export default App;