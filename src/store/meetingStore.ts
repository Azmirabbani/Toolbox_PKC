import { create } from 'zustand';
import { Meeting } from '@/types/meeting';
import { mockMeetings } from '@/data/mockMeetings';

interface MeetingStore {
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  getUnfinishedItems: () => Array<{agenda: any, meeting: Meeting}>;
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: mockMeetings,
  
  addMeeting: (meetingData) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(state => ({ meetings: [...state.meetings, newMeeting] }));
  },
  
  updateMeeting: (id, updates) => {
    set(state => ({
      meetings: state.meetings.map(meeting => 
        meeting.id === id 
          ? { ...meeting, ...updates, updatedAt: new Date().toISOString() }
          : meeting
      )
    }));
  },
  
  getUnfinishedItems: () => {
    const meetings = get().meetings;
    const unfinishedItems: Array<{agenda: any, meeting: Meeting}> = [];
    
    meetings.forEach(meeting => {
      meeting.agendas.forEach(agenda => {
        if (agenda.status === 'CARRY_OVER') {
          unfinishedItems.push({ agenda, meeting });
        }
      });
    });
    
    return unfinishedItems;
  }
}));