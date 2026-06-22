// =============================================================================
// ui-components.tsx — Standalone HTML/Tailwind UI primitives
// No Shadcn dependency. Drop-in replacements for Card, Badge, Button,
// Separator, Input, and Textarea.
// =============================================================================

import React from "react";

// ---------------------------------------------------------------------------
// Card family
// ---------------------------------------------------------------------------

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = "" }: CardHeaderProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

interface CardTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = "" }: CardTitleProps) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

interface CardContentProps {
  children?: React.ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = "" }: CardContentProps) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

interface BadgeProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export const Badge = ({
  children,
  className = "",
  variant = "default",
}: BadgeProps) => {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants: Record<string, string> = {
    default: "border-transparent bg-slate-900 text-white",
    outline: "bg-transparent",
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
  );
};

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 " +
      "focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants: Record<string, string> = {
      default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
      outline: "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    };

    const sizes: Record<string, string> = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ---------------------------------------------------------------------------
// Separator
// ---------------------------------------------------------------------------

interface SeparatorProps {
  className?: string;
}

export const Separator = ({ className = "" }: SeparatorProps) => (
  <div className={`shrink-0 bg-slate-200 h-px w-full ${className}`} role="separator" />
);

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={
      "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm " +
      "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 " +
      "focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 " +
      className
    }
    {...props}
  />
));
Input.displayName = "Input";

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea
    ref={ref}
    className={
      "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm " +
      "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 " +
      "focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none " +
      className
    }
    {...props}
  />
));
Textarea.displayName = "Textarea";
