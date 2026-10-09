"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { UnchartedHunt, HuntMarker, HuntPixel } from "./UnchartedHunt";
import TeamWall from "./TeamWall";
import PortalEnergy from "./PortalEnergy";
import LoopBand from "./LoopBand";
import ArtifactGallery from "./ArtifactGallery";
import HireUs from "@/components/HireUs";
import { mercenaries } from "@/lib/data/members";
import { PORTAL_JOIN_URL } from "@/lib/data/constants";
import styles from "./HomeExperience.module.css";

const activeSpears = [
  {
    index: "01",
    title: "Applied AI",
    copy: "An independently led practice bringing the network’s technical curiosity to applied AI. Explore its work with agents, workflows, and the systems that support them.",
    tag: "ACTIVE SPEAR / RAIDGUILD.AI",
    status: "DEPLOYING",
    href: "https://raidguild.ai",
    cta: "Explore the AI practice",
    art: "/images/neo/spear-applied-ai-v1.webp",
    artAlt: "A field technologist working with an AI companion and portable systems",
  },
  {
    index: "02",
    title: "Onchain Systems",
    copy: "A specialist practice rooted in the Guild’s onchain experience since 2019. Explore its work with protocols, products, governance, and shared ownership.",
    tag: "ACTIVE SPEAR / ONCHAIN",
    status: "BATTLE-TESTED",
    href: "https://raidguild-onchain-production.up.railway.app/",
    cta: "Explore onchain work",
    art: "/images/neo/spear-onchain-v1.webp",
    artAlt: "Guild builders operating an onchain systems foundry",
  },
];

// Reuse the identity assets from the original site's partner-logo banner.
// The group includes client, partner, and member-built projects, not just clients.
const networkLogos = [
  // Organization summaries and official destinations checked September 23, 2026.
  // These describe the organizations, not the scope of RaidGuild's engagements.
  { name: "Gitcoin", file: "logo-Gitcoin.svg", href: "https://gitcoin.co/", description: "Gitcoin explores how communities fund public goods and open-source work. Its site brings together funding campaigns, tools, research, and lessons from the Ethereum ecosystem." },
  { name: "Gnosis", file: "logo-Gnosis.svg", href: "https://www.gnosis.io/chain", description: "Gnosis Chain is an Ethereum-compatible blockchain designed for accessible, low-cost transactions. It supports an ecosystem of applications and infrastructure for building onchain." },
  { name: "Pocket Network", file: "logo-Pocket.svg", href: "https://pocket.network/", description: "Pocket Network provides decentralized access to blockchain data through a network of infrastructure providers. Developers use its RPC services to connect applications, wallets, and other tools to blockchains." },
  { name: "Unlock Protocol", file: "logo-Unlock.svg", href: "https://unlock-protocol.com/", description: "Unlock Protocol provides open-source smart contracts for memberships and subscriptions. Its tools support time-based access, renewals, and recurring payments onchain." },
  { name: "BrightID", file: "logo-brightid.svg", href: "https://www.brightid.org/", description: "BrightID is a privacy-focused social identity network that helps people demonstrate they are using an application with only one account. It supports fair access without collecting personally identifying information." },
  { name: "DAOhaus", file: "logo-daohaus.svg", href: "https://daohaus.club/", description: "DAOhaus builds open-source tools for creating and operating DAOs. Its applications and Moloch-based contracts help communities manage membership, proposals, and shared treasuries." },
  { name: "Hypercerts", file: "logo-Hypercerts.svg", href: "https://hypercerts.org/", description: "Hypercerts develops open infrastructure for funding valuable work. Its protocol connects project records, reviews, and endorsements so funders can make better-informed decisions." },
  { name: "Protocol Labs", file: "logo-Protocol.svg", href: "https://pl.xyz/", description: "Protocol Labs is an innovation network connecting researchers, builders, and technology companies. It supports work from early research and invention through venture formation and growth." },
  { name: "Livepeer", file: "logo-Livepeer.svg", href: "https://livepeer.org/", description: "Livepeer provides open video infrastructure powered by a permissionless network of GPU providers. Its ecosystem supports AI video generation and processing alongside transcoding and streaming." },
  { name: "Daedalus", file: "logo-Daedalus.png", href: "https://ddls.co/", description: "Daedalus builds custom software for organizations whose operations need more than generic tools. The team combines practical AI, conventional software, and existing products to deliver systems clients can own and maintain." },
  { name: "LX2 Labs", file: "logo-LX2.svg", href: "https://www.lx2labs.com/", description: "LX2 Labs helps fintech companies improve their products and grow through design, branding, and lifecycle systems. Its work includes onboarding, automation, and AI implementation." },
];

const stewards = [
  {
    name: "Dekan",
    role: "Knowledge Steward",
    href: "https://x.com/DekanBro",
    project: "KNOWLEDGE SYSTEMS",
    image: "/images/member-dekan.png",
  },
  {
    name: "ECWireless",
    role: "Infrastructure Steward",
    href: "https://github.com/ECWireless",
    project: "GITHUB / ECWIRELESS",
    image: "/images/member-ecwireless.png",
  },
  {
    name: "Takekek",
    role: "Sync Steward",
    project: "PROFILE FORTHCOMING",
    image: "/images/member-takekek.png",
  },
  {
    name: "Pupcakes",
    role: "Participation Steward",
    href: "https://github.com/Fluffy9",
    project: "GITHUB / FLUFFY9",
    image: "/images/member-pupcakes.png",
  },
  {
    name: "Louchi",
    role: "Brand Steward",
    href: "https://estudioblanco.org",
    project: "ESTUDIO BLANCO",
    image: "/images/member-louchi.png",
  },
];

const stewardNames = new Set(stewards.map((steward) => steward.name.toLowerCase()));
const guildMembers = mercenaries.filter((member) => !stewardNames.has(member.name.toLowerCase()));

function Sigil() {
  return (
    <span className={styles.sigil} aria-hidden="true">
      <span className={styles.swordMark} />
    </span>
  );
}

type PortalOverlayProps = {
  open: boolean;
  forming: boolean;
  closing: boolean;
  container: HTMLElement | null;
  onClose: () => void;
  onSpears: () => void;
  onProblem: () => void;
  onJoin: () => void;
};

function PortalOverlay({ open, forming, closing, container, onClose, onSpears, onProblem, onJoin }: PortalOverlayProps) {
  const [energized, setEnergized] = useState<string | null>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);


  if (!open) return null;

  return (
    <Dialog.Portal container={container ?? undefined}>
    <Dialog.Content
      className={`${styles.portalOverlay} ${forming ? styles.portalForming : ""} ${closing ? styles.portalClosing : ""}`}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        const rabbit = document.querySelector<HTMLElement>('[role="dialog"] [aria-label="Follow the rabbit"]');
        if (rabbit) rabbit.focus();
        else firstChoiceRef.current?.focus();
      }}
      onEscapeKeyDown={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <Dialog.Title className="sr-only">The RaidGuild Portal and discovery trail</Dialog.Title>
      <Dialog.Description className="sr-only">Follow the rabbit to begin the three-clue hunt, or choose a destination.</Dialog.Description>
      <div className={styles.portalAtmosphere} aria-hidden="true" />
      <button
        ref={firstChoiceRef}
        className={`${styles.portalMachine} ${styles.portalSpear}`}
        onPointerEnter={() => setEnergized("Spear")}
        onPointerLeave={() => setEnergized(null)}
        onFocus={() => setEnergized("Spear")}
        onBlur={() => setEnergized(null)}
        type="button"
        onClick={onSpears}
        disabled={closing}
        aria-label="Explore independent RaidGuild practices"
      >
        <PortalEnergy energized={energized === "Spear"} destinationSrc="/images/neo/field-protocol-garden.png" />
        <span className={styles.portalChoiceLabel}>
          <small>01 / EXPLORE</small>
          <strong>EXPLORE PRACTICES</strong>
          <b>Meet the Guild’s specialist offerings</b>
          <i>↓</i>
        </span>
      </button>
      <button
        className={`${styles.portalMachine} ${styles.portalProblem}`}
        onPointerEnter={() => setEnergized("Problem")}
        onPointerLeave={() => setEnergized(null)}
        onFocus={() => setEnergized("Problem")}
        onBlur={() => setEnergized(null)}
        type="button"
        onClick={onProblem}
        disabled={closing}
        aria-label="Start a project with RaidGuild"
      >
        <PortalEnergy energized={energized === "Problem"} destinationSrc="/images/neo/sky-citadel.png" />
        <span className={styles.portalChoiceLabel}>
          <small>02 / INQUIRE</small>
          <strong>START A PROJECT</strong>
          <b>Find a starting point in the network</b>
          <i>↓</i>
        </span>
      </button>
      <button
        className={`${styles.portalMachine} ${styles.portalJoin}`}
        onPointerEnter={() => setEnergized("Join")}
        onPointerLeave={() => setEnergized(null)}
        onFocus={() => setEnergized("Join")}
        onBlur={() => setEnergized(null)}
        type="button"
        onClick={onJoin}
        disabled={closing}
        aria-label="Join the RaidGuild builder community in a new tab"
      >
        <PortalEnergy energized={energized === "Join"} destinationSrc="/images/neo/hero-dark-poster.png" />
        <span className={styles.portalChoiceLabel}>
          <small>03 / JOIN</small>
          <strong>JOIN THE GUILD</strong>
          <b>Connect with the community on Portal</b>
          <i>↗</i>
        </span>
      </button>
      <button className={styles.portalClose} type="button" onClick={onClose} aria-label="Close portal">
        <span>CLOSE</span> ×
      </button>
      <div className={styles.portalReadout} aria-hidden="true">
        <span>RG—TRANSIT / 001</span>
        <span>STABILITY 98.7%</span>
      </div>
      {forming && <p className={styles.portalBreach}>[ SPATIAL BREACH DETECTED ]</p>}
      {!forming && (
        <div className={styles.portalMessage}>
          <h2>THE HUNT <em>STARTS HERE.</em></h2>
          <p className={styles.portalHuntIntro}>Follow the rabbit for the first clue. Then find a signal near the Guild inquiry and a mark beneath the Creed.</p>
        </div>
      )}
      {!forming && <div className={styles.unchartedPortal}><HuntPixel artifact="portal" /><HuntMarker artifact="portal" label="Follow the rabbit" rabbit /></div>}
      <p className={styles.portalCoordinates}>39°44′N / 104°59′W<br />DESTINATION: UNMAPPED</p>
    </Dialog.Content>
    </Dialog.Portal>
  );
}

export default function HomeExperience() {
  const [inquiryExpanded, setInquiryExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalForming, setPortalForming] = useState(false);
  const [portalClosing, setPortalClosing] = useState(false);
  const [isNight, setIsNight] = useState(false);
  const [arrivalTarget, setArrivalTarget] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const siteRef = useRef<HTMLDivElement>(null);
  const portalTimerRef = useRef<number | null>(null);
  const portalFormTimerRef = useRef<number | null>(null);
  const arrivalTimerRef = useRef<number | null>(null);

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
  }, [portalOpen, isNight]);

  const scrollToSection = (destination: "guild" | "spears" | "work" | "contact") => {
    const target = document.getElementById(destination);
    if (!target) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
    setArrivalTarget(destination);
    arrivalTimerRef.current = window.setTimeout(() => setArrivalTarget(null), reduceMotion ? 0 : 1800);
  };

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

  const followSectionLink = (
    event: MouseEvent<HTMLAnchorElement>,
    destination: "guild" | "spears" | "work" | "contact",
  ) => {
    event.preventDefault();
    window.history.replaceState(null, "", `#${destination}`);
    scrollToSection(destination);
  };

  const revealInquiry = (pushHistory = false) => {
    setInquiryExpanded(true);
    window.history[pushHistory ? "pushState" : "replaceState"](null, "", "#project-inquiry");
    // Wait for the disclosure to open before scrolling and moving keyboard focus.
    window.setTimeout(() => {
      const inquiry = document.getElementById("project-inquiry");
      inquiry?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
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
      } else if (destination) scrollToSection(destination);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : destination ? 920 : 620);
  };

  const joinGuild = () => {
    window.open("https://portal.raidguild.org/join", "_blank", "noopener,noreferrer");
    dismissPortal();
  };

  useEffect(() => () => {
    if (portalTimerRef.current) window.clearTimeout(portalTimerRef.current);
    if (portalFormTimerRef.current) window.clearTimeout(portalFormTimerRef.current);
    if (arrivalTimerRef.current) window.clearTimeout(arrivalTimerRef.current);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = window.localStorage.getItem("raidguild-theme");
    const initialTheme = stored === "light" || stored === "dark"
      ? stored
      : media.matches ? "dark" : "light";

    root.dataset.theme = initialTheme;
    root.style.colorScheme = initialTheme;
    setIsNight(initialTheme === "dark");

    const followSystem = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem("raidguild-theme")) return;
      const theme = event.matches ? "dark" : "light";
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      setIsNight(event.matches);
    };

    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const toggleTheme = () => {
    const theme = isNight ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("raidguild-theme", theme);
    setIsNight(theme === "dark");
  };

  useEffect(() => {
    const root = heroRef.current;
    if (!root || portalOpen) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let frame = 0;
    let x = 0;
    const paint = () => {
      frame = 0;
      root.style.setProperty("--neo-sky-x", `${(x * 10).toFixed(1)}px`);
      root.style.setProperty("--neo-land-x", `${(x * -10).toFixed(1)}px`);
      root.style.setProperty("--neo-title-x", `${(x * 8).toFixed(1)}px`);
    };
    const updatePointer = (event: PointerEvent) => {
      if (motion.matches || !finePointer.matches || document.hidden) return;
      x = event.clientX / window.innerWidth - 0.5;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const reset = () => { cancelAnimationFrame(frame); x = 0; paint(); };
    root.addEventListener("pointermove", updatePointer, { passive: true });
    root.addEventListener("pointerleave", reset);
    return () => {
      root.removeEventListener("pointermove", updatePointer);
      root.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [portalOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || portalOpen) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let previousDistance = -1;
    let travel = 1;
    let top = 0;
    const updateScroll = () => {
      if (frame || !visible || document.hidden || motion.matches) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (hero) {
          const distance = Math.min(Math.max(window.scrollY - top, 0), travel);
          if (distance === previousDistance) return;
          previousDistance = distance;
          const progress = distance / travel;
          const root = hero;
          root.style.setProperty("--neo-progress", progress.toFixed(3));
          root.style.setProperty("--neo-sky-y", `${(distance * 0.035).toFixed(1)}px`);
          root.style.setProperty("--neo-fore-y", `${(distance * -0.34).toFixed(1)}px`);
          root.style.setProperty("--neo-copy-y", `${(distance * -0.3).toFixed(1)}px`);
      root.style.setProperty("--neo-copy-opacity", (1 - progress * 0.72).toFixed(3));
        }
      });
    };
    const resize = () => {
      travel = Math.max(hero.offsetHeight - window.innerHeight, 1);
      top = hero.offsetTop;
      previousDistance = -1;
      updateScroll();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateScroll(); });
    const sizes = new ResizeObserver(resize);
    observer.observe(hero);
    sizes.observe(hero);
    resize();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      observer.disconnect();
      sizes.disconnect();
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", resize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [portalOpen]);

  return (
    <Dialog.Root open={portalOpen} onOpenChange={(open) => { if (!open) dismissPortal(); }}>
    <UnchartedHunt>
    <div className={styles.site} ref={siteRef}>
    <main inert={portalOpen} data-motion-paused={portalOpen} className={portalForming ? styles.siteGlitching : ""}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top" aria-label="RaidGuild home">
          <Sigil />
          <span>RAID<br />GUILD</span>
        </a>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Primary navigation">
          <a href="#guild" onClick={(event) => { setMenuOpen(false); followSectionLink(event, "guild"); }}>Guild</a>
          <a href="#work" onClick={(event) => { setMenuOpen(false); followSectionLink(event, "work"); }}>Community stories</a>
          <a href="#spears" onClick={(event) => { setMenuOpen(false); followSectionLink(event, "spears"); }}>Practices</a>
          <a href="https://portal.raidguild.org/join" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>Join through Portal ↗</a>
        </nav>

        <button
          className={styles.celestialToggle}
          type="button"
          aria-label={`Switch to ${isNight ? "day" : "night"} mode`}
          aria-pressed={isNight}
          onClick={toggleTheme}
        >
          <span aria-hidden="true"><i /></span>
          <b>{isNight ? "NIGHT" : "DAY"}</b>
        </button>

        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <section className={styles.hero} id="top" ref={heroRef}>
        <div className={styles.heroStage}>
          <div className={styles.heroCelestial} aria-hidden="true">
            <span className={styles.moonLarge} />
            <span className={styles.moonSmall} />
            <span className={styles.orbitLine} />
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <video
              className={styles.heroImage}
              poster="/images/neo/hero-light-poster.png"
              data-scene="light"
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source media="(max-width: 900px)" src="/videos/venture/hero-light-mobile.mp4" type="video/mp4" />
              <source src="/videos/venture/hero-light-pingpong.mp4" type="video/mp4" />
            </video>
            <video
              className={`${styles.heroImage} ${styles.heroNightImage}`}
              poster="/images/neo/hero-dark-poster.png"
              data-scene="dark"
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source media="(max-width: 900px)" src="/videos/venture/hero-dark-mobile.mp4" type="video/mp4" />
              <source src="/videos/venture/hero-dark-pingpong.mp4" type="video/mp4" />
            </video>
          </div>
          <div className={styles.heroWash} />
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span /> Independent digital mercenaries</p>
            <div className={styles.heroTitle}>
              <h1><span>VENTURE</span><br /><em>BEYOND</em></h1>
            </div>
          </div>
          <div className={styles.heroSupplement}>
            <p className={styles.heroDek}>
              RaidGuild is a builder-owned community where creative and technical people explore emerging technology and build together.
            </p>
            <div className={styles.heroPaths} aria-label="Ways into RaidGuild">
              <a className={`${styles.pill} ${styles.pillFilled} ${styles.heroPrimaryPath}`} href="#guild" onClick={(event) => followSectionLink(event, "guild")}><span>Explore the Guild</span><i className={styles.pillIcon} aria-hidden="true">↓</i></a>
              <a className={`${styles.pill} ${styles.pillOutline}`} href="https://portal.raidguild.org/join" target="_blank" rel="noopener noreferrer"><span>Join through Portal</span><i className={styles.pillIcon} aria-hidden="true">↗</i></a>
              <a className={`${styles.pill} ${styles.pillOutline}`} href="#spears" onClick={(event) => followSectionLink(event, "spears")}><span>Bring a project</span><i className={styles.pillIcon} aria-hidden="true">↓</i></a>
            </div>
          </div>
          <div className={styles.heroIndex}>
            <span>TRANSMISSION</span>
            <strong>001</strong>
          </div>
          <p className={styles.heroScrollCue} aria-hidden="true">&lt;&lt;&lt; SCROLL TO DESCEND</p>
          <div className={`${styles.heroForeground} ${styles.heroForegroundLeft}`} aria-hidden="true">
            <Image
              src="/images/neo/hero-foreground.png"
              alt=""
              fill
              priority
              sizes="110vw"
              className={styles.foregroundImage}
            />
          </div>
          <div className={`${styles.heroForeground} ${styles.heroForegroundRight}`} aria-hidden="true">
            <Image
              src="/images/neo/hero-foreground.png"
              alt=""
              fill
              priority
              sizes="110vw"
              className={styles.foregroundImage}
            />
          </div>
        </div>
      </section>

      <LoopBand label="Guild ticker">
        {['ONE GUILD', 'MANY EDGES', 'BUILDER-OWNED', 'APPLIED AI', 'ONCHAIN SYSTEMS', 'OPEN EXPERIMENTS'].map(word => <span className={styles.tickerWord} key={word}>{word}<i aria-hidden="true" /></span>)}
      </LoopBand>

      <section className={`${styles.prologue} ${arrivalTarget === "guild" ? styles.sectionArriving : ""}`} id="guild">
        <div className={styles.guildVisual}>
          <Image
            className={styles.guildBuilders}
            src="/images/neo/guild-builders-v1.png"
            alt=""
            width={768}
            height={1024}
            sizes="600px"
            aria-hidden="true"
          />
        </div>
        <div className={styles.prologueCopy}>
          <p className={styles.sectionLabel}>[ THE GUILD ]</p>
          <h2>The network<br /><em>is the engine</em></h2>
          <div className={styles.prologueBody}>
            <p>
              <strong>RaidGuild</strong> is a builder-owned community exploring emerging technology together.{" "}
              <strong>Designers, engineers, researchers, strategists, and operators</strong> share knowledge, reputation, and infrastructure.
            </p>
            <details className={styles.guildMore}>
              <summary>See more <span aria-hidden="true">↗</span></summary>
              <p>We learn from one another, test ideas, and build lasting relationships. Shared work grows from those connections, from open experiments to independent practices in applied AI and onchain systems.</p>
            </details>
          </div>
          <div className={styles.guildBenefits}>
            <h3>Your Guild kit</h3>
            <dl>
              <div><dt>Guild email</dt><dd>Your own @raidguild.org address</dd></div>
              <div><dt>Space to launch</dt><dd>A raidguild.org subdomain for your personal site or Tip of the Spear initiative</dd></div>
              <div><dt>Shared ownership</dt><dd>Equity in the company</dd></div>
              <div><dt>AI companion</dt><dd>Your own personal organizational AI assistant</dd></div>
            </dl>
            <p>To become a member, first complete a cohort.</p>
          </div>
          <div className={styles.guildActions}>
            <a className={`${styles.pill} ${styles.pillFilled}`} href={PORTAL_JOIN_URL} target="_blank" rel="noopener noreferrer">
              <span>Start with a cohort</span>
              <i className={styles.pillIcon}><b className={styles.iconLogo} /></i>
            </a>
            <a className={`${styles.pill} ${styles.pillOutline}`} href="https://discord.gg/2vx47gT95y" target="_blank" rel="noopener noreferrer">
              <span>Enter Discord</span>
              <i className={styles.pillIcon}><b className={styles.iconDiscord} /></i>
            </a>
          </div>
          <div className={styles.guildMoreLinks}>
            <a className={styles.handbookLink} href="https://handbook.raidguild.org/docs/overview/what-is-raidguild" target="_blank" rel="noopener noreferrer">Read the handbook ↗</a>
            <a className={styles.handbookLink} href="/chat" target="_blank" rel="noopener noreferrer">Questions? Ask Queen Raida, our AI CTO ↗</a>
          </div>
        </div>
        <LoopBand label="RaidGuild statistics" reverse>
          <div className={styles.metricItem}><strong>150</strong><span>GLOBAL MEMBERS</span></div>
          <div className={styles.metricItem}><strong>88+</strong><span>RAIDS SHIPPED ACROSS THE FRONTIER</span></div>
          <div className={styles.metricItem}><strong>∞</strong><span>QUESTIONS TO EXPLORE</span></div>
          <div className={styles.metricItem}><strong>2019</strong><span>BUILDING TOGETHER SINCE</span></div>
        </LoopBand>
      </section>

      <div className={styles.moreCommunity}>
      <section className={styles.keepers}>
        <div className={styles.guildRoster}>
          <div className={styles.rosterHeading}>
            <div>
              <p className={styles.sectionLabel}>[ CURRENT STEWARDS ]</p>
              <h3>Keepers of<br /><em>the signal</em></h3>
              <p>Stewards help care for the Guild’s shared knowledge, infrastructure, coordination, and public voice.</p>
            </div>
            <div className={styles.rosterAside}>
              <a href="https://portal.raidguild.org" target="_blank" rel="noopener noreferrer">Explore all members <span>↗</span></a>
            </div>
          </div>

          <div className={styles.stewardTrack}>
            {stewards.map((steward, index) => {
              const card = (
                <>
                  <div className={styles.stewardTop}>
                    <span>ST—{String(index + 1).padStart(2, "0")}</span>
                    <i>{steward.href ? "↗" : "·"}</i>
                  </div>
                  <div className={styles.stewardPortrait}>
                    <Image src={steward.image} alt="" fill sizes="180px" />
                  </div>
                  <p>{steward.role}</p>
                  <h4>{steward.name}</h4>
                  <small>{steward.project}</small>
                </>
              );

              return steward.href ? (
                <a className={styles.stewardCard} href={steward.href} target="_blank" rel="noopener noreferrer" key={steward.name}>{card}</a>
              ) : (
                <div className={styles.stewardCard} key={steward.name}>{card}</div>
              );
            })}
          </div>

        </div>
      </section>

      <section className={styles.teamNetwork} id="team">
        <TeamWall members={guildMembers} suspended={portalOpen} />
        <div className={styles.teamCopy}>
          <p className={styles.sectionLabel}>[ THE TEAM ]</p>
          <h3>A WIDE NETWORK<br /><em>OF BUILDERS</em></h3>
          <p>Different skills, backgrounds, and curiosities. Get to know the people who share what they learn and make more possible together.</p>
          <a className={`${styles.pill} ${styles.pillOutline}`} href="https://discord.gg/2vx47gT95y" target="_blank" rel="noopener noreferrer">
            <span>Enter Discord</span>
            <i className={styles.pillIcon}><b className={styles.iconDiscord} /></i>
          </a>
        </div>
      </section>

      </div>

      <div className={`${styles.sectionSlope} ${styles.slopeCommunityField}`} aria-hidden="true" />
      <section className={`${styles.fieldNotes} ${arrivalTarget === "work" ? styles.sectionArriving : ""}`} id="work">
        <header className={styles.collectionHeading}>
          <p className={styles.sectionLabel}>[ EXPLORE ]</p>
          <h2>Wall of<br /><em>curiosities</em></h2>
        </header>
        <div id="uncharted" className={styles.collectionAnchor}>
          <div id="gallery" className={styles.collectionAnchor}>
            <ArtifactGallery showFeatured={false} onOpenPortal={openPortal} collaborators={networkLogos.map(logo => ({
            id: `network-${logo.file.replace(/\.(svg|png)$/, "")}`, title: logo.name,
            category: "Across the network", kind: "collaborator" as const,
            description: logo.description, href: logo.href,
            image: `/images/${logo.file}`,
            }))} />
          </div>
        </div>
      </section>

      <div className={`${styles.sectionSlope} ${styles.slopeFieldPractice}`} aria-hidden="true" />
      <section className={`${styles.practice} ${arrivalTarget === "spears" ? styles.sectionArriving : ""}`} id="spears">
        <div className={styles.practiceHeading}>
          <p className={styles.sectionLabel}>[ ACTIVE SPEARS ]</p>
          <h2>Specialized at<br /><em>the applied edge</em></h2>
          <div className={styles.practiceAside}>
            <p>The Guild is the center of gravity. These independently led practices are its tips of the spear, turning shared experience into focused offerings with their own teams and direction.</p>
            <a className={`${styles.pill} ${styles.pillOutlineNavy}`} href="#project-inquiry" onClick={followInquiryLink}>
              <span>Open a Guild inquiry</span>
              <i className={styles.pillIcon}><b className={styles.iconLogo} /></i>
            </a>
          </div>
        </div>
        <div className={styles.practiceCards}>
          {activeSpears.map((item) => (
            <article className={styles.practiceCard} key={item.index}>
              <Image src={item.art} alt={item.artAlt} width={1024} height={768} />
              <div>
                <p className={styles.disciplineTag}>{item.tag}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.cta} <span>↗</span></a>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.practiceGeneral}>Not sure which practice fits? <a href="#project-inquiry" onClick={followInquiryLink}>Open the Guild inquiry form →</a></p>
      </section>

      <div className={`${styles.sectionSlope} ${styles.slopePracticeContact}`} aria-hidden="true" />

      <section className={`${styles.contact} ${inquiryExpanded ? styles.contactExpanded : ""} ${arrivalTarget === "contact" ? styles.sectionArriving : ""}`} id="contact">
        <div className={styles.contactIntro}>
          <Image className={styles.contactDruid} src="/images/neo/contact-druid-transparent.png" alt="Four Guild characters with maps, tools, and a staff" width={768} height={1024} sizes="(max-width: 600px) 70vw, 420px" />
          <div className={styles.contactCopy}>
            <p className={styles.sectionLabel}>[ BEGIN A TRANSMISSION ]</p>
            <h2 className={styles.contactHeadline}>Find your <em>starting point.</em></h2>
            <p className={styles.contactDek}>Start with a specialist practice above. If the fit is unclear, send the Guild a short inquiry.</p>
            <div className={styles.contactClue}><HuntPixel artifact="signal" /><HuntMarker artifact="signal" label="A signal near the inquiry" /></div>
          </div>
        </div>
        <details className={styles.inquiryMore} id="project-inquiry" tabIndex={-1} open={inquiryExpanded} onToggle={(event) => setInquiryExpanded(event.currentTarget.open)}>
          <summary>Start a Guild inquiry <span>{inquiryExpanded ? "Close the inquiry ↑" : "Share a project or question ↓"}</span></summary>
          <div className={styles.contactFormShell}>
            <div className={styles.formCoordinates}><span>RG—INTAKE / 001</span><span>ENCRYPTION: OPEN</span></div>
            <HireUs />
          </div>
        </details>
      </section>

      <section className={styles.creed}>
        <video
          className={styles.creedMoons}
          poster="/images/neo/manifesto-backdrop.png"
          src="/videos/venture/manifesto-crossfade.mp4"
          data-scene="manifesto"
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className={styles.creedContent}>
          <p className={styles.sectionLabel}>[ THE RAIDGUILD CREED ]</p>
          <blockquote>The future is not something to predict. It is something to <em>build.</em></blockquote>
        </div>
        <div className={styles.unchartedWalker}><HuntPixel artifact="walker" /><HuntMarker artifact="walker" label="A mark left by the walker" /></div>
      </section>


      <footer className={styles.footer}>
        <a className={styles.brand} href="#top"><Sigil /><span>RAID<br />GUILD</span></a>
        <p>INDEPENDENT MINDS.<br />WE GO FURTHER TOGETHER.</p>
        <div className={styles.socials}>
          <a href="https://github.com/raid-guild" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href="https://x.com/RaidGuild" target="_blank" rel="noopener noreferrer">X / TWITTER</a>
          <a href="https://discord.gg/2vx47gT95y" target="_blank" rel="noopener noreferrer">DISCORD</a>
          <a href="https://raidguild-brand-guide-production.up.railway.app/" target="_blank" rel="noopener noreferrer">BRAND ARCHIVE</a>
        </div>
        <small>© 2019—2026 RAIDGUILD · EARTH &amp; ELSEWHERE</small>
      </footer>

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
  );
}
