/**
 * Step 2 qualification questionnaire.
 * Source: SynergyCare_Landing_Page_Instructions.md §4
 * Option `value`s are stable identifiers — changing them breaks stored data
 * and the lead-scoring rules in ./scoring.ts.
 */

export type QuestionId =
  | "q1_region"
  | "q2_for_whom"
  | "q3_age"
  | "q4_location"
  | "q5_medical_remit"
  | "q6_budget"
  | "q7_commitment";

export type Question = {
  id: QuestionId;
  label: string;
  options: { value: string; label: string }[];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1_region",
    label: "Where are you based in New Zealand?",
    options: [
      { value: "auckland", label: "Auckland" },
      { value: "canterbury", label: "Canterbury" },
      { value: "wellington", label: "Wellington" },
      { value: "elsewhere_nz", label: "Elsewhere in NZ" },
    ],
  },
  {
    id: "q2_for_whom",
    label: "Who would this be for?",
    options: [
      { value: "mother", label: "Mother" },
      { value: "father", label: "Father" },
      { value: "both_parents", label: "Both parents" },
      { value: "other_family", label: "Another family member" },
    ],
  },
  {
    id: "q3_age",
    label: "Their age? (the oldest, if both)",
    options: [
      { value: "under_55", label: "Under 55" },
      { value: "55_64", label: "55–64" },
      { value: "65_74", label: "65–74" },
      { value: "75_plus", label: "75+" },
    ],
  },
  {
    id: "q4_location",
    label: "Where do they live?",
    options: [
      { value: "metro_manila", label: "Metro Manila" },
      { value: "cebu", label: "Cebu" },
      { value: "davao", label: "Davao" },
      { value: "other_city", label: "Another city" },
      { value: "province_rural", label: "Province or rural area" },
    ],
  },
  {
    id: "q5_medical_remit",
    label:
      "In the last 18 months, have you sent money home for a medical need?",
    options: [
      { value: "emergency", label: "Yes — an emergency" },
      { value: "planned", label: "Yes — planned (check-ups, meds)" },
      { value: "both", label: "Both" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "q6_budget",
    label:
      "What would feel like a fair monthly amount for the “Complete” membership described above?",
    options: [
      { value: "under_50", label: "Under NZ$50" },
      { value: "50_99", label: "NZ$50–99" },
      { value: "100_149", label: "NZ$100–149" },
      { value: "150_plus", label: "NZ$150+" },
      { value: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: "q7_commitment",
    label: "We're starting with a small paid founding group. Interested?",
    options: [
      { value: "yes", label: "Yes — count me in" },
      { value: "maybe", label: "Maybe — tell me more" },
      { value: "updates", label: "Just keep me updated" },
    ],
  },
];
