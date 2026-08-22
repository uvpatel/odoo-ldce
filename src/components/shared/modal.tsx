"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  /** If true, clicking the backdrop closes the modal. Default: true */
  closeOnBackdrop?: boolean;
  /** Custom width class, e.g. "max-w-2xl". Default: "max-w-xl" */
  maxWidthClass?: string;
  /** Slide-in from right (sheet style). Default: false */
  sheet?: boolean;
}

/**
 * Reusable modal wrapper for Next.js intercepting routes.
 * Closes by calling router.back() — preserves correct URL behavior for deep links.
 */
export function Modal({
  children,
  closeOnBackdrop = true,
  maxWidthClass = "max-w-xl",
  sheet = false,
}: ModalProps) {
  const router = useRouter();

  const close = React.useCallback(() => {
    router.back();
  }, [router]);

  // Close on Escape key
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // Prevent body scroll while modal open
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (sheet) {
    return (
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className="flex-1 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeOnBackdrop ? close : undefined}
        />
        {/* Sheet panel */}
        <div
          className={`
            relative w-full ${maxWidthClass} bg-background shadow-2xl overflow-y-auto
            animate-in slide-in-from-right duration-300
            border-l border-border
          `}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <XIcon className="size-4" />
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeOnBackdrop ? close : undefined}
      />
      {/* Modal panel */}
      <div
        className={`
          relative w-full ${maxWidthClass} bg-background rounded-2xl shadow-2xl
          animate-in zoom-in-95 fade-in duration-200
          border border-border overflow-hidden
        `}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <XIcon className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
