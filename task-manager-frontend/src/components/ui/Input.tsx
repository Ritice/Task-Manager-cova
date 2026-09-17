import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        className={`rounded border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition-colors ${
          error ? 'border-clay' : 'border-line focus:border-moss'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-clay">{error}</span>}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = '', ...rest },
  ref
) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <textarea
        id={inputId}
        ref={ref}
        className={`rounded border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition-colors resize-none ${
          error ? 'border-clay' : 'border-line focus:border-moss'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-clay">{error}</span>}
    </div>
  );
});
