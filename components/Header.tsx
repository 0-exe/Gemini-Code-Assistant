import React from 'react';

const Header: React.FC = () => (
  <header className="text-left py-4">
    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
      Gemini Code Generator
    </h1>
    <p className="mt-2 text-lg text-gray-300">
      Describe your code, select a language, and let Gemini do the rest.
    </p>
  </header>
);

export default Header;