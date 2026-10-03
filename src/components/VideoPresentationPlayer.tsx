import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX, 
  Maximize, Minimize, Clock, Users, ArrowRight, CheckCircle2, AlertTriangle, 
  TrendingUp, BarChart3, ShieldAlert, Sparkles, Layers, Sliders, Anchor, Ship,
  Eye, HelpCircle, ChevronRight, Award, Compass, Waves, Box, ExternalLink
} from 'lucide-react';
import { getPresentationBeats, SlideBeat, TOTAL_PRESENTATION_SECONDS } from '../data/presentationSlides';
import { 
  FULL_TIME_SERIES, 
  VALIDATION_METRICS, 
  DEVELOPMENT_CONVENTIONAL_COMPARISON,
  GROUP_INFO,
  TEAM_MEMBERS,
  BaselineModelChoice,
  BASELINE_MODELS
} from '../data/forecastingData';

// Authentic maritime photography generated for Port of LA briefing
const POLA_TERMINAL_IMG = '/src/assets/images/pola_container_terminal_1791024986178.jpg';
const CARGO_SHIP_IMG = '/src/assets/images/cargo_ship_breakwater_1791024998811.jpg';
const CONTAINER_YARD_IMG = '/src/assets/images/container_yard_twilight_1791025012665.jpg';
const COMMAND_CENTER_IMG = '/src/assets/images/operations_analytics_command_1790930073715.jpg';
const PORT_CONTROL_PLANNER_IMG = '/src/assets/images/port_control_planner_1791028044582.jpg';
const TEAM_IMG = '/src/assets/images/industrial_engineers_team_1790930090538.jpg';

interface VideoPresentationPlayerProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBaseline?: BaselineModelChoice;
  onSelectBaseline?: (b: BaselineModelChoice) => void;
}

export const VideoPresentationPlayer: React.FC<VideoPresentationPlayerProps> = ({
  isPlaying,
  setIsPlaying,
  selectedBaseline = 'wma3',
  onSelectBaseline
}) => {
  const activeModelConfig = BASELINE_MODELS[selectedBaseline] || BASELINE_MODELS.wma3;
  const presentationBeats = getPresentationBeats(selectedBaseline);

  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [beatElapsedTime, setBeatElapsedTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isAudioRehearsalOn, setIsAudioRehearsalOn] = useState(false); // Default silent for live presenter!
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPresenterCues, setShowPresenterCues] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentBeat: SlideBeat = presentationBeats[currentBeatIndex] || presentationBeats[0];

  // Calculate total elapsed seconds across beats
  const getElapsedTotalSeconds = () => {
    let elapsed = 0;
    for (let i = 0; i < currentBeatIndex; i++) {
      elapsed += presentationBeats[i].durationSeconds;
    }
    return elapsed + beatElapsedTime;
  };

  const currentTotalSeconds = Math.min(getElapsedTotalSeconds(), TOTAL_PRESENTATION_SECONDS);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Rehearsal synthetic voice
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isPlaying && isAudioRehearsalOn) {
      const utterance = new SpeechSynthesisUtterance(currentBeat.liveSpeakerPrompt);
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
      if (naturalVoice) utterance.voice = naturalVoice;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentBeatIndex, isPlaying, isAudioRehearsalOn, playbackSpeed]);

  // Main playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setBeatElapsedTime(prev => {
          const next = prev + 0.25 * playbackSpeed;
          if (next >= currentBeat.durationSeconds) {
            if (currentBeatIndex < presentationBeats.length - 1) {
              setCurrentBeatIndex(i => i + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return currentBeat.durationSeconds;
            }
          }
          return next;
        });
      }, 250);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentBeatIndex, currentBeat.durationSeconds, playbackSpeed, setIsPlaying, presentationBeats]);

  const handleSeek = (targetTotalSeconds: number) => {
    let accumulated = 0;
    for (let i = 0; i < presentationBeats.length; i++) {
      const beatDur = presentationBeats[i].durationSeconds;
      if (targetTotalSeconds <= accumulated + beatDur || i === presentationBeats.length - 1) {
        setCurrentBeatIndex(i);
        setBeatElapsedTime(Math.max(0, targetTotalSeconds - accumulated));
        return;
      }
      accumulated += beatDur;
    }
  };

  const handleNextBeat = () => {
    if (currentBeatIndex < presentationBeats.length - 1) {
      setCurrentBeatIndex(prev => prev + 1);
      setBeatElapsedTime(0);
    }
  };

  const handlePrevBeat = () => {
    if (beatElapsedTime > 2) {
      setBeatElapsedTime(0);
    } else if (currentBeatIndex > 0) {
      setCurrentBeatIndex(prev => prev - 1);
      setBeatElapsedTime(0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard shortcut for presentation control (Space = play/pause, Left/Right = beats)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextBeat();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevBeat();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Determine current image backdrop
  const getBackdropImage = () => {
    switch (currentBeat.visualMode) {
      case 'hook_intro':
        return CARGO_SHIP_IMG;
      case 'stakes_counter':
        return POLA_TERMINAL_IMG;
      case 'trend_anomaly':
        return CONTAINER_YARD_IMG;
      case 'contenders_race':
        return POLA_TERMINAL_IMG;
      case 'round_one_verdict':
        return COMMAND_CENTER_IMG;
      case 'ml_challengers':
        return CARGO_SHIP_IMG;
      case 'blind_test_reveal':
        return CONTAINER_YARD_IMG;
      case 'amber_plot_twist':
        return CONTAINER_YARD_IMG;
      case 'level_shift_bars':
        return CONTAINER_YARD_IMG;
      case 'om_recommendation_control_room':
        return PORT_CONTROL_PLANNER_IMG;
      case 'limitations_oversight':
        return TEAM_IMG;
      case 'closing_recommendation':
        return CARGO_SHIP_IMG;
      default:
        return POLA_TERMINAL_IMG;
    }
  };

  // Progression fraction of current beat (0 to 1)
  const beatProgress = Math.min(1, beatElapsedTime / currentBeat.durationSeconds);
  const isAmberMode = currentBeat.themeColor === 'amber';

  // Dynamic progressive drawing for Flourish-style time series animation
  // In Beat 3: reveals months 1 to 30 gradually as beatProgress goes 0 -> 1
  const beat3VisibleMonths = Math.min(30, Math.max(3, Math.floor(beatProgress * 30) + 1));
  
  // In Beat 7: reveals months 31 to 36 gradually
  const beat7VisibleMonths = Math.min(36, 30 + Math.max(1, Math.floor(beatProgress * 6) + 1));

  return (
    <div className="space-y-6">
      {/* Upper Status Banner with Presentation Rules */}
      <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1B6CA8]/20 border border-[#1B6CA8]/40 text-[#1B6CA8]">
            <Ship className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-[#1B6CA8]/30 text-sky-300 border border-sky-500/30">
                D10 Presentation Briefing
              </span>
              <span className="text-xs font-semibold text-slate-300">
                3 to 4 Minutes Total Runtime (Currently {formatTime(TOTAL_PRESENTATION_SECONDS)})
              </span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
              Port of Los Angeles Monthly Exports (TEUs) · Group 7 (BSIE 3-E)
            </h2>
          </div>
        </div>

        {/* Live Presenter / Rehearsal Audio Switch & Baseline Model Selector */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
          {onSelectBaseline && (
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => onSelectBaseline('wma3')}
                className={`px-2 py-1 rounded font-bold transition-all ${selectedBaseline === 'wma3' ? 'bg-[#1B6CA8] text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                3-Period WMA
              </button>
              <button
                onClick={() => onSelectBaseline('es05')}
                className={`px-2 py-1 rounded font-bold transition-all ${selectedBaseline === 'es05' ? 'bg-[#1B6CA8] text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                ETS (α=0.50)
              </button>
            </div>
          )}

          <button
            onClick={() => setShowPresenterCues(!showPresenterCues)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
              showPresenterCues 
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPresenterCues ? 'Hide Notes' : 'Show Notes'}</span>
          </button>

          <button
            onClick={() => setIsAudioRehearsalOn(!isAudioRehearsalOn)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
              isAudioRehearsalOn 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle synthesized voice narration for solo practice rehearsal"
          >
            {isAudioRehearsalOn ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAudioRehearsalOn ? 'Rehearsal Voice: ON' : 'Live Mode (Silent)'}</span>
          </button>
        </div>
      </div>

      {/* Main 16:9 Motion Graphics Infographic Stage */}
      <div 
        ref={containerRef}
        className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl transition-all border ${
          isAmberMode 
            ? 'border-[#F2A541] ring-2 ring-[#F2A541]/40' 
            : 'border-[#1B6CA8]/50 ring-1 ring-[#1B6CA8]/30'
        } bg-[#0B2545]`}
        style={{ minHeight: '480px' }}
      >
        {/* Background Real Maritime Photography with Cinematic Color Grading */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ 
            backgroundImage: `url(${getBackdropImage()})`,
            filter: isAmberMode ? 'brightness(0.22) saturate(1.4)' : 'brightness(0.30) saturate(1.1)'
          }}
        />

        {/* Ambient Dark Navy / Steel Blue Gradient Overlay */}
        <div className={`absolute inset-0 transition-colors duration-700 ${
          isAmberMode
            ? 'bg-gradient-to-t from-[#0B2545]/95 via-[#0B2545]/80 to-[#F2A541]/15'
            : 'bg-gradient-to-t from-[#0B2545]/95 via-[#0B2545]/75 to-[#1B6CA8]/20'
        }`} />

        {/* Top Info Bar on Canvas */}
        <div className="absolute top-0 inset-x-0 p-5 md:p-6 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md backdrop-blur-md border ${
              isAmberMode 
                ? 'bg-[#F2A541]/20 border-[#F2A541] text-[#F2A541]' 
                : 'bg-[#1B6CA8]/30 border-[#1B6CA8] text-sky-300'
            }`}>
              {currentBeat.actTitle}
            </span>
            <span className="text-xs font-semibold text-slate-300 drop-shadow">
              Beat {currentBeatIndex + 1} of {presentationBeats.length}: {currentBeat.beatTitle}
            </span>
          </div>

          {/* Active Presenter Badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-700/60">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isAmberMode ? 'bg-[#F2A541] text-slate-950' : 'bg-sky-500 text-slate-950'
            }`}>
              {currentBeat.speakerInitials}
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-white leading-tight">{currentBeat.speaker}</div>
              <div className="text-[10px] text-slate-400">{currentBeat.speakerRole}</div>
            </div>
          </div>
        </div>

        {/* ================= DYNAMIC CANVAS VISUAL RENDERING ================= */}
        <div className="absolute inset-0 pt-20 pb-24 px-6 md:px-12 flex flex-col justify-center items-center z-10">
          
          {/* BEAT 1: HOOK INTRO (Jitter Kinetic Stagger) */}
          {currentBeat.visualMode === 'hook_intro' && (
            <motion.div 
              key="beat1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-4xl text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Port of Los Angeles · San Pedro Bay Container Complex</span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Every month, thousands of containers leave this port.
                </h1>
                <p className="text-2xl md:text-4xl font-light text-sky-300 tracking-tight">
                  How many will leave next month?
                </p>
              </div>

              <div className="pt-4">
                <div className="inline-block px-6 py-2.5 rounded-xl bg-[#0B2545]/80 border border-[#1B6CA8] shadow-2xl backdrop-blur-md">
                  <span className="text-sm font-bold text-white tracking-wider uppercase font-mono">
                    D10: The Forecasting Challenge
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* BEAT 2: THE STAKES COUNTER (Napkin Visual Flow) */}
          {currentBeat.visualMode === 'stakes_counter' && (
            <motion.div 
              key="beat2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-6 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Operations Management Problem
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  36 Months of Real Data
                </div>
                <div className="text-lg text-slate-300">
                  Port of Los Angeles Monthly Total Exports (TEUs)
                </div>

                <div className="space-y-2 pt-2">
                  {currentBeat.onScreenStoryCaptions.map((caption, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      <span className="font-semibold">{caption}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-6 grid grid-cols-2 gap-4">
                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-4 backdrop-blur-md shadow-lg">
                  <div className="text-xs text-slate-400">Timeframe</div>
                  <div className="text-xl font-bold text-white mt-1">Jan 2022 – Dec 2024</div>
                  <div className="text-[11px] text-sky-300 mt-1">36 Verified Periods</div>
                </div>

                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-4 backdrop-blur-md shadow-lg">
                  <div className="text-xs text-slate-400">Unit of Measurement</div>
                  <div className="text-xl font-bold text-sky-400 mt-1">TEUs</div>
                  <div className="text-[11px] text-slate-300 mt-1">Twenty-Foot Equivalent Units</div>
                </div>

                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-4 backdrop-blur-md shadow-lg">
                  <div className="text-xs text-slate-400">Labor Gang Risk</div>
                  <div className="text-xl font-bold text-red-400 mt-1">$42,000 / Shift</div>
                  <div className="text-[11px] text-slate-300 mt-1">Wasted if over-forecasted</div>
                </div>

                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-4 backdrop-blur-md shadow-lg">
                  <div className="text-xs text-slate-400">Berth Demurrage Risk</div>
                  <div className="text-xl font-bold text-red-400 mt-1">$50,000+ / Day</div>
                  <div className="text-[11px] text-slate-300 mt-1">Incurred if under-forecasted</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BEAT 3: THE PLOT COMPLICATION (Flourish Progressive Path Drawing) */}
          {currentBeat.visualMode === 'trend_anomaly' && (
            <div className="w-full max-w-5xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                    Flourish Progressive Line Drawing · Months 1 to 30
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Non-Linear Time Series & February 2023 Shock
                  </h2>
                </div>
                <div className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Feb 2023 Anomaly (236,263.50 TEUs · -32.0%)</span>
                </div>
              </div>

              {/* Dynamic Flourish Animated Path */}
              <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/50 rounded-xl p-4 backdrop-blur-md">
                <div className="h-44 w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#1B6CA8" strokeOpacity="0.2" strokeDasharray="3 3" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#1B6CA8" strokeOpacity="0.2" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#1B6CA8" strokeOpacity="0.2" strokeDasharray="3 3" />

                    {/* Feb 2023 Shock Indicator */}
                    <rect x="250" y="10" width="35" height="120" fill="#EF4444" fillOpacity="0.15" rx="4" />
                    <line x1="267" y1="10" x2="267" y2="130" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2 2" />

                    {/* Progressive Actual Path drawn as beatElapsedTime advances */}
                    {(() => {
                      const slice = FULL_TIME_SERIES.slice(0, beat3VisibleMonths);
                      const points = slice.map((d, i) => {
                        const x = (i / 29) * 580 + 10;
                        const y = 130 - ((d.actual - 200000) / 300000) * 110;
                        return `${x},${y}`;
                      }).join(' ');

                      const lastD = slice[slice.length - 1];
                      const headX = ((slice.length - 1) / 29) * 580 + 10;
                      const headY = 130 - ((lastD.actual - 200000) / 300000) * 110;

                      return (
                        <g>
                          <polyline
                            points={points}
                            fill="none"
                            stroke="#38BDF8"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Flourish traveling head pulse */}
                          <circle cx={headX} cy={headY} r="7" fill="#38BDF8" className="animate-ping" opacity="0.6" />
                          <circle cx={headX} cy={headY} r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800 font-mono">
                  <span>Jan 2022 (Month 1: 437,121.10 TEUs)</span>
                  <span className="text-red-400 font-bold">Feb 2023 Shock (Month 14: 236,263.50 TEUs)</span>
                  <span>Currently Showing Month {beat3VisibleMonths} of 30</span>
                  <span className="text-amber-400/80 italic">[Months 31-36 Held Out Blind]</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">General Pattern:</span>
                  <div className="font-semibold text-white mt-0.5">Upward trend with seasonal peaks</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Anomalous Shock:</span>
                  <div className="font-semibold text-red-400 mt-0.5">Post-COVID cargo cliff & ILWU talks</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                  <span className="text-slate-400">Implication:</span>
                  <div className="font-semibold text-sky-300 mt-0.5">Simple linear models will severely fail</div>
                </div>
              </div>
            </div>
          )}

          {/* BEAT 4: THE FOUR CONVENTIONAL CONTENDERS (Flourish Contender Race) */}
          {currentBeat.visualMode === 'contenders_race' && (
            <div className="w-full max-w-5xl space-y-4">
              <div className="text-center space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                  Act II: The Trial · Conventional OM Methods Race
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Four Contenders Tested Against the Hidden Curve
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 3-Period SMA */}
                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">Contender 1</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">k = 3</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">3-Period SMA</h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Simple unweighted moving average. Lags significantly behind rapid surges and drops.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Dev MAPE:</span>
                    <span className="font-bold text-white">9.71%</span>
                  </div>
                </div>

                {/* 3-Period WMA */}
                <div className="bg-[#0B2545]/95 border-2 border-sky-400 rounded-xl p-4 backdrop-blur-md shadow-lg shadow-sky-500/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-400">Contender 2</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">0.5/0.3/0.2</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">3-Period WMA</h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Weights: 50% (t-1), 30% (t-2), 20% (t-3). Agility without overreacting.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Dev MAPE:</span>
                    <span className="font-bold text-sky-300">9.31% (Lowest Error!)</span>
                  </div>
                </div>

                {/* Exponential Smoothing */}
                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">Contender 3</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">α = 0.2, 0.5, 0.8</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">Exp. Smoothing</h3>
                  <p className="text-xs text-slate-300 mt-2">
                    Tested 3 constants. α=0.5 achieved 9.19% MAPE, but introduces high variance in labor schedules.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Dev MAPE:</span>
                    <span className="font-bold text-white">9.19%</span>
                  </div>
                </div>

                {/* Trend Projection (Eliminated) */}
                <div className="bg-[#0B2545]/50 border border-slate-700/60 rounded-xl p-4 backdrop-blur-md opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Contender 4</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">Eliminated</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-300 mt-1 line-through">Trend Projection</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Slope negative (-2,216 TEUs/mo) due to Feb 2023 dip; fails on rebound.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between text-xs">
                    <span className="text-slate-400">Dev MAPE:</span>
                    <span className="font-bold text-red-400">10.36%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BEAT 5: THE VERDICT - ROUND ONE */}
          {currentBeat.visualMode === 'round_one_verdict' && (
            <motion.div 
              key={`beat5-${selectedBaseline}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B6CA8]/30 border border-[#1B6CA8] text-sky-300 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                <span>Selected Conventional OM Baseline</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                  {activeModelConfig.name}
                </h1>
                <p className="text-lg md:text-xl font-medium text-sky-300 font-mono">
                  {activeModelConfig.weightsOrParam}
                </p>
              </div>

              {/* In-sample evidence badges */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
                <div className="bg-[#0B2545]/90 border border-[#1B6CA8] rounded-xl p-4">
                  <div className="text-xs text-slate-400">Development MAPE</div>
                  <div className="text-2xl font-bold text-sky-400 mt-1">{activeModelConfig.devMAPE.toFixed(2)}%</div>
                  <div className="text-[11px] text-slate-300">In-sample accuracy</div>
                </div>
                <div className="bg-[#0B2545]/90 border border-[#1B6CA8] rounded-xl p-4">
                  <div className="text-xs text-slate-400">Development RMSE</div>
                  <div className="text-2xl font-bold text-white mt-1">{activeModelConfig.devRMSE.toLocaleString()} TEUs</div>
                  <div className="text-[11px] text-slate-300">Variance penalty</div>
                </div>
                <div className="bg-[#0B2545]/90 border border-[#1B6CA8] rounded-xl p-4">
                  <div className="text-xs text-slate-400">Operational Logic</div>
                  <div className="text-base font-bold text-sky-300 mt-1">Velocity Tracking</div>
                  <div className="text-[11px] text-slate-300">Smooths gang scheduling</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BEAT 6: STATISTICAL & ML CHALLENGERS */}
          {currentBeat.visualMode === 'ml_challengers' && (
            <div className="w-full max-w-4xl space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Can Advanced Algorithms Outperform Simplicity?
                </h2>
                <p className="text-sm text-sky-300">
                  Three computational challengers enter the arena to contest 3-Period WMA
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-5 backdrop-blur-md text-center">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto mb-3">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">ARIMA (1,1,1)</h3>
                  <div className="text-xs text-sky-400 font-mono mt-1">Statistical Modeling</div>
                  <p className="text-xs text-slate-300 mt-3">
                    Autoregressive Integrated Moving Average. Captures serial autocorrelation in port time-series.
                  </p>
                </div>

                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-5 backdrop-blur-md text-center">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Lagged Linear Regression</h3>
                  <div className="text-xs text-sky-400 font-mono mt-1">Multi-Feature Linear</div>
                  <p className="text-xs text-slate-300 mt-3">
                    Engineered lag features (t-1, t-2, t-3) with intercept to predict next month container demand.
                  </p>
                </div>

                <div className="bg-[#0B2545]/85 border border-[#1B6CA8]/60 rounded-xl p-5 backdrop-blur-md text-center">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Random Forest</h3>
                  <div className="text-xs text-sky-400 font-mono mt-1">Machine Learning</div>
                  <p className="text-xs text-slate-300 mt-3">
                    Non-linear ensemble of decision trees. Capable of learning arbitrary complex interactions.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  — The 6-Month Blind Validation Test Begins —
                </span>
              </div>
            </div>
          )}

          {/* BEAT 7: THE BLIND TEST REVEAL (Flourish Multi-Model Projection) */}
          {currentBeat.visualMode === 'blind_test_reveal' && (
            <div className="w-full max-w-5xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                    Act III: The Blind Test (Months 31 to 36) · Flourish Multi-Model Reveal
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Unseen Truth Revealed: July to December 2024
                  </h2>
                </div>
                <div className="text-xs text-slate-300 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                  N = 6 Validation Periods
                </div>
              </div>

              {/* Evaluation Scorecard comparing all models on required metrics */}
              <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/60 rounded-xl overflow-hidden backdrop-blur-md shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono">
                        <th className="py-2.5 px-3">Model</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">MAE (TEU)</th>
                        <th className="py-2.5 px-3">RMSE (TEU)</th>
                        <th className="py-2.5 px-3 font-bold text-sky-300">MAPE</th>
                        <th className="py-2.5 px-3">SMAPE</th>
                        <th className="py-2.5 px-3">MPE (Bias)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {VALIDATION_METRICS.map((m) => (
                        <tr 
                          key={m.name}
                          className={m.isRecommended ? 'bg-sky-500/10 font-semibold text-white' : 'text-slate-300 hover:bg-slate-900/40'}
                        >
                          <td className="py-2 px-3 font-sans flex items-center gap-2">
                            {m.isRecommended && <span className="w-2 h-2 rounded-full bg-sky-400" />}
                            <span>{m.name}</span>
                          </td>
                          <td className="py-2 px-3 text-slate-400">{m.category}</td>
                          <td className="py-2 px-3">{m.mae.toLocaleString()}</td>
                          <td className="py-2 px-3">{m.rmse.toLocaleString()}</td>
                          <td className={`py-2 px-3 font-bold ${m.isRecommended ? 'text-sky-400 text-sm' : ''}`}>
                            {m.mape.toFixed(2)}%
                          </td>
                          <td className="py-2 px-3">{m.smape.toFixed(2)}%</td>
                          <td className="py-2 px-3">{m.mpe > 0 ? `+${m.mpe.toFixed(2)}%` : `${m.mpe.toFixed(2)}%`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center text-xs text-slate-400">
                Notice the disparity between the top and bottom ranks...
              </div>
            </div>
          )}

          {/* BEAT 8: THE PLOT TWIST (Jitter Kinetic Shockwave & Amber Accent) */}
          {currentBeat.visualMode === 'amber_plot_twist' && (
            <motion.div 
              key="beat8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="w-full max-w-4xl text-center space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2A541]/20 border border-[#F2A541] text-[#F2A541] text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-[#F2A541]/20 animate-pulse">
                <Sparkles className="w-4 h-4 text-[#F2A541]" />
                <span>The Plot Twist · Occam's Razor Revealed</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  The Algorithm Overfitted.
                </h1>
                <p className="text-3xl md:text-5xl font-black text-[#F2A541] tracking-tight">
                  Simplicity Prevailed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-2">
                {/* Conventional Champion */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#0B2545]/90 border-2 border-[#F2A541] rounded-2xl p-5 shadow-xl shadow-[#F2A541]/20"
                >
                  <div className="text-xs font-bold text-[#F2A541] uppercase tracking-wider">Validation Winner</div>
                  <div className="text-xl font-bold text-white mt-1">{activeModelConfig.shortName}</div>
                  <div className="text-3xl font-extrabold text-[#F2A541] mt-2 font-mono">{activeModelConfig.valMAPE.toFixed(2)}% MAPE</div>
                  <p className="text-xs text-slate-300 mt-2">
                    Generalizes cleanly without memorizing noise. Adapts immediately to cargo momentum.
                  </p>
                </motion.div>

                {/* Random Forest Overfit */}
                <div className="bg-slate-950/90 border border-red-500/60 rounded-2xl p-5 shadow-xl">
                  <div className="text-xs font-bold text-red-400 uppercase tracking-wider">Complex ML Failure</div>
                  <div className="text-xl font-bold text-slate-300 mt-1">Random Forest</div>
                  <div className="text-3xl font-extrabold text-red-400 mt-2 font-mono">11.19% MAPE</div>
                  <p className="text-xs text-slate-400 mt-2">
                    Cannot extrapolate beyond training boundaries. Plateaus on unseen trends with N=30 samples.
                  </p>
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-300 max-w-lg mx-auto">
                "More mathematical complexity does not guarantee better operations decisions."
              </div>
            </motion.div>
          )}

          {/* BEAT 9: WHY IT HAPPENED (The Structural Level Shift Bar Comparison) */}
          {currentBeat.visualMode === 'level_shift_bars' && (
            <motion.div 
              key="beat9"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-4xl space-y-5 text-center"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                  Root Cause Analysis · The Level Shift
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-white">
                  Demand Didn't Stay the Same. The Forecast Had to Adapt.
                </h2>
              </div>

              {/* Animated Before/After Bar Comparison */}
              <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/60 rounded-2xl p-6 shadow-2xl backdrop-blur-md max-w-3xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end justify-center pt-2">
                  {/* Development Average Bar */}
                  <div className="space-y-2 flex flex-col items-center">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Months 1–30 (Development Mean)
                    </span>
                    <div className="w-full max-w-[180px] bg-slate-900 rounded-xl p-3 border border-slate-700 flex flex-col items-center justify-end h-48 relative overflow-hidden">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '62%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="w-full bg-gradient-to-t from-slate-700 to-sky-600 rounded-lg absolute bottom-2 inset-x-2"
                      />
                      <div className="relative z-10 text-center mb-2">
                        <div className="text-2xl font-black text-white font-mono">373,431</div>
                        <div className="text-[10px] text-slate-300 font-medium">Mean Monthly TEUs</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">Post-pandemic normalization baseline</span>
                  </div>

                  {/* Validation Average Bar */}
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 uppercase">
                      <span>Months 31–36 (Validation Mean)</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                        +19.2% SURGE
                      </span>
                    </div>
                    <div className="w-full max-w-[180px] bg-slate-900 rounded-xl p-3 border-2 border-emerald-500/60 flex flex-col items-center justify-end h-48 relative overflow-hidden shadow-lg shadow-emerald-500/10">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '88%' }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-lg absolute bottom-2 inset-x-2"
                      />
                      <div className="relative z-10 text-center mb-2">
                        <div className="text-2xl font-black text-white font-mono">445,126</div>
                        <div className="text-[10px] text-emerald-200 font-medium">+71,695 TEU Shift</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-medium">Late-2024 recovery & peak shipping</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 text-xs text-slate-300 leading-relaxed max-w-xl mx-auto">
                  Static linear trend sloped downward due to the Feb 2023 dip, failing completely during the surge. <strong>3-Period WMA</strong> won because its 0.50 recent weight immediately adapted to the level shift.
                </div>
              </div>
            </motion.div>
          )}

          {/* BEAT 10: THE OM RECOMMENDATION (Port Operations Control Room) */}
          {currentBeat.visualMode === 'om_recommendation_control_room' && (
            <motion.div 
              key="beat10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-5xl space-y-4"
            >
              <div className="text-center space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                  Port Operations Control Room · Executive Decision
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  The Operations Management Recommendation
                </h2>
              </div>

              {/* Primary Action Card */}
              <div className="bg-[#0B2545]/90 border border-sky-500/50 rounded-2xl p-5 backdrop-blur-md shadow-2xl max-w-3xl mx-auto space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left space-y-2">
                  <div className="text-xs font-bold text-sky-400 uppercase font-mono tracking-wider">
                    Recommended Operational Action:
                  </div>
                  <p className="text-base md:text-lg font-bold text-white leading-relaxed">
                    Deploy <strong>3-Period Weighted Moving Average (0.50, 0.30, 0.20)</strong> as the baseline for monthly crane berth and gang scheduling, reinforced by a <strong>7% dynamic contingency buffer</strong> to absorb trade surges without berth dwell delays.
                  </p>
                </div>

                {/* 3 Concrete Operational Impacts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-sky-400 uppercase">Container Routing</span>
                    <div className="text-lg font-bold text-white font-mono">22,500 TEUs</div>
                    <p className="text-[11px] text-slate-300">
                      Eliminates monthly container misallocations across San Pedro Bay terminals.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-sky-400 uppercase">Berth Dwell Queue</span>
                    <div className="text-lg font-bold text-white font-mono">48% Reduction</div>
                    <p className="text-[11px] text-slate-300">
                      Cuts vessel anchorage wait times and demurrage penalties.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-sky-400 uppercase">Labor Shift Budget</span>
                    <div className="text-lg font-bold text-emerald-400 font-mono">$42,000 Saved</div>
                    <p className="text-[11px] text-slate-300">
                      Prevents over-requisitioning idle longshore gangs per shift.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BEAT 11: LIMITATIONS & HUMAN OVERSIGHT */}
          {currentBeat.visualMode === 'limitations_oversight' && (
            <motion.div 
              key="beat11"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl text-center space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Industry 5.0 Human-in-the-Loop Oversight</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                  Data predicts the tide.
                </h1>
                <p className="text-2xl md:text-4xl font-black text-sky-300 tracking-tight">
                  Humans steer the ship.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-2 text-left">
                <div className="p-4 rounded-xl bg-[#0B2545]/90 border border-slate-800">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>1. Labor Contract Talks</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    ILWU collective bargaining disputes trigger instantaneous port diversions that no past data can foresee.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#0B2545]/90 border border-slate-800">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>2. Geopolitical Rerouting</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Red Sea and Suez chokepoint closures alter global vessel arrival bunches and voyage transit times.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#0B2545]/90 border border-slate-800">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>3. Abrupt Tariff Shocks</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Trade policy deadlines provoke sudden cargo front-loading that violates normal stationary assumptions.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* BEAT 12: CLOSING & FINAL RECOMMENDATION (AMBER ACCENT - BOOKEND) */}
          {currentBeat.visualMode === 'closing_recommendation' && (
            <motion.div 
              key="beat12"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-full max-w-4xl text-center space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2A541]/20 border border-[#F2A541] text-[#F2A541] text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-[#F2A541]/20 animate-pulse">
                <Award className="w-4 h-4 text-[#F2A541]" />
                <span>Final Operations Management Recommendation</span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Which forecasting approach should be used, under what conditions, and why?
                </div>
                <div className="p-6 rounded-2xl bg-[#0B2545]/95 border-2 border-[#F2A541] shadow-2xl backdrop-blur-md text-left space-y-3">
                  <p className="text-lg md:text-xl font-bold text-white leading-relaxed">
                    <span className="text-[#F2A541]">"{activeModelConfig.recommendationQuote}"</span>
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                    Transparent, spreadsheet-auditable for longshore gang allocation, with zero black-box code failure risk.
                  </p>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4 font-mono">
                <span className="text-white font-semibold">Group 7 · BSIE 3-E</span>
                <span>•</span>
                <span>Aligato, Elaiza Jane · Ansay, Rash Mae Crystelle C. (Leader) · Villagracia, Mylene Joy</span>
                <span>•</span>
                <span>Cebu Technological University · Engr. Lyndrian Shalom R. Baclayon</span>
              </div>
            </motion.div>
          )}

        </div>

        {/* Story Caption Bar (3-6 words per line, documentary style) */}
        <div className="absolute bottom-16 inset-x-0 px-6 flex justify-center z-20 pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl px-6 py-2.5 max-w-2xl text-center shadow-2xl">
            <div className={`text-xs md:text-sm font-semibold tracking-wide ${isAmberMode ? 'text-[#F2A541]' : 'text-slate-200'}`}>
              {currentBeat.onScreenStoryCaptions.join('  •  ')}
            </div>
          </div>
        </div>

        {/* Video Player Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 z-30">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevBeat}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Previous Beat"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-xl transition-all ${
                isAmberMode 
                  ? 'bg-[#F2A541] text-slate-950 hover:bg-[#F2A541]/90' 
                  : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
              }`}
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={handleNextBeat}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Next Beat"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentBeatIndex(0);
                setBeatElapsedTime(0);
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Restart from Hook"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Scrubber */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
              {formatTime(currentTotalSeconds)}
            </span>
            <div 
              className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                handleSeek(pos * TOTAL_PRESENTATION_SECONDS);
              }}
            >
              <div 
                className={`h-full transition-all duration-100 ${
                  isAmberMode ? 'bg-[#F2A541]' : 'bg-sky-400'
                }`}
                style={{ width: `${(currentTotalSeconds / TOTAL_PRESENTATION_SECONDS) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
              {formatTime(TOTAL_PRESENTATION_SECONDS)}
            </span>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none"
            >
              <option value={1}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= PRESENTER TELEPROMPTER & CUES DRAWER ================= */}
      {showPresenterCues && (
        <div className="bg-[#0B2545]/90 border border-[#1B6CA8]/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Live Presenter Spoken Cue Card
              </span>
            </div>
            <div className="text-xs text-slate-400">
              Assigned Speaker: <span className="font-bold text-white">{currentBeat.speaker}</span> ({currentBeat.speakerRole})
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-sky-400 uppercase tracking-wider">
              Spoken Script (Read Aloud Over This Beat):
            </div>
            <p className="text-base text-slate-100 font-medium leading-relaxed italic">
              "{currentBeat.liveSpeakerPrompt}"
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              Beat Duration: <span className="text-white font-mono">{currentBeat.durationSeconds}s</span> · Elapsed in Beat: <span className="text-sky-400 font-mono">{Math.floor(beatElapsedTime)}s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Next Beat:</span>
              <span className="text-slate-300 font-medium">
                {currentBeatIndex < presentationBeats.length - 1 
                  ? presentationBeats[currentBeatIndex + 1].beatTitle 
                  : "Conclusion"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Narrative Spine Act Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div 
          onClick={() => { setCurrentBeatIndex(0); setBeatElapsedTime(0); }}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            currentBeat.act === 1 
              ? 'bg-[#1B6CA8]/20 border-sky-400 text-white shadow-md' 
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Act I (0:00 - 0:47)</div>
          <div className="text-sm font-bold mt-0.5">The Port Logistics Challenge</div>
          <div className="text-xs text-slate-400 mt-1">Hook, 36 Months TEUs, Feb 2023 Dip</div>
        </div>

        <div 
          onClick={() => { setCurrentBeatIndex(3); setBeatElapsedTime(0); }}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            currentBeat.act === 2 
              ? 'bg-[#1B6CA8]/20 border-sky-400 text-white shadow-md' 
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400">Act II (0:47 - 2:02)</div>
          <div className="text-sm font-bold mt-0.5">The Trial & The Contenders</div>
          <div className="text-xs text-slate-400 mt-1">SMA, WMA Baseline, ARIMA & ML</div>
        </div>

        <div 
          onClick={() => { setCurrentBeatIndex(6); setBeatElapsedTime(0); }}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            currentBeat.act === 3 
              ? 'bg-[#F2A541]/15 border-[#F2A541] text-white shadow-md' 
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#F2A541]">Act III (2:02 - 3:30)</div>
          <div className="text-sm font-bold mt-0.5">The Blind Test & Plot Twist</div>
          <div className="text-xs text-slate-400 mt-1">Overfit Reveal, Amber Impact, Final Verdict</div>
        </div>
      </div>
    </div>
  );
};
