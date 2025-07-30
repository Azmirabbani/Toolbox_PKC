import { Meeting } from '@/types/meeting';

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Weekly Production Review',
    date: '2024-07-30T09:00:00Z',
    duration: 120,
    location: 'Conference Room A',
    organizerId: '1',
    organizer: 'Ahmad Suharto',
    agendas: [
      {
        id: '1',
        title: 'Production Target Review',
        description: 'Review monthly production targets',
        status: 'COMPLETED',
        meetingId: '1',
        order: 1
      },
      {
        id: '2',
        title: 'Quality Issues Discussion',
        description: 'Discuss quality control findings',
        status: 'CARRY_OVER',
        meetingId: '1', 
        order: 2
      }
    ],
    createdAt: '2024-07-25T08:00:00Z',
    updatedAt: '2024-07-25T08:00:00Z'
  }
];