import React from 'react';
    import { Activity } from '../types/activity';
    import { useWeekSelection } from '../hooks/useWeekSelection';
    import { analyzeActivityPatterns } from '../utils/aiAnalytics';

    interface PsychologicalAnalysisProps {
      activities: Activity[];
      weekSelection: ReturnType<typeof useWeekSelection>;
    }

    export function PsychologicalAnalysis({ activities, weekSelection }: PsychologicalAnalysisProps) {
      const filteredActivities = activities.filter(activity =>
        activity.weekNumber === weekSelection.weekNumber &&
        activity.year === weekSelection.year
      );
      const analysis = analyzeActivityPatterns(filteredActivities);

      return (
        <div className="space-y-4">
          <h4 className="text-white font-medium">نقاط القوة</h4>
          <ul className="list-disc list-inside text-white/70" dir="rtl">
            {analysis.focusedDomains.length > 0 && (
              <li>
                لديك تركيز جيد في المجالات التالية: {analysis.focusedDomains.join(', ')}
              </li>
            )}
            {analysis.completionRate > 80 && (
              <li>
                لديك معدل إنجاز مرتفع، وهذا يدل على التزامك وتنظيمك الجيد.
              </li>
            )}
            {analysis.streakDays > 0 && (
              <li>
                لديك سلسلة إنجاز مستمرة، وهذا يدل على استمرارك في تحقيق أهدافك.
              </li>
            )}
          </ul>

          <h4 className="text-white font-medium mt-4">نقاط الضعف</h4>
          <ul className="list-disc list-inside text-white/70" dir="rtl">
            {analysis.completionRate < 50 && (
              <li>
                معدل الإنجاز منخفض، قد تحتاج إلى تقسيم المهام إلى أجزاء أصغر أو تحديد أوقات محددة للعمل.
              </li>
            )}
            {analysis.focusedDomains.length < 8 && (
              <li>
                قد تحتاج إلى إضافة أنشطة في مجالات أخرى لتحقيق توازن أكبر في حياتك.
              </li>
            )}
          </ul>

          <h4 className="text-white font-medium mt-4">برنامج للحل</h4>
          <ul className="list-disc list-inside text-white/70" dir="rtl">
            {analysis.completionRate < 50 && (
              <>
                <li>
                  حاول تقسيم المهام الكبيرة إلى مهام أصغر وأكثر قابلية للإنجاز.
                </li>
                <li>
                  حدد أوقاتًا محددة للعمل على الأنشطة والتزم بها.
                </li>
              </>
            )}
            {analysis.focusedDomains.length < 8 && (
              <li>
                قم بتحديد أنشطة في المجالات التي لم يتم التركيز عليها بشكل كافٍ.
              </li>
            )}
            <li>
              استمر في تتبع تقدمك وحاول تحسينه بشكل مستمر.
            </li>
          </ul>
        </div>
      );
    }
