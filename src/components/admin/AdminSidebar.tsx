import { Calendar, CheckCircle, XCircle, LayoutDashboard, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeFilter: 'all' | 'scheduled' | 'completed' | 'cancelled';
  onFilterChange: (filter: 'all' | 'scheduled' | 'completed' | 'cancelled') => void;
}

const navItems = [
  { id: 'all', icon: LayoutDashboard, label: 'All' },
  { id: 'scheduled', icon: Calendar, label: 'Scheduled' },
  { id: 'completed', icon: CheckCircle, label: 'Completed' },
  { id: 'cancelled', icon: XCircle, label: 'Cancelled' },
] as const;

export function AdminSidebar({ activeFilter, onFilterChange }: AdminSidebarProps) {
  return (
    <aside className="w-16 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 gap-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center mb-6 shadow-neon">
        <Calendar className="h-5 w-5 text-primary-foreground" />
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
              "hover:bg-sidebar-accent group relative",
              activeFilter === item.id && "bg-sidebar-accent text-primary shadow-neon"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-colors",
              activeFilter === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )} />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-card text-foreground text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-300">
          <Users className="h-5 w-5" />
        </button>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-300">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
