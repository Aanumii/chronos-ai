import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Users } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AppointmentsTable } from '@/components/admin/AppointmentsTable';
import { mockAppointments } from '@/data/mockAppointments';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const { toast } = useToast();

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'all') return appointments;
    return appointments.filter(apt => apt.status === activeFilter);
  }, [appointments, activeFilter]);

  const stats = useMemo(() => ({
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }), [appointments]);

  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, status } : apt
      )
    );

    toast({
      title: "Status Updated",
      description: `Appointment marked as ${status}`,
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="flex-1 particle-bg">
        {/* Gradient overlay */}
        <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-border/50 backdrop-blur-xl bg-background/60">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Manage your appointments</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center shadow-neon">
                  <Calendar className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </div>
          </header>

          {/* Stats */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', value: stats.total, color: 'text-foreground' },
                { label: 'Scheduled', value: stats.scheduled, color: 'text-primary' },
                { label: 'Completed', value: stats.completed, color: 'text-green-400' },
                { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="glass-panel p-4 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 mb-6">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>

            {/* Table */}
            <AppointmentsTable
              appointments={filteredAppointments}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
