import React, { useState, useRef, useContext } from 'react';
    import { Activity } from '../types/activity';
    import { AIAssistant } from './AIAssistant';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { WeekDisplay } from './WeekDisplay';
    import { Download, Upload, Brain } from 'lucide-react';
    import { ActivityContext } from '../context/ActivityContext';
    import { ProgressView } from './ProgressView';
    import { DAYS } from '../constants/days';
    import { getDateOfWeek } from '../utils/dateUtils';
    import { CombinedAI } from './CombinedAI';
    import { PsychologicalAnalysis } from './PsychologicalAnalysis';

    interface CombinedViewProps {
      activities: Activity[];
      onSuggestion: (suggestion: Partial<Activity>) => void;
    }

    export function CombinedView({ onSuggestion }: CombinedViewProps) {
      const weekSelection = useWeekSelection();
      const fileInputRef = useRef<HTMLInputElement>(null);
      const { activities, addActivity, updateActivity, deleteActivity } = useContext(ActivityContext);

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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <WeekDisplay weekNumber={weekSelection.weekNumber} year={weekSelection.year} />
            <div className="flex gap-2">
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
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AIAssistant
                activities={activities}
                onSuggestion={onSuggestion}
                weekSelection={weekSelection}
              />
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="text-amber-400" size={24} />
                  <h2 className="text-xl font-medium text-amber-400">نسبة إنجاز المجالات</h2>
                </div>
                <ProgressView activities={activities} useMainCheckbox={true} />
              </div>
              <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="text-blue-400" size={24} />
                  <h2 className="text-xl font-medium text-blue-400">التحليل النفسي والإداري</h2>
                </div>
                <PsychologicalAnalysis activities={activities} weekSelection={weekSelection} />
              </div>
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
