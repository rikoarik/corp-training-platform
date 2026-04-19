import type { ScheduleStatus } from '@prisma/client';

export interface ScheduleQuery {
  trainingId?: string;
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
}

export interface ScheduleIdParams {
  id: string;
}

export interface CreateScheduleBody {
  trainingId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  quota: number;
  status?: ScheduleStatus;
}

export interface UpdateScheduleBody {
  trainingId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  quota?: number;
  status?: ScheduleStatus;
}
