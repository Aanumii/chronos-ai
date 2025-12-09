import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import type { Appointment } from '@/hooks/useAppointments';

interface AnalyticsChartProps {
  appointments: Appointment[];
}

interface ChartData {
  date: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  total: number;
}

const statusColors = {
  scheduled: 'hsl(217, 100%, 61%)',
  completed: 'hsl(142, 76%, 36%)',
  cancelled: 'hsl(0, 84%, 60%)',
};

export function AnalyticsChart({ appointments }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    const grouped: Record<string, ChartData> = {};

    appointments.forEach((apt) => {
      const dateKey = apt.date;
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: dateKey,
          scheduled: 0,
          completed: 0,
          cancelled: 0,
          total: 0,
        };
      }
      grouped[dateKey][apt.status]++;
      grouped[dateKey].total++;
    });

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Last 14 days
  }, [appointments]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-4 border border-border/50">
          <p className="text-foreground font-medium mb-2">
            {format(parseISO(label), 'MMM d, yyyy')}
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-primary">Scheduled: {data.scheduled}</p>
            <p className="text-green-400">Completed: {data.completed}</p>
            <p className="text-red-400">Cancelled: {data.cancelled}</p>
            <p className="text-muted-foreground border-t border-border/50 pt-1 mt-2">
              Total: {data.total}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 animate-fade-up">
      <h3 className="text-lg font-semibold text-foreground mb-6">Booking Analytics</h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => format(parseISO(value), 'MMM d')}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="scheduled"
              stackId="a"
              fill={statusColors.scheduled}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="completed"
              stackId="a"
              fill={statusColors.completed}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="cancelled"
              stackId="a"
              fill={statusColors.cancelled}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColors.scheduled }} />
          <span className="text-sm text-muted-foreground">Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColors.completed }} />
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: statusColors.cancelled }} />
          <span className="text-sm text-muted-foreground">Cancelled</span>
        </div>
      </div>
    </div>
  );
}
