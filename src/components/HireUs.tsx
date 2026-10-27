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
} from "@/lib/validation";
import Image from "next/image";
import MultipleSelector, { type Option } from "./ui/multiselect";
import { DISCORD_INVITE_URL } from "@/lib/data/constants";
import { analyticsEvents, trackAnalyticsEvent } from "@/lib/analytics";

interface StepProps {
  form: ReturnType<typeof useForm<HireUsFormData>>;
  isActive?: boolean;
}

const PersonalInfoStep = ({ form, isActive }: StepProps) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-row flex-wrap w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Your name <RequiredFieldIndicator />
                </FormLabel>
                <FormControl>
                  <Input placeholder="What should we call you?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email address <RequiredFieldIndicator />
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Where can we reach you?"
                    {...field}
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Tell us about your role <RequiredFieldIndicator />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your project involvement, please introduce yourself"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="altContactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prefer another way to connect?</FormLabel>
            <div className="flex">
              <FormControl>
                <Input
                  placeholder="What is your username?"
                  className="!rounded-r-none border-r-0"
                  {...field}
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
                      <SelectTrigger className="!rounded-l-none w-32">
                        <SelectValue placeholder="Discord" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTACT_CHANNEL_OPTIONS.map((o) => {
                        return (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
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

const ProjectDetailsStep = ({ form, isActive }: StepProps) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="projectName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Name of your project or organization <RequiredFieldIndicator />
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Protocol to passion project, what do you go by?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              How can we help? <RequiredFieldIndicator />
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="What can we build, scope, design or source for you?"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specsLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you have project specs?</FormLabel>
            <FormControl>
              <Input
                placeholder="Link to your specs, docs, Figma files, or any materials (optional)"
                // className="rounded-l-none border-l-0"
                {...field}
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

const ServicesSelector = ({
  onChange,
}: {
  onChange: (options: Option[]) => void;
}) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <MultipleSelector
      onChange={onChange}
      options={SERVICES_OPTIONS}
      placeholder="Select"
      hideClearAllButton={true}
      hidePlaceholderWhenSelected={true}
      inputProps={{
        id: formItemId,
        "aria-invalid": !!error,
        "aria-describedby": !error
          ? formDescriptionId
          : `${formDescriptionId} ${formMessageId}`,
      }}
      emptyIndicator={
        <p className="text-center text-body-md leading-10 text-gray-600 dark:text-gray-400">
          no results found.
        </p>
      }
    />
  );
};

const RequirementsStep = ({ form, isActive }: StepProps) => {
  if (!isActive) return null;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <FormField
          control={form.control}
          name="projectPriority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What matters most to you?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row gap-5 md:gap-10"
                >
                  {PROJECT_PRIORITY_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label
                        htmlFor={option.value}
                        className="text-body-md peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !leading-tight"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What&apos;s your budget range <RequiredFieldIndicator />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUDGET_OPTIONS.map((o) => {
                    return (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Timeline <RequiredFieldIndicator />
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((o) => {
                    return (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Services Needed <RequiredFieldIndicator />
              </FormLabel>
              <ServicesSelector onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// `guided` is the October 23 form (40f3910) used by the audience routes: plain
// step names, a short introduction and the progress indicator.
export default function HireUs({ guided = false }: { guided?: boolean }) {
  // State management for user feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Array<{ field: string; message: string }>
  >([]);
  const formRef = React.useRef<HTMLDivElement>(null);
  const hasTrackedFormView = React.useRef(false);

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

  // Validation functions for each step
  const validatePersonalInfo = async () => {
    const result = await form.trigger(["name", "email", "bio"]);
    if (!result) {
      trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
        error_type: "validation",
        error_category: "client",
        step: "contact_info",
      });
    }
    return result;
  };

  const validateProjectDetails = async () => {
    const result = await form.trigger(["projectName", "description"]);
    if (!result) {
      trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
        error_type: "validation",
        error_category: "client",
        step: "project_details",
      });
    }
    return result;
  };

  const validateRequirements = async () => {
    const result = await form.trigger([
      "budget",
      "timeline",
      "services",
      "projectPriority",
    ]);
    if (!result) {
      trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
        error_type: "validation",
        error_category: "client",
        step: "requirements",
      });
    }
    return result;
  };

  const handleWizardComplete = async () => {
    if (isSubmitting) return; // Prevent multiple submissions

    const formData = form.getValues();
    console.log("Wizard completed:", formData);
    const servicesCount = formData.services?.length ?? 0;

    // Reset states
    setIsSubmitting(true);
    setSubmissionStatus("idle");
    setErrorMessage("");
    setValidationErrors([]);

    //tracking
    trackAnalyticsEvent(analyticsEvents.hireFormSubmitAttempt, {
      services_count: servicesCount,
    });

    // Transform form data to API format using the centralized function
    const consultData = transformFormDataToApiFormat(formData);

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ consultData }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Consultation submitted successfully:", result);
        setSubmissionStatus("success");

        //tracking
        trackAnalyticsEvent(analyticsEvents.hireFormSubmitSuccess, {
          services_count: servicesCount,
        });
        // Reset form after successful submission
        form.reset();
      } else {
        console.error("Failed to submit consultation:", result);
        setSubmissionStatus("error");

        // Handle validation errors
        if (
          response.status === 400 &&
          result.details &&
          Array.isArray(result.details)
        ) {
          console.error("Validation errors:", result.details);
          setValidationErrors(result.details);
          setErrorMessage("Please fix the validation errors below.");
          trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
            error_type: "server_validation",
            error_category: "server",
            step: "submit",
          });
        } else {
          setErrorMessage(
            result.error || "Failed to submit consultation. Please try again."
          );
          trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
            error_type: "server_error",
            error_category: "server",
            step: "submit",
          });
        }
      }
    } catch (error) {
      console.error("Error submitting consultation:", error);
      setSubmissionStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      trackAnalyticsEvent(analyticsEvents.hireFormSubmitError, {
        error_type: "network",
        error_category: "network",
        step: "submit",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Feedback components
  const SuccessState = () => (
    <div className="text-center space-y-4 p-8">
      <div className="flex items-center justify-center">
        <Image
          src="/images/Logomark.svg"
          alt="Raid Guild"
          width={169}
          height={159}
          className="flex-shrink-0"
        />
      </div>
      <a
        className="text-body-md hover:text-moloch-500 transition-colors"
        href={DISCORD_INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Introduce yourself in Discord
      </a>
    </div>
  );

  const ErrorState = () => (
    <div className="space-y-4 p-6 border rounded-md bg-scroll-100">
      <p className="text-body-md text-moloch-500">{errorMessage}</p>

      {validationErrors.length > 0 && (
        <div className="mt-4 text-body-md">
          <h4 className="font-medium text-moloch-800 mb-2">
            Please fix the following issues:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-body-md text-moloch-600">
            {validationErrors.map((error, index) => (
              <li key={index}>
                <span className="font-medium">{error.field}:</span>{" "}
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => {
          setSubmissionStatus("idle");
          setErrorMessage("");
          setValidationErrors([]);
        }}
        className="contact-btn-active mt-5"
      >
        Try Again
      </button>
    </div>
  );

  const LoadingIndicator = () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center animate-spin [animation-duration:7s]">
          <Image
            src="/images/Logomark.svg"
            alt="Raid Guild"
            width={169}
            height={159}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );

  const wizardSteps: WizardStep[] = [
    {
      id: "personal-info",
      title: guided ? "About you" : "Contact Info",
      // description: "Tell us about yourself",
      component: <PersonalInfoStep form={form} />,
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
      // description: "Describe your project requirements",
      component: <ProjectDetailsStep form={form} />,
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
      // description: "Specific requirements and timeline details",
      component: <RequirementsStep form={form} />,
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
    <div>
      <div className="mx-auto w-full">
        {submissionStatus === "success" ? (
          <>
            <h3 className="text-heading-lg font-bold text-moloch-500 mb-12">
              The Fires Have Been Lit!
            </h3>
            <p className="text-center text-body-md">
              Your quest has been received. A member of the Guild will be in
              touch with you shortly to discuss next steps.
            </p>
          </>
        ) : guided ? (
          <div className="mb-8">
            <h3 className="text-heading-lg font-bold text-moloch-500 mb-3">Tell us about your project</h3>
            <p className="text-body-base">Three steps: introduce yourself, outline the project, then share your scope and timing. You can go back to review before sending.</p>
          </div>
        ) : (
          <h3 className="text-heading-lg font-bold text-moloch-500 mb-12">
            Let&apos;s Get Started
          </h3>
        )}
      </div>

      {/* Wizard */}
      <div className="space-y-4" ref={formRef}>
        <Form {...form}>
          {submissionStatus === "success" ? (
            <SuccessState />
          ) : submissionStatus === "error" ? (
            <ErrorState />
          ) : isSubmitting ? (
            <LoadingIndicator />
          ) : (
            <Wizard
              className="hire-us-wizard"
              steps={wizardSteps}
              onComplete={handleWizardComplete}
              showProgress={guided}
              allowBackNavigation={true}
              showSummary={false}
            />
          )}
        </Form>
      </div>
    </div>
  );
}
