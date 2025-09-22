import React from 'react';

interface RecentPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
}

const RecentPrompts: React.FC<RecentPromptsProps> = ({ prompts, onSelect }) => {
  if (prompts.length === 0) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrompt = e.target.value;
    if (selectedPrompt) {
      onSelect(selectedPrompt);
      e.target.value = '';
    }
  };

  return (
    <div>
      <label htmlFor="recent-prompts-select" className="block text-sm font-medium text-gray-300 mb-2">
        Recent Prompts
      </label>
      <select
        id="recent-prompts-select"
        onChange={handleChange}
        defaultValue=""
        className="w-full p-3 bg-gray-900/50 border border-white/20 rounded-lg text-gray-200 focus:border-purple-500 transition duration-200 appearance-none bg-no-repeat pr-10 glowing-border-focus"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="white" class="h-5 w-5" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>')`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        <option value="" disabled className="bg-gray-800">Select a past prompt...</option>
        {prompts.map((p, index) => (
          <option key={`${index}-${p}`} value={p} className="bg-gray-800">
            {p.length > 80 ? `${p.substring(0, 77)}...` : p}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RecentPrompts;