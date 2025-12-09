import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { TimeSlotGrid } from '@/components/booking/TimeSlotGrid';
import { BookingForm } from '@/components/booking/BookingForm';
import { SuccessModal } from '@/components/booking/SuccessModal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<{
    date: string;
    time: string;
    name: string;
  } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (name: string, email: string) => {
    if (!selectedDate || !selectedTime) return;

    setIsLoading(true);

    // Simulate API call (replace with actual n8n webhook + Supabase when connected)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    setAppointmentDetails({
      date: formattedDate,
      time: selectedTime,
      name,
    });

    setIsLoading(false);
    setShowSuccess(true);

    toast({
      title: "Appointment Scheduled",
      description: "We'll send a confirmation to your email.",
    });
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setAppointmentDetails(null);
  };

  return (
    <div className="min-h-screen bg-background particle-bg">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-xl bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-neon flex items-center justify-center shadow-neon">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">BookFlow</span>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/admin" className="gap-2">
                Admin <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Schedule Your <span className="gradient-text">Appointment</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Pick a date and time that works for you. We'll handle the rest.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <BookingCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <TimeSlotGrid
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </main>

        <SuccessModal
          isOpen={showSuccess}
          onClose={handleCloseSuccess}
          appointmentDetails={appointmentDetails}
        />
      </div>
    </div>
  );
}
