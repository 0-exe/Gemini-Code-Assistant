import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
      Your Code Request
    </label>
    <textarea
      id="prompt-input"
      value={value}
      onChange={onChange}
      placeholder="e.g., 'Create a responsive navigation bar with a logo and three links'"
      className="w-full h-32 p-3 bg-gray-900/50 border border-white/20 rounded-lg text-gray-200 placeholder-gray-400 focus:border-purple-500 transition duration-200 resize-none glowing-border-focus"
    />
  </div>
);

export default PromptInput;