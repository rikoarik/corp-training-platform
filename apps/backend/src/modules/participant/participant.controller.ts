import type { FastifyReply, FastifyRequest } from 'fastify';
import { sendSuccess } from '../../common/utils/api-response';
import * as participantService from './participant.service';
import type {
  ParticipantAttendanceBody,
  ParticipantCertificateBody,
  ParticipantIdParams,
  ParticipantQuery,
  RegisterParticipantBody,
  UpdateParticipantBody,
} from './participant.types';

export async function list(
  request: FastifyRequest<{ Querystring: ParticipantQuery }>,
  reply: FastifyReply,
): Promise<void> {
  const participants = await participantService.listParticipants(request.query);
  sendSuccess(reply, 200, 'Fetch participants success', participants);
}

export async function getById(
  request: FastifyRequest<{ Params: ParticipantIdParams }>,
  reply: FastifyReply,
): Promise<void> {
  const participant = await participantService.getParticipantById(request.params.id);
  sendSuccess(reply, 200, 'Fetch participant success', participant);
}

export async function register(
  request: FastifyRequest<{ Body: RegisterParticipantBody }>,
  reply: FastifyReply,
): Promise<void> {
  const participant = await participantService.registerToTraining(request.body);
  sendSuccess(reply, 201, 'Participant registered', participant);
}

export async function update(
  request: FastifyRequest<{ Params: ParticipantIdParams; Body: UpdateParticipantBody }>,
  reply: FastifyReply,
): Promise<void> {
  const participant = await participantService.editParticipant(request.params.id, request.body);
  sendSuccess(reply, 200, 'Update participant success', participant);
}

export async function attendance(
  request: FastifyRequest<{ Params: ParticipantIdParams; Body: ParticipantAttendanceBody }>,
  reply: FastifyReply,
): Promise<void> {
  const participant = await participantService.markAttendance(request.params.id, request.body);
  sendSuccess(reply, 200, 'Mark attendance success', participant);
}

export async function certificate(
  request: FastifyRequest<{ Params: ParticipantIdParams; Body: ParticipantCertificateBody }>,
  reply: FastifyReply,
): Promise<void> {
  const participant = await participantService.issueCertificate(request.params.id, request.body);
  sendSuccess(reply, 200, 'Issue certificate success', participant);
}
