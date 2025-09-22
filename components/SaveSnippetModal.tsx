import React, { useState } from 'react';
import { XMarkIcon } from './Icons';

interface SaveSnippetModalProps {
  onSave: (details: { title: string; description:string }) => void;
  onClose: () => void;
}

const SaveSnippetModal: React.FC<SaveSnippetModalProps> = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title, description });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="glass-effect rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Save Snippet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close">
            <XMarkIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="snippet-title" className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              id="snippet-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 bg-gray-900/50 border border-white/20 rounded-lg text-gray-200 glowing-border-focus"
              placeholder="e.g., React Login Form"
            />
          </div>
          <div>
            <label htmlFor="snippet-description" className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
            <textarea
              id="snippet-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 bg-gray-900/50 border border-white/20 rounded-lg text-gray-200 glowing-border-focus resize-none"
              placeholder="A short description of the code snippet"
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-transition px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-black/20 hover:bg-black/30">Cancel</button>
            <button type="submit" className="btn-transition px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveSnippetModal;