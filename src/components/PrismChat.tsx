"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./PrismChat.module.css";

type Message = { role: "user" | "assistant"; content: string };

async function post(path: string, body?: object): Promise<{ message?: string }> {
  const response = await fetch(path, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
  });
  const data: { error?: string; message?: string } = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Queen Raida is unavailable right now.");
  return data;
}

export default function PrismChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Every page load begins a fresh, visible conversation. We never resume hidden history.
    let active = true;
    post("/api/chat/session").then(() => { if (active) setReady(true); }).catch((failure: Error) => { if (active) setError(failure.message); });
    return () => { active = false; };
  }, []);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  async function startOver() {
    if (busy) return;
    setReady(false);
    setError("");
    try {
      await post("/api/chat/session");
      setMessages([]);
      setDraft("");
      setReady(true);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Queen Raida is unavailable right now.");
    }
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!ready || busy || !content || content.length > 4000) return;
    setMessages(current => [...current, { role: "user", content }]);
    setDraft("");
    setBusy(true);
    setError("");
    try {
      const data = await post("/api/chat/message", { content });
      setMessages(current => [...current, { role: "assistant", content: data.message || "" }]);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Queen Raida is unavailable right now.");
    } finally {
      setBusy(false);
    }
  }

  return <main className={styles.page}>
    <div className={styles.frame}>
      <header className={styles.header}>
        <Link href="/#guild" className={styles.brand}>RAIDGUILD <span aria-hidden="true">↗</span></Link>
        <span className={styles.issue}>[ PUBLIC SIGNAL / 001 ]</span>
      </header>
      <section className={styles.intro} aria-labelledby="chat-title">
        <p className={styles.kicker}>[ QUEEN RAIDA / AI CTO ]</p>
        <h1 id="chat-title">Follow the <em>signal.</em></h1>
        <p>Meet Queen Raida, RaidGuild&apos;s AI CTO. Ask this AI agent about the Guild, its people, and what we&apos;re exploring. Answers draw on public Guild knowledge and may take a moment.</p>
      </section>
      <section className={styles.console} aria-label="Conversation with Queen Raida, an AI agent">
        <div className={styles.consoleHead}><span>QUEEN RAIDA / CONVERSATION</span><button type="button" onClick={startOver} disabled={busy}>New conversation ↗</button></div>
        <div className={styles.messages} role="log" aria-live="polite" aria-relevant="additions text">
          {messages.length === 0 && <p className={styles.empty}>What would you like to ask Queen Raida?</p>}
          {messages.map((message, index) => <div className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`} key={index}>
            <span className={styles.role}>{message.role === "user" ? "YOU" : "QUEEN RAIDA · AI"}</span>
            <p>{message.content}</p>
          </div>)}
          {busy && <p className={styles.processing}>Following the signal… this can take a moment.</p>}
          <div ref={bottom} />
        </div>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <form className={styles.form} onSubmit={send}>
          <label htmlFor="guild-chat-message">Your message</label>
          <textarea id="guild-chat-message" value={draft} onChange={event => setDraft(event.target.value)} maxLength={4000} rows={3} disabled={!ready || busy} placeholder={ready ? "Ask Queen Raida…" : "Connecting to Queen Raida…"} />
          <div className={styles.formFoot}><span>Messages are processed by the Guild&apos;s AI service. Please leave out private information.</span><button type="submit" disabled={!ready || busy || !draft.trim()}>Send <span aria-hidden="true">↗</span></button></div>
        </form>
      </section>
      <footer className={styles.footer}><Link href="/#guild">← Back to the Guild</Link><span>ONE GUILD · MANY EDGES</span></footer>
    </div>
  </main>;
}
