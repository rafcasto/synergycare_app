"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ArrowLeft, Copy } from "lucide-react";
import { QUESTIONS, type QuestionId } from "@/lib/questions";
import { captureUtm, resolveVariant, type Utm } from "@/lib/attribution";
import { track } from "@/lib/firebase-client";
import { CtaButton } from "./ui";

type Step = 1 | 2 | "done";
type Answers = Partial<Record<QuestionId, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EoiForm() {
  const [step, setStep] = useState<Step>(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [worry, setWorry] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [utm, setUtm] = useState<Utm>({});

  useEffect(() => setUtm(captureUtm()), []);

  const unanswered = useMemo(
    () => QUESTIONS.filter((q) => !answers[q.id]).map((q) => q.id),
    [answers]
  );

  function validateStep1() {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "Please tell us your first name.";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goToStep2() {
    if (!validateStep1()) return;
    track("form_step1_complete");
    setStep(2);
    document.getElementById("eoi-form")?.scrollIntoView({ block: "start" });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;

    if (unanswered.length) {
      setErrors(Object.fromEntries(unanswered.map((id) => [id, "Please choose an option."])));
      document.getElementById(`q-${unanswered[0]}`)?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/eoi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          worry_text: worry.trim(),
          answers,
          headline_variant: resolveVariant(),
          ...utm,
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      track("form_submit", { headline_variant: resolveVariant(), ...utm });
      setStep("done");
      document.getElementById("eoi-form")?.scrollIntoView({ block: "start" });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't save that. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "done") return <Confirmation firstName={firstName.trim()} />;

  return (
    <div
      className="rounded-[16px] bg-white p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="t-h2 text-ink">Register your interest</h2>
          <p className="t-body mt-2 max-w-[52ch] text-gray-600">
            Takes about 90 seconds. Founding families get priority access,
            founding pricing, and a direct line to the founder.
          </p>
        </div>
        <span className="t-small shrink-0 text-gray-600">{step} of 2</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {step === 1 ? (
          <div className="space-y-5">
            <Field
              id="firstName"
              label="First name"
              value={firstName}
              onChange={setFirstName}
              error={errors.firstName}
              autoComplete="given-name"
              required
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
              required
            />
            <Field
              id="mobile"
              label="Mobile"
              type="tel"
              value={mobile}
              onChange={setMobile}
              hint="For a personal follow-up — never spam. Optional."
              autoComplete="tel"
            />

            <CtaButton type="button" onClick={goToStep2} full>
              Continue →
            </CtaButton>
          </div>
        ) : (
          <div className="space-y-8">
            {QUESTIONS.map((question, index) => (
              <fieldset key={question.id} id={`q-${question.id}`}>
                <legend className="t-body font-medium text-ink">
                  <span className="text-gray-600">{index + 1}. </span>
                  {question.label}
                </legend>

                <div className="mt-3 flex flex-wrap gap-2">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setAnswers((prev) => ({ ...prev, [question.id]: option.value }));
                          setErrors((prev) => {
                            const { [question.id]: _removed, ...rest } = prev;
                            return rest;
                          });
                        }}
                        className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border-[1.5px] px-4 py-2 text-[16px] transition-colors duration-150 ease-out ${
                          selected
                            ? "border-teal-700 bg-teal-100 font-medium text-ink"
                            : "border-gray-300 bg-white text-ink hover:border-teal-600"
                        }`}
                      >
                        {selected && (
                          <Check
                            size={18}
                            strokeWidth={1.5}
                            style={{ color: "var(--color-teal-700)" }}
                            aria-hidden="true"
                          />
                        )}
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {errors[question.id] && <ErrorText>{errors[question.id]}</ErrorText>}
              </fieldset>
            ))}

            <div>
              <label htmlFor="worry" className="t-small block font-medium text-ink">
                What worries you most about your parents&rsquo; health right now?
              </label>
              <p className="t-small mt-1 text-gray-600">Optional — but it helps a lot.</p>
              <textarea
                id="worry"
                rows={4}
                value={worry}
                maxLength={2000}
                onChange={(event) => setWorry(event.target.value)}
                className="mt-2 w-full rounded-[12px] border-[1.5px] border-gray-300 bg-white px-4 py-3 text-[16px] text-ink outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <p className="t-small mb-4 text-gray-600">
                We&rsquo;ll only use this to contact you about SynergyCare. No spam,
                ever.{" "}
                <a href="/privacy" className="text-teal-700 underline-offset-2 hover:underline">
                  Privacy policy
                </a>
                .
              </p>

              {submitError && (
                <div className="mb-4">
                  <ErrorText>{submitError}</ErrorText>
                </div>
              )}

              <CtaButton type="submit" disabled={submitting} full>
                {submitting ? "Sending…" : "Register my interest"}
              </CtaButton>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="t-small mt-4 inline-flex items-center gap-1.5 text-teal-700 hover:underline"
              >
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
                Back to your details
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  error,
  hint,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="t-small block font-medium text-ink">
        {label}
        {!required && <span className="font-normal text-gray-600"> (optional)</span>}
      </label>
      {hint && <p className="t-small mt-1 text-gray-600">{hint}</p>}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-[48px] w-full rounded-[12px] border-[1.5px] bg-white px-4 py-3 text-[16px] text-ink outline-none focus:ring-4 focus:ring-teal-100"
        style={{
          borderColor: error ? "var(--color-error)" : "var(--color-gray-300)",
        }}
      />
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="t-small mt-2 flex items-start gap-1.5"
      style={{ color: "var(--color-error)" }}
    >
      <span aria-hidden="true">⚠</span>
      <span>{children}</span>
    </p>
  );
}

function Confirmation({ firstName }: { firstName: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    track("share_click");
    const url = window.location.origin;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div
      className="rounded-[16px] bg-white p-6 md:p-8"
      style={{ boxShadow: "var(--shadow-soft)" }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ background: "var(--color-teal-100)" }}
      >
        <Check size={24} strokeWidth={1.5} style={{ color: "var(--color-teal-700)" }} aria-hidden="true" />
      </div>

      <h2 className="t-h2 mt-5 text-ink">Salamat, {firstName}!</h2>

      <p className="t-body-lg mt-3 max-w-[56ch] text-ink">
        You&rsquo;re on the founding list. I&rsquo;ll personally be in touch within a
        week. Check your inbox — there&rsquo;s a short note from me with one
        question I&rsquo;d love you to answer.
      </p>
      <p className="t-body mt-3 text-gray-600">— Rafael</p>

      <div className="mt-8 rounded-[16px] border border-gray-300 p-5">
        <p className="t-body font-medium text-ink">
          Know someone else supporting parents back home?
        </p>
        <p className="t-body mt-1 text-gray-600">Send them this page.</p>
        <button
          type="button"
          onClick={copyLink}
          className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-[12px] border-[1.5px] border-teal-700 bg-white px-5 py-3 text-[16px] font-semibold text-teal-700 transition-colors duration-150 hover:bg-teal-100"
        >
          <Copy size={18} strokeWidth={1.5} aria-hidden="true" />
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
