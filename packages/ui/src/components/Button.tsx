import * as React from "react";
import { cn } from "../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  variant = "secondary",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "primary"
      ? "ds-btn-primary"
      : variant === "danger"
      ? "ds-btn-danger"
      : variant === "ghost"
      ? "ds-btn-ghost"
      : "ds-btn-secondary";

  return (
    <button
      className={cn("ds-btn", variantClass, fullWidth && "ds-btn-full", className)}
      {...props}
    />
  );
}
