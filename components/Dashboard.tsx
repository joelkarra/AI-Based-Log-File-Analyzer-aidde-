
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { AnalysisResult, Severity } from '../types';

interface DashboardProps {
  data: AnalysisResult;
}

const COLORS = {
  INFO: '#3b82f6',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  CRITICAL: '#be123c',
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const severityCounts = data.parsedLogs.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
  
  // Group logs by time (simple hour grouping for the demo)
  const timelineData = data.parsedLogs.map((log, idx) => ({
    time: log.timestamp.split(' ')[1] || `T${idx}`,
    severity: log.severity,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Quick Stats */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg col-span-1 lg:col-span-3">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">Executive Summary</h3>
        <p className="text-slate-300 leading-relaxed">{data.summary}</p>
      </div>

      {/* Severity Distribution */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-[400px]">
        <h3 className="text-lg font-semibold mb-6">Severity Distribution</h3>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {Object.keys(COLORS).map(s => (
            <div key={s} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[s as keyof typeof COLORS] }}></div>
              <span className="text-xs text-slate-400">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-[400px] overflow-hidden flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-rose-400">Security Threats</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {data.securityThreats.length > 0 ? data.securityThreats.map((threat, idx) => (
            <div key={idx} className="p-3 bg-slate-900 rounded-lg border-l-4 border-rose-500">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm text-rose-200">{threat.category}</span>
                <span className="px-2 py-0.5 bg-rose-900/30 text-rose-400 rounded text-[10px] font-mono tracking-tighter">
                  RISK: {threat.riskScore}/10
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{threat.details}</p>
              <div className="text-[10px] bg-slate-800 p-1.5 rounded text-emerald-400">
                <span className="font-bold">Mitigation:</span> {threat.mitigation}
              </div>
            </div>
          )) : (
            <div className="h-full flex items-center justify-center text-slate-500 italic">No threats detected</div>
          )}
        </div>
      </div>

      {/* Anomalies and Trends */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-[400px] flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-amber-400">Anomaly Detection</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {data.anomalies.map((anomaly, idx) => (
            <div key={idx} className="p-3 bg-slate-900 rounded-lg border-l-4 border-amber-500">
              <span className="block font-bold text-xs text-amber-200 mb-1 uppercase tracking-wide">{anomaly.type}</span>
              <p className="text-xs text-slate-400">{anomaly.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full" 
                    style={{ width: `${anomaly.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">{(anomaly.confidence * 100).toFixed(0)}% Confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
