'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="bg-white border border-gray-200 p-16 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#00ff88] hover:bg-[#00dd77] text-black font-bold transition"
        >
          {action.icon && <action.icon className="w-4 h-4" strokeWidth={2.5} />}
          {action.label}
        </button>
      )}
    </div>
  );
}
