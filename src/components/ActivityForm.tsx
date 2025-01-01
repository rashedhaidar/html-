import React, { useState } from 'react';
    import { Plus, Clock } from 'lucide-react';
    import { getCurrentWeekDates, formatDate, getDateOfWeek } from '../utils/dateUtils';
    import { DAYS } from '../constants/days';
    import { WeekDisplay } from './WeekDisplay';
    import { requestNotificationPermission, scheduleNotification } from '../utils/notifications';

    interface ActivityFormProps {
      onSubmit: (activity: {
        title: string;
        description?: string;
        targetCount?: number;
        selectedDays: number[];
        allowSunday: boolean;
        reminder?: {
          time: string;
          date: string;
        };
      }) => void;
      initialDomainId?: string;
      hideDomainsSelect?: boolean;
      weekNumber: number;
      year: number;
    }

    export function ActivityForm({ 
      onSubmit, 
      initialDomainId, 
      hideDomainsSelect,
      weekNumber,
      year 
    }: ActivityFormProps) {
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [targetCount, setTargetCount] = useState('');
      const [selectedDays, setSelectedDays] = useState<number[]>([]);
      const [allowSunday, setAllowSunday] = useState(false);
      const [reminderTime, setReminderTime] = useState('');
      
      // Get dates for the selected week
      const weekStartDate = getDateOfWeek(weekNumber, year);
      const weekDates = getCurrentWeekDates(weekStartDate);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        let reminder = undefined;
        if (reminderTime) {
          const [hours, minutes] = reminderTime.split(':').map(Number);
          const reminderDate = new Date(weekDates[0]);
          reminderDate.setHours(hours, minutes, 0, 0);
          reminder = {
            time: reminderTime,
            date: reminderDate.toISOString(),
          };
          const hasPermission = await requestNotificationPermission();
          if (hasPermission) {
            scheduleNotification(title, { body: description }, reminderDate.getTime());
          }
        }

        onSubmit({
          title,
          description: description || undefined,
          targetCount: targetCount ? parseInt(targetCount) : undefined,
          selectedDays,
          allowSunday,
          reminder
        });

        // Reset form for next activity
        setTitle('');
        setDescription('');
        setTargetCount('');
        setSelectedDays([]);
        setAllowSunday(false);
        setReminderTime('');
      };

      const handleSelectAllDays = () => {
        setSelectedDays([1, 2, 3, 4, 5, 6]);
      };

      const inputClasses = "w-full p-2 border rounded-md bg-black/20 text-white border-purple-400/30 placeholder-white/50 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 focus:outline-none";

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان النشاط"
              className={inputClasses}
              dir="rtl"
            />
          </div>
          
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف النشاط"
              className={inputClasses}
              dir="rtl"
            />
          </div>

          <div>
            <input
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              placeholder="العدد المستهدف"
              className={inputClasses}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <WeekDisplay weekNumber={weekNumber} year={year} />
              <label className="block text-white" dir="rtl">أيام النشاط</label>
            </div>
            <div className="grid grid-cols-7 gap-2 bg-black/20 p-4 rounded-lg">
              {DAYS.map((day, index) => (
                <div key={day} className="text-center">
                  <label className="block text-sm text-white/70">{day}</label>
                  <div className="text-xs text-white/50 my-1">{formatDate(weekDates[index])}</div>
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(index)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDays([...selectedDays, index]);
                      } else {
                        setSelectedDays(selectedDays.filter(d => d !== index));
                      }
                    }}
                    className="mt-1"
                    disabled={index === 0 && !allowSunday}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSelectAllDays}
              className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md text-sm"
            >
              تحديد الكل ما عدا الأحد
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allowSunday"
              checked={allowSunday}
              onChange={(e) => setAllowSunday(e.target.checked)}
            />
            <label htmlFor="allowSunday" className="text-white" dir="rtl">
              السماح بإضافة النشاط يوم الأحد
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-white" />
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className={inputClasses}
              dir="rtl"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-md hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            إضافة نشاط
          </button>
        </form>
      );
    }
