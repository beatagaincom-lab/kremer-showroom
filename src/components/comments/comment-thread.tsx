"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import { Presence, useLastPresent } from "@/components/presence";
import type { ProductComment } from "@/lib/comments";
import { loadStoredAuthor, saveStoredAuthor, type CommentsStatus } from "./use-comments";

const dateFormat = new Intl.DateTimeFormat("de-CH", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCommentDate(iso: string) {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? "" : dateFormat.format(parsed);
}

type CommentListProps = {
  comments: ProductComment[];
  status: CommentsStatus;
  showItemLabel?: boolean;
  emptyText?: string;
};

export function CommentList({
  comments,
  status,
  showItemLabel = false,
  emptyText = "Noch keine Kommentare. Ihre Einschätzung ist willkommen.",
}: CommentListProps) {
  if (status === "loading") {
    return <p className="py-8 text-sm text-muted">Kommentare werden geladen …</p>;
  }
  if (status === "error") {
    return (
      <p className="py-8 text-sm text-muted">
        Kommentare sind gerade nicht erreichbar. Bitte versuchen Sie es später erneut.
      </p>
    );
  }
  if (comments.length === 0) {
    return <p className="py-8 text-sm text-muted">{emptyText}</p>;
  }

  return (
    <ol className="divide-y divide-line">
      {comments.map((comment) => (
        <li key={comment.id} className="py-5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-sm font-semibold tracking-[0.02em]">{comment.author}</p>
            <p className="text-xs text-muted">{formatCommentDate(comment.created_at)}</p>
            {showItemLabel && comment.item_label ? (
              <p className="ml-auto border border-line px-2 py-0.5 text-[11px] tracking-[0.08em] text-muted">
                {comment.item_label}
              </p>
            ) : null}
          </div>
          <p className="mt-2.5 max-w-prose text-[0.95rem] leading-7 text-graphite">{comment.body}</p>
        </li>
      ))}
    </ol>
  );
}

type CommentFormProps = {
  onSubmit: (author: string, body: string) => Promise<void>;
  compact?: boolean;
};

export function CommentForm({ onSubmit, compact = false }: CommentFormProps) {
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setAuthor(loadStoredAuthor());
  }, []);

  useEffect(() => {
    if (!sent) return;
    const timeout = window.setTimeout(() => setSent(false), 2600);
    return () => window.clearTimeout(timeout);
  }, [sent]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const trimmedAuthor = author.trim();
    const trimmedBody = body.trim();
    if (!trimmedAuthor || !trimmedBody) {
      setError("Bitte Name und Kommentar ausfüllen.");
      return;
    }
    setSending(true);
    setError("");
    try {
      await onSubmit(trimmedAuthor, trimmedBody);
      saveStoredAuthor(trimmedAuthor);
      setBody("");
      setSent(true);
    } catch {
      setError("Senden nicht möglich. Bitte versuchen Sie es erneut.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "" : "max-w-xl"}>
      <label className="block text-xs font-semibold tracking-[0.14em] text-muted" htmlFor={`comment-author-${compact}`}>
        NAME
      </label>
      <input
        id={`comment-author-${compact}`}
        className="mt-2 h-11 w-full border border-[#b9c2c7] bg-white px-3 text-sm transition-colors focus:border-sky-strong"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        placeholder="Ihr Name"
        maxLength={80}
        autoComplete="name"
      />
      <label className="mt-5 block text-xs font-semibold tracking-[0.14em] text-muted" htmlFor={`comment-body-${compact}`}>
        KOMMENTAR
      </label>
      <textarea
        id={`comment-body-${compact}`}
        className="mt-2 min-h-28 w-full resize-y border border-[#b9c2c7] bg-white px-3 py-2.5 text-sm leading-6 transition-colors focus:border-sky-strong"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Ihre Anmerkung direkt zum Produkt …"
        maxLength={1200}
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button type="submit" className="button-primary !min-h-11" disabled={sending}>
          <Send aria-hidden size={15} /> {sending ? "Wird gesendet …" : "Kommentar senden"}
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {error || (sent ? "Gespeichert. Vielen Dank." : "")}
        </p>
      </div>
    </form>
  );
}

export type CommentTarget = {
  itemId: string | null;
  /** Label, unter dem der Kommentar gespeichert wird (z.B. "21 · Türkis"). */
  itemLabel?: string | null;
  label: string;
  sublabel?: string;
  accentColor?: string;
};

type CommentDrawerProps = {
  target: CommentTarget | null;
  comments: ProductComment[];
  status: CommentsStatus;
  onClose: () => void;
  onSubmit: (author: string, body: string) => Promise<void>;
};

export function CommentDrawer({ target, comments, status, onClose, onSubmit }: CommentDrawerProps) {
  const reduceMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const open = target !== null;
  const active = useLastPresent(target);
  const lastCommentsRef = useRef(comments);
  if (open) lastCommentsRef.current = comments;
  const shownComments = open ? comments : lastCommentsRef.current;

  useEffect(() => {
    if (!target) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [target, onClose]);

  if (!active) return null;

  return (
    <Presence open={open}>
      <motion.div
        className="fixed inset-0 z-[85] bg-graphite/45 backdrop-blur-[2px] print:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
        style={{ pointerEvents: open ? undefined : "none" }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={`Kommentare zu ${active.label}`}
            initial={reduceMotion ? false : { x: "6%", opacity: 0 }}
            animate={open ? { x: 0, opacity: 1 } : { x: "6%", opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-hidden border-l border-line bg-white"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-6 sm:px-9">
              <div className="flex items-center gap-4">
                {active.accentColor ? (
                  <span
                    className="textile-swatch h-14 w-11 shrink-0"
                    style={{ "--swatch-color": active.accentColor } as React.CSSProperties}
                  />
                ) : (
                  <span className="flex h-14 w-11 shrink-0 items-center justify-center border border-line text-muted">
                    <MessageCircle aria-hidden size={18} />
                  </span>
                )}
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-muted">KOMMENTARE</p>
                  <h2 className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">{active.label}</h2>
                  {active.sublabel ? <p className="mt-1 text-sm text-muted">{active.sublabel}</p> : null}
                </div>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-line transition-colors hover:border-graphite"
                aria-label="Kommentare schliessen"
              >
                <X aria-hidden size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 sm:px-9">
              <CommentList comments={shownComments} status={status} />
            </div>

            <div className="border-t border-line bg-surface px-6 py-6 sm:px-9">
              <CommentForm compact onSubmit={onSubmit} />
            </div>
          </motion.aside>
      </motion.div>
    </Presence>
  );
}
