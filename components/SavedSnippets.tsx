import React from 'react';
import { SavedSnippet } from '../types';
import { TrashIcon, XMarkIcon } from './Icons';

interface SavedSnippetsProps {
  snippets: SavedSnippet[];
  onLoad: (snippet: SavedSnippet) => void;
  onDelete: (snippetId: string) => void;
  onClose: () => void;
}

const SavedSnippets: React.FC<SavedSnippetsProps> = ({ snippets, onLoad, onDelete, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="glass-effect rounded-xl w-full max-w-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex justify-between items-center p-4 border-b border-white/10 sticky top-0 bg-gray-800/50 backdrop-blur-lg">
          <h2 className="text-xl font-bold text-white">Saved Snippets</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <XMarkIcon />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {snippets.length > 0 ? (
            <ul className="space-y-4">
              {snippets.map(snippet => (
                <li key={snippet.id} className="bg-black/20 p-4 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-purple-300">{snippet.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{snippet.description || 'No description provided.'}</p>
                      <div className="text-xs text-gray-500 mt-2 space-x-4">
                        <span>{snippet.language}</span>
                        <span>•</span>
                        <span>{formatDate(snippet.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <button onClick={() => onLoad(snippet)} className="btn-transition px-3 py-1 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">Load</button>
                      <button onClick={() => onDelete(snippet.id)} className="btn-transition p-2 text-gray-400 hover:text-red-400" aria-label="Delete snippet">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400">You have no saved snippets.</p>
              <p className="text-sm text-gray-500 mt-2">Generate some code and click the save icon to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedSnippets;