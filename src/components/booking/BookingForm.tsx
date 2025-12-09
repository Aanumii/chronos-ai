import { useState } from 'react';
import { Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookingFormProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSubmit: (name: string, email: string) => void;
  isLoading?: boolean;
}

export function BookingForm({ selectedDate, selectedTime, onSubmit, isLoading }: BookingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && selectedDate && selectedTime) {
      onSubmit(name, email);
    }
  };

  const isDisabled = !selectedDate || !selectedTime || !name || !email;

  return (
    <div className="glass-panel p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">Your Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-11"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-11"
          />
        </div>

        {selectedDate && selectedTime && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground">Selected appointment:</p>
            <p className="text-foreground font-medium mt-1">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="neon"
          size="lg"
          className="w-full"
          disabled={isDisabled || isLoading}
        >
          {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
        </Button>
      </form>
    </div>
  );
}
