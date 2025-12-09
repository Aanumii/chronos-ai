import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentDetails: {
    date: string;
    time: string;
    name: string;
  } | null;
}

export function SuccessModal({ isOpen, onClose, appointmentDetails }: SuccessModalProps) {
  if (!isOpen || !appointmentDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-panel p-8 max-w-md w-full animate-scale-in text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center animate-glow" style={{ boxShadow: '0 0 30px hsl(142 76% 36% / 0.4)' }}>
          <CheckCircle className="h-8 w-8 text-green-400" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Appointment Scheduled!
        </h2>
        <p className="text-muted-foreground mb-6">
          We'll send a confirmation to your email
        </p>

        <div className="p-4 rounded-xl bg-muted/50 border border-border/50 mb-6">
          <p className="text-sm text-muted-foreground">Booking details</p>
          <p className="text-foreground font-semibold mt-1">{appointmentDetails.name}</p>
          <p className="text-primary font-medium">
            {appointmentDetails.date} at {appointmentDetails.time}
          </p>
        </div>

        <Button variant="neon" onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </div>
  );
}
