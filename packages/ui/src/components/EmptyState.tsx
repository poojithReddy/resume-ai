import * as React from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { cn } from "../lib/cn";

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: {
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <Card padding="lg" className={cn("text-center space-y-3", className)}>
      <div className="text-lg font-semibold">{title}</div>
      {description ? <div className="text-sm text-gray-600">{description}</div> : null}

      {(primaryAction || secondaryAction) && (
        <div className="flex justify-center gap-3 pt-2">
          {secondaryAction ? (
            <Button variant="secondary" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button variant="primary" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
        </div>
      )}
    </Card>
  );
}
