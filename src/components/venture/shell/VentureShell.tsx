"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { UnchartedHunt } from "@/components/UnchartedHunt";
import { PORTAL_JOIN_URL } from "@/lib/data/constants";
import { routeHasSection, sectionHref, type SectionId } from "@/lib/venture-routes";
import { ThemeProvider, useTheme } from "./ThemeProvider";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import PortalOverlay from "./PortalOverlay";
import { ReviewFlagsProvider, ReviewPanel, SurfaceExperiment } from "../primitives/Review";
import styles from "../venture.module.css";

type VentureState = {
  pathname: string;
  portalOpen: boolean;
  arrivalTarget: string | null;
  inquiryExpanded: boolean;
  setInquiryExpanded: (open: boolean) => void;
  sectionHref: (section: SectionId) => string;
  followSectionLink: (event: MouseEvent<HTMLAnchorElement>, destination: SectionId) => void;
  followInquiryLink: (event: MouseEvent<HTMLAnchorElement>) => void;
  openPortal: () => void;
};

const VentureContext = createContext<VentureState | null>(null);

export function useVenture() {
  const context = useContext(VentureContext);
  if (!context) throw new Error("useVenture must be used inside VentureShell");
  return context;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const isNight = theme === "dark";
  const [inquiryExpanded, setInquiryExpanded] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalForming, setPortalForming] = useState(false);
  const [portalClosing, setPortalClosing] = useState(false);
  const [arrivalTarget, setArrivalTarget] = useState<string | null>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const portalTimerRef = useRef<number | null>(null);
  const portalFormTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);
  const firstPathRef = useRef(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set<HTMLVideoElement>();
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video[data-scene]"));
    const update = () => videos.forEach((video) => {
      const scene = video.dataset.scene;
      const matchesTheme = scene === "manifesto" || scene === (isNight ? "dark" : "light");
      if (!portalOpen && !document.hidden && !preference.matches && matchesTheme && visible.has(video)) {
        void video.play().catch(() => { /* Poster remains available if autoplay is blocked. */ });
      } else video.pause();
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) visible.add(video);
        else visible.delete(video);
      });
      update();
    });
    videos.forEach((video) => observer.observe(video));
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [portalOpen, isNight, pathname]);

  const scrollToSection = useCallback((destination: SectionId) => {
    const target = document.getElementById(destination);
    if (!target) return;
    const reduceMotion = reducedMotion();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
    setArrivalTarget(destination);
    arrivalTimerRef.current = window.setTimeout(() => setArrivalTarget(null), reduceMotion ? 0 : 1800);
  }, []);

  useEffect(() => {
    let revealTimer: number | undefined;
    const revealHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      setInquiryExpanded(hash === "project-inquiry");
      if (revealTimer) window.clearTimeout(revealTimer);
      if (["team", "gallery", "uncharted", "project-inquiry"].includes(hash)) {
        revealTimer = window.setTimeout(() => {
          const target = document.getElementById(hash);
          target?.scrollIntoView({ block: "start" });
          if (hash === "project-inquiry") target?.focus({ preventScroll: true });
        }, 80);
      }
    };
    revealHash();
    window.addEventListener("hashchange", revealHash);
    window.addEventListener("popstate", revealHash);
    return () => {
      if (revealTimer) window.clearTimeout(revealTimer);
      window.removeEventListener("hashchange", revealHash);
      window.removeEventListener("popstate", revealHash);
    };
  }, []);

  // Arriving from another route with a section hash: open the inquiry if needed
  // and land on the section once the new route has rendered.
  useEffect(() => {
    if (firstPathRef.current) {
      firstPathRef.current = false;
      return;
    }
    const hash = decodeURIComponent(window.location.hash.slice(1));
    setInquiryExpanded(hash === "project-inquiry");
    if (!hash) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(hash);
      target?.scrollIntoView({ block: "start" });
      if (hash === "project-inquiry") target?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const followSectionLink = (event: MouseEvent<HTMLAnchorElement>, destination: SectionId) => {
    event.preventDefault();
    if (!routeHasSection(pathname, destination)) {
      router.push(sectionHref(pathname, destination));
      return;
    }
    window.history.replaceState(null, "", `#${destination}`);
    scrollToSection(destination);
  };

  const revealInquiry = (pushHistory = false) => {
    if (!routeHasSection(pathname, "project-inquiry")) {
      router.push(sectionHref(pathname, "project-inquiry"));
      return;
    }
    setInquiryExpanded(true);
    window.history[pushHistory ? "pushState" : "replaceState"](null, "", "#project-inquiry");
    // Wait for the disclosure to open before scrolling and moving keyboard focus.
    window.setTimeout(() => {
      const inquiry = document.getElementById("project-inquiry");
      inquiry?.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      inquiry?.focus({ preventScroll: true });
    }, 80);
  };

  const followInquiryLink = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    revealInquiry(true);
  };

  const openPortal = () => {
    if (portalFormTimerRef.current) window.clearTimeout(portalFormTimerRef.current);
    setPortalOpen(true);
    // The rabbit and first clue must be available as soon as the gallery entry opens.
    setPortalForming(false);
  };

  const dismissPortal = (destination?: "project-inquiry" | "spears") => {
    if (portalClosing) return;
    if (portalFormTimerRef.current) window.clearTimeout(portalFormTimerRef.current);
    setPortalForming(false);
    setPortalClosing(true);
    portalTimerRef.current = window.setTimeout(() => {
      setPortalOpen(false);
      setPortalClosing(false);
      if (destination === "project-inquiry") {
        revealInquiry();
      } else if (destination && !routeHasSection(pathname, destination)) {
        router.push(sectionHref(pathname, destination));
      } else if (destination) scrollToSection(destination);
    }, reducedMotion() ? 0 : destination ? 920 : 620);
  };

  const joinGuild = () => {
    window.open(PORTAL_JOIN_URL, "_blank", "noopener,noreferrer");
    dismissPortal();
  };

  useEffect(() => () => {
    if (portalTimerRef.current) window.clearTimeout(portalTimerRef.current);
    if (portalFormTimerRef.current) window.clearTimeout(portalFormTimerRef.current);
    if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
  }, []);

  const venture: VentureState = {
    pathname,
    portalOpen,
    arrivalTarget,
    inquiryExpanded,
    setInquiryExpanded,
    sectionHref: (section) => sectionHref(pathname, section),
    followSectionLink,
    followInquiryLink,
    openPortal,
  };

  return (
    <VentureContext.Provider value={venture}>
    <Dialog.Root open={portalOpen} onOpenChange={(open) => { if (!open) dismissPortal(); }}>
    <UnchartedHunt>
    <div className={styles.site} ref={siteRef}>
    <a className={styles.skipLink} href="#main-content">Skip to content</a>
    <main inert={portalOpen} data-motion-paused={portalOpen} className={portalForming ? styles.siteGlitching : ""}>
      <SiteHeader />
      {/* Skip-link target: lands after the header and navigation. */}
      <span id="main-content" tabIndex={-1} className={styles.skipTarget} />
      {children}
      <SiteFooter />
    </main>
      <PortalOverlay
        open={portalOpen}
        forming={portalForming}
        closing={portalClosing}
        container={siteRef.current}
        onClose={() => dismissPortal()}
        onSpears={() => dismissPortal("spears")}
        onProblem={() => dismissPortal("project-inquiry")}
        onJoin={joinGuild}
      />
    </div>
    </UnchartedHunt>
    </Dialog.Root>
    </VentureContext.Provider>
  );
}

export default function VentureShell({ children, reviewFlags = false }: { children: ReactNode; reviewFlags?: boolean }) {
  return (
    <ThemeProvider>
      <ReviewFlagsProvider enabled={reviewFlags}>
        <Shell>{children}</Shell>
        <ReviewPanel />
        <SurfaceExperiment />
      </ReviewFlagsProvider>
    </ThemeProvider>
  );
}
