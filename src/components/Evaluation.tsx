import React, { useState, useRef, useContext } from 'react';
    import { Activity } from '../types/activity';
    import { LIFE_DOMAINS } from '../types/domains';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DAYS } from '../constants/days';
    import { CheckCircle, XCircle, Brain, TrendingUp, Award, Calendar, Download, Upload } from 'lucide-react';
    import { PositiveNotesTable } from './PositiveNotesTable';
    import { ProgressView } from './ProgressView';
    import { WeekSelector } from './WeekSelector';
    import { ActivityContext } from '../context/ActivityContext';

    interface EvaluationProps {
      activities: Activity[];
    }

    export function Evaluation({ activities }: EvaluationProps) {
      const weekSelection = useWeekSelection();
      const { selectedDate, weekNumber, year, changeWeek } = weekSelection;
      const fileInputRef = useRef<HTMLInputElement>(null);
      const { addActivity, updateActivity, deleteActivity } = useContext(ActivityContext);
      const currentWeekActivities = activities.filter(activity => activity.weekNumber === weekNumber && activity.year === year);

      const calculateDomainProgress = (domainId: string) => {
        const domainActivities = currentWeekActivities.filter(a => a.domainId === domainId);
        if (domainActivities.length === 0) return { completed: 0, total: 0, percentage: 0 };

        let totalCount = 0;
        let completedCount = 0;

        domainActivities.forEach(activity => {
          totalCount += activity.selectedDays.length; 
          completedCount += activity.selectedDays.filter(dayIndex => activity.completedDays && activity.completedDays[dayIndex]).length; 
        });

        return {
          completed: completedCount,
          total: totalCount,
          percentage: Math.round((completedCount / totalCount) * 100),
        };
      };

      const overallCompletionRate = () => {
        const totalActivities = currentWeekActivities.reduce((acc, activity) => acc + activity.selectedDays.length, 0);
        if (totalActivities === 0) return {completed: 0, total: 0, percentage: 0};

        let completedCount = 0;
        currentWeekActivities.forEach(activity => {
          completedCount += activity.selectedDays.filter(dayIndex => activity.completedDays && activity.completedDays[dayIndex]).length;
        });
        return {
          completed: completedCount,
          total: totalActivities,
          percentage: Math.round((completedCount / totalActivities) * 100),
        };
      };

      const overallRate = overallCompletionRate();

      const handleExport = () => {
        const exportData = activities.map(activity => {
          const weekKey = `${activity.weekNumber}-${activity.year}`;
          const notes = {};
          DAYS.forEach((_, dayIndex) => {
            const positiveNotes = localStorage.getItem(`positiveNotes-${weekKey}-${dayIndex}`)
            const freeWriting = localStorage.getItem(`freeWriting-${weekKey}-${dayIndex}`)
            if (positiveNotes) {
              notes[`positiveNotes-${dayIndex}`] = JSON.parse(positiveNotes);
            }
            if (freeWriting) {
              notes[`freeWriting-${dayIndex}`] = freeWriting;
            }
          });
          return { ...activity, ...notes };
        });
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'activities.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      const handleImport = () => {
        fileInputRef.current?.click();
      };

      const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const fileContent = event.target?.result as string;
            const importedData = JSON.parse(fileContent);
            if (Array.isArray(importedData)) {
              // Clear existing activities
              activities.forEach(activity => deleteActivity(activity.id));
              // Import new activities
              importedData.forEach(activity => {
                const {
                  "positiveNotes-0": positiveNotes0,
                  "positiveNotes-1": positiveNotes1,
                  "positiveNotes-2": positiveNotes2,
                  "positiveNotes-3": positiveNotes3,
                  "positiveNotes-4": positiveNotes4,
                  "positiveNotes-5": positiveNotes5,
                  "positiveNotes-6": positiveNotes6,
                  "freeWriting-0": freeWriting0,
                  "freeWriting-1": freeWriting1,
                  "freeWriting-2": freeWriting2,
                  "freeWriting-3": freeWriting3,
                  "freeWriting-4": freeWriting4,
                  "freeWriting-5": freeWriting5,
                  "freeWriting-6": freeWriting6,
                  ...rest
                } = activity;
                addActivity(rest);
                const weekKey = `${rest.weekNumber}-${rest.year}`;
                if (positiveNotes0) localStorage.setItem(`positiveNotes-${weekKey}-0`, JSON.stringify(positiveNotes0));
                if (positiveNotes1) localStorage.setItem(`positiveNotes-${weekKey}-1`, JSON.stringify(positiveNotes1));
                if (positiveNotes2) localStorage.setItem(`positiveNotes-${weekKey}-2`, JSON.stringify(positiveNotes2));
                if (positiveNotes3) localStorage.setItem(`positiveNotes-${weekKey}-3`, JSON.stringify(positiveNotes3));
                if (positiveNotes4) localStorage.setItem(`positiveNotes-${weekKey}-4`, JSON.stringify(positiveNotes4));
                if (positiveNotes5) localStorage.setItem(`positiveNotes-${weekKey}-5`, JSON.stringify(positiveNotes5));
                if (positiveNotes6) localStorage.setItem(`positiveNotes-${weekKey}-6`, JSON.stringify(positiveNotes6));
                if (freeWriting0) localStorage.setItem(`freeWriting-${weekKey}-0`, freeWriting0);
                if (freeWriting1) localStorage.setItem(`freeWriting-${weekKey}-1`, freeWriting1);
                if (freeWriting2) localStorage.setItem(`freeWriting-${weekKey}-2`, freeWriting2);
                if (freeWriting3) localStorage.setItem(`freeWriting-${weekKey}-3`, freeWriting3);
                if (freeWriting4) localStorage.setItem(`freeWriting-${weekKey}-4`, freeWriting4);
                if (freeWriting5) localStorage.setItem(`freeWriting-${weekKey}-5`, freeWriting5);
                if (freeWriting6) localStorage.setItem(`freeWriting-${weekKey}-6`, freeWriting6);
              });
              alert('Data imported successfully!');
            } else {
              alert('Invalid data format. Please ensure the file contains an array of activities.');
            }
          } catch (error) {
            console.error('Error parsing file:', error);
            alert('Error parsing file. Please ensure it is a valid text file.');
          }
        };
        reader.readAsText(file);
      };

      return (
        <div className="p-6 bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-white text-center">تقييم الأداء</h2>
          </div>
          <WeekSelector currentDate={selectedDate} onWeekChange={changeWeek} />
          <div className="flex justify-center gap-2 mb-4">
              <button
                onClick={handleExport}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md flex items-center gap-2"
              >
                <Download size={16} />
                تصدير
              </button>
              <button
                onClick={handleImport}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md flex items-center gap-2"
              >
                <Upload size={16} />
                استيراد
              </button>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="text/plain"
              />
            </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-purple-400" size={24} />
                <h2 className="text-2xl font-medium text-purple-400">تحليلات الأداء</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-purple-400" size={20} />
                    <h3 className="text-purple-400">معدل الإنجاز</h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    {overallRate.percentage}%
                  </p>
                  <p className="text-lg text-white">
                    {overallRate.completed} من {overallRate.total} أنشطة مكتملة
                  </p>
                </div>
                {/* Add other analysis sections here as needed */}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {LIFE_DOMAINS.map(domain => {
                const progress = calculateDomainProgress(domain.id);
                const DomainIcon = domain.icon;
                const Icon = progress.percentage >= 80 ? CheckCircle : XCircle;
                return (
                  <div key={domain.id} className={`bg-black/20 p-4 rounded-lg flex flex-col`}>
                    <div className="flex items-center gap-2 mb-4">
                      <DomainIcon size={24} className={`text-${domain.color}-400`} />
                      <h3 className={`text-2xl font-bold text-${domain.color}-400`}>{domain.name}</h3>
                      <Icon size={24} className={`text-${progress.percentage >= 80 ? 'green-500' : 'red-500'}`} />
                    </div>
                    <p className="text-xl font-medium text-white">
                      {progress.completed} من {progress.total} أنشطة مكتملة ({progress.percentage}%)
                    </p>
                    <ul className="list-disc list-inside text-lg text-white/70">
                      {currentWeekActivities
                        .filter(activity => activity.domainId === domain.id)
                        .map(activity => (
                          <li key={activity.id} className="flex items-center gap-2">
                            <span>{activity.title}</span>
                            <span className={`text-${activity.selectedDays.every(dayIndex => activity.completedDays && activity.completedDays[dayIndex]) ? 'green-500' : 'red-500'}`}>
                              {activity.selectedDays.every(dayIndex => activity.completedDays && activity.completedDays[dayIndex]) ? 'مكتمل' : 'غير مكتمل'}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="bg-gradient-to-br from-teal-500/20 to-teal-700/20 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="text-teal-400" size={24} />
                <h2 className="text-2xl font-medium text-teal-400">ملخص النقاط الإيجابية</h2>
              </div>
              <PositiveNotesTable activities={currentWeekActivities} weekSelection={weekSelection} />
            </div>
          </div>
        </div>
      );
    }

    // Placeholder functions for export and import
    function exportData(activities: Activity[]) {
      // This function will be replaced with actual export logic
      console.log('Exporting data:', activities);
    }

    function importData() {
      // This function will be replaced with actual import logic
      console.log('Importing data');
    }
