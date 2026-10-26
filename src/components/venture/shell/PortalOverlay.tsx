"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { HuntMarker, HuntPixel } from "@/components/UnchartedHunt";
import PortalEnergy from "@/components/PortalEnergy";
import styles from "../venture.module.css";

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

export default function PortalOverlay({ open, forming, closing, container, onClose, onSpears, onProblem, onJoin }: PortalOverlayProps) {
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
