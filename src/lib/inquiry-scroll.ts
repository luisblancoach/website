// Keeps a part of the Hire the DAO form in view (November 11). The audience
// routes pin a bar to the top of the viewport (SiteHeader, data-fixed-nav), so
// "visible" means below that bar. Scrolls only as far as needed, and not at all
// when the element is already in view.

export function fixedNavBottom(): number {
  const bar = document.querySelector<HTMLElement>("[data-fixed-nav]");
  if (!bar || getComputedStyle(bar).position !== "fixed") return 0;
  return Math.max(0, bar.getBoundingClientRect().bottom);
}

// `until`: also bring this later element into view (e.g. the button below a
// message), as long as the start stays below the bar.
export function revealBelowNav(element: HTMLElement, gap = 16, until?: HTMLElement) {
  const top = fixedNavBottom() + gap;
  const bottom = window.innerHeight - gap;
  const start = element.getBoundingClientRect();
  const end = until?.getBoundingClientRect();
  const rect = { top: start.top, bottom: Math.max(start.bottom, end?.bottom ?? start.bottom) };
  let delta = 0;
  if (rect.top < top) delta = rect.top - top;
  // Too low: bring the bottom up, but never push the top under the bar.
  else if (rect.bottom > bottom) delta = Math.min(rect.bottom - bottom, rect.top - top);
  if (Math.abs(delta) < 1) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollBy({ top: delta, behavior: reduce ? "auto" : "smooth" });
}

// The first field that needs attention, in reading order: focused, and shown
// below the bar.
export function focusFirstInvalid(container: HTMLElement | null) {
  const field = container?.querySelector<HTMLElement>('[aria-invalid="true"]');
  if (!field) return;
  const target = field.matches("input, textarea, button, select, [tabindex]") ? field : field.querySelector<HTMLElement>("input, button, textarea") ?? field;
  target.focus({ preventScroll: true });
  revealBelowNav(field.closest<HTMLElement>('[data-slot="form-item"]') ?? field);
}
