import React from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="mt-6 p-4 bg-red-500/10 backdrop-filter backdrop-blur-md border border-red-500/30 text-red-300 rounded-lg flex items-start space-x-3" role="alert">
    <div className="flex-shrink-0 text-red-400">
      <ExclamationTriangleIcon />
    </div>
    <div>
      <h3 className="font-bold">An Error Occurred</h3>
      <p className="text-sm mt-1">{message}</p>
    </div>
  </div>
);

export default ErrorDisplay;