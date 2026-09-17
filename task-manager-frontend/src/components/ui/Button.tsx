import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-moss text-paper hover:bg-moss-dark disabled:bg-moss/50',
  secondary: 'bg-transparent text-ink border border-line hover:border-ink disabled:opacity-50',
  danger: 'bg-transparent text-clay border border-clay/40 hover:bg-clay/10 disabled:opacity-50',
  ghost: 'bg-transparent text-ink-soft hover:text-ink disabled:opacity-50',
};

export default function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
