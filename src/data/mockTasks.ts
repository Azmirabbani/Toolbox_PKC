import { Task } from '@/types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Safety Protocols',
    description: 'Review and update safety protocols for production line A',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2024-08-01',
    assigneeId: '1',
    assignee: 'Ahmad Suharto',
    createdAt: '2024-07-25T09:00:00Z',
    updatedAt: '2024-07-25T09:00:00Z'
  },
  {
    id: '2',
    title: 'Quality Control Inspection',
    description: 'Conduct monthly quality control inspection',
    status: 'IN_PROGRESS', 
    priority: 'MEDIUM',
    dueDate: '2024-07-30',
    assigneeId: '2',
    assignee: 'Siti Nurhaliza',
    createdAt: '2024-07-20T10:00:00Z',
    updatedAt: '2024-07-26T14:30:00Z'
  }
];
