import * as React from "react";
import { cn } from "../lib/cn";
import type { CandidateResult } from "@resume-ai/shared";

export default function CandidateDetailDrawer({
  open,
  onClose,
  candidate,
}: {
  open: boolean;
  onClose: () => void;
  candidate: CandidateResult | null;
}) {
  // Prevent background scroll when open
  React.useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white border-l",
          "transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-5 border-b flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-gray-500">Candidate</div>
              <div className="text-lg font-semibold truncate">
                {candidate?.fileName ?? "—"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Score: <span className="font-medium">{candidate?.score ?? "—"}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className={cn(
                "shrink-0 rounded border px-3 py-2 text-sm",
                "hover:bg-gray-50"
              )}
            >
              Close
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-5 space-y-6">
            {/* Matched */}
            <section className="space-y-2">
              <h3 className="font-semibold">Matched</h3>
              {candidate?.matched?.length ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {candidate.matched.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No matched items.</div>
              )}
            </section>

            {/* Missing */}
            <section className="space-y-2">
              <h3 className="font-semibold">Missing</h3>
              {candidate?.missing?.length ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {candidate.missing.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-gray-500">No missing items.</div>
              )}
            </section>

            {/* Evidence */}
            <section className="space-y-2">
              <h3 className="font-semibold">Evidence</h3>
              {candidate?.evidence?.length ? (
                <div className="space-y-3">
                  {candidate.evidence.map((e, i) => (
                    <div key={i} className="border rounded p-3 bg-gray-50">
                      <div className="text-sm font-medium">{e.requirement}</div>
                      <div className="text-sm text-gray-700 mt-1">{e.snippet}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No evidence available.</div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="p-5 border-t flex justify-end gap-3">
            <button
              className={cn("rounded border px-4 py-2 text-sm hover:bg-gray-50")}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
