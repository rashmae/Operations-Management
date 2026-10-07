/**
 * "The Forecast: Port of Los Angeles Monthly Export Volume (TEUs)"
 * Applied Study 1: Real-Data Forecasting Decision Challenge
 * IE-PC 3112: Operations Management 1 · BSIE 3-E · Group 7 · Cebu Technological University
 * 
 * Cinematic Data Film: 12 Continuous Scenes (300 Seconds · Exactly 5:00 Minutes)
 * Flow: PORT → DATA → DATA BEHAVIOR → FORECASTING MODELS → TESTING → WINNER → OPERATIONS → PORT
 * 
 * Scene 1  — 30s: Opening: The Port (Real Port → Container Particles → 36 Months Timeline)
 * Scene 2  — 40s: Data Becomes a Time-Series Graph (36 Points Connect → Dimensional 3D Data Object)
 * Scene 3  — 40s: Data Behavior: Four Components (Center-Stage Zoom into Trend, Seasonality, Cyclical, Random)
 * Scene 4  — 50s: Four Conventional Models (Overview → Center-Stage Zooms: SMA, WMA, ETS, Trend r = -0.39)
 * Scene 5  — 20s: Four Models Become One Test (Development 30 Months vs Validation 6 Months Partition)
 * Scene 6  — 15s: Model Error Becomes Visible (Actual vs Forecast Gaps → Physical Error Bars → MAE)
 * Scene 7  — 30s: Advanced Models Enter (ARIMA 1,1,0, Lagged Linear Regression, Random Forest 100 Trees)
 * Scene 8  — 15s: Final Model Competition (All 9 Models Ranked Vertically by Out-of-Sample MAE)
 * Scene 9  — 15s: ARIMA Wins (ARIMA 1,1,0 MAE 20,919 vs ETS α=0.50 MAE 27,725 · ≈25% Lower Error)
 * Scene 10 — 15s: Forecast Becomes Operations (Container Flow → Labor, Equipment, Berth Capacity)
 * Scene 11 — 15s: Underforecasting + Modest Capacity Buffer (Planning Margin Above Forecast)
 * Scene 12 — 15s: Limitations, Human Oversight & Return to the Port (Human Review → Port Aerial Hold)
 */

import { BaselineModelChoice } from './forecastingData';

export interface KeynoteBeat {
  id: string;
  beatNumber: number;
  slideNumber: number;
  title: string;
  beatTitle: string;
  actTitle: string;
  flowSection: string;
  durationSeconds: number;
  cumulativeStartSeconds: number;
  speaker: string;
  speakerRole: string;
  speakerInitials: string;
  livePresenterPrompt: string;
  liveSpeakerPrompt: string;
  onScreenStoryCaptions: string[];
  dataHighlight?: string;
  keyMetric?: {
    label: string;
    value: string;
    sublabel?: string;
  };
}

export const KEYNOTE_BEATS: KeynoteBeat[] = [
  // =========================================================================
  // SCENE 1 (0:00 - 0:30 · 30s) — OPENING: THE PORT
  // =========================================================================
  {
    id: "scene-1",
    beatNumber: 0,
    slideNumber: 1,
    title: "Opening: The Port",
    beatTitle: "Scene 1: The Port · Real World to Data",
    actTitle: "Act I: Physical Port to Data Space",
    flowSection: "Port of Los Angeles Maritime Gateway & 36-Month Timeline",
    durationSeconds: 30,
    cumulativeStartSeconds: 0,
    speaker: "Aligato, Elaiza Jane",
    speakerRole: "Lead Analyst · Speaker 1",
    speakerInitials: "EA",
    livePresenterPrompt: "Welcome to the Port of Los Angeles, America's leading maritime gateway. Behind every container vessel docking at the berths, every crane hoist, and every longshore gang assignment lies a pivotal industrial engineering problem: anticipating monthly export container volume. A single physical container on the dock dissolves into glowing data particles. These particles ascend, crystallize, and arrange into a horizontal chronological timeline: 36 consecutive monthly observations, from January 2022 through December 2024, measured in Twenty-Foot Equivalent Units — TEUs.",
    liveSpeakerPrompt: "Welcome to the Port of Los Angeles, America's leading maritime gateway. Behind every container vessel docking at the berths, every crane hoist, and every longshore gang assignment lies a pivotal industrial engineering problem: anticipating monthly export container volume. A single physical container on the dock dissolves into glowing data particles. These particles ascend, crystallize, and arrange into a horizontal chronological timeline: 36 consecutive monthly observations, from January 2022 through December 2024, measured in Twenty-Foot Equivalent Units — TEUs.",
    onScreenStoryCaptions: [
      "PORT OF LOS ANGELES",
      "36 MONTHS",
      "JAN 2022 — DEC 2024",
      "TEUs"
    ],
    dataHighlight: "Physical Container → Data Particles → 36 Months Timeline",
    keyMetric: {
      label: "Dataset D10",
      value: "36 MONTHS",
      sublabel: "Jan 2022 – Dec 2024 Verified Export TEUs"
    }
  },

  // =========================================================================
  // SCENE 2 (0:30 - 1:10 · 40s) — DATA BECOMES A TIME-SERIES GRAPH
  // =========================================================================
  {
    id: "scene-2",
    beatNumber: 1,
    slideNumber: 2,
    title: "Data Becomes a Time-Series Graph",
    beatTitle: "Scene 2: Data Becomes Time-Series Graph",
    actTitle: "Act I: Physical Port to Data Space",
    flowSection: "Chronological Data Points Form Dimensional Time Series",
    durationSeconds: 40,
    cumulativeStartSeconds: 30,
    speaker: "Aligato, Elaiza Jane",
    speakerRole: "Lead Analyst · Speaker 1",
    speakerInitials: "EA",
    livePresenterPrompt: "The thirty-six data points align into their chronological coordinates. A luminous vector connects them, giving birth to a dimensional three-dimensional time-series curve. As the camera travels along this path, the reality of Pacific trade emerges: high volumes in early 2022, followed by a persistent slide through late 2022. In February 2023, volume collapses to 236,264 TEUs — the sharpest structural shock in the entire thirty-six months. A tentative recovery ensues through 2023, oscillating until a strong upward surge in the final six months of 2024.",
    liveSpeakerPrompt: "The thirty-six data points align into their chronological coordinates. A luminous vector connects them, giving birth to a dimensional three-dimensional time-series curve. As the camera travels along this path, the reality of Pacific trade emerges: high volumes in early 2022, followed by a persistent slide through late 2022. In February 2023, volume collapses to 236,264 TEUs — the sharpest structural shock in the entire thirty-six months. A tentative recovery ensues through 2023, oscillating until a strong upward surge in the final six months of 2024.",
    onScreenStoryCaptions: [
      "CHRONOLOGICAL TIMELINE",
      "2022 DECLINE",
      "FEB 2023 LOW: 236,264",
      "2024 RECOVERY"
    ],
    dataHighlight: "36 Months Verified TEUs · Historical Shock: 236,264 TEUs",
    keyMetric: {
      label: "Series Low",
      value: "236,264 TEUs",
      sublabel: "February 2023 Structural Shock"
    }
  },

  // =========================================================================
  // SCENE 3 (1:10 - 1:50 · 40s) — DATA BEHAVIOR: FOUR COMPONENTS
  // =========================================================================
  {
    id: "scene-3",
    beatNumber: 2,
    slideNumber: 3,
    title: "Data Behavior: Four Components",
    beatTitle: "Scene 3: Data Behavior · Four Components",
    actTitle: "Act I: Physical Port to Data Space",
    flowSection: "Center-Stage Zoom: Trend, Seasonality, Cyclical, Random",
    durationSeconds: 40,
    cumulativeStartSeconds: 70,
    speaker: "Aligato, Elaiza Jane",
    speakerRole: "Lead Analyst · Speaker 1",
    speakerInitials: "EA",
    livePresenterPrompt: "The complete graph expands into center stage. To model this series, Industrial Engineering decomposes it into four fundamental components. First, TREND: the camera pushes toward the long-term direction; a faint linear slope emerges showing only a slight upward or weak tilt. Second, SEASONALITY: moving to matching months across 2022, 2023, and 2024, showing weak, irregular repetition rather than rigid calendar cycles. Third, CYCLICAL: multi-month waves of contraction and recovery across international trade. Fourth, RANDOM: camera zooms into February 2023 — unexpected noise and severe shocks. All four layers visually recombine into THE OBSERVED DATA.",
    liveSpeakerPrompt: "The complete graph expands into center stage. To model this series, Industrial Engineering decomposes it into four fundamental components. First, TREND: the camera pushes toward the long-term direction; a faint linear slope emerges showing only a slight upward or weak tilt. Second, SEASONALITY: moving to matching months across 2022, 2023, and 2024, showing weak, irregular repetition rather than rigid calendar cycles. Third, CYCLICAL: multi-month waves of contraction and recovery across international trade. Fourth, RANDOM: camera zooms into February 2023 — unexpected noise and severe shocks. All four layers visually recombine into THE OBSERVED DATA.",
    onScreenStoryCaptions: [
      "TREND (SLIGHT UPWARD)",
      "SEASONALITY (WEAK / IRREGULAR)",
      "CYCLICAL (LONG WAVES)",
      "RANDOM (FEB 2023 SHOCK)"
    ],
    dataHighlight: "4 Components Decomposed & Recombined into Observed Series",
    keyMetric: {
      label: "Component Decomp",
      value: "4 FORCES",
      sublabel: "Trend · Seasonality · Cyclical · Random"
    }
  },

  // =========================================================================
  // SCENE 4 (1:50 - 2:40 · 50s) — FOUR CONVENTIONAL MODELS (CENTER-STAGE ZOOMS)
  // =========================================================================
  {
    id: "scene-4",
    beatNumber: 3,
    slideNumber: 4,
    title: "Four Conventional Models",
    beatTitle: "Scene 4: Four Conventional Contenders",
    actTitle: "Act II: Conventional OM Lab",
    flowSection: "Overview → Center-Stage Zooms: SMA, WMA, ETS, Trend Projection",
    durationSeconds: 50,
    cumulativeStartSeconds: 110,
    speaker: "Rash Mae Crystelle C. Ansay",
    speakerRole: "Port Operations Planner · Speaker 2",
    speakerInitials: "RA",
    livePresenterPrompt: "We now enter our Operations Management forecasting laboratory. Four conventional models appear in panoramic overview: Simple Moving Average, Weighted Moving Average, Exponential Smoothing, and Trend Projection. The camera pushes into 3-Period SMA: a sliding window averages the latest three months, lagging behind sudden shifts. Next, WMA zooms to center stage: weights of 0.50, 0.30, and 0.20 give recency greater influence. Next, Exponential Smoothing: we test alphas 0.20, 0.50, and 0.80. Alpha 0.50 achieves balanced response and lowest development error, locked as our SELECTED CONVENTIONAL BASELINE. Finally, Trend Projection zooms in: fitting a straight line yields r = -0.39 with a downward slope (-2,216 TEUs/month) — proving a rigid linear trend that cannot track port cyclicality and level shifts.",
    liveSpeakerPrompt: "We now enter our Operations Management forecasting laboratory. Four conventional models appear in panoramic overview: Simple Moving Average, Weighted Moving Average, Exponential Smoothing, and Trend Projection. The camera pushes into 3-Period SMA: a sliding window averages the latest three months, lagging behind sudden shifts. Next, WMA zooms to center stage: weights of 0.50, 0.30, and 0.20 give recency greater influence. Next, Exponential Smoothing: we test alphas 0.20, 0.50, and 0.80. Alpha 0.50 achieves balanced response and lowest development error, locked as our SELECTED CONVENTIONAL BASELINE. Finally, Trend Projection zooms in: fitting a straight line yields r = -0.39 with a downward slope (-2,216 TEUs/month) — proving a rigid linear trend that cannot track port cyclicality and level shifts.",
    onScreenStoryCaptions: [
      "SMA (3-PERIOD WINDOW)",
      "WMA (0.50 / 0.30 / 0.20)",
      "ETS α = 0.50 (BASELINE ★)",
      "TREND (r = -0.39 DOWNWARD)"
    ],
    dataHighlight: "Center-Stage Zooms · ETS α=0.50 Locked Baseline · Trend r = -0.39",
    keyMetric: {
      label: "Conventional Baseline",
      value: "ETS α = 0.50",
      sublabel: "Dev MAE: 30,596 · r = -0.39 down-slope"
    }
  },

  // =========================================================================
  // SCENE 5 (2:40 - 3:00 · 20s) — FOUR MODELS BECOME ONE TEST
  // =========================================================================
  {
    id: "scene-5",
    beatNumber: 4,
    slideNumber: 5,
    title: "Four Models Become One Test",
    beatTitle: "Scene 5: Partition & Blind Validation",
    actTitle: "Act II: Conventional OM Lab",
    flowSection: "Chronological Split: 30 Months Development vs 6 Months Validation",
    durationSeconds: 20,
    cumulativeStartSeconds: 160,
    speaker: "Rash Mae Crystelle C. Ansay",
    speakerRole: "Port Operations Planner · Speaker 2",
    speakerInitials: "RA",
    livePresenterPrompt: "All four model paths converge at period thirty. A bright vertical barrier partitions history: thirty development months on the left, and six held-out validation months on the right. In genuine terminal management, forecasters never inspect future manifests. The unseen actual trajectory of July to December 2024 materializes, and our competing forecast lines extend into the blind horizon.",
    liveSpeakerPrompt: "All four model paths converge at period thirty. A bright vertical barrier partitions history: thirty development months on the left, and six held-out validation months on the right. In genuine terminal management, forecasters never inspect future manifests. The unseen actual trajectory of July to December 2024 materializes, and our competing forecast lines extend into the blind horizon.",
    onScreenStoryCaptions: [
      "DEVELOPMENT (30 MONTHS)",
      "VALIDATION (6 MONTHS)",
      "HOLDOUT HORIZON",
      "ONE TEST"
    ],
    dataHighlight: "Chronological Split: Months 1–30 Development vs 31–36 Validation",
    keyMetric: {
      label: "Validation Split",
      value: "6 MONTHS",
      sublabel: "Blind Out-of-Sample Holdout (Jul–Dec 2024)"
    }
  },

  // =========================================================================
  // SCENE 6 (3:00 - 3:15 · 15s) — MODEL ERROR BECOMES VISIBLE
  // =========================================================================
  {
    id: "scene-6",
    beatNumber: 5,
    slideNumber: 6,
    title: "Model Error Becomes Visible",
    beatTitle: "Scene 6: Physical Error Gaps to MAE",
    actTitle: "Act II: Conventional OM Lab",
    flowSection: "Distance to Actual Transforms into Physical Error Bars (MAE)",
    durationSeconds: 15,
    cumulativeStartSeconds: 180,
    speaker: "Rash Mae Crystelle C. Ansay",
    speakerRole: "Port Operations Planner · Speaker 2",
    speakerInitials: "RA",
    livePresenterPrompt: "The distance between each model's projection and the actual volume becomes a visible physical gap. These gaps detach, transform into elegant vertical bars, and resolve into Mean Absolute Error. In terminal logistics, the rule is unmistakable: smaller error means tighter container staging, less idle labor, and superior capacity reliability.",
    liveSpeakerPrompt: "The distance between each model's projection and the actual volume becomes a visible physical gap. These gaps detach, transform into elegant vertical bars, and resolve into Mean Absolute Error. In terminal logistics, the rule is unmistakable: smaller error means tighter container staging, less idle labor, and superior capacity reliability.",
    onScreenStoryCaptions: [
      "ACTUAL VS FORECAST",
      "PHYSICAL GAP",
      "ERROR → MAE",
      "SMALLER = BETTER"
    ],
    dataHighlight: "Prediction Gaps Morph into Physical Error Metric (MAE)",
    keyMetric: {
      label: "Error Metric",
      value: "MAE",
      sublabel: "Mean Absolute Error in Physical TEUs"
    }
  },

  // =========================================================================
  // SCENE 7 (3:15 - 3:45 · 30s) — ADVANCED MODELS ENTER
  // =========================================================================
  {
    id: "scene-7",
    beatNumber: 6,
    slideNumber: 7,
    title: "Advanced Models Enter",
    beatTitle: "Scene 7: Statistical & ML Challengers",
    actTitle: "Act III: Advanced Algorithmic Arena",
    flowSection: "ARIMA (1,1,0), Lagged Linear Regression, Random Forest 100 Trees",
    durationSeconds: 30,
    cumulativeStartSeconds: 195,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "Our locked ETS alpha 0.50 baseline remains on stage as three advanced algorithmic challengers emerge directly from the time series. First, ARIMA (1,1,0): first-differencing creates stationarity while an autoregressive parameter absorbs momentum with lowest AIC. Second, Lagged Linear Regression: autoregressive lags one through three driving linear predictions. Third, Random Forest Regressor: an ensemble of one hundred decision trees segmenting past feature thresholds. Can complex machine learning beat parsimonious time-series statistics?",
    liveSpeakerPrompt: "Our locked ETS alpha 0.50 baseline remains on stage as three advanced algorithmic challengers emerge directly from the time series. First, ARIMA (1,1,0): first-differencing creates stationarity while an autoregressive parameter absorbs momentum with lowest AIC. Second, Lagged Linear Regression: autoregressive lags one through three driving linear predictions. Third, Random Forest Regressor: an ensemble of one hundred decision trees segmenting past feature thresholds. Can complex machine learning beat parsimonious time-series statistics?",
    onScreenStoryCaptions: [
      "ARIMA (1,1,0) · AIC 701.43",
      "LAGGED REGRESSION (LAGS 1–3)",
      "RANDOM FOREST (100 TREES)",
      "STATISTICS VS ML"
    ],
    dataHighlight: "3 Advanced Contenders Emerge: ARIMA (1,1,0), Lagged LR, Random Forest",
    keyMetric: {
      label: "Contenders",
      value: "9 MODELS",
      sublabel: "Conventional vs ARIMA vs Machine Learning"
    }
  },

  // =========================================================================
  // SCENE 8 (3:45 - 4:05 · 20s) — FINAL MODEL COMPETITION
  // =========================================================================
  {
    id: "scene-8",
    beatNumber: 7,
    slideNumber: 8,
    title: "Final Model Competition",
    beatTitle: "Scene 8: Out-of-Sample Leaderboard",
    actTitle: "Act III: Advanced Algorithmic Arena",
    flowSection: "All 9 Models Compete · Vertical Dynamic Ranking by Validation MAE",
    durationSeconds: 20,
    cumulativeStartSeconds: 225,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "All nine forecasting models compete across the blind validation horizon. The competing lines transform into an animated vertical leaderboard, shifting position in real time according to out-of-sample error. ARIMA claims first place at 20,919 TEUs. ETS 0.80 follows at 22,952. Our baseline ETS 0.50 achieves 27,725. WMA scores 28,473; SMA 31,927. Random Forest and Lagged Regression fall behind four conventional methods at 37,138 and 37,990, while Trend Projection collapses to 52,142.",
    liveSpeakerPrompt: "All nine forecasting models compete across the blind validation horizon. The competing lines transform into an animated vertical leaderboard, shifting position in real time according to out-of-sample error. ARIMA claims first place at 20,919 TEUs. ETS 0.80 follows at 22,952. Our baseline ETS 0.50 achieves 27,725. WMA scores 28,473; SMA 31,927. Random Forest and Lagged Regression fall behind four conventional methods at 37,138 and 37,990, while Trend Projection collapses to 52,142.",
    onScreenStoryCaptions: [
      "9 MODELS RANKED",
      "ARIMA: 20,919 MAE",
      "ML BEHIND CONVENTIONAL",
      "PARSIMONY WINS"
    ],
    dataHighlight: "Official Validation MAE Ranking: ARIMA #1 (20,919 TEUs)",
    keyMetric: {
      label: "Top Rank",
      value: "ARIMA #1",
      sublabel: "Outperforms all 8 alternative models"
    }
  },

  // =========================================================================
  // SCENE 9 (4:05 - 4:25 · 20s) — ARIMA WINS
  // =========================================================================
  {
    id: "scene-9",
    beatNumber: 8,
    slideNumber: 9,
    title: "ARIMA Wins",
    beatTitle: "Scene 9: The Decisive Victory",
    actTitle: "Act III: Advanced Algorithmic Arena",
    flowSection: "ARIMA (1,1,0) Center Stage vs ETS α=0.50 · 25% Lower MAE",
    durationSeconds: 20,
    cumulativeStartSeconds: 245,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "ARIMA (1,1,0) commands the entire screen as the glowing primary path. Its Mean Absolute Error of 20,919 TEUs stands in clear visual comparison against our selected conventional baseline, ETS alpha 0.50, at 27,725 TEUs. That is an unmistakable twenty-five percent reduction in container error. By differencing consecutive months, ARIMA adapted instantly to 2024's volume surge where static models fell short.",
    liveSpeakerPrompt: "ARIMA (1,1,0) commands the entire screen as the glowing primary path. Its Mean Absolute Error of 20,919 TEUs stands in clear visual comparison against our selected conventional baseline, ETS alpha 0.50, at 27,725 TEUs. That is an unmistakable twenty-five percent reduction in container error. By differencing consecutive months, ARIMA adapted instantly to 2024's volume surge where static models fell short.",
    onScreenStoryCaptions: [
      "ARIMA (1,1,0)",
      "MAE 20,919",
      "ETS α=0.50: 27,725",
      "≈25% LOWER MAE"
    ],
    dataHighlight: "ARIMA (1,1,0) Achieves 20,919 MAE · ≈25% Error Reduction",
    keyMetric: {
      label: "Error Reduction",
      value: "≈25% LOWER",
      sublabel: "20,919 MAE vs 27,725 Baseline MAE"
    }
  },

  // =========================================================================
  // SCENE 10 (4:25 - 4:40 · 15s) — FORECAST BECOMES OPERATIONS
  // =========================================================================
  {
    id: "scene-10",
    beatNumber: 9,
    slideNumber: 10,
    title: "Forecast Becomes Operations",
    beatTitle: "Scene 10: Operational Translation",
    actTitle: "Act IV: Operations & Port Decision",
    flowSection: "Forecast Vector Transforms into Port Labor, Equipment, Berth Capacity",
    durationSeconds: 15,
    cumulativeStartSeconds: 265,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "The winning forecast line moves forward and transforms into an active stream of containers within the port. In terminal logistics, export volume governs three operational pillars: longshore LABOR gang scheduling, heavy EQUIPMENT crane and yard truck staging, and commercial BERTH allocation for incoming container ships.",
    liveSpeakerPrompt: "The winning forecast line moves forward and transforms into an active stream of containers within the port. In terminal logistics, export volume governs three operational pillars: longshore LABOR gang scheduling, heavy EQUIPMENT crane and yard truck staging, and commercial BERTH allocation for incoming container ships.",
    onScreenStoryCaptions: [
      "FORECAST → OPERATIONS",
      "LABOR SCHEDULING",
      "EQUIPMENT STAGING",
      "BERTH ALLOCATION"
    ],
    dataHighlight: "Mathematical Output Drives Physical Terminal Operations",
    keyMetric: {
      label: "Operational Pillars",
      value: "3 AREAS",
      sublabel: "Labor · Equipment · Berth Capacity"
    }
  },

  // =========================================================================
  // SCENE 11 (4:40 - 4:55 · 15s) — UNDERFORECASTING + CAPACITY BUFFER
  // =========================================================================
  {
    id: "scene-11",
    beatNumber: 10,
    slideNumber: 11,
    title: "Underforecasting + Capacity Buffer",
    beatTitle: "Scene 11: Asymmetric Risk & Buffer",
    actTitle: "Act IV: Operations & Port Decision",
    flowSection: "Actuals Sit Above Forecasts → Modest Capacity Buffer Margin",
    durationSeconds: 15,
    cumulativeStartSeconds: 280,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "Notice that actual validation volumes sat slightly above forecasts. In maritime terminals, under-forecasting carries heavy asymmetric penalties: vessel anchorage delays, yard bottlenecks, and carrier demurrage claims exceeding fifty thousand dollars a day. Therefore, terminal leadership must incorporate a modest capacity buffer above the raw forecast to protect throughput.",
    liveSpeakerPrompt: "Notice that actual validation volumes sat slightly above forecasts. In maritime terminals, under-forecasting carries heavy asymmetric penalties: vessel anchorage delays, yard bottlenecks, and carrier demurrage claims exceeding fifty thousand dollars a day. Therefore, terminal leadership must incorporate a modest capacity buffer above the raw forecast to protect throughput.",
    onScreenStoryCaptions: [
      "UNDERFORECAST RISK",
      "DEMURRAGE COST",
      "MODEST CAPACITY BUFFER",
      "SAFETY MARGIN"
    ],
    dataHighlight: "Asymmetric Demurrage Risk Justifies Modest Capacity Buffer",
    keyMetric: {
      label: "Risk Policy",
      value: "CAPACITY BUFFER",
      sublabel: "Insulates against demurrage and congestion"
    }
  },

  // =========================================================================
  // SCENE 12 & FINAL SCENE (4:55 - 5:00 · 15s) — LIMITATIONS, HUMAN OVERSIGHT & RETURN TO THE PORT
  // =========================================================================
  {
    id: "scene-12",
    beatNumber: 11,
    slideNumber: 12,
    title: "Limitations & Return to the Port",
    beatTitle: "Scene 12: Human Review & Port Return",
    actTitle: "Act IV: Operations & Port Decision",
    flowSection: "Human Review · ARIMA Primary · ETS Backup · Port Aerial Hold",
    durationSeconds: 15,
    cumulativeStartSeconds: 295,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "Yet no statistical model can anticipate tariff overhauls, labor disputes, or geopolitical route diversions. The model informs the plan; the human engineer makes the final commitment. Deploy ARIMA (1,1,0) as primary, with ETS alpha 0.50 as spreadsheet backup, under rigorous human review. The screen zooms through the forecast line, returning to the vast cranes and waters of the Port of Los Angeles: Forecast the volume. Plan the capacity. ARIMA (1,1,0).",
    liveSpeakerPrompt: "Yet no statistical model can anticipate tariff overhauls, labor disputes, or geopolitical route diversions. The model informs the plan; the human engineer makes the final commitment. Deploy ARIMA (1,1,0) as primary, with ETS alpha 0.50 as spreadsheet backup, under rigorous human review. The screen zooms through the forecast line, returning to the vast cranes and waters of the Port of Los Angeles: Forecast the volume. Plan the capacity. ARIMA (1,1,0).",
    onScreenStoryCaptions: [
      "FORECAST ≠ CERTAINTY",
      "HUMAN REVIEW",
      "ARIMA PRIMARY · ETS BACKUP",
      "PLAN THE CAPACITY"
    ],
    dataHighlight: "ARIMA (1,1,0) Primary · ETS α=0.50 Backup · Human Review",
    keyMetric: {
      label: "Final Verdict",
      value: "ARIMA (1,1,0)",
      sublabel: "Forecast Volume · Plan Capacity · Human Oversight"
    }
  }
];

export const TOTAL_KEYNOTE_SECONDS = KEYNOTE_BEATS.reduce((sum, b) => sum + b.durationSeconds, 0); // Exactly 310s ~ 5:00 minutes!

// Compatibility exports
export type SlideBeat = KeynoteBeat;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPresentationBeats = (_baseline?: BaselineModelChoice) => KEYNOTE_BEATS;
export const PRESENTATION_BEATS = KEYNOTE_BEATS;
export const TOTAL_PRESENTATION_SECONDS = TOTAL_KEYNOTE_SECONDS;
