import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from 'lucide-react';

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  show_name: string;
  host_name: string;
  start_time: string;
  end_time: string;
  station_id: string;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const ScheduleTable = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data, error } = await supabase
          .from('schedule')
          .select('*')
          .eq('station_id', 'primal-radio')
          .order('day_of_week')
          .order('start_time');

        if (error) {
          console.error('Error fetching schedule:', error);
        } else {
          setScheduleData(data || []);
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group schedule by day
  const scheduleByDay = scheduleData.reduce((acc, entry) => {
    const dayName = dayNames[entry.day_of_week];
    if (!acc[dayName]) {
      acc[dayName] = [];
    }
    acc[dayName].push({
      show: entry.show_name,
      host: entry.host_name,
      time: `${formatTime(entry.start_time)} - ${formatTime(entry.end_time)}`
    });
    return acc;
  }, {} as Record<string, Array<{show: string, host: string, time: string}>>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
      {dayNames.map(day => {
        const dayShows = scheduleByDay[day] || [];
        
        return (
          <div key={day} className="bg-card/60 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-5 min-h-[220px] shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:border-primary/40">
            <h3 className="font-bold text-xl mb-4 text-center border-b-2 border-primary/30 pb-3 text-primary-glow">
              {day}
            </h3>
            <div className="space-y-3">
              {dayShows.map((show, index) => (
                <div key={index} className="bg-gradient-card/80 rounded-lg p-3 border border-primary/10 hover:border-primary/30 transition-all duration-200 hover:shadow-md backdrop-blur-sm">
                  <div className="font-semibold text-sm text-foreground mb-2 break-words">
                    {show.show}
                  </div>
                  <div className="text-xs text-accent font-medium mb-1 bg-accent/10 rounded px-2 py-1 inline-block">
                    {show.host}
                  </div>
                  <div className="text-xs text-primary font-bold bg-primary/10 rounded px-2 py-1 inline-block">
                    {show.time}
                  </div>
                </div>
              ))}
              {dayShows.length === 0 && (
                <div className="text-muted-foreground text-center text-sm italic py-8 bg-muted/10 rounded-lg border border-muted/20">
                  No shows scheduled
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};