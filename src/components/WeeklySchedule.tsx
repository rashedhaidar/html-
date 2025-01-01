import React, { useState, useEffect } from 'react';
    import { Bell, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react';
    import { Activity } from '../types/activity';
    import { LIFE_DOMAINS } from '../types/domains';
    import { ActivityProgress } from './ActivityProgress';
    import { WeekSelector } from './WeekSelector';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
    import { DAYS } from '../constants/days';
    import { WeekDisplay } from './WeekDisplay';
    import { getDateOfWeek, getCurrentWeekDates, formatDate } from '../utils/dateUtils';

    interface WeeklyScheduleProps {
      activities: Activity[];
      onToggleReminder: (activityId: string, dayIndex: number) => void;
      onEditActivity: (id: string, updates: Partial<Activity>) => void;
      onDeleteActivity: (id: string, dayIndex: number) => void;
      onMoveActivity?: (activityId: string, fromDay: number, toDay: number) => void;
    }

    export function WeeklySchedule({ 
      activities, 
      onToggleReminder,
      onEditActivity,
      onDeleteActivity,
      onMoveActivity
    }: WeeklyScheduleProps) {
      const { selectedDate, weekNumber, year, changeWeek } = useWeekSelection();
      
      const weekStartDate = getDateOfWeek(weekNumber, year);
      const weekDates = getCurrentWeekDates(weekStartDate);
      
      const currentWeekActivities = activities.filter(activity => 
        activity.weekNumber === weekNumber && 
        activity.year === year
      );
      
      const handleDragEnd = (result: any) => {
        if (!result.destination || !onMoveActivity) return;
        
        const fromDay = parseInt(result.source.droppableId);
        const toDay = parseInt(result.destination.droppableId);
        const activityId = result.draggableId;
        
        if (toDay === 0 && !activities.find(a => a.id === activityId)?.allowSunday) {
          return;
        }
        
        onMoveActivity(activityId, fromDay, toDay);
      };

      const renderActivity = (activity: Activity, index: number, dayIndex: number) => {
        const isCompleted = activity.completedDays && activity.completedDays[dayIndex];
        return (
          <Draggable key={activity.id} draggableId={activity.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`p-4 rounded-lg flex items-start justify-between group ${
                  isCompleted
                    ? 'bg-green-500/20 border-green-500/40' 
                    : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                }`}
              >
                <div>
                  <h3 className="text-lg font-medium" dir="rtl">{activity.title}</h3>
                  {activity.description && (
                    <p className="text-sm opacity-70" dir="rtl">{activity.description}</p>
                  )}
                  {activity.reminder && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-white/70">
                      <Bell size={14} />
                      <span>{activity.reminder.time}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditActivity(activity.id, {
                      completedDays: {
                        ...activity.completedDays,
                        [dayIndex]: !isCompleted,
                      }
                    })}
                    className={`p-2 rounded-full ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(activity.id, dayIndex)}
                    className="p-2 rounded-full bg-red-400/20 text-red-400 hover:bg-red-400/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </Draggable>
        );
      };

      const renderDayContent = (dayIndex: number) => {
        const [positiveNotes, setPositiveNotes] = useState<string[]>(() => {
          const savedNotes = localStorage.getItem(`positiveNotes-${weekNumber}-${year}-${dayIndex}`);
          return savedNotes ? JSON.parse(savedNotes) : ['', '', '', '', ''];
        });
        const [freeWriting, setFreeWriting] = useState<string>(() => {
          return localStorage.getItem(`freeWriting-${weekNumber}-${year}-${dayIndex}`) || '';
        });
        const [isExpanded, setIsExpanded] = useState(false);

        useEffect(() => {
          localStorage.setItem(`positiveNotes-${weekNumber}-${year}-${dayIndex}`, JSON.stringify(positiveNotes));
        }, [positiveNotes, weekNumber, year, dayIndex]);

        useEffect(() => {
          localStorage.setItem(`freeWriting-${weekNumber}-${year}-${dayIndex}`, freeWriting);
        }, [freeWriting, weekNumber, year, dayIndex]);

        const handlePositiveNoteChange = (index: number, value: string) => {
          const newNotes = [...positiveNotes];
          newNotes[index] = value;
          setPositiveNotes(newNotes);
        };

        const toggleExpanded = () => {
          setIsExpanded(!isExpanded);
        };

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {currentWeekActivities
                .filter(activity => {
                  if (dayIndex === 0) {
                    return activity.allowSunday && activity.selectedDays?.includes(0);
                  }
                  return activity.selectedDays?.includes(dayIndex);
                })
                .map((activity, index) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    {renderActivity(activity, index, dayIndex)}
                  </div>
                ))}
            </div>
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-1 text-white/70 hover:text-white"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {isExpanded ? 'إخفاء' : 'إظهار'} الملاحظات والكتابة الحرة
            </button>
            {isExpanded && (
              <div className="space-y-2">
                <h4 className="text-white font-medium text-base" dir="rtl">
                  5 نقاط إيجابية
                </h4>
                <ul className="list-disc list-inside">
                  {positiveNotes.map((note, index) => (
                    <li key={index}>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handlePositiveNoteChange(index, e.target.value)}
                        className="w-full p-1 rounded bg-black/20 border border-white/10 text-white text-sm"
                        dir="rtl"
                        placeholder={`نقطة ${index + 1}`}
                      />
                    </li>
                  ))}
                </ul>
                <h4 className="text-white font-medium text-base mt-2" dir="rtl">
                  كتابة حرة
                </h4>
                <textarea
                  value={freeWriting}
                  onChange={(e) => setFreeWriting(e.target.value)}
                  className="w-full p-2 rounded bg-black/20 border border-white/10 text-white text-sm"
                  dir="rtl"
                  rows={4}
                  placeholder="اكتب هنا أفكارك ومشاعرك"
                />
              </div>
            )}
          </div>
        );
      };

      return (
        <div className="space-y-6">
          <WeekSelector 
            currentDate={selectedDate}
            onWeekChange={changeWeek}
          />
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {DAYS.map((day, index) => (
                      <th key={day} className="p-3 text-white border border-white/20">
                        <div className="flex flex-col items-center">
                          <span>{day}</span>
                          <span className="text-sm text-white/70">
                            {formatDate(weekDates[index])}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {DAYS.map((_, dayIndex) => (
                      <td key={dayIndex} className="p-3 border border-white/20 align-top">
                        <Droppable droppableId={dayIndex.toString()}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="min-h-[100px]"
                            >
                              {renderDayContent(dayIndex)}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </DragDropContext>
        </div>
      );
    }
