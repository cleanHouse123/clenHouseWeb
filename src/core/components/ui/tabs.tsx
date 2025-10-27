import { useState } from 'react';
import { cn } from '@/core/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs = ({ tabs, activeTab, onTabChange, className }: TabsProps) => {
  return (
    <div className={cn("flex border-b border-gray-200", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
            activeTab === tab.id
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};