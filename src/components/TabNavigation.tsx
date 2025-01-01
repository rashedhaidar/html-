import React from 'react';
    import { Layout, Calendar, BarChart, Sparkles, Brain, ClipboardList } from 'lucide-react';

    interface TabNavigationProps {
      activeTab: string;
      onTabChange: (tab: string) => void;
    }

    export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
      const tabs = [
        { id: 'domains', icon: <Layout />, label: 'المجالات' },
        { id: 'weekly', icon: <Calendar />, label: 'الأيام' },
        { id: 'evaluation', icon: <ClipboardList />, label: 'التقييم' },
      ];

      return (
        <nav className="flex justify-center mb-8">
          <div className="flex gap-2 bg-black/30 p-1 rounded-lg">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      );
    }
