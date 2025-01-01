import React, { useState } from 'react';
    import { TabNavigation } from './components/TabNavigation';
    import { DomainGrid } from './components/DomainGrid';
    import { WeeklySchedule } from './components/WeeklySchedule';
    import { CombinedView } from './components/CombinedView';
    import { useTodos } from './hooks/useTodos';
    import { useWeekSelection } from './hooks/useWeekSelection';
    import { ActivityContext } from './context/ActivityContext';
    import { Evaluation } from './components/Evaluation';

    export default function App() {
      const [activeTab, setActiveTab] = useState('domains');
      const { 
        todos: activities, 
        addTodo: addActivity, 
        toggleTodo: toggleActivity,
        deleteTodo: deleteActivity,
        updateTodo: updateActivity 
      } = useTodos();

      // Use shared week selection state
      const weekSelection = useWeekSelection();

      const handleAddActivity = (activity: any) => {
        addActivity({
          ...activity,
          weekNumber: weekSelection.weekNumber,
          year: weekSelection.year
        });
      };

      return (
        <ActivityContext.Provider value={{ activities, addActivity, toggleActivity, deleteActivity, updateActivity }}>
          <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 text-gray-100">
            <div className="container mx-auto px-4 py-8">
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === 'domains' && (
                <DomainGrid
                  activities={activities}
                  onAddActivity={handleAddActivity}
                  onEditActivity={updateActivity}
                  onDeleteActivity={deleteActivity}
                  weekSelection={weekSelection}
                />
              )}
              {activeTab === 'weekly' && (
                <WeeklySchedule
                  activities={activities}
                  onToggleReminder={(activityId, dayIndex) => {
                    const activity = activities.find(a => a.id === activityId);
                    if (activity) {
                      const days = activity.reminder?.days || [];
                      updateActivity(activityId, { 
                        reminder: { 
                          ...activity.reminder,
                          days: days.includes(dayIndex) 
                            ? days.filter(d => d !== dayIndex)
                            : [...days, dayIndex]
                        } 
                      });
                    }
                  }}
                  onEditActivity={updateActivity}
                  onDeleteActivity={deleteActivity}
                  weekSelection={weekSelection}
                />
              )}
              {activeTab === 'evaluation' && (
                <Evaluation activities={activities} />
              )}
            </div>
          </div>
        </ActivityContext.Provider>
      );
    }
