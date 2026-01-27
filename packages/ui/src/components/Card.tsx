import * as React from "react";
import { cn } from "../lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

export function Card({ padding = "md", className, ...props }: CardProps) {
  const padClass =
    padding === "sm" ? "ds-card-sm" : padding === "lg" ? "ds-card-lg" : "ds-card-md";

  return <div className={cn("ds-card", padClass, className)} {...props} />;
}

export function CardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-lg font-semibold">{title}</div>
      {description ? <div className="text-sm text-gray-600">{description}</div> : null}
    </div>
  );
}
