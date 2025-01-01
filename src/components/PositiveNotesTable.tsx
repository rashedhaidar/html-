import React from 'react';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DAYS } from '../constants/days';
    import { getDateOfWeek, getCurrentWeekDates } from '../utils/dateUtils';

    interface PositiveNotesTableProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function PositiveNotesTable({ activities, weekSelection }: PositiveNotesTableProps) {
      const { weekNumber, year } = weekSelection;
      const weekKey = `${weekNumber}-${year}`;
      const allPositiveNotes: string[][] = DAYS.map(() => []);

      DAYS.forEach((_, dayIndex) => {
        const notes = localStorage.getItem(`positiveNotes-${weekKey}-${dayIndex}`);
        if (notes) {
          try {
            const parsedNotes = JSON.parse(notes);
            if (Array.isArray(parsedNotes)) {
              allPositiveNotes[dayIndex] = parsedNotes;
            }
          } catch (e) {
            console.error("Error parsing positive notes:", notes, e);
          }
        }
      });

      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {DAYS.map((day, index) => (
                  <th key={day} className="p-4 text-white border border-white/20">
                    <div className="flex flex-col items-center">
                      <span>{day}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {DAYS.map((_, dayIndex) => (
                    <td key={dayIndex} className="p-4 border border-white/20 align-top">
                      <ul className="list-disc list-inside text-white/70 text-sm" dir="rtl">
                        {allPositiveNotes[dayIndex][rowIndex] && (
                          <li>{allPositiveNotes[dayIndex][rowIndex]}</li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
