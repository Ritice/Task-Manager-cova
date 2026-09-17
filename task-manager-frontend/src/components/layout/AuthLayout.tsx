import type { ReactNode } from 'react';

export default function AuthLayout({
  children,
  tagline,
}: {
  children: ReactNode;
  tagline: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-moss-dark px-12 py-16 text-paper md:flex">
        <span className="font-display text-3xl">Tâches</span>
        <div>
          <p className="font-display text-4xl leading-tight">{tagline}</p>
          <p className="mt-6 max-w-sm text-sm text-paper/70">
            Un registre simple pour suivre ce qu'il reste à faire, ce qui avance,
            et ce qui est terminé — sur le web comme sur mobile.
          </p>
        </div>
        <p className="text-xs text-paper/50">Task Manager</p>
      </div>
      <div className="flex items-center justify-center bg-paper px-6 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
