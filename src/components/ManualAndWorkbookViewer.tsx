import React, { useState } from 'react';
import { 
  BookOpen, FileText, CheckCircle2, AlertTriangle, ShieldCheck, 
  Table, Code2, Download, ExternalLink, Sparkles, HelpCircle, 
  Layers, Users, ChevronRight, Award, FileSpreadsheet, Compass
} from 'lucide-react';
import { 
  GROUP_INFO, 
  TEAM_MEMBERS, 
  VALIDATION_METRICS, 
  DEVELOPMENT_CONVENTIONAL_COMPARISON,
  RAW_POLA_DATA,
  VALIDATION_TABLE,
  BaselineModelChoice,
  BASELINE_MODELS
} from '../data/forecastingData';

interface ManualAndWorkbookViewerProps {
  selectedBaseline?: BaselineModelChoice;
  onSelectBaseline?: (b: BaselineModelChoice) => void;
}

export const ManualAndWorkbookViewer: React.FC<ManualAndWorkbookViewerProps> = ({
  selectedBaseline = 'wma3',
  onSelectBaseline
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'part_v' | 'part_ix' | 'worksheet' | 'workbook_sheets' | 'python_glossary'>('overview');
  const activeModelConfig = BASELINE_MODELS[selectedBaseline] || BASELINE_MODELS.wma3;

  const downloadRawCSV = () => {
    const headers = "Date,Actual Value\n";
    const rows = RAW_POLA_DATA.map(r => `${r.date},${r.actual}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "D10_PortOfLA_Exports_Jan2022_Dec2024.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadMetricsCSV = () => {
    const headers = "Model,Category,MAE,MSE,RMSE,MAPE,SMAPE,MPE,Rank\n";
    const rows = VALIDATION_METRICS.map(
      m => `"${m.name}","${m.category}",${m.mae.toFixed(2)},${m.mse.toFixed(2)},${m.rmse.toFixed(2)},${m.mape.toFixed(2)},${m.smape.toFixed(2)},${m.mpe.toFixed(2)},${m.validationRank}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "D10_PortOfLA_Model_Comparison_Metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner: Official Course Manual Header */}
      <div className="p-6 rounded-2xl bg-[#0B2545]/90 border border-[#1B6CA8]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>OFFICIAL COURSE ACTIVITY MANUAL · IE-PC 3112</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-1">
            OM1 Applied Study 1 Manual: Real-Data Forecasting Decision Challenge
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Prepared by <strong>Engr. Lyndrian Shalom R. Baclayon</strong> · Cebu Technological University – Main Campus (BSIE 3-E, 1st Semester A.Y. 2026-2027). All 14 Parts, workbook requirements, and defense guidelines.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'overview' ? 'bg-[#1B6CA8] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Guidelines & Rules
          </button>

          <button
            onClick={() => setActiveSection('part_v')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'part_v' ? 'bg-[#1B6CA8] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Part V: Model Record
          </button>

          <button
            onClick={() => setActiveSection('part_ix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'part_ix' ? 'bg-[#1B6CA8] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Part IX: Comparison Tables
          </button>

          <button
            onClick={() => setActiveSection('worksheet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'worksheet' ? 'bg-[#1B6CA8] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Part VIII: Analysis Answers
          </button>

          <button
            onClick={() => setActiveSection('workbook_sheets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'workbook_sheets' ? 'bg-[#1B6CA8] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Workbook Sheets (01-09)
          </button>

          <button
            onClick={() => setActiveSection('python_glossary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'python_glossary' ? 'bg-[#F2A541] text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Python Glossary
          </button>
        </div>
      </div>

      {/* Quick Action Deliverable Downloads Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span><strong>Official Course Deliverables:</strong> Download pre-formatted submission datasets</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadRawCSV}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Raw Data CSV (36 Observations)</span>
          </button>
          <button
            onClick={downloadMetricsCSV}
            className="px-3 py-1.5 rounded-lg bg-[#1B6CA8] hover:bg-sky-500 text-white font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Table 18 Model Metrics CSV</span>
          </button>
        </div>
      </div>

      {/* ================= SECTION 1: MANUAL GUIDELINES & RULES ================= */}
      {activeSection === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Key Manual Rules Callout Box */}
          <div className="p-5 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Key Rule from Manual (Page 2)</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              "The forecasting method with the lowest error is not automatically the best Operations Management decision. Your group must interpret the evidence and defend its recommendation."
            </p>
          </div>

          {/* Fixed Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-xl p-5 shadow-lg space-y-2">
              <span className="text-xs font-mono text-sky-400 uppercase">Fixed Setting #1</span>
              <h4 className="text-base font-bold text-white">Conventional Models (Part IV)</h4>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 list-disc list-inside">
                <li>SMA: Exactly 3 periods.</li>
                <li>WMA: Exactly 3 periods with weights <strong>0.50, 0.30, 0.20</strong>.</li>
                <li>Exp Smoothing: Evaluate $\alpha = 0.20, 0.50, 0.80$ on development only.</li>
                <li>Trend: Linear time regression $y_t = a + b t$.</li>
              </ul>
            </div>

            <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-xl p-5 shadow-lg space-y-2">
              <span className="text-xs font-mono text-sky-400 uppercase">Fixed Setting #2</span>
              <h4 className="text-base font-bold text-white">Validation Protocol (Part III & VI)</h4>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 list-disc list-inside">
                <li>36 Observations: Months 1–30 (Dev) vs Months 31–36 (Validation).</li>
                <li><strong>No tuning after seeing the future</strong>: Model selection locked in Part V before validation.</li>
                <li>Lagged ML models: Exactly 3 lags (Lag 1, Lag 2, Lag 3).</li>
                <li>Random Forest: $n\_estimators=100, max\_depth=3, random\_state=42$.</li>
              </ul>
            </div>

            <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-xl p-5 shadow-lg space-y-2">
              <span className="text-xs font-mono text-sky-400 uppercase">Fixed Setting #3</span>
              <h4 className="text-base font-bold text-white">Defense & Evaluation (Part XI & XIII)</h4>
              <ul className="text-xs text-slate-300 space-y-1 pt-1 list-disc list-inside">
                <li>Group presentation: <strong>3 to 5 minutes limit</strong>.</li>
                <li>Technical defense: ~10 minutes.</li>
                <li>6 Metrics: MAE, MSE, RMSE, MAPE, SMAPE, MPE.</li>
                <li>Scoring: 4 pts Presentation + 6 pts Individual Defense = 10 pts (Total study = 100 pts).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: PART V MODEL SELECTION RECORD ================= */}
      {activeSection === 'part_v' && (
        <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                Part V · Model Selection Record (Page 5)
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Completed & Signed Conventional Baseline Record · Group 7
              </h3>
            </div>
            
            {/* Quick Switcher for Workbook Selection */}
            {onSelectBaseline && (
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 px-2 font-mono">Workbook Choice:</span>
                <button
                  onClick={() => onSelectBaseline('wma3')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedBaseline === 'wma3'
                      ? 'bg-[#1B6CA8] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3-Period WMA (6.41%)
                </button>
                <button
                  onClick={() => onSelectBaseline('es05')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    selectedBaseline === 'es05'
                      ? 'bg-[#1B6CA8] text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ETS α=0.50 (6.22%)
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-2.5 px-4 w-1/3">Required Item from Manual</th>
                  <th className="py-2.5 px-4 text-white">Group 7 Verified Response</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Group / Section</td>
                  <td className="py-2.5 px-4 text-white font-mono font-bold text-sky-300">Group 7 / BSIE 3-E</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Dataset Code</td>
                  <td className="py-2.5 px-4 text-sky-300 font-mono font-bold">D10 (Port of Los Angeles Monthly TEUs)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Variable Analyzed</td>
                  <td className="py-2.5 px-4 text-slate-200">Total Monthly Container Exports / Volume in TEUs (Twenty-Foot Equivalent Units)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Observation Frequency</td>
                  <td className="py-2.5 px-4 text-slate-200 font-mono">Monthly (Jan 2022 to Dec 2024 · 36 Real Observations)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Observed Data Pattern</td>
                  <td className="py-2.5 px-4 text-slate-200">
                    High seasonality with structural shock in Feb 2023 (Month 14: 236,263.50 TEUs, -32.0% unexpected dip), followed by strong non-linear post-strike rebound.
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">3-Period SMA Dev Result</td>
                  <td className="py-2.5 px-4 font-mono text-slate-200">MAE = 33,427.99 | RMSE = 41,927.81 | MAPE = 9.71%</td>
                </tr>
                <tr className={selectedBaseline === 'wma3' ? 'bg-sky-500/15 font-bold' : ''}>
                  <td className="py-2.5 px-4 font-semibold text-sky-400 flex items-center gap-1.5">
                    {selectedBaseline === 'wma3' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                    <span>3-Period WMA Dev Result (0.50, 0.30, 0.20)</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">
                    MAE = 32,141.60 | RMSE = 40,168.34 | MAPE = 9.31%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Exp Smoothing $\alpha = 0.20$</td>
                  <td className="py-2.5 px-4 font-mono text-slate-200">MAE = 32,093.23 | RMSE = 43,211.50 | MAPE = 9.48%</td>
                </tr>
                <tr className={selectedBaseline === 'es05' ? 'bg-sky-500/15 font-bold' : ''}>
                  <td className="py-2.5 px-4 font-semibold text-sky-400 flex items-center gap-1.5">
                    {selectedBaseline === 'es05' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                    <span>Exp Smoothing $\alpha = 0.50$ Dev Result</span>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-emerald-400 font-bold">
                    MAE = 30,595.71 | RMSE = 38,241.15 | MAPE = 8.92%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Exp Smoothing $\alpha = 0.80$</td>
                  <td className="py-2.5 px-4 font-mono text-slate-200">MAE = 32,183.02 | RMSE = 40,073.86 | MAPE = 9.66%</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Trend Projection Dev Result</td>
                  <td className="py-2.5 px-4 font-mono text-slate-200">
                    y_t = 411,620.96 - 2,216.33*t | MAE = 41,174.79 | MAPE = 10.36% (r = 0.06 near zero)
                  </td>
                </tr>
                <tr className="bg-sky-500/20 font-bold border-y-2 border-sky-400/50">
                  <td className="py-3 px-4 text-sky-300 text-sm">Selected Conventional OM Model</td>
                  <td className="py-3 px-4 text-white font-mono text-sm font-black">
                    {activeModelConfig.name}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-300">Reason for Selection</td>
                  <td className="py-2.5 px-4 text-slate-200 leading-relaxed">
                    {activeModelConfig.rationale} {activeModelConfig.operationalTradeoff}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Model Selection Declaration Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="font-bold text-sky-400 uppercase tracking-wider">Official Signed Declaration:</span>
            <p className="italic text-slate-200 leading-relaxed">
              "Before receiving the six validation observations, Group 7 selects <strong>{activeModelConfig.name}</strong> as our conventional OM forecasting baseline because it achieved low development error while offering smooth, auditable longshore labor gang requisitions without the dangerous over-reactivity of naive smoothing."
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-slate-400 font-mono text-[11px]">
              <span>Signatures: Aligato, Elaiza Jane · Ansay, Rash Mae Crystelle C. (Leader) · Villagracia, Mylene Joy</span>
              <span>•</span>
              <span>Date Submitted: October 7, 2026</span>
              <span>•</span>
              <span>Instructor: Engr. Lyndrian Shalom R. Baclayon</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 3: PART IX REQUIRED FINAL COMPARISON TABLES ================= */}
      {activeSection === 'part_ix' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Table 17: Python Model Comparison */}
          <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                Part IX · Table 17 (Page 14)
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Python Model Comparison (Validation Months 31–36)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-2.5 px-4">Model</th>
                    <th className="py-2.5 px-4">MAE</th>
                    <th className="py-2.5 px-4">MSE</th>
                    <th className="py-2.5 px-4">RMSE</th>
                    <th className="py-2.5 px-4 text-sky-300 font-bold">MAPE (%)</th>
                    <th className="py-2.5 px-4">SMAPE (%)</th>
                    <th className="py-2.5 px-4">MPE (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 text-white font-sans font-bold">ARIMA (1,1,1)</td>
                    <td className="py-2.5 px-4">24,274.04</td>
                    <td className="py-2.5 px-4">834,110,543.00</td>
                    <td className="py-2.5 px-4">28,880.97</td>
                    <td className="py-2.5 px-4 text-sky-300 font-bold">5.46%</td>
                    <td className="py-2.5 px-4">5.66%</td>
                    <td className="py-2.5 px-4 text-emerald-400">+4.18%</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 text-slate-200 font-sans">Lagged Linear Regression</td>
                    <td className="py-2.5 px-4">37,990.11</td>
                    <td className="py-2.5 px-4">1,727,189,190.00</td>
                    <td className="py-2.5 px-4">41,559.48</td>
                    <td className="py-2.5 px-4">8.48%</td>
                    <td className="py-2.5 px-4">8.93%</td>
                    <td className="py-2.5 px-4 text-emerald-400">+8.48%</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 text-red-300 font-sans">Random Forest (max_depth=3)</td>
                    <td className="py-2.5 px-4">50,027.88</td>
                    <td className="py-2.5 px-4">2,607,666,922.00</td>
                    <td className="py-2.5 px-4">51,065.32</td>
                    <td className="py-2.5 px-4 text-red-400 font-bold">11.19%</td>
                    <td className="py-2.5 px-4">11.88%</td>
                    <td className="py-2.5 px-4 text-red-400">+11.19%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 18: Finalist Accuracy Comparison */}
          <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
                Part IX · Table 18 (Page 14)
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Finalist Accuracy Comparison (Best Conventional vs ARIMA vs Best ML)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="py-2.5 px-4 font-sans">Finalist Approach</th>
                    <th className="py-2.5 px-4">MAE</th>
                    <th className="py-2.5 px-4">MSE</th>
                    <th className="py-2.5 px-4">RMSE</th>
                    <th className="py-2.5 px-4 text-sky-300 font-bold">MAPE (%)</th>
                    <th className="py-2.5 px-4">SMAPE (%)</th>
                    <th className="py-2.5 px-4">MPE (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  <tr className="bg-sky-500/10 font-bold">
                    <td className="py-2.5 px-4 text-white font-sans flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      <span>Best Conventional: 3-Period WMA</span>
                    </td>
                    <td className="py-2.5 px-4">28,473.35</td>
                    <td className="py-2.5 px-4">1,086,514,040.25</td>
                    <td className="py-2.5 px-4">32,962.31</td>
                    <td className="py-2.5 px-4 text-sky-300">6.41%</td>
                    <td className="py-2.5 px-4">6.66%</td>
                    <td className="py-2.5 px-4 text-emerald-400">+4.12%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-200 font-sans">Statistical: ARIMA (1,1,1)</td>
                    <td className="py-2.5 px-4">24,274.04</td>
                    <td className="py-2.5 px-4">834,110,543.00</td>
                    <td className="py-2.5 px-4">28,880.97</td>
                    <td className="py-2.5 px-4">5.46%</td>
                    <td className="py-2.5 px-4">5.66%</td>
                    <td className="py-2.5 px-4 text-emerald-400">+4.18%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-200 font-sans">Best ML: Lagged Linear Regression</td>
                    <td className="py-2.5 px-4">37,990.11</td>
                    <td className="py-2.5 px-4">1,727,189,190.00</td>
                    <td className="py-2.5 px-4">41,559.48</td>
                    <td className="py-2.5 px-4">8.48%</td>
                    <td className="py-2.5 px-4">8.93%</td>
                    <td className="py-2.5 px-4 text-emerald-400">+8.48%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Finalist Operational Trade-Offs (Required by Manual) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-sans text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400">3-Period WMA Trade-Off:</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Advantage:</strong> Fast, auditable, runs natively in spreadsheets with zero code failure risk.<br />
                  <strong>Limitation:</strong> Requires consecutive historical data; cannot anticipate sudden policy walkouts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400">ARIMA (1,1,1) Trade-Off:</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Advantage:</strong> Highest mathematical accuracy (5.46% MAPE).<br />
                  <strong>Limitation:</strong> Opaque statistical parameters for terminal dock foremen; sensitive to model order drift.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-400">Random Forest Trade-Off:</span>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Advantage:</strong> Non-linear decision trees.<br />
                  <strong>Limitation:</strong> Overfits small $N=30$ series; collapsed to 11.19% MAPE because trees cannot extrapolate outside bounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 4: PART VIII STUDENT ANALYSIS WORKSHEET ================= */}
      {activeSection === 'worksheet' && (
        <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
              Part VIII · Student Analysis Worksheet (Page 13)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Synthesized Operational Responses Across All 6 Domains
            </h3>
          </div>

          <div className="space-y-4">
            {/* Domain A */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                A. Operational Context & Data Understanding
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>1–5 Summary:</strong> Dataset D10 measures monthly container volume at the Port of Los Angeles in TEUs. Accurate forecasts govern longshore gang shift scheduling ($42k/shift) and berth dwell times to avoid demurrage ($50k+/day). The time series displays pronounced cyclical volatility, marked by a catastrophic structural shock in Feb 2023 (Month 14: 236,263.50 TEUs, a 32% drop). This non-linearity proves that simple static linear models are inappropriate.
              </p>
            </div>

            {/* Domain B */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                B. Conventional Forecasting
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>1–5 Summary:</strong> 3-Period WMA ($0.50, 0.30, 0.20$) outperformed SMA and Trend with a 9.31% development MAPE and 40,168 RMSE (with ES α=0.50 achieving 8.92% MAPE). Trend projection failed because the Feb 2023 shock created a negative slope (-2,216 TEUs/month), which falsely predicted declining volumes during late 2024's strong surge. Group 7 locked in their conventional baseline in Part V prior to seeing validation data.
              </p>
            </div>

            {/* Domain C */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                C. Validation & Evaluation Metrics
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>1–4 Summary:</strong> On the unseen 6 validation months (July–Dec 2024), WMA delivered a solid 6.41% MAPE, while Random Forest struggled at 11.19% and Trend collapsed to 24.15%. All 6 metrics show complementary value: MAE shows physical container error (~28,473 TEUs), RMSE penalizes large misses, and positive MPE (+4.12%) proves a safe, conservative under-forecast bias.
              </p>
            </div>

            {/* Domain D */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                D. Python-Assisted Forecasting
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>1–5 Summary:</strong> ARIMA order $(1,1,1)$ was selected via lowest AIC on training data, modeling first-order differencing and autoregression. Random Forest failed to beat WMA because tree ensembles cannot extrapolate values above their training maximum ($466k$) on small sample sizes ($N=30$).
              </p>
            </div>

            {/* Domain E */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                E. Final Model Comparison & OM Decision
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>Recommendation:</strong> Deploy <strong>3-Period WMA ($0.50, 0.30, 0.20$)</strong> for standard operations management. While ARIMA achieved slightly lower numerical MAPE (5.46% vs 6.41%), WMA is completely transparent, auditable by port supervisors without software dependencies, and avoids black-box calculation failures.
              </p>
            </div>

            {/* Domain F */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                F. Industry 5.0 and Human Oversight
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong>Human-in-the-Loop Protocol:</strong> Algorithmic forecasting automates baseline demand calculations. However, human terminal executives must exercise override authority during external macroeconomic shocks: labor union contract votes (ILWU), tariff deadlines, or maritime corridor chokepoints (Red Sea rerouting). <em>Data predicts the tide; human engineers steer the ship.</em>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: RECOMMENDED WORKBOOK SHEETS ================= */}
      {activeSection === 'workbook_sheets' && (
        <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">
              Part XII · Section 20 (Page 15)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Recommended Conventional Workbook Sheets (Sheets 01 to 09)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Per the manual: "Submit the actual workbook, not screenshots. Every reported value must be traceable to a formula or software output."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: '01_RAW_DATA', desc: 'Raw 36-month Port of LA TEU observations with Date & Actual Value headers.' },
              { id: '02_DATA_VISUALIZATION', desc: 'Time series plot showing upward growth, Feb 2023 shock, and late 2024 recovery.' },
              { id: '03_MOVING_AVERAGE', desc: 'Formulas for fixed 3-period SMA across development and validation.' },
              { id: '04_WEIGHTED_MOVING_AVERAGE', desc: 'Formulas for fixed 3-period WMA with weights 0.50, 0.30, 0.20.' },
              { id: '05_EXP_SMOOTHING', desc: 'Formulas for Exponential Smoothing with alphas 0.20, 0.50, and 0.80.' },
              { id: '06_TREND_REGRESSION', desc: 'Slope, intercept, and linear trend projection formulas on development data.' },
              { id: '07_MODEL_DEVELOPMENT', desc: 'In-sample comparative evaluation table for baseline selection.' },
              { id: '08_VALIDATION', desc: 'Rolling 1-period-ahead evaluation on held-out Months 31 to 36.' },
              { id: '09_FINAL_COMPARISON', desc: 'Comprehensive 6-metric summary table comparing all conventional and ML models.' }
            ].map(sheet => (
              <div key={sheet.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-white">{sheet.id}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {sheet.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 6: PYTHON GLOSSARY & DEFENSE APPENDIX ================= */}
      {activeSection === 'python_glossary' && (
        <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-mono text-[#F2A541] uppercase tracking-wider">
              Appendix B · Beginner Python Glossary (Page 17–18)
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Technical Terms & Code Explanations for Defense
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { term: 'CSV', meaning: 'A simple text-based table file in which values are separated by commas.' },
              { term: 'DataFrame', meaning: 'A 2D labeled data structure used by pandas, similar to an Excel worksheet.' },
              { term: 'Training Data', meaning: 'Historical observations (Months 1–30) used to fit or construct the forecast model.' },
              { term: 'Validation Data', meaning: 'Held-out observations (Months 31–36) used to test how well the model performs on unseen future periods.' },
              { term: 'Lag 1, 2, 3', meaning: 'The value from one, two, or three periods earlier used as explanatory input features.' },
              { term: '.fit()', meaning: 'Tells a statistical or machine learning model to estimate its parameters from the training data.' },
              { term: '.predict()', meaning: 'Requests forecast predictions from a previously fitted machine learning model.' },
              { term: 'forecast()', meaning: 'Requests future out-of-sample values from a time-series model such as ARIMA.' },
              { term: 'AIC (Akaike Info Criterion)', meaning: 'A measure used to compare candidate ARIMA orders while balancing goodness of fit and complexity. Lower is preferred.' },
              { term: 'random_state = 42', meaning: 'A fixed random seed that guarantees identical, reproducible Random Forest results across runs.' }
            ].map(item => (
              <div key={item.term} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="font-mono text-xs font-bold text-sky-300">{item.term}</span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.meaning}</p>
              </div>
            ))}
          </div>

          {/* Final Reminder from Manual Page 18 */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200">
            <span className="font-bold text-[#F2A541] uppercase block mb-1">Final Reminder (Manual Page 18):</span>
            "The purpose of this applied study is not to prove that AI is better. The purpose is to determine, using real data and verified evidence, which forecasting approach is appropriate for the operation and to defend that decision as an Industrial Engineer."
          </div>
        </div>
      )}
    </div>
  );
};
