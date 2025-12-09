import { CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import type { Appointment } from '@/hooks/useAppointments';
import type { Database } from '@/integrations/supabase/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type AppointmentStatus = Database['public']['Enums']['appointment_status'];

interface AppointmentsTableProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const statusBadgeVariant: Record<AppointmentStatus, 'scheduled' | 'completed' | 'cancelled'> = {
  scheduled: 'scheduled',
  completed: 'completed',
  cancelled: 'cancelled',
};

export function AppointmentsTable({ appointments, onUpdateStatus }: AppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="text-muted-foreground">No appointments found</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr 
                key={appointment.id}
                className={cn(
                  "border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors animate-fade-up",
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="p-4">
                  <p className="font-medium text-foreground">{appointment.name}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm text-muted-foreground">{appointment.email}</p>
                </td>
                <td className="p-4">
                  <p className="font-medium text-foreground">{formatDate(appointment.date)}</p>
                </td>
                <td className="p-4">
                  <p className="text-foreground">{appointment.time}</p>
                </td>
                <td className="p-4">
                  <Badge variant={statusBadgeVariant[appointment.status]}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border/50 backdrop-blur-xl">
                      {appointment.status !== 'completed' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(appointment.id, 'completed')}
                          className="gap-2 cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Mark Completed
                        </DropdownMenuItem>
                      )}
                      {appointment.status !== 'cancelled' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                          className="gap-2 cursor-pointer text-red-400"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Booking
                        </DropdownMenuItem>
                      )}
                      {appointment.status !== 'scheduled' && (
                        <DropdownMenuItem 
                          onClick={() => onUpdateStatus(appointment.id, 'scheduled')}
                          className="gap-2 cursor-pointer"
                        >
                          <CheckCircle className="h-4 w-4 text-primary" />
                          Mark Scheduled
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
