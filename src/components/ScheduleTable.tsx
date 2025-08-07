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
    if (!acc[entry.day_of_week]) {
      acc[entry.day_of_week] = [];
    }
    acc[entry.day_of_week].push(entry);
    return acc;
  }, {} as Record<number, ScheduleEntry[]>);

  return (
    <div className="space-y-6">
      {/* Table view for larger screens */}
      <div className="hidden md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-semibold">Day</th>
              <th className="text-left p-3 font-semibold">Show</th>
              <th className="text-left p-3 font-semibold">Host</th>
              <th className="text-left p-3 font-semibold">Time (Eastern)</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((entry) => (
              <tr key={entry.id} className="border-b border-border/30 hover:bg-muted/20">
                <td className="p-3 font-medium">{dayNames[entry.day_of_week]}</td>
                <td className="p-3">{entry.show_name}</td>
                <td className="p-3 text-muted-foreground">{entry.host_name}</td>
                <td className="p-3 text-accent">
                  {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden space-y-4">
        {Object.entries(scheduleByDay).map(([dayOfWeek, entries]) => (
          <div key={dayOfWeek} className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {dayNames[parseInt(dayOfWeek)]}
            </h3>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="border-l-2 border-primary pl-3">
                  <div className="font-medium">{entry.show_name}</div>
                  <div className="text-sm text-muted-foreground">{entry.host_name}</div>
                  <div className="text-sm text-accent">
                    {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};