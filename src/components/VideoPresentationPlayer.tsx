import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  Maximize, Minimize, Mic, Download, Layers,
  ChevronRight, ArrowRight, ShieldCheck, Ship, Anchor,
  Video, Printer, Check, Sparkles, TrendingUp, BarChart3, Sliders, Cpu,
  Award, Compass, Activity, Brain, UserCheck, Terminal, AlertTriangle
} from 'lucide-react';
import { KEYNOTE_BEATS, KeynoteBeat, TOTAL_KEYNOTE_SECONDS } from '../data/presentationSlides';
import { FULL_TIME_SERIES, BaselineModelChoice, GROUP_INFO, VALIDATION_METRICS } from '../data/forecastingData';
import { ambientDrone } from '../utils/ambientAudio';
import { ExportPresentationModal } from './ExportPresentationModal';
import { 
  exportPrintableDeck, 
  downloadOfficialPPTX, 
  downloadOfficialVideoMP4, 
  formatTime 
} from '../utils/exportPresentation';
import { generateNativePPTX } from '../utils/pptxExport';

// Authoritative Image Assets for Group 7 Keynote - 3D Character Mascots & Maritime Port Scenery
const MASCOT_BLUE = '/src/assets/images/mascot_blue_analyst_1791196865420.jpg';
const MASCOT_ORANGE = '/src/assets/images/mascot_orange_planner_1791196885029.jpg';
const MASCOT_GREEN = '/src/assets/images/mascot_green_validator_1791196903349.jpg';

const ESTABLISHING_SHOT_IMG = '/src/assets/images/cargo_ship_breakwater_1791024998811.jpg';
const PORT_TERMINAL_IMG = '/src/assets/images/pola_container_terminal_1791024986178.jpg';
const CONTAINER_YARD_IMG = '/src/assets/images/container_yard_twilight_1791025012665.jpg';
const OPERATIONS_COMMAND_IMG = '/src/assets/images/operations_analytics_command_1790930073715.jpg';
const PORT_PLANNER_IMG = '/src/assets/images/port_control_planner_1791028044582.jpg';

interface VideoPresentationPlayerProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBaseline?: BaselineModelChoice;
  onSelectBaseline?: (b: BaselineModelChoice) => void;
  onOpen3DStudio?: () => void;
}

export const VideoPresentationPlayer: React.FC<VideoPresentationPlayerProps> = ({
  isPlaying,
  setIsPlaying,
  onOpen3DStudio
}) => {
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);
  const [beatElapsedSeconds, setBeatElapsedSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showPresenterHUD, setShowPresenterHUD] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isGeneratingPPTX, setIsGeneratingPPTX] = useState<boolean>(false);
  const [mouseActive, setMouseActive] = useState<boolean>(true);
  const [videoNotification, setVideoNotification] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentBeat: KeynoteBeat = KEYNOTE_BEATS[currentBeatIndex] || KEYNOTE_BEATS[0];

  // Cumulative elapsed seconds across all beats
  const totalElapsedSeconds = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < currentBeatIndex; i++) {
      sum += KEYNOTE_BEATS[i].durationSeconds;
    }
    return sum + beatElapsedSeconds;
  }, [currentBeatIndex, beatElapsedSeconds]);

  // Master Playback Timer (Tick every 100ms) - Pure ticker
  useEffect(() => {
    if (!isPlaying) {
      ambientDrone.stop();
      return;
    }

    if (!isMuted) {
      ambientDrone.play();
    }

    const interval = setInterval(() => {
      setBeatElapsedSeconds((prev) => prev + 0.1);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, isMuted]);

  // Clean Beat Progression and Completion Effect (runs during commit phase, not during render)
  useEffect(() => {
    if (!isPlaying) return;

    const duration = currentBeat.durationSeconds;
    if (beatElapsedSeconds >= duration) {
      if (currentBeatIndex < KEYNOTE_BEATS.length - 1) {
        setCurrentBeatIndex((idx) => idx + 1);
        setBeatElapsedSeconds(0);
      } else {
        setIsPlaying(false);
        ambientDrone.stop();
        setBeatElapsedSeconds(duration);
      }
    }
  }, [beatElapsedSeconds, currentBeat.durationSeconds, currentBeatIndex, isPlaying, setIsPlaying]);

  // Ensure ambient audio stops if unmounted
  useEffect(() => {
    return () => {
      ambientDrone.stop();
    };
  }, []);

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (isPlaying) ambientDrone.play();
    } else {
      setIsMuted(true);
      ambientDrone.stop();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Jump to specific beat
  const skipToBeat = (index: number) => {
    setCurrentBeatIndex(index);
    setBeatElapsedSeconds(0);
  };

  // Keyboard Shortcuts (Space, Arrows, F, C, P, V, S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipToBeat(Math.min(KEYNOTE_BEATS.length - 1, currentBeatIndex + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipToBeat(Math.max(0, currentBeatIndex - 1));
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowPresenterHUD((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handleDownloadPPTX();
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        handleDownloadVideoMP4();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleExportSlides();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentBeatIndex, setIsPlaying]);

  // Mouse activity timer for autohiding transport
  const handleMouseMove = () => {
    setMouseActive(true);
    if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
    mouseTimerRef.current = setTimeout(() => {
      if (isPlaying) setMouseActive(false);
    }, 2800);
  };

  // Export Handlers
  const handleDownloadPPTX = async () => {
    setIsGeneratingPPTX(true);
    setVideoNotification("Generating official PowerPoint Presentation (.pptx)...");
    try {
      await generateNativePPTX();
      setVideoNotification("PowerPoint Deck downloaded successfully!");
    } catch {
      downloadOfficialPPTX();
      setVideoNotification("Direct PPTX downloaded successfully!");
    } finally {
      setIsGeneratingPPTX(false);
      setTimeout(() => setVideoNotification(null), 4000);
    }
  };

  const handleDownloadVideoMP4 = () => {
    downloadOfficialVideoMP4();
    setVideoNotification("Downloading official 1080p Keynote Video (MP4)...");
    setTimeout(() => setVideoNotification(null), 4000);
  };

  const handleExportSlides = () => {
    exportPrintableDeck();
  };

  // SVG Chart Geometry Constants
  const svgWidth = 1000;
  const svgHeight = 440;
  const padLeft = 85;
  const padRight = 65;
  const padTop = 50;
  const padBottom = 55;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;
  const minVal = 200000;
  const maxVal = 480000;

  const getX = (period: number) => padLeft + ((period - 1) / 35) * plotW;
  const getY = (val: number) => padTop + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

  const actualPoints = useMemo(() => {
    return FULL_TIME_SERIES.map((row) => ({
      period: row.period,
      x: getX(row.period),
      y: getY(row.actual),
      val: row.actual,
      month: row.monthName
    }));
  }, []);

  const actualPathString = useMemo(() => {
    return actualPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  }, [actualPoints]);

  const smaPoints = useMemo(() => {
    return FULL_TIME_SERIES.filter((r) => r.sma3 !== undefined).map((r) => ({
      x: getX(r.period),
      y: getY(r.sma3!)
    }));
  }, []);

  const wmaPoints = useMemo(() => {
    return FULL_TIME_SERIES.filter((r) => r.wma3 !== undefined).map((r) => ({
      x: getX(r.period),
      y: getY(r.wma3!)
    }));
  }, []);

  const es05Points = useMemo(() => {
    return FULL_TIME_SERIES.filter((r) => r.es05 !== undefined).map((r) => ({
      x: getX(r.period),
      y: getY(r.es05!)
    }));
  }, []);

  const es02Points = useMemo(() => {
    return FULL_TIME_SERIES.filter((r) => r.es02 !== undefined).map((r) => ({
      x: getX(r.period),
      y: getY(r.es02!)
    }));
  }, []);

  const es08Points = useMemo(() => {
    return FULL_TIME_SERIES.filter((r) => r.es08 !== undefined).map((r) => ({
      x: getX(r.period),
      y: getY(r.es08!)
    }));
  }, []);

  const trendPoints = useMemo(() => {
    return [
      { x: getX(1), y: getY(FULL_TIME_SERIES[0].trend || 409404) },
      { x: getX(36), y: getY(FULL_TIME_SERIES[35].trend || 331833) }
    ];
  }, []);

  // Validation models (Periods 31-36 from PDF Table 5.4)
  const valArimaPoints = useMemo(() => {
    const arimaVals = [395788, 435086, 449029, 454461, 442723, 427066];
    return arimaVals.map((v, i) => ({ x: getX(31 + i), y: getY(v) }));
  }, []);

  const valLrPoints = useMemo(() => {
    const lrVals = [380816, 404950, 416225, 420463, 414842, 405430];
    return lrVals.map((v, i) => ({ x: getX(31 + i), y: getY(v) }));
  }, []);

  const valRfPoints = useMemo(() => {
    const rfVals = [365739, 401997, 412902, 433329, 438313, 420364];
    return rfVals.map((v, i) => ({ x: getX(31 + i), y: getY(v) }));
  }, []);

  const toPath = (pts: { x: number; y: number }[]) => {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  };

  // Full validation ranking models (Exact from Analytical Report Table 2)
  const validationRanking = [
    { rank: 1, name: 'ARIMA (1,1,0)', mae: 20919, rmse: 24426, mape: 4.71, isWinner: true },
    { rank: 2, name: 'ETS α = 0.80', mae: 22952, rmse: 26323, mape: 5.17, isWinner: false },
    { rank: 3, name: 'ETS α = 0.50 (Selected)', mae: 27725, rmse: 33064, mape: 6.22, isWinner: false },
    { rank: 4, name: '3-Period WMA', mae: 28473, rmse: 32962, mape: 6.41, isWinner: false },
    { rank: 5, name: '3-Period SMA', mae: 31927, rmse: 37934, mape: 7.19, isWinner: false },
    { rank: 6, name: 'Random Forest', mae: 37138, rmse: 42988, mape: 8.31, isWinner: false },
    { rank: 7, name: 'Lagged Linear Regression', mae: 37990, rmse: 41559, mape: 8.48, isWinner: false },
    { rank: 8, name: 'ETS α = 0.20', mae: 44787, rmse: 48914, mape: 10.00, isWinner: false },
    { rank: 9, name: 'Trend Projection', mae: 107737, rmse: 108450, mape: 24.15, isWinner: false }
  ];

  // Beat 1 drawing index (for period line draw)
  const beat1DrawIndex = useMemo(() => {
    if (currentBeatIndex !== 1) return 35;
    if (beatElapsedSeconds < 13) return 0;
    if (beatElapsedSeconds < 24) {
      return Math.min(13, Math.floor(((beatElapsedSeconds - 13) / 11) * 14));
    }
    if (beatElapsedSeconds < 27) return 13; // hold at Feb 2023
    return Math.min(35, 13 + Math.floor(((beatElapsedSeconds - 27) / 9) * 23));
  }, [currentBeatIndex, beatElapsedSeconds]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Full Screen Steady 16:9 Cinema Keynote Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`relative w-full aspect-video bg-[#060B14] rounded-2xl overflow-hidden shadow-2xl border border-slate-900 select-none flex items-center justify-center transition-all ${
          isFullscreen ? '!fixed !inset-0 !z-50 !w-screen !h-screen !max-w-none !rounded-none !border-none !aspect-auto bg-[#060B14]' : ''
        }`}
      >
        {/* Subtle radial depth gradient in Apple keynote stage style */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: 'radial-gradient(circle at 50% 45%, #0B2545 0%, #060B14 85%)'
          }}
        />

        {/* Top-Right Action Controls (PPTX, Video & PDF) */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          {/* Download Real PPTX */}
          <button
            onClick={handleDownloadPPTX}
            disabled={isGeneratingPPTX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600/90 hover:bg-orange-500 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-lg group disabled:opacity-50"
            title="Download Real Microsoft PowerPoint Presentation (.pptx)"
          >
            <span className="font-mono text-[10px] font-black bg-orange-950/60 px-1 py-0.5 rounded text-orange-200">PPTX</span>
            <span>{isGeneratingPPTX ? 'Generating...' : 'Download PPTX'}</span>
          </button>

          {/* Download Real MP4 Video */}
          <button
            onClick={handleDownloadVideoMP4}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-[#F2A541] hover:text-slate-950 text-amber-300 border border-amber-500/40 text-xs font-semibold backdrop-blur-md transition-all shadow-lg group active:scale-95"
            title="Download Real 1080p Keynote Video (.mp4)"
          >
            <Video className="w-3.5 h-3.5 text-amber-400 group-hover:text-slate-950" />
            <span>Download Video (.mp4)</span>
          </button>

          {/* Export Slides PDF */}
          <button
            onClick={handleExportSlides}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1B6CA8]/30 hover:bg-[#1B6CA8] hover:text-white text-sky-300 border border-[#1B6CA8]/50 text-xs font-semibold backdrop-blur-md transition-all shadow-lg hidden sm:flex"
            title="Export Slide Deck (Save as PDF)"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {/* More Export Options */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-colors"
            title="Open Export Suite"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Notification Toast */}
        <AnimatePresence>
          {videoNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-16 right-4 z-50 px-4 py-2 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-semibold rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{videoNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top-Left: Full Screen Steady Presentation Control */}
        <div className="absolute top-4 left-4 z-40 flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-md transition-all shadow-lg active:scale-95 border ${
              isFullscreen
                ? 'bg-[#F2A541] text-slate-950 border-amber-300 shadow-amber-500/30'
                : 'bg-sky-600/90 hover:bg-sky-500 text-white border-sky-400/40 shadow-sky-950/50'
            }`}
            title="Toggle Full Screen Steady Presentation View (F)"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Full Screen' : 'Full Screen Steady'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/85 border border-slate-800 backdrop-blur-md text-[11px] text-slate-300 font-mono shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="font-semibold text-slate-200">Steady Full View</span>
            <span className="text-slate-500">·</span>
            <span className="text-sky-300">1080p Cinema</span>
          </div>
        </div>

        {/* Steady Full Screen Presentation Viewport */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
        >

        {/* ============================================================== */}
        {/* BEAT 0 (0:00 - 0:25 · 25s): PROLOGUE — "MEET GROUP 7"           */}
        {/* ============================================================== */}
        {currentBeatIndex === 0 && (
          <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12 overflow-hidden">
            {/* Ambient Background Grid & Subtle Lighting */}
            <div className="absolute inset-0 bg-[#060B14]">
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, #1B6CA8 1.5px, transparent 1.5px)`,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            {/* Kinetic Branching Lines Background (Inspired by Reference Video 1) */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              <path d="M 100 250 C 250 250, 300 120, 500 120 C 700 120, 800 250, 900 250" fill="none" stroke="#1B6CA8" strokeWidth="2" strokeDasharray="4 6" />
              <path d="M 100 250 C 250 250, 350 380, 500 380 C 650 380, 750 250, 900 250" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="6 6" />
            </svg>

            {/* Phase 0a (0.0s - 5.5s): Spotlight Member 1 - Elaiza Jane Aligato (Blue Analyst Mascot) */}
            {beatElapsedSeconds < 5.5 && (
              <motion.div
                key="member1"
                initial={{ opacity: 0, scale: 0.90, y: 25 }}
                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                exit={{ opacity: 0, scale: 1.06, y: -20 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full"
              >
                {/* 3D Character Hologram Card with Mascot */}
                <div className="relative group">
                  <div className="w-56 h-56 md:w-68 md:h-68 rounded-3xl overflow-hidden border-2 border-sky-400 shadow-[0_0_50px_rgba(56,189,248,0.45)] relative bg-[#0B2545]/90 flex items-center justify-center p-3">
                    <img 
                      src={MASCOT_BLUE} 
                      alt="Blue Mascot - Elaiza Jane Aligato - Lead Analyst" 
                      className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-sky-300 bg-slate-950/80 px-3 py-1 rounded-full border border-sky-500/40">
                      <span className="flex items-center gap-1 font-bold">
                        <Activity className="w-3.5 h-3.5 text-sky-400" />
                        <span>TIME-SERIES SIGNAL</span>
                      </span>
                      <span className="text-slate-400">01 / 03</span>
                    </div>
                  </div>
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 to-[#1B6CA8] opacity-40 blur-xl -z-10" />
                </div>

                {/* Profile Details & Skill Badges */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    <Compass className="w-3.5 h-3.5 text-sky-400" />
                    <span>Specialist 1 of 3</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">
                    Aligato, Elaiza Jane
                  </h2>

                  <div className="text-sm md:text-base font-mono text-sky-400 font-semibold tracking-wide">
                    Lead Analyst &amp; Time-Series Specialist
                  </div>

                  <p className="text-xs md:text-sm font-serif italic text-slate-300 border-l-2 border-sky-400/60 pl-3 my-1">
                    "Sees the Signal &amp; Seasonality"
                  </p>

                  {/* 3 Customized Skill Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-sky-500/40 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                      ARIMA (1,1,0)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-mono font-semibold text-amber-300 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#F2A541]" />
                      ETS α = 0.50
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                      Trend Decomposition
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 0b (5.5s - 11.0s): Spotlight Member 2 - Rash Mae Crystelle C. Ansay (Orange Planner Mascot) */}
            {beatElapsedSeconds >= 5.5 && beatElapsedSeconds < 11.0 && (
              <motion.div
                key="member2"
                initial={{ opacity: 0, scale: 0.90, y: 25 }}
                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                exit={{ opacity: 0, scale: 1.06, y: -20 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full"
              >
                {/* 3D Character Hologram Card with Mascot */}
                <div className="relative group">
                  <div className="w-56 h-56 md:w-68 md:h-68 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-[0_0_50px_rgba(242,165,65,0.5)] relative bg-[#0B2545]/90 flex items-center justify-center p-3">
                    <img 
                      src={MASCOT_ORANGE} 
                      alt="Orange Mascot - Rash Mae Crystelle C. Ansay - Logistics Planner" 
                      className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-amber-300 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-500/40">
                      <span className="flex items-center gap-1 font-bold">
                        <Ship className="w-3.5 h-3.5 text-amber-400" />
                        <span>PORT CAPACITY &amp; BERTH</span>
                      </span>
                      <span className="text-slate-400">02 / 03</span>
                    </div>
                  </div>
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-[#1B6CA8] opacity-40 blur-xl -z-10" />
                </div>

                {/* Profile Details & Skill Badges */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    <Award className="w-3.5 h-3.5 text-[#F2A541]" />
                    <span>Group Leader · Specialist 2 of 3</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">
                    Ansay, Rash Mae Crystelle C.
                  </h2>

                  <div className="text-sm md:text-base font-mono text-amber-400 font-semibold tracking-wide">
                    Port Operations &amp; Logistics Planner
                  </div>

                  <p className="text-xs md:text-sm font-serif italic text-slate-300 border-l-2 border-amber-400/60 pl-3 my-1">
                    "Sees the Operational Capacity"
                  </p>

                  {/* 3 Customized Skill Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-amber-500/40 text-xs font-mono font-semibold text-amber-300 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#F2A541] animate-pulse" />
                      Berth Scheduling
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-sky-500/40 text-xs font-mono font-semibold text-sky-300 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Yard Utilization
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                      TEU Throughput
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 0c (11.0s - 16.5s): Spotlight Member 3 - Mylene Joy Villagracia (Green Validator Mascot) */}
            {beatElapsedSeconds >= 11.0 && beatElapsedSeconds < 16.5 && (
              <motion.div
                key="member3"
                initial={{ opacity: 0, scale: 0.90, y: 25 }}
                animate={{ opacity: 1, scale: 1.0, y: 0 }}
                exit={{ opacity: 0, scale: 1.06, y: -20 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full"
              >
                {/* 3D Character Hologram Card with Mascot */}
                <div className="relative group">
                  <div className="w-56 h-56 md:w-68 md:h-68 rounded-3xl overflow-hidden border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.45)] relative bg-[#0B2545]/90 flex items-center justify-center p-3">
                    <img 
                      src={MASCOT_GREEN} 
                      alt="Green Mascot - Mylene Joy Villagracia - ML & Validation Engineer" 
                      className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                      <span className="flex items-center gap-1 font-bold">
                        <Brain className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PREDICTIVE VALIDATION</span>
                      </span>
                      <span className="text-slate-400">03 / 03</span>
                    </div>
                  </div>
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-sky-500 opacity-40 blur-xl -z-10" />
                </div>

                {/* Profile Details & Skill Badges */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5 max-w-lg">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Specialist 3 of 3</span>
                  </div>

                  <h2 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">
                    Villagracia, Mylene Joy
                  </h2>

                  <div className="text-sm md:text-base font-mono text-emerald-400 font-semibold tracking-wide">
                    Validation &amp; Machine Learning Engineer
                  </div>

                  <p className="text-xs md:text-sm font-serif italic text-slate-300 border-l-2 border-emerald-400/60 pl-3 my-1">
                    "Sees the Predictive Accuracy"
                  </p>

                  {/* 3 Customized Skill Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-emerald-500/40 text-xs font-mono font-semibold text-emerald-300 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      MAE / RMSE
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-sky-500/40 text-xs font-mono font-semibold text-sky-300 flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      Random Forest
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
                      Lagged Regression
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 0d (16.5s - 25.0s): The Team Lineup - 3 Mascots Assemble Side-by-Side */}
            {beatElapsedSeconds >= 16.5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ 
                  opacity: 1, 
                  scale: beatElapsedSeconds > 22.5 ? 1.05 : 1.0
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 flex flex-col items-center gap-4 max-w-5xl w-full text-center"
              >
                {/* Header & Subtitle */}
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#F2A541] uppercase tracking-[0.3em] font-bold">
                    Applied Study 1 · IE-PC 3112: Operations Management 1
                  </div>
                  <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight">
                    Together, they are <span className="font-bold text-sky-400">Group 7</span> (Section D10)
                  </h1>
                  <p className="text-xs md:text-sm font-sans text-slate-300 max-w-2xl mx-auto">
                    "Turning 36 Months of Port Data into High-Confidence Terminal Operations."
                  </p>
                </div>

                {/* 3 Mascots Assemble Side-by-Side with 3D Depth & Float Animation */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl mt-3">
                  {/* Member 1 Mascot Card */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="p-3 md:p-5 rounded-2xl bg-slate-950/85 border border-sky-500/50 shadow-2xl flex flex-col items-center text-center gap-2.5 group hover:border-sky-400 backdrop-blur-md"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-sky-400 shadow-md bg-[#0B2545]/70 flex items-center justify-center p-1.5">
                      <img src={MASCOT_BLUE} alt="Elaiza Jane Aligato" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-bold text-white leading-tight">Elaiza Jane Aligato</div>
                      <div className="text-[10px] md:text-xs font-mono text-sky-400">Lead Analyst</div>
                      <div className="text-[9px] text-slate-400 font-serif italic mt-0.5">"Signal &amp; Seasonality"</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 text-[9px] font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-sky-950/90 border border-sky-800 text-sky-300">ARIMA</span>
                      <span className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-800 text-amber-300">ETS α=0.50</span>
                    </div>
                  </motion.div>

                  {/* Member 2 Mascot Card (Leader - elevated in 3D) */}
                  <motion.div
                    animate={{ y: [0, -9, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    className="p-3 md:p-5 rounded-2xl bg-[#0B2545]/95 border-2 border-amber-500 shadow-2xl flex flex-col items-center text-center gap-2.5 group scale-105 z-10 backdrop-blur-md ring-2 ring-amber-500/30"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#F2A541] shadow-lg bg-[#060B14] flex items-center justify-center p-1.5">
                      <img src={MASCOT_ORANGE} alt="Rash Mae Crystelle C. Ansay" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-bold text-white leading-tight">Rash Mae Crystelle Ansay</div>
                      <div className="text-[10px] md:text-xs font-mono text-[#F2A541] font-bold">Group Leader · Logistics</div>
                      <div className="text-[9px] text-slate-300 font-serif italic mt-0.5">"Operational Capacity"</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 text-[9px] font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-amber-950/90 border border-amber-700 text-amber-200">Berth Scheduling</span>
                      <span className="px-2 py-0.5 rounded bg-sky-950/90 border border-sky-800 text-sky-200">Yard Staging</span>
                    </div>
                  </motion.div>

                  {/* Member 3 Mascot Card */}
                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                    className="p-3 md:p-5 rounded-2xl bg-slate-950/85 border border-emerald-500/50 shadow-2xl flex flex-col items-center text-center gap-2.5 group hover:border-emerald-400 backdrop-blur-md"
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-emerald-400 shadow-md bg-[#0B2545]/70 flex items-center justify-center p-1.5">
                      <img src={MASCOT_GREEN} alt="Mylene Joy Villagracia" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-xs md:text-sm font-bold text-white leading-tight">Mylene Joy Villagracia</div>
                      <div className="text-[10px] md:text-xs font-mono text-emerald-400">ML Validation</div>
                      <div className="text-[9px] text-slate-400 font-serif italic mt-0.5">"Predictive Accuracy"</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 text-[9px] font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-800 text-emerald-300">MAE / RMSE</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-slate-300">Random Forest</span>
                    </div>
                  </motion.div>
                </div>

                {/* Seamless Morph Transition Indicator */}
                {beatElapsedSeconds > 22 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs font-mono text-sky-400 mt-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-400/40 shadow-lg"
                  >
                    <span>ENTERING SCENE 01: THE MARITIME SIGNAL</span>
                    <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* BEAT 1 (0:25 - 1:05 · 40s): REAL WORLD -> DATA (BRANCHING SYNAPSE) */}
        {/* ============================================================== */}
        {currentBeatIndex === 1 && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Phase 1a (0s - 3s): Opening shot, physical port environment, no text */}
            {beatElapsedSeconds < 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 1.0 }}
                animate={{ opacity: 1, scale: 1.04 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.8, ease: 'easeOut' }}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                <img
                  src={ESTABLISHING_SHOT_IMG}
                  alt="Port of Los Angeles Breakwater"
                  className="w-full h-full object-cover brightness-[0.75] contrast-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060B14] via-transparent to-transparent opacity-85" />
              </motion.div>
            )}

            {/* Phase 1b (3s - 7s): MORPH 1 — Physical containers morph into glowing data points */}
            {beatElapsedSeconds >= 3 && beatElapsedSeconds < 7 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={PORT_TERMINAL_IMG}
                  alt="Port of Los Angeles Terminal"
                  className="w-full h-full object-cover brightness-[0.4] contrast-[1.1] filter blur-[1px]"
                />
                <div className="absolute inset-0 bg-[#060B14]/75" />
                {/* 3D Data Particles Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 1000 500" className="w-full h-full">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const px = 100 + (i * 22) + ((i % 4) * 8);
                      const py = 200 + Math.sin(i * 0.4) * 90;
                      return (
                        <g key={i}>
                          <motion.rect
                            initial={{ width: 24, height: 14, opacity: 0.8, fill: '#1B6CA8' }}
                            animate={{ width: 8, height: 8, opacity: 1, rx: 4, fill: '#38BDF8' }}
                            transition={{ duration: 2.5, delay: i * 0.05 }}
                            x={px}
                            y={py}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Phase 1c (7s - 13s): Text Reveal: 36 MONTHS (Hold) -> ONE QUESTION (Hold) */}
            {beatElapsedSeconds >= 7 && beatElapsedSeconds < 13 && (
              <motion.div
                key={beatElapsedSeconds < 10 ? "36months" : "onequestion"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-center z-20"
              >
                {beatElapsedSeconds < 10 ? (
                  <h1 className="text-5xl md:text-8xl font-extralight text-slate-100 tracking-[0.2em] uppercase">
                    36 MONTHS
                  </h1>
                ) : (
                  <h1 className="text-5xl md:text-8xl font-extralight text-slate-100 tracking-[0.2em] uppercase">
                    ONE QUESTION
                  </h1>
                )}
              </motion.div>
            )}

            {/* Phase 1d (13s - 32s): MORPH 2 — 36-Month Chart with Kinetic Branching Nodes & Frosted Widgets */}
            {beatElapsedSeconds >= 13 && beatElapsedSeconds < 32 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 z-10"
              >
                {/* Top Info Bar with Apple-style Frosted Widget */}
                <div className="w-full max-w-4xl flex items-center justify-between mb-2 px-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                    <span className="text-slate-300 font-bold uppercase tracking-wider">Port of LA Exports (TEUs)</span>
                  </div>

                  {/* Frosted Glass Heartbeat / Anomaly Widget (Inspired by Video 2) */}
                  {beatElapsedSeconds >= 20 && beatElapsedSeconds < 29 && (
                    <motion.div 
                      initial={{ scale: 0.85, opacity: 0, y: -10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-[#F2A541] border border-amber-500/50 font-bold flex items-center gap-2 shadow-xl"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#F2A541] animate-bounce" />
                      <span>FEB 2023 ANOMALY: 236,264 TEUs (-32.0%)</span>
                    </motion.div>
                  )}
                </div>

                <div className="relative w-full max-w-4xl h-[70%]">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="polaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1B6CA8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#1B6CA8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Minimal grid lines */}
                    {[250000, 350000, 450000].map((v) => (
                      <line
                        key={v}
                        x1={padLeft}
                        y1={getY(v)}
                        x2={padLeft + plotW}
                        y2={getY(v)}
                        stroke="#1E293B"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                      />
                    ))}

                    {/* Partial Drawn Line up to current index */}
                    {beat1DrawIndex > 0 && (
                      <path
                        d={actualPoints.slice(0, beat1DrawIndex + 1).map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')}
                        fill="none"
                        stroke="#1B6CA8"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    )}

                    {/* February 2023 Anomaly Pulse in Warm Amber */}
                    {beatElapsedSeconds >= 20 && beatElapsedSeconds < 29 && (
                      <g transform={`translate(${getX(14)}, ${getY(236264)})`}>
                        <circle r="22" fill="none" stroke="#F2A541" strokeWidth="2" className="animate-ping opacity-75" />
                        <circle r="8" fill="#F2A541" />
                        <text x="14" y="5" fill="#F2A541" className="text-xs font-mono font-bold">
                          236,264 TEUs (Shock)
                        </text>
                      </g>
                    )}
                  </svg>

                  {/* Mascot Floating in Bottom Corner pointing to chart */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-2 p-2 rounded-2xl bg-slate-950/85 border border-sky-400/50 shadow-2xl backdrop-blur-md"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-sky-400 bg-[#0B2545]">
                      <img src={MASCOT_BLUE} alt="Blue Mascot" className="w-full h-full object-contain" />
                    </div>
                    <div className="text-[10px] font-mono text-left pr-2">
                      <div className="text-sky-300 font-bold">Lead Analyst</div>
                      <div className="text-slate-400">Tracking Feb 2023 dip</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Phase 1e (32s - 40s): Chart dissolves, leaving only r = −0.39 in clean typography */}
            {beatElapsedSeconds >= 32 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center z-20 flex flex-col items-center gap-3"
              >
                <div className="text-6xl md:text-9xl font-extralight text-slate-100 tracking-wider">
                  r = −0.39
                </div>
                <div className="text-xs md:text-sm font-mono tracking-[0.25em] uppercase text-slate-400">
                  Slopes Down −2,216 TEUs/Mo · No Steady Trend
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* BEAT 2 (1:05 - 1:40 · 35s): CONVENTIONAL TRAJECTORIES (3D RADIAL FAN) */}
        {/* ============================================================== */}
        {currentBeatIndex === 2 && (
          <div className="absolute inset-0 flex items-center justify-center p-8 z-10 overflow-hidden">
            {/* Subtle Terminal Background Photo */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <img src={CONTAINER_YARD_IMG} alt="Container Yard Twilight" className="w-full h-full object-cover" />
            </div>

            {/* Background Actual Line */}
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none p-8">
              <path d={actualPathString} fill="none" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Model 1: SMA (0s - 9s) */}
            {beatElapsedSeconds < 9 && (
              <motion.div
                key="sma"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.0 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center"
              >
                <h2 className="text-5xl md:text-7xl font-extralight text-slate-100 tracking-wider mb-2">
                  SMA
                </h2>
                <div className="text-xs font-mono text-sky-400 mb-6 tracking-widest uppercase">
                  3-Period Moving Average
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 md:h-56">
                  <path d={toPath(smaPoints)} fill="none" stroke="#1B6CA8" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}

            {/* Model 2: WMA (9s - 18s) */}
            {beatElapsedSeconds >= 9 && beatElapsedSeconds < 18 && (
              <motion.div
                key="wma"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.0 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center"
              >
                <h2 className="text-5xl md:text-7xl font-extralight text-slate-100 tracking-wider mb-2">
                  WMA
                </h2>
                <div className="text-xs font-mono text-sky-400 mb-6 tracking-widest uppercase">
                  Weights: 0.50 / 0.30 / 0.20
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 md:h-56">
                  <path d={toPath(wmaPoints)} fill="none" stroke="#1B6CA8" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}

            {/* Model 3: ETS α (18s - 27s) — Smooth trajectory morphing between 0.20 -> 0.50 -> 0.80 */}
            {beatElapsedSeconds >= 18 && beatElapsedSeconds < 27 && (
              <motion.div
                key="ets"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.0 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center"
              >
                <h2 className="text-5xl md:text-7xl font-extralight text-slate-100 tracking-wider mb-2">
                  ETS
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400 mb-6 tracking-widest uppercase">
                  <span>α:</span>
                  <span className={beatElapsedSeconds < 21 ? 'text-white font-bold' : 'text-slate-500'}>0.20</span>
                  <span>→</span>
                  <span className={beatElapsedSeconds >= 21 && beatElapsedSeconds < 24 ? 'text-[#F2A541] font-bold text-sm' : 'text-slate-500'}>0.50</span>
                  <span>→</span>
                  <span className={beatElapsedSeconds >= 24 ? 'text-white font-bold' : 'text-slate-500'}>0.80</span>
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 md:h-56">
                  <path 
                    d={toPath(beatElapsedSeconds < 21 ? es02Points : beatElapsedSeconds < 24 ? es05Points : es08Points)} 
                    fill="none" 
                    stroke="#1B6CA8" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                </svg>
              </motion.div>
            )}

            {/* Model 4: TREND (27s - 35s) — Contrast: irregular vs straight line */}
            {beatElapsedSeconds >= 27 && (
              <motion.div
                key="trend"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 1.0 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center"
              >
                <h2 className="text-5xl md:text-7xl font-extralight text-slate-100 tracking-wider mb-2">
                  TREND
                </h2>
                <div className="text-xs font-mono text-slate-400 mb-6 tracking-widest uppercase">
                  Rigid Linear Fit
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 md:h-56">
                  <path d={toPath(trendPoints)} fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}

            {/* Orange Mascot in Corner with Mini Blue Container */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2.5 p-2 rounded-2xl bg-slate-950/85 border border-amber-500/50 shadow-2xl backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400 bg-[#0B2545]">
                <img src={MASCOT_ORANGE} alt="Orange Mascot" className="w-full h-full object-contain" />
              </div>
              <div className="text-[10px] font-mono text-left pr-2">
                <div className="text-amber-300 font-bold">Logistics Planner</div>
                <div className="text-slate-400">Balancing Container Flow</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BEAT 3 (1:40 - 2:10 · 30s): CONVENTIONAL OM BASELINE SELECTION  */}
        {/* ============================================================== */}
        {currentBeatIndex === 3 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10 bg-[#060B14]">
            {/* Visual 1 (0s - 15s): Black screen -> THE BASELINE -> ETS α = 0.50 with amber ONLY on α = 0.50 */}
            {beatElapsedSeconds < 15 && (
              <motion.div
                key={beatElapsedSeconds < 5 ? "thebaseline" : "etsbaseline"}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center flex flex-col items-center gap-3"
              >
                {beatElapsedSeconds < 5 ? (
                  <h1 className="text-5xl md:text-8xl font-extralight text-slate-100 tracking-[0.2em] uppercase">
                    THE BASELINE
                  </h1>
                ) : (
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400 block mb-2">
                      Conventional Benchmark
                    </span>
                    <h1 className="text-5xl md:text-8xl font-extralight text-slate-100 tracking-tight">
                      ETS <span className="text-[#F2A541] font-normal">α = 0.50</span>
                    </h1>
                  </div>
                )}
              </motion.div>
            )}

            {/* Visual 2 (15s - 30s): Minimal error indicators MAE -> RMSE -> MAPE -> SMAPE */}
            {beatElapsedSeconds >= 15 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="text-center flex flex-col items-center gap-6"
              >
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">
                  Development Period Evaluator
                </div>
                <div className="flex items-center gap-6 md:gap-10 text-xl md:text-3xl font-light font-mono text-slate-300">
                  <span className={beatElapsedSeconds < 19 ? 'text-[#F2A541] font-bold' : 'text-slate-400'}>MAE</span>
                  <span>·</span>
                  <span className={beatElapsedSeconds >= 19 && beatElapsedSeconds < 23 ? 'text-[#F2A541] font-bold' : 'text-slate-400'}>RMSE</span>
                  <span>·</span>
                  <span className={beatElapsedSeconds >= 23 && beatElapsedSeconds < 27 ? 'text-[#F2A541] font-bold' : 'text-slate-400'}>MAPE</span>
                  <span>·</span>
                  <span className={beatElapsedSeconds >= 27 ? 'text-[#F2A541] font-bold' : 'text-slate-400'}>SMAPE</span>
                </div>
                <div className="text-xs font-mono text-slate-500 mt-2">
                  (Pre-Validation Baseline · Not Final Winner)
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* BEAT 4 (2:10 - 2:50 · 40s): ARIMA + ML CHALLENGERS (CODE TERMINAL) */}
        {/* ============================================================== */}
        {currentBeatIndex === 4 && (
          <div className="absolute inset-0 flex items-center justify-center p-8 z-10 overflow-hidden">
            {/* Subtle Operations Command Backdrop */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <img src={OPERATIONS_COMMAND_IMG} alt="Operations Command" className="w-full h-full object-cover" />
            </div>

            {/* Model 1: ARIMA + macOS Python Code Sandbox (Inspired by Video 1) */}
            {beatElapsedSeconds < 16 && (
              <motion.div
                key="arima_terminal"
                initial={{ opacity: 0, z: -80, scale: 0.92 }}
                animate={{ opacity: 1, z: 0, scale: 1.0 }}
                exit={{ opacity: 0, z: 50 }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-3xl flex flex-col items-center"
              >
                {/* macOS Style Code Terminal Window (like Video 1) */}
                <div className="w-full rounded-2xl bg-slate-950/95 border border-sky-500/40 shadow-2xl overflow-hidden backdrop-blur-xl">
                  {/* Window Titlebar */}
                  <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                      <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">arima_optimization.py — Instructor Code 14</span>
                    <span className="text-[10px] font-mono text-sky-400 font-bold">AIC: 701.43</span>
                  </div>

                  {/* Terminal Code Body */}
                  <div className="p-4 font-mono text-xs md:text-sm text-slate-300 space-y-1.5 text-left leading-relaxed">
                    <p><span className="text-sky-400 font-bold">from</span> statsmodels.tsa.arima.model <span className="text-sky-400 font-bold">import</span> ARIMA</p>
                    <p><span className="text-slate-500"># Fit Order (p=1, d=1, q=0) with 1st Differencing</span></p>
                    <p>model = ARIMA(pola_train, order=(<span className="text-amber-400 font-bold">1, 1, 0</span>))</p>
                    <p>result = model.fit()</p>
                    
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-[11px]">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Stationary (d=1)
                      </span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> AR Term (p &lt; 0.01)
                      </span>
                      <span className="text-amber-300 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Lowest AIC (701.43)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xl md:text-2xl font-mono text-[#F2A541] mt-3 font-bold">
                  ARIMA (1, 1, 0)
                </div>
              </motion.div>
            )}

            {/* Model 2: Linear Regression (16s - 26s) */}
            {beatElapsedSeconds >= 16 && beatElapsedSeconds < 26 && (
              <motion.div
                key="lr"
                initial={{ opacity: 0, z: -80, scale: 0.92 }}
                animate={{ opacity: 1, z: 0, scale: 1.0 }}
                exit={{ opacity: 0, z: 50 }}
                transition={{ duration: 1.0 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center"
              >
                <h2 className="text-5xl md:text-7xl font-extralight text-slate-100 tracking-wider mb-2">
                  LINEAR REGRESSION
                </h2>
                <div className="text-xs font-mono text-sky-400 mb-6 tracking-widest uppercase">
                  Lagged Autoregressive Predictor
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 md:h-56">
                  <path d={toPath(valLrPoints)} fill="none" stroke="#1B6CA8" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}

            {/* Model 3: Random Forest abstract decision nodes (26s - 34s) */}
            {beatElapsedSeconds >= 26 && beatElapsedSeconds < 34 && (
              <motion.div
                key="rf"
                initial={{ opacity: 0, z: -80, scale: 0.92 }}
                animate={{ opacity: 1, z: 0, scale: 1.0 }}
                exit={{ opacity: 0, z: 50 }}
                transition={{ duration: 1.0 }}
                className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center"
              >
                <h2 className="text-5xl md:text-7xl font-extralight text-slate-100 tracking-wider mb-2">
                  RANDOM FOREST
                </h2>
                {/* Abstract Structured Decision Blocks */}
                <div className="flex items-center gap-3 my-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-4 h-6 rounded bg-[#1B6CA8] border border-sky-400/40"
                    />
                  ))}
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 md:h-56">
                  <path d={toPath(valRfPoints)} fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
                </svg>
              </motion.div>
            )}

            {/* Visual Question (34s - 40s): WHICH ONE WINS? -> Cut to black */}
            {beatElapsedSeconds >= 34 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0 }}
                className="text-center z-20"
              >
                <h1 className="text-5xl md:text-8xl font-extralight text-slate-100 tracking-[0.15em] uppercase">
                  WHICH ONE WINS?
                </h1>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* BEAT 5 (2:50 - 3:45 · 55s): FINAL VALIDATION COMPARISON (GREEN MASCOT INSPECTS) */}
        {/* ============================================================== */}
        {currentBeatIndex === 5 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 z-10 overflow-hidden">
            {/* Phase 5a (0s - 15s): Actual vs Forecast trajectories in validation holdout */}
            {beatElapsedSeconds < 15 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-4xl flex flex-col items-center text-center"
              >
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
                  Validation Holdout · Periods 31–36
                </div>
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-56 md:h-64 overflow-visible">
                  {/* Actual Validation Curve */}
                  <path
                    d={toPath(actualPoints.slice(30))}
                    fill="none"
                    stroke="#F8FAFC"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* ARIMA Forecast Curve */}
                  <path
                    d={toPath(valArimaPoints)}
                    fill="none"
                    stroke="#1B6CA8"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </motion.div>
            )}

            {/* Phase 5b (15s - 35s): MORPH 5 — 3D Vertical Bar Ranking by MAE; ARIMA turns amber */}
            {beatElapsedSeconds >= 15 && beatElapsedSeconds < 35 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-3xl flex flex-col gap-3 relative"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Validation Ranking by MAE
                  </span>
                  {beatElapsedSeconds >= 27 && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-lg font-mono font-bold text-[#F2A541]"
                    >
                      20,919 MAE (Winner)
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  {validationRanking.slice(0, 7).map((item, idx) => {
                    const isArima = item.rank === 1;
                    const maxMAE = 40000;
                    const barWidth = Math.min(100, (item.mae / maxMAE) * 100);
                    return (
                      <div key={item.name} className="flex items-center gap-3 text-xs font-mono">
                        <span className="w-6 text-slate-500">#{item.rank}</span>
                        <span className={`w-44 text-right truncate ${isArima && beatElapsedSeconds >= 25 ? 'text-[#F2A541] font-bold' : 'text-slate-300'}`}>
                          {item.name}
                        </span>
                        {/* 3D Extruded Bar */}
                        <div className="flex-1 h-4 bg-slate-950/80 rounded border border-slate-800 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 1.0, delay: idx * 0.12 }}
                            className={`h-full rounded ${
                              isArima && beatElapsedSeconds >= 25
                                ? 'bg-gradient-to-r from-amber-600 via-[#F2A541] to-amber-300 shadow-[0_0_12px_rgba(242,165,65,0.6)]'
                                : 'bg-[#1B6CA8]'
                            }`}
                          />
                        </div>
                        <span className={`w-20 ${isArima && beatElapsedSeconds >= 25 ? 'text-[#F2A541] font-bold' : 'text-slate-400'}`}>
                          {item.mae.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Green Validator Mascot Inspecting with Magnifying Glass */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-12 -right-8 hidden md:flex items-center gap-2 p-2 rounded-2xl bg-slate-950/90 border border-emerald-500/50 shadow-2xl backdrop-blur-md"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-400 bg-[#0B2545]">
                    <img src={MASCOT_GREEN} alt="Green Mascot" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-[10px] font-mono text-left pr-2">
                    <div className="text-emerald-300 font-bold">Validation Inspector</div>
                    <div className="text-slate-400">Verifying 20,919 Error Floor</div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Phase 5c (35s - 45s): Cinematic 6-Metric Sequence (MAE -> MSE -> RMSE -> MAPE -> SMAPE -> MPE) */}
            {beatElapsedSeconds >= 35 && beatElapsedSeconds < 45 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.0 }}
                className="text-center flex flex-col items-center gap-4"
              >
                <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  Evaluation Across All 6 Required Metrics
                </div>
                {beatElapsedSeconds < 37 && (
                  <div className="text-5xl md:text-7xl font-extralight font-mono text-white">
                    MAE: <span className="text-[#F2A541] font-normal">20,919</span>
                  </div>
                )}
                {beatElapsedSeconds >= 37 && beatElapsedSeconds < 39 && (
                  <div className="text-5xl md:text-7xl font-extralight font-mono text-white">
                    MSE: <span className="text-[#F2A541] font-normal">5.97e8</span>
                  </div>
                )}
                {beatElapsedSeconds >= 39 && beatElapsedSeconds < 41 && (
                  <div className="text-5xl md:text-7xl font-extralight font-mono text-white">
                    RMSE: <span className="text-[#F2A541] font-normal">24,426</span>
                  </div>
                )}
                {beatElapsedSeconds >= 41 && beatElapsedSeconds < 43 && (
                  <div className="text-5xl md:text-7xl font-extralight font-mono text-white">
                    MAPE: <span className="text-[#F2A541] font-normal">4.71%</span>
                  </div>
                )}
                {beatElapsedSeconds >= 43 && (
                  <div className="text-5xl md:text-7xl font-extralight font-mono text-white">
                    SMAPE: <span className="text-[#F2A541] font-normal">4.82%</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Phase 5d (45s - 55s): Finalist Comparison (ETS vs RF vs ARIMA) -> ARIMA WINS */}
            {beatElapsedSeconds >= 45 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="text-center flex flex-col items-center gap-6"
              >
                <div className="grid grid-cols-3 gap-6 text-center max-w-xl">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 opacity-60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Conventional</div>
                    <div className="text-sm font-bold text-white mt-1">ETS α=0.50</div>
                    <div className="text-xs text-slate-400 mt-1">27,725 MAE</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 opacity-50">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Machine Learning</div>
                    <div className="text-sm font-bold text-white mt-1">Random Forest</div>
                    <div className="text-xs text-slate-400 mt-1">37,138 MAE</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B2545] border border-[#F2A541] shadow-2xl scale-110">
                    <div className="text-[10px] font-mono text-[#F2A541] uppercase font-bold">Statistical Winner</div>
                    <div className="text-base font-bold text-white mt-1">ARIMA (1,1,0)</div>
                    <div className="text-xs text-emerald-400 font-bold mt-1">20,919 MAE</div>
                  </div>
                </div>

                <h1 className="text-4xl md:text-7xl font-extralight text-[#F2A541] tracking-[0.2em] uppercase mt-2">
                  ARIMA WINS
                </h1>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* BEAT 6 (3:45 - 4:30 · 45s): RECOMMENDATION, OVERSIGHT & BOOKEND */}
        {/* ============================================================== */}
        {currentBeatIndex === 6 && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Phase 6a (0s - 14s): MORPH 6 — Forecast line -> Operations Capacity (USE ARIMA, ROLL FORWARD) */}
            {beatElapsedSeconds < 14 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center z-10 flex flex-col items-center gap-4"
              >
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-[#F2A541]">
                  Operational Management Action
                </div>
                <h1 className="text-5xl md:text-8xl font-extralight text-white tracking-tight">
                  USE ARIMA
                </h1>
                <div className="text-2xl md:text-4xl font-mono text-[#F2A541]">
                  (1, 1, 0)
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mt-2">
                  ROLL FORWARD MONTHLY
                </div>
              </motion.div>
            )}

            {/* Phase 6b (14s - 24s): Buffer Concept — ARIMA Forecast -> Safety Buffer -> Operational Plan */}
            {beatElapsedSeconds >= 14 && beatElapsedSeconds < 24 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center z-10 flex flex-col items-center gap-6"
              >
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-slate-400">
                  Capacity Commitment Protocol
                </div>
                <div className="flex flex-col items-center gap-3 text-lg md:text-2xl font-light">
                  <span className="text-slate-300">ARIMA (1,1,0) Primary</span>
                  <span className="text-slate-500">↓</span>
                  <span className="text-[#F2A541] font-mono font-bold">+5% Flexible Buffer (Up to 10%)</span>
                  <span className="text-slate-500">↓</span>
                  <span className="text-emerald-400 font-semibold">Berth &amp; Labor Dispatch (ETS Backup)</span>
                </div>
              </motion.div>
            )}

            {/* Phase 6c (24s - 32s): Human Oversight Hierarchy (MODEL -> HUMAN -> DECISION) */}
            {beatElapsedSeconds >= 24 && beatElapsedSeconds < 32 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0 }}
                className="text-center z-10 flex flex-col items-center gap-6"
              >
                <div className="flex items-center gap-4 md:gap-8 text-2xl md:text-5xl font-extralight tracking-wider">
                  <span className="text-slate-500">MODEL</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-[#F2A541] font-normal">HUMAN</span>
                  <span className="text-slate-600">→</span>
                  <span className="text-white">DECISION</span>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono text-slate-400 uppercase tracking-widest mt-2">
                  <span>QUARTERLY REVIEW (TRIGGER &gt; 6.2%)</span>
                  <span>·</span>
                  <span>SHOCKS</span>
                  <span>·</span>
                  <span>HUMAN SIGN-OFF</span>
                </div>
              </motion.div>
            )}

            {/* Phase 6d (32s - 40s): MORPH 7 — Return to Port of LA Scene + Final Statement */}
            {beatElapsedSeconds >= 32 && beatElapsedSeconds < 40 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center p-8 text-center"
              >
                <img
                  src={ESTABLISHING_SHOT_IMG}
                  alt="Port of Los Angeles Final Bookend"
                  className="w-full h-full object-cover brightness-[0.35] contrast-[1.1]"
                />
                <div className="relative z-10 max-w-4xl flex flex-col items-center gap-3">
                  <h2 className="text-3xl md:text-5xl font-light text-white tracking-wide">
                    USE ARIMA (1,1,0).
                  </h2>
                  <div className="text-sm md:text-base font-mono text-[#F2A541] tracking-widest uppercase">
                    +5% FLEXIBLE BUFFER · REVALIDATE QUARTERLY.
                  </div>
                  <div className="text-xs md:text-sm font-mono text-slate-400 tracking-widest uppercase">
                    ETS α = 0.50 SPREADSHEET BACKUP · HUMAN REVIEW.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 6e (40s - 45s): Minimal Black End Card with 3 Mascots Assemble */}
            {beatElapsedSeconds >= 40 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 bg-[#060B14] flex flex-col items-center justify-center gap-4 z-20 text-center px-6"
              >
                {/* 3 Mascots in End Card */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-sky-400 bg-slate-900 p-1">
                    <img src={MASCOT_BLUE} alt="Blue Mascot" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 bg-[#0B2545] p-1 scale-110">
                    <img src={MASCOT_ORANGE} alt="Orange Mascot" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-400 bg-slate-900 p-1">
                    <img src={MASCOT_GREEN} alt="Green Mascot" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="text-xl sm:text-2xl md:text-4xl font-extralight tracking-[0.25em] uppercase text-slate-200">
                  IE-PC 3112 · GROUP 7
                </div>
                <div className="text-xs sm:text-sm font-mono text-slate-400 tracking-widest">
                  OPERATIONS MANAGEMENT 1 · BSIE 3-E · SECTION D10
                </div>
                <div className="text-xs text-sky-400 font-mono">
                  Cebu Technological University – Main Campus
                </div>
              </motion.div>
            )}
          </div>
        )}
        </div>

        {/* ============================================================== */}
        {/* MINIMAL KEYNOTE TRANSPORT HUD                                 */}
        {/* ============================================================== */}
        <AnimatePresence>
          {(mouseActive || !isPlaying) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-[#060B14]/95 via-[#060B14]/60 to-transparent flex flex-col gap-2 z-30"
            >
              {/* Progress Scrub Bar (Exactly 7 Beats) */}
              <div className="grid grid-cols-7 gap-1.5 w-full">
                {KEYNOTE_BEATS.map((beat, idx) => {
                  const isPast = currentBeatIndex > idx;
                  const isCurrent = currentBeatIndex === idx;
                  const beatProgress = isCurrent
                    ? (beatElapsedSeconds / beat.durationSeconds) * 100
                    : isPast
                    ? 100
                    : 0;

                  return (
                    <div
                      key={beat.id}
                      onClick={() => skipToBeat(idx)}
                      className="group cursor-pointer py-1.5 flex flex-col gap-1"
                    >
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 group-hover:bg-[#F2A541] transition-all"
                          style={{ width: `${beatProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 group-hover:text-slate-300">
                        <span>{idx === 0 ? 'Intro' : `B${idx}`}</span>
                        <span>{beat.durationSeconds}s</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Control Row */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                {/* Left: Play/Pause, Replay, Time */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentBeatIndex(0);
                      setBeatElapsedSeconds(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                    title="Restart from Beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                    title={isMuted ? "Unmute Ambient Bed" : "Mute Ambient Bed"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <div className="font-mono text-[11px] text-slate-400 pl-2">
                    <span className="text-white font-bold">{formatTime(totalElapsedSeconds)}</span>
                    <span className="mx-1 text-slate-600">/</span>
                    <span>{formatTime(TOTAL_KEYNOTE_SECONDS)}</span>
                  </div>
                </div>

                {/* Center: Slide Title */}
                <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="text-sky-400 font-bold">
                    {currentBeat.beatNumber === 0 ? 'Prologue:' : `Beat ${currentBeat.beatNumber} of 6:`}
                  </span>
                  <span className="text-white truncate max-w-sm">{currentBeat.title}</span>
                </div>

                {/* Right: Fullscreen & Presenter Notes */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPresenterHUD(!showPresenterHUD)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
                      showPresenterHUD
                        ? 'bg-[#1B6CA8] text-white font-bold'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Presenter Teleprompter</span>
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
                    title="Toggle Fullscreen (F)"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Presenter Teleprompter HUD (Press C or click button) */}
        <AnimatePresence>
          {showPresenterHUD && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-20 inset-x-4 md:inset-x-12 z-40 bg-slate-950/95 border border-[#1B6CA8]/60 p-4 rounded-xl shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-[#F2A541]" />
                  <span className="font-bold text-[#F2A541]">LIVE SPEAKER SCRIPT (Presenter-First)</span>
                  <span className="text-slate-400 font-mono">· {currentBeat.speaker}</span>
                </div>
                <button
                  onClick={() => setShowPresenterHUD(false)}
                  className="text-slate-400 hover:text-white text-xs font-mono"
                >
                  ✕ Close (C)
                </button>
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-serif">
                "{currentBeat.livePresenterPrompt}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Presentation Modal */}
      <ExportPresentationModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};
