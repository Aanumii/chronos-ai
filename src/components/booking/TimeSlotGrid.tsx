import { cn } from '@/lib/utils';
import { timeSlots } from '@/data/mockAppointments';

interface TimeSlotGridProps {
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  selectedDate: Date | null;
}

export function TimeSlotGrid({ selectedTime, onSelectTime, selectedDate }: TimeSlotGridProps) {
  if (!selectedDate) {
    return (
      <div className="glass-panel p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">Available Times</h3>
        <p className="text-muted-foreground text-sm">Select a date to view available times</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Available Times</h3>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onSelectTime(time)}
            className={cn(
              "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300",
              "border border-border/50",
              selectedTime === time
                ? "bg-primary text-primary-foreground border-primary shadow-neon"
                : "bg-muted/50 text-foreground hover:bg-muted hover:border-primary/30"
            )}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
