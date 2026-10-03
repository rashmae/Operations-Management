/**
 * "D10: The Forecasting Challenge" — Port of Los Angeles Monthly Total TEUs
 * Narrative Infographic Video Presentation Structure & Spoken Cues
 * Complete 12-Beat Documentary Arc strictly aligned with Group 7's Model Selection Record & Google Sheets data
 * 
 * Target Duration: 210 seconds (3 minutes 30 seconds) — strictly within 3-4 minutes
 * Tone: Corporate, cinematic, credible maritime trade briefing
 * 3 Group 7 Members equally distributed (70 seconds each!)
 *   1. Aligato, Elaiza Jane (0:00 – 1:10)
 *   2. Ansay, Rash Mae Crystelle C. (Leader) (1:10 – 2:20)
 *   3. Villagracia, Mylene Joy (2:20 – 3:30)
 */

import { BaselineModelChoice, BASELINE_MODELS } from './forecastingData';

export type VisualMode =
  | 'hook_intro'
  | 'stakes_counter'
  | 'trend_anomaly'
  | 'contenders_race'
  | 'round_one_verdict'
  | 'ml_challengers'
  | 'blind_test_reveal'
  | 'amber_plot_twist'
  | 'level_shift_bars'
  | 'om_recommendation_control_room'
  | 'limitations_oversight'
  | 'closing_recommendation';

export interface SlideBeat {
  id: string;
  slideNumber: number;
  act: 1 | 2 | 3;
  actTitle: string;
  beatTitle: string;
  durationSeconds: number;
  cumulativeStartTime: number;
  speaker: string;
  speakerRole: string;
  speakerInitials: string;
  backgroundImage: string;
  themeColor: 'steel' | 'navy' | 'amber'; // amber reserved strictly for Plot Twist & Closing Recommendation
  onScreenStoryCaptions: string[]; // 3-6 words per line max, used sparingly
  liveSpeakerPrompt: string; // What the student says over this beat during live presentation
  dataHighlight?: string;
  visualMode: VisualMode;
}

export function getPresentationBeats(baseline: BaselineModelChoice = 'wma3'): SlideBeat[] {
  const modelConfig = BASELINE_MODELS[baseline] || BASELINE_MODELS.wma3;
  const isWMA = baseline === 'wma3';

  return [
    // ==================== ACT 1: THE CHALLENGE (70 SECONDS) ====================
    // Speaker 1: Aligato, Elaiza Jane (0:00 – 1:10)
    {
      id: "beat-1",
      slideNumber: 1,
      act: 1,
      actTitle: "Act I: The Challenge",
      beatTitle: "The Maritime Trade Hook",
      durationSeconds: 8,
      cumulativeStartTime: 0,
      speaker: "Aligato, Elaiza Jane",
      speakerRole: "Speaker 1",
      speakerInitials: "EA",
      backgroundImage: "/src/assets/images/cargo_ship_breakwater_1791024998811.jpg",
      themeColor: "steel",
      onScreenStoryCaptions: [
        "Every month, thousands of containers leave this port.",
        "How many will leave next month?",
        "D10: The Forecasting Challenge"
      ],
      liveSpeakerPrompt: "Good day, Engr. Baclayon and colleagues. At the Port of Los Angeles, America's leading maritime gateway, every terminal decision depends on one critical question: how many container TEUs will cross the docks next month?",
      visualMode: "hook_intro"
    },
    {
      id: "beat-2",
      slideNumber: 2,
      act: 1,
      actTitle: "Act I: The Challenge",
      beatTitle: "The Operational Stakes",
      durationSeconds: 17,
      cumulativeStartTime: 8,
      speaker: "Aligato, Elaiza Jane",
      speakerRole: "Speaker 1",
      speakerInitials: "EA",
      backgroundImage: "/src/assets/images/pola_container_terminal_1791024986178.jpg",
      themeColor: "steel",
      dataHighlight: "36 Months of Real Data (TEUs)",
      onScreenStoryCaptions: [
        "36 Months of Real Data (TEUs).",
        "Capacity planning hangs on this.",
        "Labor gangs committed 24 hours ahead.",
        "Berth scheduling cannot fail."
      ],
      liveSpeakerPrompt: "We analyzed 36 consecutive months of verified operational container throughput from January 2022 to December 2024. Longshore labor gangs, crane berths, and yard stacking equipment must be committed days before a vessel enters the channel.",
      visualMode: "stakes_counter"
    },
    {
      id: "beat-3",
      slideNumber: 3,
      act: 1,
      actTitle: "Act I: The Challenge",
      beatTitle: "The Plot Complication (Anomaly)",
      durationSeconds: 20,
      cumulativeStartTime: 25,
      speaker: "Aligato, Elaiza Jane",
      speakerRole: "Speaker 1",
      speakerInitials: "EA",
      backgroundImage: "/src/assets/images/container_yard_twilight_1791025012665.jpg",
      themeColor: "steel",
      dataHighlight: "Feb 2023 Shock: 236,264 TEUs (-32.0%)",
      onScreenStoryCaptions: [
        "Then, without warning...",
        "Feb 2023: 236,264 TEUs.",
        "A 32% sudden structural dip.",
        "Demand visibly defies straight linearity."
      ],
      liveSpeakerPrompt: "Drawing the first 30 months reveals reality: in February 2023, export volume crashed to 236,264 TEUs—the lowest point in our development data, triggered by post-pandemic inventory corrections and ILWU contract talks. Linear correlation is near zero at r equals 0.06.",
      visualMode: "trend_anomaly"
    },
    {
      id: "beat-4",
      slideNumber: 4,
      act: 1,
      actTitle: "Act I: The Challenge",
      beatTitle: "The Four Conventional Contenders",
      durationSeconds: 25,
      cumulativeStartTime: 45,
      speaker: "Aligato, Elaiza Jane",
      speakerRole: "Speaker 1",
      speakerInitials: "EA",
      backgroundImage: "/src/assets/images/pola_container_terminal_1791024986178.jpg",
      themeColor: "steel",
      onScreenStoryCaptions: [
        "Four conventional contenders tested.",
        "SMA lags behind quarterly shifts.",
        "WMA weights recent momentum (0.50/0.30/0.20).",
        "Exponential Smoothing alphas race ahead.",
        "Trend Projection fails the dip."
      ],
      liveSpeakerPrompt: "We tested four classical Operations Management contenders: 3-Period SMA, 3-Period WMA, Exponential Smoothing with alphas 0.20, 0.50, and 0.80, and Trend Projection. Linear Trend collapsed immediately because the data possesses no sustained slope.",
      visualMode: "contenders_race"
    },

    // ==================== ACT 2: THE TRIAL (70 SECONDS) ====================
    // Speaker 2: Ansay, Rash Mae Crystelle C. (1:10 – 2:20)
    {
      id: "beat-5",
      slideNumber: 5,
      act: 2,
      actTitle: "Act II: The Trial",
      beatTitle: "The Verdict - Round One (Baseline Selection)",
      durationSeconds: 16,
      cumulativeStartTime: 70,
      speaker: "Ansay, Rash Mae Crystelle C.",
      speakerRole: "Group Leader / Speaker 2",
      speakerInitials: "RA",
      backgroundImage: "/src/assets/images/operations_analytics_command_1790930073715.jpg",
      themeColor: "steel",
      dataHighlight: modelConfig.beat5Highlight,
      onScreenStoryCaptions: isWMA ? [
        "Verdict: 3-Period WMA Selected.",
        "Dev MAPE: 9.31% | RMSE: 40,168 TEUs.",
        "Trend ruled out: r = 0.06.",
        "Optimal balance of velocity & stability."
      ] : [
        "Verdict: ETS α = 0.50 Selected.",
        "Lowest Dev MAE: 30,595.71 TEUs.",
        "Trend ruled out: r = 0.06.",
        "Optimal balance of responsiveness & stability."
      ],
      liveSpeakerPrompt: isWMA 
        ? "Based strictly on in-sample development evidence across Months 1 to 30, Group 7 selected 3-Period Weighted Moving Average with weights 0.50, 0.30, and 0.20. It produced a robust 9.31% development MAPE and 40,168 RMSE, balancing immediate cargo momentum without chasing erratic noise."
        : "Based strictly on in-sample development evidence across Months 1 to 30, Group 7 selected Exponential Smoothing with alpha 0.50. It produced the lowest development MAE of 30,595.71 TEUs, perfectly balancing responsiveness to cargo shifts without chasing erratic noise.",
      visualMode: "round_one_verdict"
    },
    {
      id: "beat-6",
      slideNumber: 6,
      act: 2,
      actTitle: "Act II: The Trial",
      beatTitle: "The Statistical & Machine Learning Challengers",
      durationSeconds: 22,
      cumulativeStartTime: 86,
      speaker: "Ansay, Rash Mae Crystelle C.",
      speakerRole: "Group Leader / Speaker 2",
      speakerInitials: "RA",
      backgroundImage: "/src/assets/images/cargo_ship_breakwater_1791024998811.jpg",
      themeColor: "steel",
      onScreenStoryCaptions: [
        "Can algorithms beat simple conventional OM?",
        "ARIMA: Autoregressive integrated order (1,1,1).",
        "Lagged Linear Regression: 3 lag features.",
        "Random Forest: Non-linear decision trees.",
        "Tested independently in parallel."
      ],
      liveSpeakerPrompt: "Next, we deployed three computational challengers in parallel: ARIMA 1-1-1 to capture differenced stationarity, Lagged Linear Regression with three lag features, and Random Forest Regression with 100 decision trees. Could advanced machine learning outperform our conventional OM baseline?",
      visualMode: "ml_challengers"
    },
    {
      id: "beat-7",
      slideNumber: 7,
      act: 2,
      actTitle: "Act II: The Trial",
      beatTitle: "The Reveal (The 6-Month Blind Test)",
      durationSeconds: 16,
      cumulativeStartTime: 108,
      speaker: "Ansay, Rash Mae Crystelle C.",
      speakerRole: "Group Leader / Speaker 2",
      speakerInitials: "RA",
      backgroundImage: "/src/assets/images/container_yard_twilight_1791025012665.jpg",
      themeColor: "steel",
      dataHighlight: "Held-Out Truth: July to December 2024",
      onScreenStoryCaptions: [
        "Then the hidden months were revealed...",
        "July to December 2024.",
        "Actual volume surged to 460,304 TEUs.",
        "All forecasts tested simultaneously."
      ],
      liveSpeakerPrompt: "Then the six hidden validation months were unveiled: July through December 2024. Export demand staged a powerful recovery, climbing to 460,304 TEUs. All models were tested blind against real-world observations.",
      visualMode: "blind_test_reveal"
    },
    {
      id: "beat-8",
      slideNumber: 8,
      act: 2,
      actTitle: "Act II: The Trial",
      beatTitle: "The Plot Twist: Simplicity Prevails",
      durationSeconds: 16,
      cumulativeStartTime: 124,
      speaker: "Ansay, Rash Mae Crystelle C.",
      speakerRole: "Group Leader / Speaker 2",
      speakerInitials: "RA",
      backgroundImage: "/src/assets/images/container_yard_twilight_1791025012665.jpg",
      themeColor: "amber", // AMBER ACCENT COLOR UNLOCKED!
      dataHighlight: modelConfig.beat8Highlight,
      onScreenStoryCaptions: [
        "The algorithm overfitted.",
        "Simplicity prevailed.",
        `${modelConfig.shortName}: ${modelConfig.valMAPE.toFixed(2)}% MAPE.`,
        "Random Forest collapsed to 11.19%."
      ],
      liveSpeakerPrompt: `Here is the critical plot twist: Random Forest overfitted to training noise, plateauing near 398,000 TEUs and collapsing to 11.19% error. Linear Trend failed at 24.15%. Meanwhile, our selected baseline ${modelConfig.shortName} delivered an exceptional ${modelConfig.valMAPE.toFixed(2)}% validation MAPE!`,
      visualMode: "amber_plot_twist"
    },

    // ==================== ACT 3: THE LESSON (70 SECONDS) ====================
    // Speaker 3: Villagracia, Mylene Joy (2:20 – 3:30)
    {
      id: "beat-9",
      slideNumber: 9,
      act: 3,
      actTitle: "Act III: The Lesson",
      beatTitle: "Why It Happened: The Level Shift",
      durationSeconds: 18,
      cumulativeStartTime: 140,
      speaker: "Villagracia, Mylene Joy",
      speakerRole: "Speaker 3",
      speakerInitials: "MV",
      backgroundImage: "/src/assets/images/container_yard_twilight_1791025012665.jpg",
      themeColor: "steel",
      dataHighlight: "Level Shift: 373,431 → 445,126 TEUs (+19.2%)",
      onScreenStoryCaptions: [
        "Development Average: 373,431 TEUs.",
        "Validation Average: 445,126 TEUs.",
        "Demand didn't stay the same.",
        "The forecast had to adapt."
      ],
      liveSpeakerPrompt: "Why did this happen? Port export demand underwent a structural level shift: average monthly volume surged from 373,431 TEUs during development to 445,126 TEUs during validation—a 19.2% jump. Static linear models broke; our adaptive baseline tracked the surge seamlessly.",
      visualMode: "level_shift_bars"
    },
    {
      id: "beat-10",
      slideNumber: 10,
      act: 3,
      actTitle: "Act III: The Lesson",
      beatTitle: "The OM Recommendation: Control Room Action",
      durationSeconds: 20,
      cumulativeStartTime: 158,
      speaker: "Villagracia, Mylene Joy",
      speakerRole: "Speaker 3",
      speakerInitials: "MV",
      backgroundImage: "/src/assets/images/port_control_planner_1791028044582.jpg",
      themeColor: "steel",
      dataHighlight: `Recommended Action: ${modelConfig.shortName} + 7% Buffer`,
      onScreenStoryCaptions: [
        "Recommended Operational Action:",
        `Deploy ${modelConfig.shortName} for berth allocation.`,
        "Maintain a 7% surge contingency buffer.",
        "Prevents 22,500 misplaced containers monthly."
      ],
      liveSpeakerPrompt: `Our operational recommendation for terminal dispatchers: schedule crane shifts and longshore gangs using ${modelConfig.name}, reinforced by a 7% dynamic capacity buffer to absorb unexpected vessel surges without berth dwell delays.`,
      visualMode: "om_recommendation_control_room"
    },
    {
      id: "beat-11",
      slideNumber: 11,
      act: 3,
      actTitle: "Act III: The Lesson",
      beatTitle: "Limitations, Honestly",
      durationSeconds: 18,
      cumulativeStartTime: 178,
      speaker: "Villagracia, Mylene Joy",
      speakerRole: "Speaker 3",
      speakerInitials: "MV",
      backgroundImage: "/src/assets/images/industrial_engineers_team_1790930090538.jpg",
      themeColor: "steel",
      onScreenStoryCaptions: [
        "When does human judgment override?",
        "ILWU labor contract votes.",
        "Red Sea maritime chokepoint diversions.",
        "Data predicts the tide. Humans steer."
      ],
      liveSpeakerPrompt: "Yet we acknowledge the model's limitations honestly. No statistical formula can foresee ILWU labor contract walkouts, Red Sea maritime diversions, or tariff deadlines. Data predicts the tide; human industrial engineers steer the ship.",
      visualMode: "limitations_oversight"
    },
    {
      id: "beat-12",
      slideNumber: 12,
      act: 3,
      actTitle: "Act III: The Lesson",
      beatTitle: "Closing & Final Recommendation",
      durationSeconds: 14,
      cumulativeStartTime: 196,
      speaker: "Villagracia, Mylene Joy",
      speakerRole: "Speaker 3",
      speakerInitials: "MV",
      backgroundImage: "/src/assets/images/cargo_ship_breakwater_1791024998811.jpg",
      themeColor: "amber", // AMBER ACCENT COLOR UNLOCKED!
      dataHighlight: "Final Group Decision",
      onScreenStoryCaptions: [
        "Final Recommendation:",
        `Deploy ${modelConfig.shortName} for standard port planning.`,
        "Enforce human override during external shocks.",
        "Group 7 · BSIE 3-E · Cebu Tech"
      ],
      liveSpeakerPrompt: `Our final recommendation: ${modelConfig.recommendationQuote} Thank you.`,
      visualMode: "closing_recommendation"
    }
  ];
}

export const PRESENTATION_BEATS: SlideBeat[] = getPresentationBeats('wma3');

export const TOTAL_PRESENTATION_SECONDS = 210; // 3 minutes 30 seconds
