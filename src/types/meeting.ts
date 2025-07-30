export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  location?: string;
  description?: string;
  organizerId: string;
  organizer: string;
  agendas: Agenda[];
  notulensi?: string;
  createdAt: string;
  updatedAt: string;
}


export interface Agenda {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'DISCUSSED' | 'COMPLETED' | 'CARRY_OVER';
  meetingId: string;
  order: number;
}