import React from 'react';
import Spinner from './Spinner';
import { LightBulbIcon } from './Icons';

interface RecommendationsProps {
  recommendations: string | null;
  isRecommending: boolean;
  onGetRecommendations: () => void;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-3 pt-2">
      <div className="h-4 bg-white/10 rounded w-3/4"></div>
      <div className="h-4 bg-white/10 rounded w-full"></div>
      <div className="h-4 bg-white/10 rounded w-5/6"></div>
    </div>
  );

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, isRecommending, onGetRecommendations }) => {
  return (
    <div className="mt-8 pt-6 border-t border-white/10">
      <div className="flex justify-center">
        <button
          onClick={onGetRecommendations}
          disabled={isRecommending}
          className="btn-transition inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecommending ? <Spinner /> : <LightBulbIcon />}
          <span className="ml-2">Suggest Improvements</span>
        </button>
      </div>

      {(isRecommending || recommendations) && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Recommendations</h3>
          <div className="p-4 glass-effect rounded-lg min-h-[150px]">
          {isRecommending ? (
            <LoadingSkeleton />
          ) : (
            <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: recommendations || '' }} />
          )}
        </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;