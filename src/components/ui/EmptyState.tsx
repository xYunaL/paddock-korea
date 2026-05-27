import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-16 px-6">
      {icon && (
        <div className="text-4xl opacity-60" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-white">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-white/55 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
