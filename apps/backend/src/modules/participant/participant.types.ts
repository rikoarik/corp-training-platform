import type { ParticipantStatus } from '@prisma/client';

export interface ParticipantQuery {
  scheduleId?: string;
  status?: ParticipantStatus;
  page?: number;
  limit?: number;
}

export interface ParticipantIdParams {
  id: string;
}

export interface RegisterParticipantBody {
  scheduleId: string;
  name: string;
  email: string;
  phone?: string;
  status?: ParticipantStatus;
}

export interface UpdateParticipantBody {
  name?: string;
  email?: string;
  phone?: string;
  status?: ParticipantStatus;
}

export interface ParticipantAttendanceBody {
  attendedAt?: string;
}

export interface ParticipantCertificateBody {
  issuedBy?: string;
}
