import type { Answers, LeadScore } from "./types";

/**
 * Lead scoring — SynergyCare_Landing_Page_Instructions.md §4.1
 *
 * A: (Q3 >= 65 OR Q5 = emergency/both) AND Q6 >= $50 AND Q7 = Yes
 * B: Q5 = any yes AND (Q6 >= $50 OR not sure) AND Q7 = yes/maybe
 * C: everyone else — still valuable, they prove reach.
 */
const OLDER = new Set(["65_74", "75_plus"]);
const URGENT_REMIT = new Set(["emergency", "both"]);
const ANY_REMIT = new Set(["emergency", "planned", "both"]);
const BUDGET_50_PLUS = new Set(["50_99", "100_149", "150_plus"]);

export function scoreLead(a: Partial<Answers>): LeadScore {
  const highNeed = OLDER.has(a.q3_age ?? "") || URGENT_REMIT.has(a.q5_medical_remit ?? "");
  const budget50Plus = BUDGET_50_PLUS.has(a.q6_budget ?? "");
  const committed = a.q7_commitment === "yes";

  if (highNeed && budget50Plus && committed) return "A";

  const anyRemit = ANY_REMIT.has(a.q5_medical_remit ?? "");
  const budgetOk = budget50Plus || a.q6_budget === "not_sure";
  const openToFounding = committed || a.q7_commitment === "maybe";

  if (anyRemit && budgetOk && openToFounding) return "B";

  return "C";
}

/**
 * Tags used to segment the list. `provincial` builds the provincial demand
 * map that decides pilot geography (§4.1).
 */
export function tagLead(a: Partial<Answers>): string[] {
  const tags: string[] = [];
  if (a.q4_location === "province_rural") tags.push("provincial");
  if (a.q2_for_whom === "both_parents") tags.push("both_parents");
  if (a.q7_commitment === "yes") tags.push("founding_yes");
  if (URGENT_REMIT.has(a.q5_medical_remit ?? "")) tags.push("emergency_history");
  if (a.q3_age === "75_plus") tags.push("age_75_plus");
  return tags;
}
