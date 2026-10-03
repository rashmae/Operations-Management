/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { VideoPresentationPlayer } from './components/VideoPresentationPlayer';
import { MotionFXStudio } from './components/MotionFXStudio';
import { ManualAndWorkbookViewer } from './components/ManualAndWorkbookViewer';
import { TechnicalDefenseSimulator } from './components/TechnicalDefenseSimulator';
import { DataAndCodeInspector } from './components/DataAndCodeInspector';
import { SpeakerNotesViewer } from './components/SpeakerNotesViewer';
import { RubricAndChecklist } from './components/RubricAndChecklist';
import { Calendar, Clock, MapPin, Users, Award, Play, Sparkles, BookOpen, SlidersHorizontal } from 'lucide-react';
import { BaselineModelChoice, BASELINE_MODELS } from './data/forecastingData';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('presentation');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedBaseline, setSelectedBaseline] = useState<BaselineModelChoice>('wma3');

  const handleLaunchPresentation = () => {
    setActiveTab('presentation');
    setIsPlaying(prev => !prev);
  };

  const activeModelConfig = BASELINE_MODELS[selectedBaseline] || BASELINE_MODELS.wma3;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-300">
      {/* 3-Zone Clean Header with Dynamic Model Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLaunchPresentation={handleLaunchPresentation}
        isPlaying={isPlaying}
        selectedBaseline={selectedBaseline}
        onSelectBaseline={setSelectedBaseline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
        {/* Academic Presentation Notice Bar */}
        <div className="bg-[#0B2545]/70 border border-[#1B6CA8]/40 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Oct 8, 2026</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>9:00 AM – 12:00 PM</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>IE-PC 3112 · OM1 · BSIE 3-E</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-bold text-sky-300">Group 7 (D10 Port of LA Exports)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400">Baseline Locked:</span>
              <span className="font-bold text-[#F2A541]">{activeModelConfig.shortName}</span>
              <span className="text-emerald-400">({activeModelConfig.valMAPE.toFixed(2)}% Val MAPE)</span>
            </div>
            <button
              onClick={() => setActiveTab('motion')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-400/30 text-[11px] font-semibold hover:bg-sky-500/25 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Flourish & Napkin</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Video Presentation Player */}
        {activeTab === 'presentation' && (
          <VideoPresentationPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            selectedBaseline={selectedBaseline}
            onSelectBaseline={setSelectedBaseline}
          />
        )}

        {/* Tab 2: Motion FX Studio (Flourish, Napkin, Jitter) */}
        {activeTab === 'motion' && (
          <MotionFXStudio />
        )}

        {/* Tab 3: Official Course Activity Manual & Guidelines */}
        {activeTab === 'manual' && (
          <ManualAndWorkbookViewer 
            selectedBaseline={selectedBaseline}
            onSelectBaseline={setSelectedBaseline}
          />
        )}

        {/* Tab 4: Technical Defense Station */}
        {activeTab === 'defense' && (
          <TechnicalDefenseSimulator 
            selectedBaseline={selectedBaseline}
          />
        )}

        {/* Tab 5: Data & Models Inspector */}
        {activeTab === 'data' && (
          <DataAndCodeInspector 
            selectedBaseline={selectedBaseline}
            onSelectBaseline={setSelectedBaseline}
          />
        )}

        {/* Tab 6: Speaker Notes & Rehearsal */}
        {activeTab === 'scripts' && (
          <SpeakerNotesViewer 
            selectedBaseline={selectedBaseline}
          />
        )}

        {/* Tab 7: Rubric & Checklist */}
        {activeTab === 'checklist' && (
          <RubricAndChecklist />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 md:px-8 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Operations Management 1 (IE-PC 3112)</span>
            <span>·</span>
            <span>Cebu Technological University – Main Campus</span>
          </div>
          <div>
            Engr. Lyndrian Shalom R. Baclayon · D10: Port of Los Angeles Monthly Exports (TEUs) · Group 7
          </div>
        </div>
      </footer>
    </div>
  );
}
