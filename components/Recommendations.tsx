
import React from 'react';

interface RecommendationsProps {
  recommendations: string[];
  performance: { metric: string; value: string; assessment: 'GOOD' | 'FAIR' | 'POOR' }[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations, performance }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Actionable Recommendations
        </h3>
        <ul className="space-y-3">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-slate-300">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-bold text-emerald-500 border border-slate-700">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{rec}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {performance.map((p, idx) => (
            <div key={idx} className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">{p.metric}</div>
              <div className="text-xl font-bold text-slate-100">{p.value}</div>
              <div className={`text-[10px] mt-2 inline-block px-2 py-0.5 rounded font-bold ${
                p.assessment === 'GOOD' ? 'bg-emerald-900/30 text-emerald-400' :
                p.assessment === 'FAIR' ? 'bg-amber-900/30 text-amber-400' :
                'bg-rose-900/30 text-rose-400'
              }`}>
                {p.assessment}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
