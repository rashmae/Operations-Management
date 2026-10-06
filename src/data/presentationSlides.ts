/**
 * "The Forecast: Port of Los Angeles Monthly Export Volume (TEUs)"
 * Applied Study 1: Real-Data Forecasting Decision Challenge
 * IE-PC 3112: Operations Management 1 · BSIE 3-E · Group 7 · Cebu Technological University
 * 
 * Apple Product-Launch Keynote Presentation Flow
 * Total Presentation Runtime: 4 minutes 30 seconds (270s) — exactly within the 4-5 minute limit!
 * 7 Major Keynote Beats:
 *   Beat 0 — 25s: Prologue — "Meet Group 7" (Section D10 Forecasters Spotlight)
 *   Beat 1 — 40s: Operational Problem, Real Dataset & Data Behavior
 *   Beat 2 — 35s: Conventional Forecasting Results
 *   Beat 3 — 30s: Conventional OM Baseline Selection (ETS α=0.50)
 *   Beat 4 — 40s: ARIMA + Machine Learning Challengers
 *   Beat 5 — 55s: Final Validation Comparison (All 6 Metrics)
 *   Beat 6 — 45s: Operations Management Recommendation + Limitations + Human Oversight
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
  // BEAT 0 (0:00 - 0:25 · 25s) — PROLOGUE: MEET GROUP 7 (THE FORECASTERS)
  // =========================================================================
  {
    id: "beat-0",
    beatNumber: 0,
    slideNumber: 1,
    title: "Prologue: Meet Group 7",
    beatTitle: "Meet Group 7 · Operations Forecasters",
    actTitle: "Prologue: The Forecasters",
    flowSection: "Prologue: Meet Group 7 (BSIE 3-E · Section D10)",
    durationSeconds: 25,
    cumulativeStartSeconds: 0,
    speaker: "Group 7 Forecasters",
    speakerRole: "Team Presentation Intro",
    speakerInitials: "G7",
    livePresenterPrompt: "Good day, Engr. Lyndrian Shalom Baclayon and esteemed evaluators. We are Group 7 from Section D10, BSIE 3-E. Our presentation tackles Applied Study 1: the Port of Los Angeles Monthly Export Forecasting Challenge. Our team unites three specialized operational perspectives: Elaiza Jane Aligato, our Lead Analyst and Time-Series Specialist, decoding signals and seasonality; Rash Mae Crystelle Ansay, our Port Operations and Logistics Planner, aligning forecast volumes to dock capacity, berth allocations, and container yard staging; and Mylene Joy Villagracia, our Validation and Machine Learning Engineer, rigorously stress-testing model error across blind holdout horizons. Together, we are Group 7 — turning 36 months of real maritime export data into high-confidence terminal operations.",
    liveSpeakerPrompt: "Good day, Engr. Lyndrian Shalom Baclayon and esteemed evaluators. We are Group 7 from Section D10, BSIE 3-E. Our presentation tackles Applied Study 1: the Port of Los Angeles Monthly Export Forecasting Challenge. Our team unites three specialized operational perspectives: Elaiza Jane Aligato, our Lead Analyst and Time-Series Specialist, decoding signals and seasonality; Rash Mae Crystelle Ansay, our Port Operations and Logistics Planner, aligning forecast volumes to dock capacity, berth allocations, and container yard staging; and Mylene Joy Villagracia, our Validation and Machine Learning Engineer, rigorously stress-testing model error across blind holdout horizons. Together, we are Group 7 — turning 36 months of real maritime export data into high-confidence terminal operations.",
    onScreenStoryCaptions: [
      "MEET GROUP 7",
      "THE FORECASTERS",
      "SECTION D10 · BSIE 3-E",
      "DATA → OPERATIONS"
    ],
    dataHighlight: "Group 7 (Section D10) · 3 Specialists",
    keyMetric: {
      label: "Group 7 Lineup",
      value: "3 Specialists",
      sublabel: "BSIE 3-E · Section D10 · CTU Main"
    }
  },

  // =========================================================================
  // BEAT 1 (0:25 - 1:05 · 40s) — THE OPERATIONAL PROBLEM + REAL DATA + BEHAVIOR
  // =========================================================================
  {
    id: "beat-1",
    beatNumber: 1,
    slideNumber: 2,
    title: "Operational Problem & Data Behavior",
    beatTitle: "Operational Problem & Data Behavior",
    actTitle: "Act I: Real World to Data",
    flowSection: "Operational Problem, Real Dataset & Data Behavior",
    durationSeconds: 40,
    cumulativeStartSeconds: 25,
    speaker: "Aligato, Elaiza Jane",
    speakerRole: "Lead Analyst · Speaker 1",
    speakerInitials: "EA",
    livePresenterPrompt: "At the Port of Los Angeles, America's leading maritime gateway, every terminal decision depends on one critical question: how many container TEUs will cross the docks next month? We analyzed 36 consecutive months of verified operational export volume from January 2022 to December 2024. In February 2023, volume unexpectedly plummeted to 236,264 TEUs — the lowest month in the entire dataset. A straight line fitted to months 1 to 30 slopes downward by about 2,216 TEUs a month, with a correlation of only r = -0.39. It describes the 2022 decline and nothing that came after. With high volatility and no steady trend, terminal operations cannot plan on a straight line.",
    liveSpeakerPrompt: "At the Port of Los Angeles, America's leading maritime gateway, every terminal decision depends on one critical question: how many container TEUs will cross the docks next month? We analyzed 36 consecutive months of verified operational export volume from January 2022 to December 2024. In February 2023, volume unexpectedly plummeted to 236,264 TEUs — the lowest month in the entire dataset. A straight line fitted to months 1 to 30 slopes downward by about 2,216 TEUs a month, with a correlation of only r = -0.39. It describes the 2022 decline and nothing that came after. With high volatility and no steady trend, terminal operations cannot plan on a straight line.",
    onScreenStoryCaptions: [
      "36 MONTHS",
      "ONE QUESTION",
      "FEB 2023: 236,264 TEUs",
      "r = −0.39 (NO TREND)"
    ],
    dataHighlight: "36 Months Verified TEUs · r = −0.39 · Slope: −2,216 TEUs/mo",
    keyMetric: {
      label: "Trend Correlation",
      value: "r = −0.39",
      sublabel: "Slopes -2,216 TEUs/mo · No steady trend"
    }
  },

  // =========================================================================
  // BEAT 2 (1:05 - 1:40 · 35s) — CONVENTIONAL FORECASTING RESULTS
  // =========================================================================
  {
    id: "beat-2",
    beatNumber: 2,
    slideNumber: 3,
    title: "Conventional Forecasting Results",
    beatTitle: "Conventional Forecasting Results",
    actTitle: "Act I: Conventional OM Trajectories",
    flowSection: "Conventional Forecasting Results (Periods 1–30)",
    durationSeconds: 35,
    cumulativeStartSeconds: 65,
    speaker: "Aligato, Elaiza Jane",
    speakerRole: "Lead Analyst · Speaker 1",
    speakerInitials: "EA",
    livePresenterPrompt: "To support berth allocation and labor gang requisitions, we evaluated four conventional Operations Management methods across the 30 development months. First, a 3-Period Simple Moving Average with MAE 33,428. Second, a 3-Period Weighted Moving Average with weights 0.50, 0.30, and 0.20 achieving MAE 32,142. Third, Exponential Smoothing tested across alphas 0.20, 0.50, and 0.80 — where alpha 0.50 delivered the lowest error at MAE 30,596 and 8.80% MAPE. Finally, Trend Projection at MAE 35,201. The four approaches interpret the same irregular data in distinct ways: while the actual series oscillates wildly, the trend line slopes rigidly downward.",
    liveSpeakerPrompt: "To support berth allocation and labor gang requisitions, we evaluated four conventional Operations Management methods across the 30 development months. First, a 3-Period Simple Moving Average with MAE 33,428. Second, a 3-Period Weighted Moving Average with weights 0.50, 0.30, and 0.20 achieving MAE 32,142. Third, Exponential Smoothing tested across alphas 0.20, 0.50, and 0.80 — where alpha 0.50 delivered the lowest error at MAE 30,596 and 8.80% MAPE. Finally, Trend Projection at MAE 35,201. The four approaches interpret the same irregular data in distinct ways: while the actual series oscillates wildly, the trend line slopes rigidly downward.",
    onScreenStoryCaptions: [
      "SMA (3-Period · 33,428 MAE)",
      "WMA (0.50/0.30/0.20 · 32,142 MAE)",
      "ETS (α=0.50 · 30,596 MAE ★)",
      "TREND (35,201 MAE · r = −0.39)"
    ],
    dataHighlight: "4 Conventional Contenders · ETS α=0.50 Leads (MAE 30,596)",
    keyMetric: {
      label: "Conventional Field",
      value: "4 MODELS",
      sublabel: "ETS α=0.50 lowest dev MAE (30,596 TEUs)"
    }
  },

  // =========================================================================
  // BEAT 3 (1:40 - 2:10 · 30s) — CONVENTIONAL OM BASELINE SELECTION
  // =========================================================================
  {
    id: "beat-3",
    beatNumber: 3,
    slideNumber: 4,
    title: "Conventional OM Baseline Selection",
    beatTitle: "Conventional OM Baseline Selection",
    actTitle: "Act II: Pre-Validation Commitment",
    flowSection: "Conventional OM Baseline Selection Before Validation",
    durationSeconds: 30,
    cumulativeStartSeconds: 100,
    speaker: "Ansay, Rash Mae Crystelle C.",
    speakerRole: "Port Operations Planner · Speaker 2",
    speakerInitials: "RA",
    livePresenterPrompt: "Before our group evaluated the six validation months, we officially locked our conventional OM baseline using development data only. We selected Exponential Smoothing with alpha = 0.50. Across months 1 to 30, ETS alpha 0.50 delivered the lowest error across MAE (30,596 TEUs), RMSE (38,534 TEUs), MAPE (8.80%), and SMAPE (8.46%). A mid-range constant balanced the failure modes: alpha 0.20 reacted too slowly to shifts like the 2022 decline, while alpha 0.80 chased monthly noise. Please note: this was our locked conventional baseline — not yet the final validation winner.",
    liveSpeakerPrompt: "Before our group evaluated the six validation months, we officially locked our conventional OM baseline using development data only. We selected Exponential Smoothing with alpha = 0.50. Across months 1 to 30, ETS alpha 0.50 delivered the lowest error across MAE (30,596 TEUs), RMSE (38,534 TEUs), MAPE (8.80%), and SMAPE (8.46%). A mid-range constant balanced the failure modes: alpha 0.20 reacted too slowly to shifts like the 2022 decline, while alpha 0.80 chased monthly noise. Please note: this was our locked conventional baseline — not yet the final validation winner.",
    onScreenStoryCaptions: [
      "THE BASELINE",
      "ETS α = 0.50",
      "MAE: 30,596 · MAPE: 8.80%",
      "LOCKED PRE-VALIDATION"
    ],
    dataHighlight: "Locked Pre-Validation Baseline: ETS α = 0.50",
    keyMetric: {
      label: "Locked Baseline",
      value: "ETS α = 0.50",
      sublabel: "30,596 Dev MAE · 8.80% Dev MAPE"
    }
  },

  // =========================================================================
  // BEAT 4 (2:10 - 2:50 · 40s) — ARIMA + MACHINE LEARNING CHALLENGERS
  // =========================================================================
  {
    id: "beat-4",
    beatNumber: 4,
    slideNumber: 5,
    title: "ARIMA + Machine Learning Challengers",
    beatTitle: "ARIMA + Machine Learning Challengers",
    actTitle: "Act II: Advanced Algorithmic Contenders",
    flowSection: "Statistical & Machine Learning Results (Periods 31–36)",
    durationSeconds: 40,
    cumulativeStartSeconds: 130,
    speaker: "Ansay, Rash Mae Crystelle C.",
    speakerRole: "Port Operations Planner · Speaker 2",
    speakerInitials: "RA",
    livePresenterPrompt: "We now pit our conventional baseline against advanced competitors. First, an ARIMA model with order (1, 1, 0), which achieved the lowest AIC of 701.43 among six candidates. It differences once for stationarity and takes last month's actual with a slight pullback. Next, machine learning: Lagged Linear Regression with an intercept of 136,697 and lag weights summing to only 0.63, pulling forecasts to about 365,000 TEUs. And Random Forest with 100 trees, which averages in-sample history. On small, shifting macroeconomic series, can machine learning beat parsimonious statistics? The question is: which one wins?",
    liveSpeakerPrompt: "We now pit our conventional baseline against advanced competitors. First, an ARIMA model with order (1, 1, 0), which achieved the lowest AIC of 701.43 among six candidates. It differences once for stationarity and takes last month's actual with a slight pullback. Next, machine learning: Lagged Linear Regression with an intercept of 136,697 and lag weights summing to only 0.63, pulling forecasts to about 365,000 TEUs. And Random Forest with 100 trees, which averages in-sample history. On small, shifting macroeconomic series, can machine learning beat parsimonious statistics? The question is: which one wins?",
    onScreenStoryCaptions: [
      "ARIMA (1,1,0) · AIC: 701.43",
      "LAGGED REGRESSION (Lags 1–3)",
      "RANDOM FOREST (100 Trees)",
      "WHICH ONE WINS?"
    ],
    dataHighlight: "Statistical vs Machine Learning Contenders",
    keyMetric: {
      label: "Contenders",
      value: "3 CLASSES",
      sublabel: "Conventional vs ARIMA (1,1,0) vs Machine Learning"
    }
  },

  // =========================================================================
  // BEAT 5 (2:50 - 3:45 · 55s) — FINAL VALIDATION COMPARISON (ALL 6 METRICS)
  // =========================================================================
  {
    id: "beat-5",
    beatNumber: 5,
    slideNumber: 6,
    title: "Final Validation Comparison",
    beatTitle: "Final Validation Comparison",
    actTitle: "Act III: The Arena & Decisive Evidence",
    flowSection: "Model Comparison & Validation Results Across All 6 Metrics",
    durationSeconds: 55,
    cumulativeStartSeconds: 170,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "Here is the ultimate test: periods 31 through 36, held out as blind operational validation. In the final six months volume stepped up to an average of 445,111 TEUs — 18.0% above development. Ranking models strictly by MAE, the verdict is definitive: ARIMA (1,1,0) achieved an extraordinary MAE of 20,919 TEUs and a MAPE of 4.71% — outperforming every other model across all six evaluated metrics. It cut average error by 25% against our conventional baseline ETS alpha 0.50 (MAE 27,725). Both machine learning models finished behind four conventional methods, with Random Forest landing at 37,138 MAE and 8.31% MAPE. Simpler statistical structure decisively adapted best.",
    liveSpeakerPrompt: "Here is the ultimate test: periods 31 through 36, held out as blind operational validation. In the final six months volume stepped up to an average of 445,111 TEUs — 18.0% above development. Ranking models strictly by MAE, the verdict is definitive: ARIMA (1,1,0) achieved an extraordinary MAE of 20,919 TEUs and a MAPE of 4.71% — outperforming every other model across all six evaluated metrics. It cut average error by 25% against our conventional baseline ETS alpha 0.50 (MAE 27,725). Both machine learning models finished behind four conventional methods, with Random Forest landing at 37,138 MAE and 8.31% MAPE. Simpler statistical structure decisively adapted best.",
    onScreenStoryCaptions: [
      "VALIDATION: 31–36",
      "20,919 MAE · 4.71% MAPE",
      "24,426 RMSE · 4.82% SMAPE",
      "ARIMA WINS DECISIVELY"
    ],
    dataHighlight: "ARIMA (1,1,0) Wins Validation: 20,919 MAE · 4.71% MAPE",
    keyMetric: {
      label: "Winning Model",
      value: "ARIMA (1,1,0)",
      sublabel: "20,919 MAE · 4.71% MAPE · Lowest on all 6 metrics"
    }
  },

  // =========================================================================
  // BEAT 6 (3:45 - 4:30 · 45s) — OPERATIONS MANAGEMENT RECOMMENDATION
  // =========================================================================
  {
    id: "beat-6",
    beatNumber: 6,
    slideNumber: 7,
    title: "Operations Management Recommendation",
    beatTitle: "Operations Management Recommendation",
    actTitle: "Act III: Operational Action, Buffer & Oversight",
    flowSection: "Operations Management Recommendation + Limitations + Human Oversight",
    durationSeconds: 45,
    cumulativeStartSeconds: 225,
    speaker: "Villagracia, Mylene Joy",
    speakerRole: "ML & Validation Engineer · Speaker 3",
    speakerInitials: "MV",
    livePresenterPrompt: "How does this translate into operations management? We recommend ARIMA (1,1,0) as our primary one-month-ahead forecast for labor rosters, berth allocation, and equipment staging. Because every model under-forecasted on average, management should commit firm resources to the forecast and hold roughly a 5% flexible capacity buffer above it — matching ARIMA's 4.7% error — with an escalation route to 10%. Second, keep ETS alpha 0.50 running as a spreadsheet backup and cross-check. Third, log actuals and review quarterly, triggering an early review if 3-month rolling MAPE exceeds 6.2%. Finally, Industry 5.0: keep human sign-off on every binding capacity commitment. USE ARIMA (1,1,0). REVALIDATE QUARTERLY. HUMAN REVIEW.",
    liveSpeakerPrompt: "How does this translate into operations management? We recommend ARIMA (1,1,0) as our primary one-month-ahead forecast for labor rosters, berth allocation, and equipment staging. Because every model under-forecasted on average, management should commit firm resources to the forecast and hold roughly a 5% flexible capacity buffer above it — matching ARIMA's 4.7% error — with an escalation route to 10%. Second, keep ETS alpha 0.50 running as a spreadsheet backup and cross-check. Third, log actuals and review quarterly, triggering an early review if 3-month rolling MAPE exceeds 6.2%. Finally, Industry 5.0: keep human sign-off on every binding capacity commitment. USE ARIMA (1,1,0). REVALIDATE QUARTERLY. HUMAN REVIEW.",
    onScreenStoryCaptions: [
      "USE ARIMA (1,1,0)",
      "HOLD ~5% FLEXIBLE BUFFER",
      "ETS α = 0.50 BACKUP",
      "HUMAN SIGN-OFF"
    ],
    dataHighlight: "ARIMA (1,1,0) Primary · +5% Buffer · ETS Backup · Human Sign-off",
    keyMetric: {
      label: "Final Policy",
      value: "USE ARIMA (1,1,0)",
      sublabel: "+5% Buffer · ETS Backup · Revalidate Quarterly"
    }
  }
];

export const TOTAL_KEYNOTE_SECONDS = KEYNOTE_BEATS.reduce((sum, b) => sum + b.durationSeconds, 0); // Exactly 270s = 4m 30s!

// Compatibility exports
export type SlideBeat = KeynoteBeat;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPresentationBeats = (_baseline?: BaselineModelChoice) => KEYNOTE_BEATS;
export const PRESENTATION_BEATS = KEYNOTE_BEATS;
export const TOTAL_PRESENTATION_SECONDS = TOTAL_KEYNOTE_SECONDS;
