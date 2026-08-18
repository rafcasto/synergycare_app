import type { HeadlineVariant } from "./content";
import type { QuestionId } from "./questions";

export type Answers = Record<QuestionId, string>;

export type LeadScore = "A" | "B" | "C";

export type EoiPayload = {
  first_name: string;
  email: string;
  mobile?: string;
  worry_text?: string;
  answers: Partial<Answers>;
  headline_variant: HeadlineVariant;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
};
