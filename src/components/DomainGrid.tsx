import React, { useState } from 'react';
    import { Plus, X } from 'lucide-react';
    import { LIFE_DOMAINS } from '../types/domains';
    import { Activity } from '../types/activity';
    import { ActivityCard } from './ActivityCard';
    import { WeekSelector } from './WeekSelector';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { ActivityForm } from './ActivityForm';

    interface DomainGridProps {
      activities: Activity[];
      onAddActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
      onEditActivity: (id: string, updates: Partial<Activity>) => void;
      onDeleteActivity: (id: string) => void;
    }

    export function DomainGrid({ 
      activities, 
      onAddActivity, 
      onEditActivity, 
      onDeleteActivity 
    }: DomainGridProps) {
      const { selectedDate, weekNumber, year, changeWeek } = useWeekSelection();
      const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

      const getActivitiesByDomain = (domainId: string) => 
        activities.filter(activity => 
          activity.domainId === domainId && 
          activity.weekNumber === weekNumber &&
          activity.year === year
        );

      const handleAddActivity = (activity: Omit<Activity, 'id' | 'createdAt'>) => {
        if (selectedDomain) {
          onAddActivity({
            ...activity,
            domainId: selectedDomain,
            weekNumber,
            year
          });
          // Form stays open for multiple additions
        }
      };

      return (
        <div className="space-y-6">
          <WeekSelector 
            currentDate={selectedDate}
            onWeekChange={changeWeek}
          />

          {selectedDomain && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 p-6 rounded-lg w-full max-w-2xl relative">
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white"
                >
                  <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4 text-right">
                  {LIFE_DOMAINS.find(d => d.id === selectedDomain)?.name} إضافة نشاط في مجال
                </h2>
                <ActivityForm
                  onSubmit={handleAddActivity}
                  initialDomainId={selectedDomain}
                  hideDomainsSelect
                  weekNumber={weekNumber}
                  year={year}
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {LIFE_DOMAINS.map(domain => {
                    const DomainIcon = domain.icon;
                    return (
                      <th key={domain.id} className="p-4 text-white border border-white/20">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setSelectedDomain(domain.id)}
                            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                          <div className="flex items-center gap-2">
                            <span>{domain.name}</span>
                            <DomainIcon size={20} />
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {LIFE_DOMAINS.map(domain => {
                    const domainActivities = getActivitiesByDomain(domain.id);
                    return (
                      <td key={domain.id} className="p-4 border border-white/20 align-top bg-gradient-to-br from-purple-500/5 to-pink-500/5">
                        <div className="space-y-3 min-h-[200px]">
                          {domainActivities.map(activity => (
                            <ActivityCard
                              key={activity.id}
                              activity={activity}
                              onEdit={onEditActivity}
                              onDelete={onDeleteActivity}
                            />
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2">
              <img
                src="https://i.ibb.co/v10G57G/logo.png"
                alt="Mohammad Hussein Farhat Logo"
                className="h-8 w-auto"
              />
              <p className="text-white text-sm font-mono">تصميم وتطوير: محمد حسين فرحات</p>
            </div>
          </div>
        </div>
      );
    }
