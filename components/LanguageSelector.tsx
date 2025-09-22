import React from 'react';
import { SupportedLanguage } from '../types';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="language-select" className="block text-sm font-medium text-gray-300 mb-2">
      Language
    </label>
    <select
      id="language-select"
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-gray-900/50 border border-white/20 rounded-lg text-gray-200 focus:border-purple-500 transition duration-200 glowing-border-focus"
    >
      {Object.values(SupportedLanguage).map((lang) => (
        <option key={lang} value={lang} className="bg-gray-800">
          {lang}
        </option>
      ))}
    </select>
  </div>
);

export default LanguageSelector;