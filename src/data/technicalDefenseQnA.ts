/**
 * Technical Defense & Q&A Questions from OM1 Applied Study 1 Manual
 * Directly tailored to Dataset D10: Port of Los Angeles Monthly Total Exports (TEUs)
 * Prepared for the ~10 minute technical defense following the 3-4 minute presentation.
 */

export interface DefenseQuestion {
  id: string;
  category: 'Dataset & Operations' | 'Conventional Methods' | 'Validation & Metrics' | 'Advanced ML' | 'Human Oversight';
  question: string;
  targetedConcept: string;
  shortBulletSummary: string[];
  detailedDefenseScript: string;
  keyFormulas?: string[];
  rubricCriterion: string;
}

export const TECHNICAL_DEFENSE_QUESTIONS: DefenseQuestion[] = [
  {
    id: "q-1",
    category: "Dataset & Operations",
    question: "Explain your dataset, unit of measurement, and the specific operational decision it supports.",
    targetedConcept: "Context & Operational Stakes",
    shortBulletSummary: [
      "Dataset D10: Port of Los Angeles Monthly Total Exports from Jan 2022 to Dec 2024 (36 periods).",
      "Unit of Measurement: TEUs (Twenty-Foot Equivalent Units) of shipping containers.",
      "Operational Decisions: Berth crane assignment, longshore labor gang staffing, and container staging yard allocation.",
      "Asymmetric risk: Under-forecasting causes vessel queues and demurrage ($50k+/day); over-forecasting incurs idle union labor ($42k/gang shift)."
    ],
    detailedDefenseScript: "Our group analyzed Dataset D10, comprising 36 verified monthly observations of total container export volume from the Port of Los Angeles, measured in TEUs (Twenty-Foot Equivalent Units). In maritime port logistics, operational decisions are locked in advance: crane operators and longshore labor gangs (ILWU) must be ordered 24 hours prior to ship docking. Over-forecasting wastes substantial capital on idle labor and unoccupied crane berths, whereas under-forecasting leads to catastrophic container yard congestion, truck gate turn-times exceeding 90 minutes, and carrier demurrage claims.",
    keyFormulas: [
      "1 TEU = Standard 20 ft × 8 ft × 8.5 ft intermodal container volume",
      "Demurrage Cost = Daily Rate × Days Over Berth Limit"
    ],
    rubricCriterion: "Part I & II: Operational Context & Problem Formulation (15 pts)"
  },
  {
    id: "q-2",
    category: "Dataset & Operations",
    question: "What caused the sharp anomaly in February 2023, and how did it affect your models?",
    targetedConcept: "Time Series Structural Break",
    shortBulletSummary: [
      "Feb 2023 volume plummeted to 236,263.50 TEUs (-32.0% drop from prior month).",
      "Causes: Post-COVID inventory destocking by US retailers, combined with ILWU contract negotiation uncertainties.",
      "Impact: Severely distorted linear regression trend slopes; penalized models with long memory.",
      "Why WMA handled it better: Because 0.50/0.30/0.20 weights shed the drop within 3 months, preventing prolonged forecast depression."
    ],
    detailedDefenseScript: "In February 2023 (Month 14), exports dropped to 236,263.50 TEUs—a 32.0% drop from 347,493.25 TEUs that broke the prior trajectory. This was caused by nationwide inventory overhang where US retailers ceased overseas ordering, plus cargo diversion during heated ILWU-PMA contract talks. This structural shock penalized linear trend projection, which permanently tilted downward (slope = -2,216.33 TEUs/mo). 3-Period WMA excelled because its short 3-month window allowed it to recover once volumes normalized.",
    keyFormulas: [
      "Percentage Shock = (A_14 - A_13) / A_13 = (236,263.50 - 347,493.25) / 347,493.25 = -32.01%",
      "Linear Trend Slope = -2,216.33 TEUs/month"
    ],
    rubricCriterion: "Part III: Data Behavior & Time-Series Pattern Analysis (15 pts)"
  },
  {
    id: "q-3",
    category: "Conventional Methods",
    question: "Why did your SMA and WMA use exactly three periods, and how were the WMA weights chosen?",
    targetedConcept: "Window Sizing & Weight Distribution",
    shortBulletSummary: [
      "Three periods (k=3) balances responsiveness to seasonal cycles against dampening erratic month-to-month shocks.",
      "A larger window (k=6) would cause unacceptable lag during peak shipping seasons (July-October).",
      "WMA weights of 0.50 (t-1), 0.30 (t-2), and 0.20 (t-3) sum strictly to 1.00.",
      "Assigning 50% weight to the most recent month captures current ocean carrier scheduling momentum."
    ],
    detailedDefenseScript: "We strictly complied with the operational research specification of three periods (k=3). In port logistics, trade momentum changes rapidly across quarterly contract cycles. A 6-month or 12-month moving average would lag behind rapid surges, such as the peak agricultural export harvest in autumn. For WMA, assigning weights of 0.50 to month t-1, 0.30 to t-2, and 0.20 to t-3 ensures that half the weight tracks immediate port velocity while still filtering single-month anomalies, summing to 1.00 to guarantee an unbiased scale.",
    keyFormulas: [
      "SMA_t = (A_{t-1} + A_{t-2} + A_{t-3}) / 3",
      "WMA_t = 0.50 × A_{t-1} + 0.30 × A_{t-2} + 0.20 × A_{t-3}",
      "Constraint: w_1 + w_2 + w_3 = 0.50 + 0.30 + 0.20 = 1.00"
    ],
    rubricCriterion: "Part IV: Conventional Forecasting Implementation (20 pts)"
  },
  {
    id: "q-4",
    category: "Conventional Methods",
    question: "Why did Exponential Smoothing with α=0.5 outperform α=0.2 in development, yet WMA was still preferred?",
    targetedConcept: "Smoothing Parameter Responsiveness",
    shortBulletSummary: [
      "Moderate alpha (0.50) assigns 50% weight to the latest observation, quickly adjusting after the Feb 2023 dip (Dev MAPE: 9.19%).",
      "Low alpha (0.20) heavily dampens and smoothed through the rebound, producing a 9.94% MAPE.",
      "WMA was preferred because its fixed 0.50/0.30/0.20 memory avoids bullwhip amplification in longshore labor ordering.",
      "WMA achieves 9.31% development MAPE and superior 6.41% out-of-sample validation generalization."
    ],
    detailedDefenseScript: "In our development stage across Months 1-30, Exponential Smoothing with α=0.5 achieved a MAPE of 9.19% and RMSE of 39,582 TEUs, superior to α=0.2 which yielded 9.94% and 45,413 RMSE. Because our dataset features a sharp 32% drop followed by recovery, moderate responsiveness was necessary. 3-Period WMA (0.50, 0.30, 0.20) delivered a balanced 9.31% development MAPE and went on to deliver the best conventional validation accuracy of 6.41% MAPE while maintaining predictable longshore gang staffing requisitions.",
    keyFormulas: [
      "F_t = F_{t-1} + α(A_{t-1} - F_{t-1})",
      "Dev WMA MAPE = 9.31% | Dev WMA RMSE = 40,168 TEUs"
    ],
    rubricCriterion: "Part IV & V: Conventional Baseline Selection (15 pts)"
  },
  {
    id: "q-5",
    category: "Validation & Metrics",
    question: "What is the specific purpose of the six validation observations (July–December 2024)?",
    targetedConcept: "Out-of-Sample Generalization",
    shortBulletSummary: [
      "Simulates real-world forecasting: decisions must be made before future data is observed.",
      "Prevents data snooping and in-sample overfitting.",
      "A model that fits 100% on historical data may completely collapse when tested on unseen future periods.",
      "Provides an unbiased, level playing field across all 6 models."
    ],
    detailedDefenseScript: "The final six months—July to December 2024—were strictly held out as an unseen validation set. In real operations management, terminal managers never have access to future container manifests when ordering equipment or staffing. Testing on historical data alone only measures how well an algorithm memorizes the past. The 6-period validation simulates true out-of-sample prediction, proving whether a model has learned the underlying generative process or merely overfit historical idiosyncrasies.",
    keyFormulas: [
      "Development Set: Periods 1 to 30 (83.3% of total data)",
      "Validation Set: Periods 31 to 36 (16.7% held-out test set)"
    ],
    rubricCriterion: "Part VI & VII: Statistical & ML Validation (15 pts)"
  },
  {
    id: "q-6",
    category: "Validation & Metrics",
    question: "Differentiate MAE, RMSE, MAPE, SMAPE, and MPE. Why did you look at MPE?",
    targetedConcept: "Evaluation Metric Complementarity & Bias",
    shortBulletSummary: [
      "MAE: Average absolute error in physical TEU containers (intuitive for yard planners).",
      "RMSE: Penalizes large outliers heavily due to squared terms (vital for berth capacity bottlenecks).",
      "MAPE: Scale-independent percentage error (6.41% for WMA vs 11.19% for RF vs 24.15% for Trend).",
      "SMAPE: Symmetric metric bounded between 0-200% that treats over- and under-forecasts equally.",
      "MPE: Crucial directional bias indicator! Positive MPE means under-forecasting; negative means over-forecasting."
    ],
    detailedDefenseScript: "Each metric provides a distinct industrial engineering perspective. MAE tells the terminal manager that our WMA is off by an average of 28,473 TEUs. RMSE squares errors (32,962 TEUs for WMA), penalizing catastrophic misses that could cause port gridlock. MAPE gives executive leadership a clear 6.41% error benchmark. SMAPE guarantees mathematical symmetry near zero. Most importantly, MPE reveals directional bias: our WMA had an MPE of +4.12%, indicating a healthy slight under-forecast (safety cushion), whereas Trend Projection suffered an MPE of +24.15% because its negative slope projected 331k while actual was 460k.",
    keyFormulas: [
      "MAE = (1/n) Σ |A_t - F_t|",
      "RMSE = sqrt[ (1/n) Σ (A_t - F_t)^2 ]",
      "MAPE = (100%/n) Σ |(A_t - F_t) / A_t|",
      "SMAPE = (100%/n) Σ [ 2|A_t - F_t| / (|A_t| + |F_t|) ]",
      "MPE = (100%/n) Σ [ (A_t - F_t) / A_t ]"
    ],
    rubricCriterion: "Part VII: Model Evaluation & Metric Comparison (15 pts)"
  },
  {
    id: "q-7",
    category: "Advanced ML",
    question: "Why did Random Forest perform so poorly on the validation set despite high complexity?",
    targetedConcept: "Tree Ensemble Extrapolation Failure",
    shortBulletSummary: [
      "Small sample size: Only 30 training observations (N=30) is insufficient for tree-based ensemble learning.",
      "Extrapolation bound: Decision trees cannot predict values higher or lower than the training target bounds.",
      "Overfitting: RF learned in-sample noise rather than generalizable autoregressive dynamics.",
      "Validation MAPE of 11.19% was far worse than WMA (6.41%), proving Occam's Razor in OM."
    ],
    detailedDefenseScript: "Random Forest Regression failed because of a fundamental mathematical limitation of tree-based models: decision trees cannot extrapolate beyond the maximum and minimum values encountered during training. In a 36-month monthly time series, we only had 30 training observations. Furthermore, Random Forest splits data on orthogonal feature thresholds, causing it to memorize idiosyncratic monthly spikes rather than smooth temporal momentum. When confronted with the unseen late 2024 validation surge (460,304 TEUs), it plateaued near historical training medians (~398,000 TEUs), producing an 11.19% MAPE and an RMSE of 51,065 TEUs.",
    keyFormulas: [
      "Tree Prediction: y_hat = (1/B) Σ T_b(x)",
      "Extrapolation limit: min(y_train) <= y_hat <= max(y_train)"
    ],
    rubricCriterion: "Part VI: Advanced Machine Learning Modeling (15 pts)"
  },
  {
    id: "q-8",
    category: "Human Oversight",
    question: "When should the operational forecast be overridden by human terminal managers?",
    targetedConcept: "Industry 5.0 Human-in-the-Loop Governance",
    shortBulletSummary: [
      "ILWU Labor contract negotiation deadlines & potential strike walkouts.",
      "Carrier alliance rerouting (e.g. ships diverting from Suez/Red Sea around Cape of Good Hope).",
      "Sudden federal tariff policy changes causing advance front-loading of imports/exports.",
      "Natural disasters, typhoons, or container crane equipment breakdowns.",
      "Golden Rule: Quantitative algorithms predict the baseline tide; experienced industrial engineers steer the ship."
    ],
    detailedDefenseScript: "A statistical forecast assumes that the future generative mechanism mirrors the past. However, maritime ports operate in a volatile geopolitical environment. Terminal managers must invoke executive human override in three distinct conditions: First, during labor collective bargaining (such as ILWU negotiations) where strike risks divert cargo to rival ports. Second, during maritime chokepoint disruptions like the Red Sea crisis which alters shipping schedules by 14 days. Third, when impending tariff deadlines prompt exporters to front-load shipments into earlier months. Under Industry 5.0 principles, algorithms handle computational routine, but human industrial engineers exercise judgment during disruption.",
    keyFormulas: [
      "Operational Rule: If Exogenous Risk Index > Threshold, Activate Human Buffer Stock (+10% Berth Contingency)"
    ],
    rubricCriterion: "Part VIII & IX: Managerial Action & Human Oversight (20 pts)"
  }
];
