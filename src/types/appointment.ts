export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
