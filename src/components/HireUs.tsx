"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Wizard, WizardStep } from "@/components/ui/wizard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredFieldIndicator,
  useFormField,
} from "@/components/ui/form";
import {
  BUDGET_OPTIONS,
  SERVICES_OPTIONS,
  TIMELINE_OPTIONS,
  PROJECT_PRIORITY_OPTIONS,
  CONTACT_CHANNEL_OPTIONS,
} from "@/lib/data/forms";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  hireUsFormSchema,
  type HireUsFormData,
  transformFormDataToApiFormat,
  isValidLink,
  normalizeLink,
} from "@/lib/validation";
import { Check } from "lucide-react";
import type { Option } from "./ui/multiselect";
import { DISCORD_INVITE_URL } from "@/lib/data/constants";
import { analyticsEvents, trackAnalyticsEvent } from "@/lib/analytics";
import { focusFirstInvalid, revealBelowNav } from "@/lib/inquiry-scroll";
import Image from "next/image";

interface StepProps {
  form: ReturnType<typeof useForm<HireUsFormData>>;
  isActive?: boolean;
  // Fields already checked by a step's Next (November 11): with content and
  // no error they take the "valid" surface.
  validated?: ReadonlySet<string>;
}

// data-valid for a field: checked, without an error, and not empty (an empty
// optional field stays neutral).
const validMark = (validated: ReadonlySet<string> | undefined, field: { name: string; value: unknown }, state: { invalid: boolean }) => {
  const filled = Array.isArray(field.value) ? field.value.length > 0 : String(field.value ?? "").trim() !== "";
  return validated?.has(field.name) && !state.invalid && filled ? "" : undefined;
};

const PersonalInfoStep = ({ form, isActive, validated }: StepProps) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-row flex-wrap w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Your name <RequiredFieldIndicator />
                </FormLabel>
                <FormControl>
                  <Input placeholder="What should we call you?" {...field} data-valid={validMark(validated, field, fieldState)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Email address <RequiredFieldIndicator />
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Where can we reach you?"
                    {...field}
                    data-valid={validMark(validated, field, fieldState)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name="bio"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Tell us about your role <RequiredFieldIndicator />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your project involvement, please introduce yourself"
                {...field}
                data-valid={validMark(validated, field, fieldState)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="altContactName"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Prefer another way to connect?</FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  placeholder="What is your username?"
                  className="!rounded-r-none border-r-0"
                  {...field}
                  data-valid={validMark(validated, field, fieldState)}
                />
              </FormControl>
              <FormField
                control={form.control}
                name="altContactChannel"
                render={({ field: dropdownField }) => (
                  <Select
                    onValueChange={dropdownField.onChange}
                    defaultValue={dropdownField.value}
                  >
                    <FormControl>
                      <SelectTrigger className="!rounded-l-none w-36 contact-channel-trigger" aria-label="Channel">
                        <SelectValue placeholder="Discord" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="contact-channel-menu">
                      {CONTACT_CHANNEL_OPTIONS.map((o) => {
                        // October 30: each channel shows its mark (Discord,
                        // a paper plane for Telegram); the label names it.
                        return (
                          <SelectItem key={o.value} value={o.value}>
                            <span className="contact-channel">
                              <span className="contact-channel-icon" data-channel={o.value} aria-hidden="true" />
                              {o.label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

const ProjectDetailsStep = ({ form, isActive, validated }: StepProps) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="projectName"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              Name of your project or organization <RequiredFieldIndicator />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Protocol to passion project, what do you go by?"
                {...field}
                data-valid={validMark(validated, field, fieldState)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>
              How can we help? <RequiredFieldIndicator />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="What can we build, scope, design or source for you?"
                {...field}
                data-valid={validMark(validated, field, fieldState)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specsLink"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Do you have project specs?</FormLabel>
            <FormControl>
              <Input
                placeholder="Link to your specs, docs, Figma files, or any materials (optional)"
                // className="rounded-l-none border-l-0"
                {...field}
                data-valid={validMark(validated, field, fieldState)}
              />
            </FormControl>
            <FormMessage />
            {/* </div> */}
          </FormItem>
        )}
      />
    </div>
  );
};

// Services Needed (November 11): four options shown at once as check tiles,
// instead of a combobox whose chosen options left the list. The selection is
// kept as {label, value} options, the shape the API transform expects.
const ServicesChoices = ({
  value,
  onChange,
  labelId,
}: {
  value: Option[] | undefined;
  onChange: (options: Option[]) => void;
  labelId: string;
}) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  const chosen = new Set((value ?? []).map((option) => option.value));
  const toggle = (optionValue: string, on: boolean) => {
    const next = new Set(chosen);
    if (on) next.add(optionValue);
    else next.delete(optionValue);
    onChange(SERVICES_OPTIONS.filter((option) => next.has(option.value)).map(({ label, value }) => ({ label, value })));
  };

  return (
    <div
      role="group"
      id={formItemId}
      aria-labelledby={labelId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      data-invalid={error ? "" : undefined}
      className="inquiry-choices inquiry-choices-grid"
    >
      {SERVICES_OPTIONS.map((option) => {
        const checked = chosen.has(option.value);
        return (
          <label key={option.value} className="inquiry-choice" data-checked={checked || undefined}>
            <input
              type="checkbox"
              className="inquiry-choice-input"
              checked={checked}
              aria-invalid={!!error}
              onChange={(event) => toggle(option.value, event.target.checked)}
            />
            <span className="inquiry-check" aria-hidden="true">
              <Check strokeWidth={3} />
            </span>
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

const RequirementsStep = ({ form, isActive, validated }: StepProps) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="projectPriority"
        render={({ field }) => (
          <FormItem>
            <FormLabel id="inquiry-priority-label">What matters most to you?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                aria-labelledby="inquiry-priority-label"
                className="inquiry-choices"
              >
                {PROJECT_PRIORITY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    htmlFor={`inquiry-priority-${option.value}`}
                    className="inquiry-choice"
                    data-checked={field.value === option.value || undefined}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`inquiry-priority-${option.value}`}
                      className="inquiry-radio"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FormField
          control={form.control}
          name="budget"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                What&apos;s your budget range <RequiredFieldIndicator />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger onBlur={field.onBlur} data-valid={validMark(validated, field, fieldState)}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="inquiry-select-menu">
                  {BUDGET_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeline"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Timeline <RequiredFieldIndicator />
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger onBlur={field.onBlur} data-valid={validMark(validated, field, fieldState)}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="inquiry-select-menu">
                  {TIMELINE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="services"
        render={({ field }) => (
          <FormItem>
            <FormLabel id="inquiry-services-label">
              Services Needed <RequiredFieldIndicator />
            </FormLabel>
            <ServicesChoices value={field.value} onChange={field.onChange} labelId="inquiry-services-label" />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// Server validation paths (lib/validation.ts consultationApiSchema) back to the
// form's fields, so their messages appear next to the field.
const API_FIELDS: Array<[RegExp, keyof HireUsFormData]> = [
  [/contact\.data\.name$/, "name"],
  [/contact_info\.data\.email$/, "email"],
  [/contact\.data\.bio$/, "bio"],
  [/contact_info\.data\.(discord|telegram)$/, "altContactName"],
  [/consultData\.name$/, "projectName"],
  [/consultData\.description$/, "description"],
  [/consultData\.link$/, "specsLink"],
  [/consultations_services_required/, "services"],
  [/budget_key$/, "budget"],
  [/additional_info$/, "timeline"],
  [/delivery_priorities_key$/, "projectPriority"],
];

const STEP_FIELDS: Array<Array<keyof HireUsFormData>> = [
  ["name", "email", "bio", "altContactName"],
  ["projectName", "description", "specsLink"],
  ["projectPriority", "budget", "timeline", "services"],
];

export type InquiryStatus = "idle" | "submitting" | "success" | "error";
export type InquiryProgress = { step: number; status: InquiryStatus };

// `guided` is the October 23 form (40f3910) used by the audience routes: plain
// step names, a short introduction and the progress indicator.
// November 11: the form stays mounted while it sends and after an error, so
// every answer (and the step) survives a retry; the panel keeps its size while
// sending, and the result (confirmation or error) is focused and brought into
// view only as far as needed. With `onProgress`, the surrounding module
// (GuildInquiry) owns the heading: it shows the full introduction on step 1, a
// compact one on steps 2 and 3, and the confirmation title, and it keeps the
// heading in view; the form then leaves those to it.
export default function HireUs({ guided = false, onExit, onProgress }: { guided?: boolean; onExit?: () => void; onProgress?: (progress: InquiryProgress) => void }) {
  const [status, setStatus] = useState<InquiryStatus>("idle");
  const [step, setStep] = useState(0);
  const [validated, setValidated] = useState<ReadonlySet<string>>(() => new Set());
  const validatedRef = React.useRef(validated);
  validatedRef.current = validated;
  const formRef = React.useRef<HTMLDivElement>(null);
  const noticeRef = React.useRef<HTMLDivElement>(null);
  const confirmationRef = React.useRef<HTMLDivElement>(null);
  const confirmationTitleRef = React.useRef<HTMLHeadingElement>(null);
  const hasTrackedFormView = React.useRef(false);
  const isSubmitting = status === "submitting";
  const headingOutside = Boolean(onProgress);

  const form = useForm<HireUsFormData>({
    resolver: zodResolver(hireUsFormSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      altContactChannel: "DISCORD",
      altContactName: "",
      projectName: "",
      description: "",
      specsLink: "",
      budget: "",
      timeline: "",
      services: undefined,
      projectPriority: PROJECT_PRIORITY_OPTIONS[0].value,
    },
  });

  // A field shown as invalid, or already checked, is checked again as soon as
  // it changes, so its message and surface follow what the visitor types.
  React.useEffect(() => {
    const subscription = form.watch((_values, { name }) => {
      if (name && (form.getFieldState(name).error || validatedRef.current.has(name))) void form.trigger(name);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  React.useEffect(() => {
    if (!formRef.current || hasTrackedFormView.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTrackedFormView.current) return;

        hasTrackedFormView.current = true;
        trackAnalyticsEvent(analyticsEvents.hireFormViewed);
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(formRef.current);

    return () => observer.disconnect();
  }, []);

  // The surrounding module learns the step and status before paint, so its
  // heading changes in the same frame as the form.
  React.useLayoutEffect(() => {
    onProgress?.({ step, status });
  }, [onProgress, step, status]);

  // The result of a submission takes focus and is shown below the fixed bar.
  React.useLayoutEffect(() => {
    if (status === "success" && !headingOutside) {
      confirmationTitleRef.current?.focus({ preventScroll: true });
      if (confirmationRef.current) revealBelowNav(confirmationRef.current);
    } else if (status === "error" && noticeRef.current) {
      noticeRef.current.focus({ preventScroll: true });
      // The notice and the actions below it (Try again) together, when they fit.
      const actions = noticeRef.current.parentElement?.querySelector<HTMLElement>("[data-wizard-primary]");
      revealBelowNav(noticeRef.current, 16, actions ?? undefined);
    }
  }, [status, headingOutside]);

  const markValidated = (fields: Array<keyof HireUsFormData>) =>
    setValidated((previous) => new Set([...previous, ...fields]));

  // A step that does not validate: its first field needing attention takes focus.
  const failStep = (step: string) => {
    trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
      error_type: "validation",
      error_category: "client",
      step,
    });
    requestAnimationFrame(() => focusFirstInvalid(formRef.current));
  };

  // Validation functions for each step
  const validatePersonalInfo = async () => {
    const result = await form.trigger(["name", "email", "bio"]);
    markValidated(STEP_FIELDS[0]);
    if (!result) failStep("contact_info");
    return result;
  };

  const validateProjectDetails = async () => {
    // The specs link is normalized in place before it is validated: trimmed,
    // and given https:// when it has no protocol. Text that is not a link stays
    // as typed (trimmed), so the visitor can correct it.
    const raw = form.getValues("specsLink") ?? "";
    const link = normalizeLink(raw);
    const next = link === "" || isValidLink(link) ? link : raw.trim();
    if (next !== raw) form.setValue("specsLink", next, { shouldDirty: true });
    const result = await form.trigger(["projectName", "description", "specsLink"]);
    markValidated(STEP_FIELDS[1]);
    if (!result) failStep("project_details");
    return result;
  };

  const validateRequirements = async () => {
    const result = await form.trigger([
      "projectPriority",
      "budget",
      "timeline",
      "services",
    ]);
    markValidated(STEP_FIELDS[2]);
    if (!result) failStep("requirements");
    return result;
  };

  const handleWizardComplete = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    const formData = form.getValues();
    const servicesCount = formData.services?.length ?? 0;

    setStatus("submitting");

    trackAnalyticsEvent(analyticsEvents.hireFormSubmitAttempt, {
      services_count: servicesCount,
    });

    const consultData = transformFormDataToApiFormat(formData);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consultData }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        trackAnalyticsEvent(analyticsEvents.hireFormSubmitSuccess, {
          services_count: servicesCount,
        });
        form.reset();
        setStatus("success");
        return;
      }

      // The technical detail stays in the console; the visitor sees one plain
      // notice, and any field the server rejected is marked beside the field.
      console.error("Consultation not confirmed:", response.status, result);
      if (response.status === 400 && Array.isArray(result.details)) {
        for (const detail of result.details as Array<{ field: string; message: string }>) {
          const field = API_FIELDS.find(([pattern]) => pattern.test(detail.field))?.[1];
          if (field) form.setError(field, { type: "server", message: detail.message });
        }
        trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
          error_type: "server_validation",
          error_category: "server",
          step: "submit",
        });
      } else {
        trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
          error_type: "server_error",
          error_category: "server",
          step: "submit",
        });
      }
      setStatus("error");
    } catch (error) {
      console.error("Consultation not confirmed (network):", error);
      trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
        error_type: "network",
        error_category: "network",
        step: "submit",
      });
      setStatus("error");
    }
  };

  // After Next/Previous: record the step and, unless the surrounding module
  // anchors its own heading, keep the step header below the fixed bar.
  const onStepChange = React.useCallback((root: HTMLDivElement, index: number) => {
    setStep(index);
    if (headingOutside) return;
    const header = root.querySelector<HTMLElement>("[data-wizard-progress]") ?? root;
    const rect = header.getBoundingClientRect();
    const nav = document.querySelector("[data-fixed-nav]")?.getBoundingClientRect().bottom ?? 0;
    if (rect.top < nav + 16 || rect.top > window.innerHeight * 0.6) revealBelowNav(header);
  }, [headingOutside]);

  // Submission failure (November 11): a full-width alert just above the
  // actions. New copy, pending Tae's review.
  const errorNotice = status === "error" ? (
    <div className="inquiry-notice" role="alert" tabIndex={-1} ref={noticeRef}>
      <span className="inquiry-notice-icon" aria-hidden="true">!</span>
      <div className="inquiry-notice-body">
        <p className="inquiry-notice-title">We couldn&apos;t confirm your inquiry.</p>
        <p>Your answers are still here. You can try again.</p>
      </div>
    </div>
  ) : null;

  const wizardSteps: WizardStep[] = [
    {
      id: "personal-info",
      title: guided ? "About you" : "Contact Info",
      component: <PersonalInfoStep form={form} validated={validated} />,
      validation: validatePersonalInfo,
      onStepComplete: () => {
        trackAnalyticsEvent(analyticsEvents.hireFormStepCompleted, {
          step: "contact_info",
          step_id: "contact_info",
          step_number: 1,
        });
      },
    },
    {
      id: "project-description",
      title: guided ? "Your project" : "Project Description",
      component: <ProjectDetailsStep form={form} validated={validated} />,
      validation: validateProjectDetails,
      onStepComplete: () => {
        trackAnalyticsEvent(analyticsEvents.hireFormStepCompleted, {
          step: "project_details",
          step_id: "project_details",
          step_number: 2,
        });
      },
    },
    {
      id: "requirements",
      title: guided ? "Scope & timing" : "Requirements & Timeline",
      component: <RequirementsStep form={form} validated={validated} />,
      validation: validateRequirements,
      onStepComplete: () => {
        trackAnalyticsEvent(analyticsEvents.hireFormStepCompleted, {
          step: "requirements",
          step_id: "requirements",
          step_number: 3,
        });
      },
    },
  ];

  return (
    <div className="inquiry-form" data-status={status}>
      {status !== "success" && !guided && (
        <div className="mx-auto w-full">
          <h3 className="text-heading-lg font-bold text-moloch-500 mb-12">
            Let&apos;s Get Started
          </h3>
        </div>
      )}

      <div className="space-y-4" ref={formRef}>
        {status === "success" ? (
          // Confirmation (November 11, revised): the title belongs to the
          // module's heading when it has one ("[ Transmission Started ]", THE
          // FIRES / HAVE BEEN LIT!). Order, in the DOM and on screen: title,
          // the lit beacon (centred), the message across the panel, then the
          // Discord action.
          <div className="inquiry-confirmation" ref={confirmationRef}>
            {!headingOutside && (
              <h3 className="inquiry-confirmation-title" tabIndex={-1} ref={confirmationTitleRef}>
                The Fires Have Been Lit!
              </h3>
            )}
            {/* Right below the title: the lit beacon (public/images/venture/states/beacon.png, see docs/asset-provenance.md). Decorative. */}
            <Image
              className="inquiry-beacon"
              src="/images/venture/states/beacon.png"
              alt=""
              width={1448}
              height={1086}
              sizes="(max-width: 600px) 92vw, 440px"
            />
            {/* Owner's wording (November 11), pending Tae's review: the first
                sentence in Ubuntu Bold, the second regular. */}
            <p className="inquiry-confirmation-body">
              <strong>Your Submission Has Been Received.</strong> A member of the
              Guild will be in touch with you shortly to discuss next steps.
            </p>
            <a
              className="inquiry-discord"
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="inquiry-discord-icon" aria-hidden="true" />
              Introduce yourself in Discord
            </a>
          </div>
        ) : (
          <Form {...form}>
            <Wizard
              className="hire-us-wizard"
              steps={wizardSteps}
              onComplete={handleWizardComplete}
              showProgress={guided}
              allowBackNavigation={true}
              showSummary={false}
              onExit={onExit}
              submitLabel={status === "error" ? "Try again" : "Send inquiry"}
              busy={isSubmitting}
              busyLabel="Sending inquiry…"
              notice={errorNotice}
              onStepChange={onStepChange}
            />
          </Form>
        )}
      </div>
    </div>
  );
}
