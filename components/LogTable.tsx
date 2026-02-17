
import React, { useState } from 'react';
import { LogEntry, Severity } from '../types';

interface LogTableProps {
  logs: LogEntry[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  const [filter, setFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesText = log.message.toLowerCase().includes(filter.toLowerCase()) || 
                       log.source?.toLowerCase().includes(filter.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesText && matchesSeverity;
  });

  const getSeverityStyle = (severity: Severity) => {
    switch (severity) {
      case Severity.INFO: return 'bg-blue-900/30 text-blue-400 border-blue-900';
      case Severity.WARNING: return 'bg-amber-900/30 text-amber-400 border-amber-900';
      case Severity.ERROR: return 'bg-rose-900/30 text-rose-400 border-rose-900';
      case Severity.CRITICAL: return 'bg-red-600 text-white border-red-700 font-bold';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-700 flex flex-wrap gap-4 items-center bg-slate-800/50 sticky top-0 z-10">
        <input 
          type="text" 
          placeholder="Filter logs by message or source..." 
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <select 
          className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-100"
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="ALL">All Severities</option>
          <option value="INFO">Info</option>
          <option value="WARNING">Warning</option>
          <option value="ERROR">Error</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <div className="text-xs text-slate-500 font-mono">
          Showing {filteredLogs.length} of {logs.length} entries
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider font-bold sticky top-0">
            <tr>
              <th className="px-4 py-3 border-b border-slate-700 w-48">Timestamp</th>
              <th className="px-4 py-3 border-b border-slate-700 w-24 text-center">Severity</th>
              <th className="px-4 py-3 border-b border-slate-700">Source / Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-700/30 transition-colors group">
                <td className="px-4 py-3 text-slate-400 font-mono text-xs whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityStyle(log.severity)}`}>
                    {log.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-emerald-400 text-[11px] mb-1 group-hover:text-emerald-300 transition-colors">
                    {log.source || 'SYSTEM'}
                  </div>
                  <div className="text-slate-300 leading-relaxed font-mono text-xs break-all">
                    {log.message}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogTable;
