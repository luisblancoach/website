"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  validation?: () => boolean | Promise<boolean>;
  onStepComplete?: () => void;
}

interface StepComponentProps {
  isActive?: boolean;
  data?: Record<string, unknown>;
  onUpdate?: (data: Record<string, unknown>) => void;
}

interface WizardProps {
  steps: WizardStep[];
  onComplete?: (data: Record<string, unknown>) => void;
  className?: string;
  showProgress?: boolean;
  allowBackNavigation?: boolean;
  showSummary?: boolean;
  // Shown as "Back" on the first step, to leave the wizard (e.g. close the
  // surrounding inquiry); later steps keep "Previous".
  onExit?: () => void;
  // November 11 (Hire the DAO form): the last step's action and its sending
  // state. While `busy`, the steps stay in place (same size, read-only) and the
  // action shows `busyLabel`, so the panel never collapses during a request.
  submitLabel?: string;
  busy?: boolean;
  busyLabel?: string;
  // Shown above the actions (e.g. a submission error), so it sits where the
  // visitor pressed the button.
  notice?: React.ReactNode;
  // Called after a step change has rendered, with the wizard's root, so the
  // host can keep the active step in view.
  onStepChange?: (root: HTMLDivElement, index: number) => void;
}

export function Wizard({
  steps,
  onComplete,
  className,
  showProgress = true,
  allowBackNavigation = true,
  showSummary,
  onExit,
  submitLabel = "Complete",
  busy = false,
  busyLabel = "Sending…",
  notice,
  onStepChange,
}: WizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(
    new Set()
  );
  const [isValidating, setIsValidating] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const renderedStep = React.useRef(currentStep);

  // After a step change: let the host anchor the panel, then move focus to the
  // progress indicator, which names the new step.
  React.useLayoutEffect(() => {
    if (renderedStep.current === currentStep || !rootRef.current) return;
    renderedStep.current = currentStep;
    onStepChange?.(rootRef.current, currentStep);
    rootRef.current.querySelector<HTMLElement>("[data-wizard-progress]")?.focus({ preventScroll: true });
  }, [currentStep, onStepChange]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  // const canProceed = completedSteps.has(currentStep);

  const goToStep = async (stepIndex: number) => {
    const currentStepData = steps[currentStep];
    if (currentStepData.validation) {
      setIsValidating(true);

      try {
        const isValid = await currentStepData.validation();
        if (isValid) {
          setCompletedSteps((prev) => new Set([...prev, currentStep]));
        } else {
          setCompletedSteps((prev) => {
            const newSet = new Set([...prev]);
            newSet.delete(currentStep);
            return newSet;
          });
        }
      } catch (error) {
        console.error("Validation failed:", error);
      } finally {
        setIsValidating(false);
      }
    }

    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const goToNextStep = async () => {
    if (busy) return;
    const currentStepData = steps[currentStep];

    if (currentStepData.validation) {
      setIsValidating(true);
      try {
        const isValid = await currentStepData.validation();
        if (isValid) {
          setCompletedSteps((prev) => new Set([...prev, currentStep]));

          if (isLastStep) {
            currentStepData.onStepComplete?.();
            onComplete?.({});
          } else {
            currentStepData.onStepComplete?.();
            goToStep(currentStep + 1);
          }
        }
      } catch (error) {
        console.error("Validation failed:", error);
      } finally {
        setIsValidating(false);
      }
    } else {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));

      if (isLastStep) {
        onComplete?.({});
      } else {
        goToStep(currentStep + 1);
      }
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep && allowBackNavigation) {
      goToStep(currentStep - 1);
    }
  };

  // need to check each previous not length
  const isFinalStepCanSubmit = [...Array(steps.length - 1).keys()].every(
    (step) => completedSteps.has(step)
  );
  const disableSubmit = isLastStep && !isFinalStepCanSubmit;

  return (
    <div className={cn("space-y-6", className)} ref={rootRef} aria-busy={busy || undefined} data-busy={busy || undefined}>
      {/* Guided form (October 30): one full-width stepper. Each step is a
          small numbered circle and its title, over a bar segment; the
          segments fill as the steps are reached, so the progress bar is the
          three steps themselves. It is a <nav>, not a div, so the older
          progress card and pill styles do not apply to it. The steps are not
          controls (Next and Previous move between them); the current one is
          marked with aria-current. */}
      {showProgress ? (
        <nav className="wizard-stepper" aria-label={`Form progress: step ${currentStep + 1} of ${steps.length}, ${steps[currentStep].title}`} tabIndex={-1} data-wizard-progress="">
          <ol style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
            {steps.map((step, index) => (
              <li
                key={step.id}
                aria-current={index === currentStep ? "step" : undefined}
                data-state={index < currentStep ? "done" : index === currentStep ? "current" : "next"}
              >
                <span className="wizard-step-dot" aria-hidden="true">{index + 1}</span>
                <span className="wizard-step-title">{step.title}</span>
                {index < currentStep && <span className="sr-only"> (completed)</span>}
              </li>
            ))}
          </ol>
        </nav>
      ) : (
        <div className="flex items-center gap-4" tabIndex={-1} data-wizard-progress="" aria-label={`Step ${currentStep + 1} of ${steps.length}, ${steps[currentStep].title}`}>
          {steps.map((step, index) => (
            <div
              key={step.id}
              aria-current={index === currentStep ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 h-8 px-5 rounded-md font-medium pointer-events-none",
                index === currentStep
                  ? "bg-moloch-500 text-scroll-100"
                  : "bg-moloch-800 text-scroll-100"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-sm flex items-center justify-center text-[12px] font-body font-bold leading-none",
                  index === currentStep
                    ? "bg-scroll-100 text-moloch-500"
                    : "bg-moloch-500 text-moloch-800"
                )}
              >
                {index + 1}
              </span>
              <span className="hidden sm:inline text-body-md font-body">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* <Separator /> */}

      {/* Current Step Content */}
      <div>
        {/* The guided form's stepper already names the step (October 30). */}
        {!showProgress && <div className="text-heading-md mb-7">{steps[currentStep].title}</div>}
        {steps[currentStep].description && (
          <CardDescription>{steps[currentStep].description}</CardDescription>
        )}
        {/* While sending, the fields stay visible but cannot change. */}
        <div className="min-h-[300px]" inert={busy || undefined}>
          {React.isValidElement(steps[currentStep].component)
            ? React.cloneElement(steps[currentStep].component, {
                isActive: true,
                data: {},
                onUpdate: () => {},
              } as StepComponentProps)
            : steps[currentStep].component}
        </div>
      </div>

      {notice}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-end gap-4">
        {isFirstStep && onExit && (
          <Button size={null} onClick={onExit} disabled={busy} className="contact-btn-active" data-wizard-exit="">
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        )}
        {!isFirstStep && (
          <Button
            size={null}
            onClick={goToPreviousStep}
            disabled={!allowBackNavigation || busy}
            className="contact-btn-active"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        )}

        <Button
          onClick={goToNextStep}
          // While sending, the button keeps focus (aria-disabled, not disabled).
          disabled={isValidating || (isLastStep && disableSubmit)}
          aria-disabled={busy || undefined}
          size={null}
          className="contact-btn-active"
          data-wizard-primary=""
        >
          {isLastStep ? (
            <span aria-live="polite">{busy ? busyLabel : submitLabel}</span>
          ) : (
            <>
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Step Summary */}
      {showSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    completedSteps.has(index)
                      ? "bg-scroll-500/20 border border-scroll-500/30"
                      : index === currentStep
                      ? "bg-moloch-500/20 border border-moloch-500/30"
                      : "bg-muted/50"
                  )}
                >
                  <span className="text-sm font-medium">{step.title}</span>
                  <div className="flex items-center space-x-2">
                    {completedSteps.has(index) && (
                      <Badge
                        variant="secondary"
                        className="bg-scroll-500 text-black"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                    {index === currentStep && (
                      <Badge variant="moloch">Current</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
