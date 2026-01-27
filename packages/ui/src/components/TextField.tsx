import * as React from "react";
import { cn } from "../lib/cn";

export type TextFieldProps = {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;

  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  helperText?: string;
  error?: string;

  inputClassName?: string;
  className?: string;
};

export function TextField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required,
  disabled,
  value,
  defaultValue,
  onChange,
  helperText,
  error,
  inputClassName,
  className,
}: TextFieldProps) {
  const id = React.useId();
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-1", className)}>
      <label className="ds-label" htmlFor={id}>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        aria-invalid={hasError || undefined}
        aria-describedby={helperText || error ? `${id}-help` : undefined}
        className={cn("ds-input", hasError && "ds-input-error", inputClassName)}
      />

      {hasError ? (
        <div id={`${id}-help`} className="ds-error">
          {error}
        </div>
      ) : helperText ? (
        <div id={`${id}-help`} className="ds-help">
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
