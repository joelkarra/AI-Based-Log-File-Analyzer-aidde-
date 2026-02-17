
import React, { useState, useCallback } from 'react';
import { analyzeLogs } from './services/geminiService';
import { AnalysisResult } from './types';
import Dashboard from './components/Dashboard';
import LogTable from './components/LogTable';
import Recommendations from './components/Recommendations';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const analysis = await analyzeLogs(text);
      setResult(analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze log file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Log File Analyzer</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Intelligence Powered Log Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className={`
              cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${loading ? 'bg-slate-800 text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'}
            `}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {loading ? 'Analyzing...' : 'Upload Log File'}
              <input type="file" className="hidden" onChange={handleFileUpload} disabled={loading} accept=".log,.txt,.csv,.json" />
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 pt-8 flex-1">
        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
              <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Ready to audit your logs</h2>
            <p className="text-slate-500 max-w-md">
              Upload Apache, Nginx, System, or Application logs (CSV, JSON, TXT). 
              Log File Analyzer will parse, structure, and identify security threats automatically.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500/20 border-t-emerald-500"></div>
            <div className="text-slate-400 font-medium">Processing large log dataset...</div>
            <div className="text-[10px] text-slate-600 uppercase tracking-widest animate-pulse">Parsing • Normalizing • Scanning • Detecting</div>
          </div>
        )}

        {error && (
          <div className="bg-rose-900/20 border border-rose-500/50 text-rose-200 p-4 rounded-xl mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button 
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={() => setActiveTab('overview')}
              >
                Analytics Dashboard
                {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400"></div>}
              </button>
              <button 
                className={`px-6 py-3 text-sm font-semibold transition-all relative ${activeTab === 'logs' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                onClick={() => setActiveTab('logs')}
              >
                Structured Log View
                {activeTab === 'logs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400"></div>}
              </button>
            </div>

            {activeTab === 'overview' ? (
              <>
                <Dashboard data={result} />
                <Recommendations recommendations={result.recommendations} performance={result.performanceInsights} />
              </>
            ) : (
              <LogTable logs={result.parsedLogs} />
            )}
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 border-t border-slate-900 text-center">
        <p className="text-xs text-slate-600 font-medium">
          Enterprise Log Security Audit Platform
        </p>
      </footer>
    </div>
  );
};

export default App;
